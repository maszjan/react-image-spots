import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import pkg from "../package.json";

// https://vite.dev/config/
export default defineConfig({
	base: "/react-image-spots/",
	plugins: [react(), tailwindcss()],
	define: {
		__BASE__: JSON.stringify("/react-image-spots/"),
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
});
