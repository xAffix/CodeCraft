/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@monaco-editor/react', 'monaco-editor'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Monaco Editor web workers
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
