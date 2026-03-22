import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Keep Prisma on the Node resolution path (Turbopack stub can omit model delegates). */
  serverExternalPackages: ["@prisma/client", "prisma"],
  experimental: {
    serverActions: {
      bodySizeLimit: "512mb",
      /** Dev: Host vs Origin mismatch (localhost / 127.0.0.1 / ::1) can abort Server Actions. */
      allowedOrigins: [
        "localhost:3000",
        "127.0.0.1:3000",
        "[::1]:3000",
      ],
    },
  },
};

export default nextConfig;
