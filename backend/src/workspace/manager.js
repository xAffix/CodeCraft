/**
 * CodeCraft Workspace Manager
 * Manages per-user Docker workspace containers.
 * 
 * Each user gets an isolated container with:
 * - Node.js dev environment
 * - Git pre-configured
 * - Volume mount for persistent code
 * - Resource limits (CPU, memory)
 */

const { execSync, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const WORKSPACE_BASE = path.resolve(__dirname, '../../workspaces');
const CONTAINER_IMAGE = 'node:22-alpine';
const MEMORY_LIMIT = '512m';
const CPU_LIMIT = '0.5';

// Track active workspaces: { [userId]: containerInfo }
const activeWorkspaces = new Map();

/**
 * Ensure Docker is available and the base image exists.
 */
async function init() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    console.log('[Workspace] Docker is available');

    // Pull the base image if not present
    try {
      execSync(`docker image inspect ${CONTAINER_IMAGE}`, { stdio: 'ignore' });
    } catch {
      console.log('[Workspace] Pulling base image...');
      execSync(`docker pull ${CONTAINER_IMAGE}`, { stdio: 'inherit' });
    }

    // Create workspace base dir
    if (!fs.existsSync(WORKSPACE_BASE)) {
      fs.mkdirSync(WORKSPACE_BASE, { recursive: true });
    }

    // Cleanup any stale containers on startup
    cleanupStale();
  } catch (err) {
    console.warn('[Workspace] Docker not available, using mock mode:', err.message);
  }
}

/**
 * Create a workspace container for a user.
 */
