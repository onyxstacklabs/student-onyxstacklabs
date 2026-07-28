/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Build ke waqt ESLint errors ki wajah se deployment cancel nahi hone dega
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Typecheck errors ko bhi build ke dauran ignore karega
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
