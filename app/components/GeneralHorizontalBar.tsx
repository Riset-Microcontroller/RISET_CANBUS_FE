interface GeneralHorizontalBarProps {
    name: string;
    value: number; // 0–100
    color?: string; // base LED color
    height?: number;
    segments?: number; // default 20
    onClick?: () => void;
}

export default function GeneralHorizontalBar({
    name,
    value,
    color = "#EF1A2D",
    height = 40,
    segments = 20,
    onClick,
}: GeneralHorizontalBarProps) {

    const activeCount = Math.round((value / 100) * segments);

    const hexToRgb = (hex: string) => {
        const clean = hex.replace("#", "");
        const bigint = parseInt(clean, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    };

    const base = hexToRgb(color);

    const getTone = (index: number) => {
        // Tonal logic: brighter as it progresses to the right
        const t = index / segments;
        const r = Math.round(base.r * (0.7 + t * 0.5));
        const g = Math.round(base.g * (0.7 + t * 0.5));
        const b = Math.round(base.b * (0.7 + t * 0.5));

        return `rgb(${r}, ${g}, ${b})`;
    };

    return (
        <div
            className="flex flex-col bg-white text-black p-4 rounded-md shadow-md hover:cursor-pointer w-full"
            onClick={onClick}
        >
            {/* Label Area */}
            <div className="flex justify-between items-end mb-2">
                <p className="text-xl font-semibold">{name}</p>
                <p className="text-xl font-bold">{value}%</p>
            </div>

            {/* The Bar Container */}
            <div
                className="flex flex-row bg-[#ebebeb] overflow-hidden rounded-md"
                style={{
                    height: height,
                    width: "100%",
                    padding: "4px",
                    border: "2px solid #111",
                    boxShadow: "0 0 6px #111 inset",
                }}
            >
                {[...Array(segments)].map((_, i) => {
                    // Logic: Turn on if index is less than active count (Left to Right)
                    const isOn = i < activeCount;
                    const tone = getTone(i);

                    return (
                        <div
                            key={i}
                            className="h-full flex-1 mx-[1.5px] rounded-sm"
                            style={{
                                backgroundColor: isOn ? tone : "#222",
                                boxShadow: isOn
                                    ? `0 0 6px ${tone}`
                                    : "inset 0 0 4px #000",
                                transition: "all 0.2s ease",
                            }}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
}