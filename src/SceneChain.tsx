import React, { useCallback, useState, type ReactNode } from "react";
import { ImageSpotMap } from "./ImageSpotMap";
import type { SceneChainProps, SpotDef } from "./types";

export const SceneChain: React.FC<SceneChainProps> = ({
	scenes,
	initialScene,
	transition = "fade",
	transitionDuration = 350,
	enableImageSwap = true,
	hideOthersOnHover = false,
	swapAnimation = "fade",
	showBackButton = true,
	showBreadcrumb = true,
	backButtonLabel,
	renderBackButton,
	onSceneChange,
	onSpotClick,
	className = "",
	style,
}) => {
	const [history, setHistory] = useState<string[]>([initialScene]);
	const [opacity, setOpacity] = useState(1);
	const [transitioning, setTransitioning] = useState(false);

	const currentSceneId = history[history.length - 1];
	const currentScene = scenes[currentSceneId] ?? { src: "", spots: [] };
	const canGoBack = history.length > 1;

	const doTransition = useCallback(
		(cb: () => void) => {
			if (transition === "none") {
				cb();
				return;
			}
			setTransitioning(true);
			setOpacity(0);
			setTimeout(() => {
				cb();
				setOpacity(1);
				setTimeout(() => setTransitioning(false), transitionDuration);
			}, transitionDuration);
		},
		[transition, transitionDuration],
	);

	const goTo = useCallback(
		(sceneId: string) => {
			if (!scenes[sceneId]) {
				console.warn(
					`[SceneChain] Scene "${sceneId}" not found. Available:`,
					Object.keys(scenes),
				);
				return;
			}
			doTransition(() => {
				setHistory((h) => [...h, sceneId]);
				onSceneChange?.(sceneId, scenes[sceneId]);
			});
		},
		[scenes, doTransition, onSceneChange],
	);

	const goBack = useCallback(() => {
		if (!canGoBack) return;
		doTransition(() => {
			setHistory((h) => {
				const next = h.slice(0, -1);
				const sceneId = next[next.length - 1];
				onSceneChange?.(sceneId, scenes[sceneId]);
				return next;
			});
		});
	}, [canGoBack, doTransition, onSceneChange, scenes]);

	return (
		<div
			className={className}
			style={{
				position: "relative",
				width: "100%",
				height: "100%",
				// overflow: hidden removed — spots can overflow
				...style,
			}}>
			{/* overflow: hidden only on image wrapper for transition */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					overflow: "hidden",
					borderRadius: "inherit",
					opacity,
					transition:
						transition !== "none"
							? `opacity ${transitionDuration}ms ease`
							: undefined,
					pointerEvents: transitioning ? "none" : "auto",
				}}>
				<ImageSpotMap
					src={currentScene.src}
					alt={currentScene.alt}
					spots={currentScene.spots}
					enableImageSwap={enableImageSwap}
					hideOthersOnHover={hideOthersOnHover}
					swapAnimation={swapAnimation}
					onSpotClick={(spot: SpotDef) => onSpotClick?.(spot, currentSceneId)}
					_goTo={goTo}
					_goBack={goBack}
					_canGoBack={canGoBack}
				/>
			</div>

			{canGoBack &&
				(renderBackButton
					? renderBackButton({ goBack, canGoBack, history })
					: showBackButton && (
							<button
								onClick={goBack}
								style={{
									position: "absolute",
									top: 16,
									left: 16,
									zIndex: 50,
									display: "flex",
									alignItems: "center",
									gap: 6,
									padding: "8px 16px",
									borderRadius: 8,
									background: "rgba(255,255,255,0.92)",
									border: "1.5px solid #e2e8f0",
									color: "#374151",
									fontSize: 13,
									fontWeight: 600,
									cursor: "pointer",
									fontFamily: "system-ui,sans-serif",
									backdropFilter: "blur(8px)",
									boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
								}}>
								{backButtonLabel ?? "← Back"}
							</button>
						))}

			{showBreadcrumb && history.length > 1 && (
				<div
					style={{
						position: "absolute",
						bottom: 14,
						left: "50%",
						transform: "translateX(-50%)",
						display: "flex",
						alignItems: "center",
						gap: 6,
						zIndex: 50,
						background: "rgba(0,0,0,0.5)",
						backdropFilter: "blur(8px)",
						borderRadius: 20,
						padding: "5px 14px",
					}}>
					{history.map((sceneId, i) => (
						<React.Fragment key={`${sceneId}-${i}`}>
							<span
								style={{
									fontSize: 11,
									fontFamily: "system-ui,sans-serif",
									color:
										i === history.length - 1
											? "white"
											: "rgba(255,255,255,0.45)",
									fontWeight: i === history.length - 1 ? 600 : 400,
								}}>
								{sceneId}
							</span>
							{i < history.length - 1 && (
								<span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>
									›
								</span>
							)}
						</React.Fragment>
					))}
				</div>
			)}
		</div>
	);
};
