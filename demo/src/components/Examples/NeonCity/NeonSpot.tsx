import { useRef, useEffect, useState } from "react";
import type { SpotRenderProps } from "react-image-spots";

interface NeonSpotProps extends SpotRenderProps {
	label: string;
	sublabel?: string;
	color: string;
	previewSrc: string;
	nextScene?: string;
}

export const NeonSpot = ({
	isHovered,
	onMouseEnter,
	onMouseLeave,
	onClick,
	goTo,
	label,
	sublabel,
	color,
	previewSrc,
	nextScene,
}: NeonSpotProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const [placement, setPlacement] = useState<
		"top" | "bottom" | "left" | "right"
	>("top");

	useEffect(() => {
		if (!isHovered || !ref.current) return;
		const rect = ref.current.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;

		const spaceTop = rect.top;
		const spaceBottom = vh - rect.bottom;
		const spaceLeft = rect.left;
		const spaceRight = vw - rect.right;

		const max = Math.max(spaceTop, spaceBottom, spaceLeft, spaceRight);
		if (max === spaceTop) setPlacement("top");
		else if (max === spaceBottom) setPlacement("bottom");
		else if (max === spaceRight) setPlacement("right");
		else setPlacement("left");
	}, [isHovered]);

	const handleClick = (e: React.MouseEvent) => {
		onClick(e);
		if (nextScene) goTo(nextScene);
	};

	const cardStyle: React.CSSProperties = {
		position: "absolute",
		width: 180,
		borderRadius: 8,
		overflow: "hidden",
		border: `1px solid ${color}`,
		boxShadow: `0 0 20px ${color}44, 0 8px 32px rgba(0,0,0,0.6)`,
		pointerEvents: "none",
		zIndex: 100,
		...(placement === "top" && {
			bottom: "130%",
			left: "50%",
			transform: "translateX(-50%)",
		}),
		...(placement === "bottom" && {
			top: "130%",
			left: "50%",
			transform: "translateX(-50%)",
		}),
		...(placement === "right" && {
			left: "130%",
			top: "50%",
			transform: "translateY(-50%)",
		}),
		...(placement === "left" && {
			right: "130%",
			top: "50%",
			transform: "translateY(-50%)",
		}),
	};

	return (
		<div
			ref={ref}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={handleClick}
			style={{
				width: "100%",
				height: "100%",
				position: "relative",
				cursor: "pointer",
			}}>
			{/* Outer ring */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					borderRadius: "50%",
					border: `1.5px solid ${color}`,
					opacity: isHovered ? 0 : 0.4,
					transform: isHovered ? "scale(2)" : "scale(1.5)",
					transition: "all 0.4s ease",
				}}
			/>

			{/* Middle ring */}
			<div
				style={{
					position: "absolute",
					inset: "10%",
					borderRadius: "50%",
					border: `1.5px solid ${color}`,
					opacity: isHovered ? 0.6 : 0.3,
					transition: "all 0.3s ease",
				}}
			/>

			{/* Core dot */}
			<div
				style={{
					position: "absolute",
					inset: "30%",
					borderRadius: "50%",
					background: color,
					boxShadow: isHovered
						? `0 0 12px 4px ${color}, 0 0 30px 8px ${color}55`
						: `0 0 6px 2px ${color}88`,
					transition: "all 0.3s ease",
					transform: isHovered ? "scale(1.3)" : "scale(1)",
				}}
			/>

			{/* Label */}
			<div
				style={{
					position: "absolute",
					top: "110%",
					left: "50%",
					transform: "translateX(-50%)",
					whiteSpace: "nowrap",
					fontFamily: "'Courier New', monospace",
					fontSize: 10,
					fontWeight: 700,
					letterSpacing: "0.1em",
					textTransform: "uppercase",
					color: isHovered ? color : `${color}88`,
					textShadow: isHovered ? `0 0 8px ${color}` : "none",
					transition: "all 0.3s ease",
					pointerEvents: "none",
				}}>
				{label}
			</div>

			{/* Preview card — smart positioned */}
			{isHovered && (
				<div style={cardStyle}>
					<div
						style={{ height: 100, overflow: "hidden", position: "relative" }}>
						<img
							src={previewSrc}
							alt={label}
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								display: "block",
							}}
						/>
						<div
							style={{
								position: "absolute",
								inset: 0,
								background:
									"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
							}}
						/>
					</div>
					<div
						style={{
							background: "#000",
							padding: "6px 10px",
							borderTop: `1px solid ${color}44`,
						}}>
						<div
							style={{
								fontSize: 10,
								fontWeight: 700,
								fontFamily: "'Courier New', monospace",
								letterSpacing: "0.08em",
								textTransform: "uppercase",
								color,
								textShadow: `0 0 6px ${color}`,
							}}>
							{label}
						</div>
						{sublabel && (
							<div
								style={{
									fontSize: 9,
									fontFamily: "'Courier New', monospace",
									color: "rgba(255,255,255,0.4)",
									marginTop: 2,
								}}>
								{sublabel}
							</div>
						)}
						{nextScene && (
							<div
								style={{
									fontSize: 9,
									fontFamily: "'Courier New', monospace",
									color: `${color}88`,
									marginTop: 4,
									display: "flex",
									alignItems: "center",
									gap: 4,
								}}>
								<span>ENTER ZONE</span>
								<span style={{ color }}>→</span>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
