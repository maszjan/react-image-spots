import { useEffect, useState, type ComponentType } from "react";
import type { LucideIconName } from "./types";

/**
 * Curated subset of lucide-react icon names used to power the icon browser
 * in LayerScene edit mode. lucide-react ships 1000+ icons - this list is a
 * hand-picked sample for search/discovery, not an exhaustive registry.
 * `resolveIcon` can still resolve any valid lucide-react export name, even
 * ones not present in this list (e.g. typed in a config by hand).
 */
export const LUCIDE_ICON_NAMES: LucideIconName[] = [
	"AlarmClock",
	"AlertCircle",
	"AlertOctagon",
	"AlertTriangle",
	"Anchor",
	"Apple",
	"Archive",
	"AtSign",
	"Award",
	"Baby",
	"Ban",
	"Banana",
	"Battery",
	"BatteryCharging",
	"BatteryFull",
	"BatteryLow",
	"Beer",
	"Bell",
	"BellRing",
	"Bike",
	"Bird",
	"Bluetooth",
	"Bone",
	"Book",
	"BookOpen",
	"BookOpenCheck",
	"Bookmark",
	"Box",
	"Brush",
	"Bug",
	"Building",
	"Building2",
	"Bus",
	"Cake",
	"Calendar",
	"CalendarCheck",
	"CalendarDays",
	"Camera",
	"CameraOff",
	"Car",
	"Castle",
	"Cat",
	"Check",
	"CheckCheck",
	"CheckSquare",
	"Cherry",
	"Circle",
	"CircleAlert",
	"CircleCheck",
	"CircleDot",
	"CircleHelp",
	"CircleX",
	"Clipboard",
	"ClipboardCopy",
	"ClipboardList",
	"Clock",
	"Cloud",
	"CloudLightning",
	"CloudMoon",
	"CloudRain",
	"CloudSnow",
	"CloudSun",
	"Cloudy",
	"Coffee",
	"Columns",
	"Compass",
	"Construction",
	"Contact",
	"Cookie",
	"Copy",
	"Cpu",
	"CreditCard",
	"Crown",
	"Database",
	"Diamond",
	"Dog",
	"DollarSign",
	"Download",
	"DownloadCloud",
	"Droplet",
	"Droplets",
	"Edit",
	"Egg",
	"Eraser",
	"ExternalLink",
	"Eye",
	"EyeOff",
	"Factory",
	"FastForward",
	"Feather",
	"File",
	"FileText",
	"Film",
	"Filter",
	"Fish",
	"Flag",
	"Flame",
	"Flower",
	"Flower2",
	"Folder",
	"FolderOpen",
	"Frown",
	"Gamepad",
	"Gamepad2",
	"Gem",
	"Gift",
	"Glasses",
	"Globe",
	"Grape",
	"Grid2x2",
	"Grid3x3",
	"Grip",
	"GripVertical",
	"Hammer",
	"Hand",
	"Handshake",
	"HardDrive",
	"Hash",
	"Headphones",
	"Heart",
	"HeartCrack",
	"Hexagon",
	"Home",
	"Hospital",
	"Hourglass",
	"IceCreamCone",
	"Image",
	"Images",
	"Inbox",
	"Info",
	"Joystick",
	"Key",
	"Keyboard",
	"Landmark",
	"Laptop",
	"Laugh",
	"Layers",
	"LayoutGrid",
	"LayoutList",
	"Leaf",
	"Link",
	"List",
	"ListChecks",
	"Loader",
	"LoaderCircle",
	"Lock",
	"Mail",
	"MailOpen",
	"Map",
	"MapPin",
	"Maximize",
	"Medal",
	"Meh",
	"Menu",
	"MessageCircle",
	"MessageSquare",
	"MessagesSquare",
	"Mic",
	"MicOff",
	"Milestone",
	"Minimize",
	"Minus",
	"MinusCircle",
	"Monitor",
	"Moon",
	"MoonStar",
	"MoreHorizontal",
	"MoreVertical",
	"Mountain",
	"Mouse",
	"Move",
	"Music",
	"Music2",
	"Navigation",
	"Newspaper",
	"Octagon",
	"Package",
	"Paintbrush",
	"Palette",
	"Palmtree",
	"PanelLeft",
	"PanelRight",
	"Paperclip",
	"ParkingCircle",
	"Pause",
	"PawPrint",
	"Pen",
	"Pencil",
	"PencilLine",
	"Pentagon",
	"Percent",
	"Phone",
	"PhoneCall",
	"Pin",
	"Pizza",
	"Plane",
	"Play",
	"Plug",
	"PlugZap",
	"Plus",
	"PlusCircle",
	"Power",
	"PowerOff",
	"Printer",
	"Rabbit",
	"Radio",
	"Rainbow",
	"Redo",
	"Redo2",
	"RefreshCcw",
	"RefreshCw",
	"Repeat",
	"Repeat1",
	"Rewind",
	"Rocket",
	"RotateCcw",
	"RotateCw",
	"Route",
	"Rows",
	"Ruler",
	"Sandwich",
	"Save",
	"School",
	"Scissors",
	"Search",
	"Send",
	"Server",
	"Settings",
	"Settings2",
	"Share",
	"Share2",
	"Shield",
	"ShieldAlert",
	"ShieldCheck",
	"Ship",
	"ShoppingBag",
	"ShoppingCart",
	"Shuffle",
	"Sidebar",
	"Signpost",
	"SkipBack",
	"SkipForward",
	"Sliders",
	"Smartphone",
	"Smile",
	"Snowflake",
	"Sparkles",
	"Speaker",
	"Sprout",
	"Square",
	"SquareCheck",
	"Squirrel",
	"Star",
	"Store",
	"Sun",
	"Sunrise",
	"Sunset",
	"Table",
	"Tablet",
	"Tag",
	"Target",
	"Tent",
	"Thermometer",
	"ThumbsDown",
	"ThumbsUp",
	"Timer",
	"TrafficCone",
	"Train",
	"Trash",
	"Trash2",
	"TreePine",
	"Trees",
	"Triangle",
	"Trophy",
	"Truck",
	"Turtle",
	"Tv",
	"Umbrella",
	"Undo",
	"Undo2",
	"Unlock",
	"Upload",
	"UploadCloud",
	"User",
	"UserCheck",
	"UserPlus",
	"UserX",
	"Users",
	"Utensils",
	"UtensilsCrossed",
	"Video",
	"VideoOff",
	"Volume",
	"Volume1",
	"Volume2",
	"VolumeX",
	"Wallet",
	"Warehouse",
	"Watch",
	"Waves",
	"Wifi",
	"WifiOff",
	"Wind",
	"Wine",
	"Wrench",
	"X",
	"XCircle",
	"Zap",
];

