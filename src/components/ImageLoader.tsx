import React, { useEffect, useRef, useState } from "react";
import { resolveAnimation } from "./swapAnimations";
import type { SwapAnimation } from "../types";

interface ImageLoaderProps {
	src: string;
	alt?: string;
	swapSrc?: string | null;
	swapAnimation?: SwapAnimation;
	swapDuration?: number;
	style?: React.CSSProperties;
}

const shimmerCSS = `
@keyframes ris-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}`;

export const ImageLoader: React.FC<ImageLoaderProps> = ({
	src,
	alt = "",
	swapSrc,
	swapAnimation = "fade",
	swapDuration = 400,
	style,
}) => {
	const [loaded, setLoaded] = useState(false);
	const [displaySrc, setDisplaySrc] = useState(src);
	const [incomingSrc, setIncomingSrc] = useState<string | null>(null);
	const [animKey, setAnimKey] = useState(0);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const resolved = resolveAnimation(swapAnimation, swapDuration);

	useEffect(() => {
		setLoaded(false);
		setDisplaySrc(src);
		setIncomingSrc(null);
	}, [src]);

	useEffect(() => {
		const target = swapSrc || src;
		if (target === displaySrc) return;
		if (timer.current) clearTimeout(timer.current);

		if (resolved.duration === 0) {
			setDisplaySrc(target);
			return;
		}

		setIncomingSrc(target);
		setAnimKey((k) => k + 1);

		timer.current = setTimeout(() => {
			setDisplaySrc(target);
			setIncomingSrc(null);
		}, resolved.duration);

		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [swapSrc, src]);

	return (
		<div
			style={{
				position: "relative",
				width: "100%",
				height: "100%",
				overflow: "hidden",
				...style,
			}}>
			<style>
				{shimmerCSS}
				{resolved.css}
			</style>

			{!loaded && (
				<div
					style={{
						position: "absolute",
						inset: 0,
						background:
							"linear-gradient(90deg,#e8eaed 25%,#f4f5f7 50%,#e8eaed 75%)",
						backgroundSize: "200% 100%",
						animation: "ris-shimmer 1.4s infinite linear",
						borderRadius: "inherit",
					}}
				/>
			)}

			{/* Base / outgoing image */}
			<img
				src={displaySrc}
				alt={alt}
				loading='lazy'
				decoding='async'
				draggable={false}
				onLoad={() => setLoaded(true)}
				style={{
					display: "block",
					width: "100%",
					height: "100%",
					objectFit: "cover",
					userSelect: "none",
					pointerEvents: "none",
					opacity: loaded ? 1 : 0,
					transition: "opacity 0.3s ease",
					animation:
						incomingSrc && resolved.leaveAnimation
							? resolved.leaveAnimation
							: undefined,
				}}
			/>

			{/* Incoming image */}
			{incomingSrc && resolved.enterAnimation && (
				<img
					key={animKey}
					src={incomingSrc}
					alt={alt}
					draggable={false}
					style={{
						position: "absolute",
						inset: 0,
						display: "block",
						width: "100%",
						height: "100%",
						objectFit: "cover",
						userSelect: "none",
						pointerEvents: "none",
						animation: resolved.enterAnimation,
					}}
				/>
			)}
		</div>
	);
};
