import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          bitcoin: ["@bitcoin-js/tiny-secp256k1-asmjs", "bitcoinjs-lib"],
          cosmos: ["@cosmjs/proto-signing", "@cosmjs/stargate"],
          babylon: [
            "@babylonlabs-io/babylon-proto-ts",
            "@babylonlabs-io/btc-staking-ts",
            "@babylonlabs-io/core-ui",
          ],
          wallets: ["@babylonlabs-io/wallet-connector"],
        },
      },
    },
  },
  plugins: [
    react(),
    tsconfigPaths({
      projects: [resolve(__dirname, "./tsconfig.lib.json")],
    }),
    nodePolyfills({ include: ["buffer", "crypto"] }),
    EnvironmentPlugin("all", { prefix: "REACT_APP_" }),
  ],
  define: {
    "import.meta.env.REACT_APP_COMMIT_HASH": JSON.stringify(
      process.env.REACT_APP_COMMIT_HASH || "development",
    ),
    "import.meta.env.REACT_APP_CANONICAL": JSON.stringify(
      process.env.REACT_APP_CANONICAL || "https://babylonlabs.io/",
    ),
    "process.env.NEXT_TELEMETRY_DISABLED": JSON.stringify("1"),
  },

  server: {
    host: true
  }
});
