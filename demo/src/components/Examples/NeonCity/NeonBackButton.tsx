interface NeonBackButtonProps {
	goBack: () => void;
	label?: string;
	color?: string;
}

export const NeonBackButton = ({
	goBack,
	label = "← BACK",
	color = "#00fff0",
}: NeonBackButtonProps) => (
	<button
		onClick={goBack}
		style={{
			position: "absolute",
			top: 16,
			left: 16,
			zIndex: 50,
			padding: "6px 14px",
			background: "rgba(0,0,0,0.75)",
			border: `1px solid ${color}`,
			borderRadius: 4,
			color,
			fontSize: 11,
			fontWeight: 700,
			fontFamily: "'Courier New', monospace",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			cursor: "pointer",
			backdropFilter: "blur(8px)",
			boxShadow: `0 0 12px ${color}44, inset 0 0 12px ${color}11`,
			textShadow: `0 0 8px ${color}`,
			transition: "all 0.2s ease",
		}}
		onMouseEnter={(e) => {
			const el = e.currentTarget as HTMLButtonElement;
			el.style.boxShadow = `0 0 20px ${color}88, inset 0 0 20px ${color}22`;
			el.style.background = `${color}11`;
		}}
		onMouseLeave={(e) => {
			const el = e.currentTarget as HTMLButtonElement;
			el.style.boxShadow = `0 0 12px ${color}44, inset 0 0 12px ${color}11`;
			el.style.background = "rgba(0,0,0,0.75)";
		}}>
		{label}
	</button>
);
