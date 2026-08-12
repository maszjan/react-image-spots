import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const external = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "framer-motion",
  "lucide-react",
];

export default [
  {
    input: "src/index.ts",
    external,
    output: [
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
        banner: '"use client";',
      },
      {
        file: "dist/index.cjs.js",
        format: "cjs",
        sourcemap: true,
        banner: '"use client";',
      },
    ],
    plugins: [
      resolve(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
      }),
    ],
  },
  {
    input: "src/index.ts",
    external,
    output: { file: "dist/index.d.ts", format: "esm" },
    plugins: [dts()],
  },
];