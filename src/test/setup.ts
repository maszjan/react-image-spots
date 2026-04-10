import "@testing-library/jest-dom";

(globalThis as any).Image = class {
	onload: (() => void) | null = null;
	src = "";
};
