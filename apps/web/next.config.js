import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import createNextIntlPlugin from "next-intl/plugin";

const __dirname = fileURLToPath(new URL('.', import.meta.url));
config({ path: resolve(__dirname, '../../.env'), override: false });

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  allowedDevOrigins: [process.env.GATEWAY_URL ?? '/'],

  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.GATEWAY_URL ?? ''}/api/:path*`
      }
    ]
  }
};

export default withNextIntl(nextConfig);
