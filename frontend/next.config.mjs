const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  images: {
    remotePatterns: [
      /* your current patterns */
    ],
    unoptimized: isDev,
  },
};

export default nextConfig;
