/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["books.google.com", "i.scdn.co"],
  },
};

module.exports = nextConfig;
