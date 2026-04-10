import type { ImageConfig } from "./types";

export function exportToJSON(config: ImageConfig, pretty = true): string {
	return JSON.stringify(config, null, pretty ? 2 : 0);
}

export function importFromJSON(json: string): ImageConfig {
	const parsed = JSON.parse(json) as ImageConfig;
	if (!Array.isArray(parsed.spots)) throw new Error('Missing "spots" array');
	return parsed;
}

export function downloadConfig(
	config: ImageConfig,
	filename = "spots-config.json",
): void {
	const blob = new Blob([exportToJSON(config)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = Object.assign(document.createElement("a"), {
		href: url,
		download: filename,
	});
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
