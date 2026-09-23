/** @type {import('next').NextConfig} */
const nextConfig = {
  // Same reasoning as apps/web's next.config.mjs — required in a pnpm
  // monorepo so `next build` bundles workspace packages that live outside
  // apps/admin correctly.
  transpilePackages: ["@platform/auth", "@platform/database", "@platform/queue"],
};

export default nextConfig;
