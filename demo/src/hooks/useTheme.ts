import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function getStoredTheme(): Theme | null {
	try {
		const stored = localStorage.getItem("theme") as Theme | null;
		return stored === "light" || stored === "dark" ? stored : null;
	} catch {
		return null;
	}
}

function applyTheme(theme: Theme) {
	if (theme === "dark") {
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
	}
}

export function useTheme() {
	const [theme, setThemeState] = useState<Theme>(() => {
		const stored = getStoredTheme();
		return stored ?? getSystemTheme();
	});

	useEffect(() => {
		applyTheme(theme);
	}, [theme]);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = (e: MediaQueryListEvent) => {
			if (!getStoredTheme()) setThemeState(e.matches ? "dark" : "light");
		};
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	const setTheme = (t: Theme) => {
		localStorage.setItem("theme", t);
		setThemeState(t);
	};

	const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

	return { theme, setTheme, toggle };
}