async function createWorkspace(userId, simulationId = 'default') {
  // Check if workspace already exists
  if (activeWorkspaces.has(userId)) {
    const existing = activeWorkspaces.get(userId);
    if (existing.status === 'running') {
      return existing;
    }
    // Clean up stale entry
    await destroyWorkspace(userId);
  }

  const workspaceDir = path.join(WORKSPACE_BASE, userId);
  if (!fs.existsSync(workspaceDir)) {
    fs.mkdirSync(workspaceDir, { recursive: true });

    // Create a starter project
    const packageJson = {
      name: `codecraft-workspace-${userId.slice(0, 8)}`,
      version: '1.0.0',
      private: true,
      scripts: {
        start: 'node index.js',
        test: 'echo "Tests passed"',
      },
    };
    fs.writeFileSync(
      path.join(workspaceDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    fs.writeFileSync(
      path.join(workspaceDir, 'index.js'),
      `// CodeCraft Workspace — ${simulationId}\n// Your code goes here\n\nconsole.log('Workspace ready!');\n`
    );
    fs.writeFileSync(
      path.join(workspaceDir, '.gitignore'),
      'node_modules/\n.env\n'
    );
  }

  const containerName = `codecraft-${userId.slice(0, 12)}`;

  try {
    // Run the container
    execSync(
      `docker run -d \
        --name ${containerName} \
        --memory ${MEMORY_LIMIT} \
        --cpus ${CPU_LIMIT} \
        --network codecraft-net \
        -v ${workspaceDir}:/workspace \
        -w /workspace \
        ${CONTAINER_IMAGE} \
        sh -c "cd /workspace && npm install 2>/dev/null; tail -f /dev/null"`,
      { stdio: 'pipe' }
    );

    const info = {
      userId,
      simulationId,
      containerName,
      workspaceDir,
      status: 'running',
      createdAt: new Date().toISOString(),
      port: null, // Could map a port for HTTP servers
    };

    activeWorkspaces.set(userId, info);
    console.log(`[Workspace] Created container ${containerName} for user ${userId.slice(0, 8)}...`);
    return info;
  } catch (err) {
    console.error(`[Workspace] Failed to create container: ${err.message}`);
    // Fall back to mock workspace
    const mockInfo = {
      userId,
      simulationId,
      containerName: null,
      workspaceDir,
      status: 'mock',
      createdAt: new Date().toISOString(),
      port: null,
    };
    activeWorkspaces.set(userId, mockInfo);
    return mockInfo;
  }
}

/**
 * Execute a command in a user's workspace.
 */
async function execCommand(userId, command) {
  const workspace = activeWorkspaces.get(userId);
  if (!workspace) {
    throw new Error('No active workspace for this user');
  }

  if (workspace.status === 'mock' || !workspace.containerName) {
    // Mock execution for when Docker isn't available
    const mockOutput = simulateCommand(command, workspace);
    return mockOutput;
  }

  try {
    const output = execSync(
      `docker exec ${workspace.containerName} sh -c ${JSON.stringify(command)}`,
      { encoding: 'utf-8', timeout: 30000 }
    );
    return output;
  } catch (err) {
    if (err.stdout) return err.stdout;
    if (err.stderr) return err.stderr;
    return `Error: ${err.message}`;
  }
}

/**
 * Simulate command output when Docker is unavailable.
 */
function simulateCommand(command, workspace) {
  const cmd = command.trim().toLowerCase();

  if (cmd === 'ls' || cmd.startsWith('ls ')) {
    return 'package.json  index.js  node_modules\n';
  }
  if (cmd === 'pwd') {
    return '/workspace\n';
  }
  if (cmd === 'node --version' || cmd === 'node -v') {
    return 'v22.22.2\n';
  }
  if (cmd === 'npm --version' || cmd === 'npm -v') {
    return '10.8.0\n';
  }
  if (cmd.startsWith('echo ')) {
    return command.slice(5) + '\n';
  }
  if (cmd === 'node index.js' || cmd === 'node index' || cmd === 'npm start') {
    return 'Workspace ready!\n';
  }
  if (cmd === 'npm test') {
    return '> Workspace test\nTests passed (1/1)\n';
  }
  if (cmd === 'cat package.json') {
    try {
      return fs.readFileSync(path.join(workspace.workspaceDir, 'package.json'), 'utf-8') + '\n';
    } catch {
      return '{}\n';
    }
  }
  if (cmd === 'env' || cmd.startsWith('env ')) {
    return 'NODE_ENV=development\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\n';
  }
  if (cmd === 'clear') {
    return '\x1b[2J\x1b[H';
  }
  if (cmd === 'help') {
    return `Available commands (mock mode):
  ls, pwd, node -v, npm -v, echo <text>
  node index.js, npm start, npm test
  cat <file>, clear, help
`;
  }

  return `bash: ${command}: command not found (mock mode)\n`;
}

/**
 * Get workspace status for a user.
 */
function getWorkspaceStatus(userId) {
  return activeWorkspaces.get(userId) || null;
}

/**
 * Destroy a user's workspace container.
 */
async function destroyWorkspace(userId) {
  const workspace = activeWorkspaces.get(userId);
  if (!workspace) return;

  if (workspace.containerName) {
    try {
      execSync(`docker rm -f ${workspace.containerName}`, { stdio: 'ignore' });
      console.log(`[Workspace] Removed container ${workspace.containerName}`);
    } catch (err) {
      console.warn(`[Workspace] Failed to remove container: ${err.message}`);
    }
  }

  activeWorkspaces.delete(userId);
}

/**
 * Clean up stale containers from previous sessions.
 */
function cleanupStale() {
  try {
    const containers = execSync(
      'docker ps --filter "name=codecraft-" --format "{{.Names}}"',
      { encoding: 'utf-8' }
    ).trim().split('\n').filter(Boolean);

    for (const name of containers) {
      execSync(`docker rm -f ${name}`, { stdio: 'ignore' });
      console.log(`[Workspace] Cleaned up stale container: ${name}`);
    }
  } catch {
    // No stale containers
  }
}

/**
 * List all active workspaces.
 */
function listWorkspaces() {
  return Array.from(activeWorkspaces.entries()).map(([userId, info]) => ({
    userId: userId.slice(0, 8),
    status: info.status,
    simulationId: info.simulationId,
    createdAt: info.createdAt,
  }));
}

module.exports = {
  init,
  createWorkspace,
  execCommand,
  getWorkspaceStatus,
  destroyWorkspace,
  listWorkspaces,
};
