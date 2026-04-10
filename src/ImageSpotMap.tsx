import React, { useCallback, useRef, useState } from "react";
import { ImageLoader } from "./components/ImageLoader";
import { SpotLayer } from "./components/SpotLayer";
import type { ImageSpotMapProps, Position, SwapAnimation } from "./types";

const noop = () => {};

const toastCSS = `
@keyframes ris-toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(6px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}`;

export const ImageSpotMap: React.FC<ImageSpotMapProps> = ({
	src,
	alt = "",
	mode = "preview",
	spots = [],
	enableImageSwap = true,
	swapDuration = 400,
	hideOthersOnHover = true,
	hideHoveredSpot = false,
	swapAnimation = "fade",
	onSpotHover,
	onSpotClick,
	onSpotLeave,
	onSpotPlace,
	_goTo,
	_goBack,
	_canGoBack = false,
	className = "",
	style,
}) => {
	const [swapSrc, setSwapSrc] = useState<string | null>(null);
	const [activeAnimation, setActiveAnimation] =
		useState<SwapAnimation>(swapAnimation);
	const [markers, setMarkers] = useState<Position[]>([]);
	const [toast, setToast] = useState<string | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const counterRef = useRef(0);
	const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleSwap = useCallback(
		(src: string | null, anim?: SwapAnimation) => {
			if (!enableImageSwap) return;
			setSwapSrc(src);
			setActiveAnimation(anim ?? swapAnimation);
		},
		[enableImageSwap, swapAnimation],
	);

	const showToast = (msg: string) => {
		setToast(msg);
		if (toastTimer.current) clearTimeout(toastTimer.current);
		toastTimer.current = setTimeout(() => setToast(null), 1800);
	};

	const handleEditClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (mode !== "edit") return;
			const rect = containerRef.current?.getBoundingClientRect();
			if (!rect) return;
			const pos: Position = {
				x: parseFloat(
					(((e.clientX - rect.left) / rect.width) * 100).toFixed(2),
				),
				y: parseFloat(
					(((e.clientY - rect.top) / rect.height) * 100).toFixed(2),
				),
			};
			counterRef.current += 1;
			const index = counterRef.current;
			setMarkers((p) => [...p, pos]);
			navigator.clipboard
				.writeText(`{ x: ${pos.x}, y: ${pos.y} }`)
				.then(() => showToast(`#${index} copied — x: ${pos.x}, y: ${pos.y}`))
				.catch(() => showToast(`#${index} x: ${pos.x}, y: ${pos.y}`));
			onSpotPlace?.(pos, index);
		},
		[mode, onSpotPlace],
	);

	const isEdit = mode === "edit";

	return (
		<div
			ref={containerRef}
			className={className}
			onClick={handleEditClick}
			style={{
				position: "relative",
				width: "100%",
				height: "100%",
				borderRadius: "inherit",
				cursor: isEdit ? "crosshair" : "default",
				...style,
			}}>
			<style>{toastCSS}</style>

			<ImageLoader
				src={src}
				alt={alt}
				swapSrc={swapSrc}
				swapAnimation={activeAnimation}
				swapDuration={swapDuration}
				style={{ position: "absolute", inset: 0, borderRadius: "inherit" }}
			/>

			{!isEdit && (
				<SpotLayer
					spots={spots}
					hideOthersOnHover={hideOthersOnHover}
					hideHoveredSpot={hideHoveredSpot}
					onSpotHover={onSpotHover}
					onSpotClick={onSpotClick}
					onSpotLeave={onSpotLeave}
					onSwapRequest={handleSwap}
					goTo={_goTo ?? noop}
					goBack={_goBack ?? noop}
					canGoBack={_canGoBack}
				/>
			)}

			{isEdit &&
				markers.map((pos, i) => (
					<div
						key={i}
						style={{
							position: "absolute",
							left: `${pos.x}%`,
							top: `${pos.y}%`,
							transform: "translate(-50%, -50%)",
							pointerEvents: "none",
							zIndex: 10,
						}}>
						<div
							style={{
								width: 24,
								height: 24,
								borderRadius: "50%",
								border: "2px solid #3b82f6",
								background: "rgba(59,130,246,0.15)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}>
							<div
								style={{
									width: 6,
									height: 6,
									borderRadius: "50%",
									background: "#3b82f6",
								}}
							/>
						</div>
						<div
							style={{
								position: "absolute",
								top: -18,
								left: "50%",
								transform: "translateX(-50%)",
								fontSize: 10,
								fontWeight: 700,
								color: "#3b82f6",
								fontFamily: "system-ui,sans-serif",
								whiteSpace: "nowrap",
								textShadow: "0 1px 3px rgba(255,255,255,0.9)",
							}}>
							{i + 1}
						</div>
					</div>
				))}

			{isEdit && markers.length === 0 && (
				<div
					style={{
						position: "absolute",
						inset: 0,
						pointerEvents: "none",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<div
						style={{
							background: "rgba(255,255,255,0.88)",
							backdropFilter: "blur(8px)",
							border: "1.5px dashed #cbd5e1",
							borderRadius: 10,
							padding: "12px 22px",
							fontSize: 13,
							color: "#94a3b8",
							fontWeight: 500,
							fontFamily: "system-ui,sans-serif",
						}}>
						Click anywhere to get a position
					</div>
				</div>
			)}

			{isEdit && markers.length > 0 && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						setMarkers([]);
						counterRef.current = 0;
					}}
					style={{
						position: "absolute",
						top: 12,
						right: 12,
						zIndex: 50,
						padding: "6px 12px",
						borderRadius: 7,
						border: "none",
						background: "rgba(255,255,255,0.92)",
						backdropFilter: "blur(8px)",
						color: "#64748b",
						fontSize: 12,
						fontWeight: 600,
						cursor: "pointer",
						fontFamily: "system-ui,sans-serif",
						boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
					}}>
					Clear ({markers.length})
				</button>
			)}

			{toast && (
				<div
					style={{
						position: "absolute",
						bottom: 16,
						left: "50%",
						transform: "translateX(-50%)",
						zIndex: 50,
						background: "#0f172a",
						color: "white",
						padding: "8px 16px",
						borderRadius: 8,
						fontSize: 12,
						fontWeight: 600,
						fontFamily: "system-ui,sans-serif",
						whiteSpace: "nowrap",
						pointerEvents: "none",
						boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
						animation: "ris-toast-in 0.2s ease",
					}}>
					✓ {toast}
				</div>
			)}
		</div>
	);
};