/** Splits "ShoppingBag" -> ["Shopping", "Bag"] so substring search matches "shopping bag" too */
export function splitIconWords(name: string): string[] {
	return name.match(/[A-Z][a-z0-9]*/g) ?? [name];
}

export function searchIcons(query: string): LucideIconName[] {
	const q = query.trim().toLowerCase();
	if (!q) return LUCIDE_ICON_NAMES;
	return LUCIDE_ICON_NAMES.filter((name) => {
		if (name.toLowerCase().includes(q)) return true;
		const words = splitIconWords(name).join(" ").toLowerCase();
		return words.includes(q);
	});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LucideModule = Record<string, ComponentType<any>>;

// The specifier is a literal so bundlers (Vite/webpack/Rollup) can statically
// detect and properly resolve/code-split this dynamic import when
// lucide-react IS installed - a variable specifier defeats that analysis and
// breaks resolution in real dev servers (bare specifiers aren't resolvable
// by the browser at runtime without it). When lucide-react is NOT installed,
// this package's own build marks it `external` so its presence is never
// assumed here; consumers who never render an icon layer and never install
// it are unaffected because the import only rejects at runtime, it doesn't
// fail their build (dynamic imports aren't eagerly resolved at build time).
let lucideModulePromise: Promise<LucideModule | null> | null = null;
let cachedModule: LucideModule | null | undefined;
const listeners = new Set<() => void>();

function loadLucide(): Promise<LucideModule | null> {
	if (!lucideModulePromise) {
		lucideModulePromise = import("lucide-react")
			.then((mod) => mod as unknown as LucideModule)
			.catch(() => null)
			.then((mod) => {
				// cachedModule must be set before listeners fire - a listener's
				// callback calls resolveIcon() synchronously, and it reads
				// cachedModule directly.
				cachedModule = mod;
				listeners.forEach((cb) => cb());
				return mod;
			});
	}
	return lucideModulePromise;
}

// Kick off the load eagerly so icons resolve as soon as possible rather
// than waiting for the first icon layer to mount.
void loadLucide();

/**
 * Resolves a lucide-react icon name to its component, synchronously if
 * already loaded/cached. Returns `null` if lucide-react isn't installed,
 * hasn't finished loading yet, or the name doesn't match an export -
 * callers should render a placeholder in that case instead of crashing.
 * Use `useLucideIcon` in components so a not-yet-loaded module re-renders
 * once the dynamic import resolves.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveIcon(iconName: string): ComponentType<any> | null {
	if (cachedModule === undefined) return null;
	if (cachedModule === null) return null;
	return cachedModule[iconName] ?? null;
}

/** Subscribes to lucide-react finishing its (one-time) dynamic import. */
export function onLucideLoaded(cb: () => void): () => void {
	if (cachedModule !== undefined) {
		cb();
		return () => {};
	}
	listeners.add(cb);
	return () => listeners.delete(cb);
}

/**
 * Resolves an icon component and re-renders once lucide-react finishes its
 * (one-time) dynamic import, in case it wasn't ready yet on first render.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useLucideIcon(iconName: string): ComponentType<any> | null {
	const [icon, setIcon] = useState(() => resolveIcon(iconName));

	useEffect(() => {
		setIcon(() => resolveIcon(iconName));
		return onLucideLoaded(() => setIcon(() => resolveIcon(iconName)));
	}, [iconName]);

	return icon;
}
