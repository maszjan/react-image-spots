import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import pkg from "../package.json";

// https://vite.dev/config/
export default defineConfig({
	base: "/react-image-spots/",
	// TEMP: only needed while react-image-spots is npm-link/file:-symlinked
	// for local testing - a real npm-registry install has a single flat
	// React copy and doesn't need this.
	resolve: { dedupe: ["react", "react-dom"] },
	plugins: [react(), tailwindcss()],
	define: {
		__BASE__: JSON.stringify("/react-image-spots/"),
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
});
