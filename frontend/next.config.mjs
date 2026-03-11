/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_URL: "https://sellix-sales-insight-generator.onrender.com",
  },
};

export default nextConfig;
