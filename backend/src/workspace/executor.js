/**
 * CodeCraft Code Execution Engine
 * 
 * Runs user code inside isolated Docker workspace containers.
 * Supports JavaScript, Python, and shell scripts.
 * Falls back to sandboxed local execution when Docker is unavailable.
 */

const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const { getWorkspaceStatus } = require('./manager');

const EXEC_DIR = path.resolve(__dirname, '../../executions');

// ── Language Configuration ──────────────────────────────

const LANGUAGES = {
  javascript: {
    extension: '.js',
    image: 'node:22-alpine',
    runCmd: (filePath) => `node ${filePath}`,
    localCmd: (filePath) => `node ${filePath}`,
    timeout: 10000,
  },
  python: {
    extension: '.py',
    image: 'python:3.12-alpine',
    runCmd: (filePath) => `python3 ${filePath}`,
    localCmd: (filePath) => `python3 ${filePath}`,
    timeout: 15000,
  },
  typescript: {
    extension: '.ts',
    image: 'node:22-alpine',
    runCmd: (filePath) => `npx tsx ${filePath}`,
    localCmd: (filePath) => `node -e "try { require('tsx').register(); require('${filePath}') } catch(e) { console.log(e.message) }"`,
    timeout: 20000,
  },
  shell: {
    extension: '.sh',
    image: 'alpine:3.19',
    runCmd: (filePath) => `sh ${filePath}`,
    localCmd: (filePath) => `bash ${filePath}`,
    timeout: 10000,
  },
};

const MAX_OUTPUT_LENGTH = 100 * 1024; // 100KB max output

// ── Ensure exec directory exists ─────────────────────────

if (!fs.existsSync(EXEC_DIR)) {
  fs.mkdirSync(EXEC_DIR, { recursive: true });
}

/**
 * Execute user code and return the result.
 * 
 * @param {string} userId - Authenticated user ID
 * @param {string} code - Source code to execute
 * @param {string} language - One of: javascript, python, typescript, shell
 * @param {object} options - { timeout, stdin }
 * @returns {object} { stdout, stderr, exitCode, executionTime, language }
 */
async function executeCode(userId, code, language = 'javascript', options = {}) {
  const startTime = Date.now();
  const lang = LANGUAGES[language];
  
  if (!lang) {
    return {
      stdout: '',
      stderr: `Unsupported language: "${language}". Supported: ${Object.keys(LANGUAGES).join(', ')}`,
      exitCode: 1,
      executionTime: 0,
      language,
    };
  }

  // Generate a unique file for this execution
  const executionId = uuidv4().slice(0, 12);
  const fileName = `exec-${executionId}${lang.extension}`;
  const filePath = path.join(EXEC_DIR, fileName);

  try {
    // Write code to temp file
    fs.writeFileSync(filePath, code, 'utf-8');

    // Try to run inside Docker workspace container first
    const workspace = getWorkspaceStatus(userId);

    let stdout = '';
    let stderr = '';
    let exitCode = 0;

    if (workspace && workspace.status === 'running' && workspace.containerName) {
      // Run inside existing workspace container
      try {
        // Copy file to container
        execSync(
          `docker cp ${filePath} ${workspace.containerName}:/tmp/${fileName}`,
          { timeout: 5000, stdio: 'pipe' }
        );

        // Execute inside container
        const result = execSync(
          `docker exec ${workspace.containerName} sh -c "cd /tmp && ${lang.runCmd(`/tmp/${fileName}`)}"`,
          {
            timeout: options.timeout || lang.timeout,
            stdio: 'pipe',
            maxBuffer: MAX_OUTPUT_LENGTH,
          }
        );
        stdout = result.toString();
        exitCode = 0;
      } catch (dockerErr) {
        if (dockerErr.stdout) stdout = dockerErr.stdout.toString();
        if (dockerErr.stderr) stderr = dockerErr.stderr.toString();
        exitCode = dockerErr.status || 1;
      }
    } else {
      // Fallback: run locally with sandboxing
      try {
        // Security: strip dangerous patterns
        const sanitized = sanitizeCode(code, language);
        fs.writeFileSync(filePath, sanitized, 'utf-8');

        const result = execSync(
          lang.localCmd(filePath),
          {
            timeout: options.timeout || lang.timeout,
            stdio: 'pipe',
            maxBuffer: MAX_OUTPUT_LENGTH,
            env: {
              ...process.env,
              NODE_ENV: 'sandbox',
              CODE_PATH: filePath,
            },
          }
        );
        stdout = result.toString();
        exitCode = 0;
      } catch (localErr) {
        if (localErr.stdout) stdout = localErr.stdout.toString();
        if (localErr.stderr) stderr = localErr.stderr.toString();
        exitCode = localErr.status || 1;
      }
    }

    const executionTime = Date.now() - startTime;

    // Truncate output if too long
    if (stdout.length > MAX_OUTPUT_LENGTH) {
      stdout = stdout.slice(0, MAX_OUTPUT_LENGTH) + '\n... [output truncated]';
    }
    if (stderr.length > MAX_OUTPUT_LENGTH) {
      stderr = stderr.slice(0, MAX_OUTPUT_LENGTH) + '\n... [error truncated]';
    }

    return {
      stdout,
      stderr,
      exitCode,
      executionTime,
      language,
      executionId,
    };
  } catch (err) {
    return {
      stdout: '',
      stderr: `Execution error: ${err.message}`,
      exitCode: 1,
      executionTime: Date.now() - startTime,
      language,
      executionId: null,
    };
  } finally {
    // Cleanup temp file
    try { fs.unlinkSync(filePath); } catch {}
  }
}

/**
 * Basic sanitization — strip obviously dangerous operations
 * while keeping the code functional for learning.
 */
function sanitizeCode(code, language) {
  if (language === 'shell') {
    // For shell, just prevent obviously destructive commands
    const dangerous = [
      /rm\s+-rf\s+\//,
      /mkfs/,
      /dd\s+if/,
      /:\(\)\s*\{/,
      /wget\s+.*\|\s*bash/,
      /curl\s+.*\|\s*bash/,
      /chmod\s+777/,
      />\/dev\/sda/,
    ];
    for (const pattern of dangerous) {
      if (pattern.test(code)) {
        return `# Command blocked for security\n echo "Security: This command is not allowed in the sandbox"`;
      }
    }
  }

  if (language === 'javascript' || language === 'typescript') {
    // Block require('child_process') usage in sandbox mode
    const dangerous = [
      /require\s*\(\s*['"]child_process['"]\s*\)/,
      /require\s*\(\s*['"]fs['"]\s*\)/,
      /process\.exit/,
      /process\.kill/,
      /global\./,
    ];
    for (const pattern of dangerous) {
      if (pattern.test(code)) {
        return `// Security: Sandbox restriction\nconsole.log("⚠ This operation (${pattern.source}) is not allowed in the sandbox");\n`;
      }
    }
  }

  return code;
}

/**
 * Get list of supported languages.
 */
function getSupportedLanguages() {
  return Object.entries(LANGUAGES).map(([id, config]) => ({
    id,
    extension: config.extension,
    timeout: config.timeout,
  }));
}

module.exports = { executeCode, getSupportedLanguages };
