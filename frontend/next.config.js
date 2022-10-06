/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        loader: "imgix",
        path: "https://noop/",
      },
    reactStrictMode: true,
    swcMinify: true,
};

module.exports = nextConfig;
