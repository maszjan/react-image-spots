import { Nav } from "../components/Nav";
import { Hero } from "../components/Landing/Hero";
import { Features } from "../components/Landing/Features";
import { AnimationsShowcase } from "../components/Landing/AnimationsShowcase";
import { Footer } from "../components/Footer";
import type { PageProps } from "../App";

export const Landing = ({ onThemeToggle, theme }: PageProps) => (
	<>
		<Nav active='home' theme={theme} onThemeToggle={onThemeToggle} />
		<main className='pt-14'>
			<Hero />
			<Features />
			<AnimationsShowcase />
		</main>
		<Footer />
	</>
);
