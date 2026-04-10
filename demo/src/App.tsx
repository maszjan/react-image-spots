import { useEffect, useState } from "react";
import { useTheme } from "./hooks/useTheme";
import { Landing } from "./pages/Landing";
import { Docs } from "./pages/Docs";

export type Route = "home" | "docs";

export type PageProps = {
	onThemeToggle: () => void;
	theme: "light" | "dark";
};

const VALID: Route[] = ["home", "docs"];

function getRoute(): Route {
	const hash = window.location.hash.slice(1).split("?")[0] as Route;
	return VALID.includes(hash) ? hash : "home";
}

export function navigate(route: Route, sectionId?: string) {
	window.location.hash = route;
	if (sectionId) {
		// Czekamy na render nowej strony potem scrollujemy
		setTimeout(() => {
			document
				.getElementById(sectionId)
				?.scrollIntoView({ behavior: "smooth", block: "start" });
		}, 50);
	} else {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
}

export default function App() {
	const [route, setRoute] = useState<Route>(getRoute);
	const { theme, toggle } = useTheme();

	useEffect(() => {
		const handler = () => setRoute(getRoute());
		window.addEventListener("hashchange", handler);
		return () => window.removeEventListener("hashchange", handler);
	}, []);

	const pageProps: PageProps = { onThemeToggle: toggle, theme };

	return (
		<div className='min-h-screen bg-white dark:bg-[#0a0a0f] text-slate-900 dark:text-white transition-colors duration-200'>
			{route === "home" && <Landing {...pageProps} />}
			{route === "docs" && <Docs {...pageProps} />}
		</div>
	);
}
