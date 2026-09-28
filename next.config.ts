import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  serverExternalPackages: [
    "tree-sitter",
    "tree-sitter-javascript",
    "tree-sitter-typescript",
    "sharp",
  ],

  turbopack: {
    resolveAlias: {
      "onnxruntime-node": "onnxruntime-web",
    },
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "110mb",
    },
  },
};

export default nextConfig;