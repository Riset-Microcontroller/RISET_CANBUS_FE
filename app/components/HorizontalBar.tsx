interface HorizontalBarProps {
    value: number;
    max: number;
    name: string;
    segments?: number;
    onClick?: () => void;
    units?: string;
}

export default function HorizontalBar({
    value,
    max,
    name,
    segments = 15,
    onClick,
    units,
}: HorizontalBarProps) {

    const activeCount = Math.round((value / max) * segments);

    const getLedColor = (index: number) => {
        const ratio = index / segments;

        if (ratio < 0.5) {
            const t = ratio / 0.5;
            return `rgb(${Math.round(0 + t * 230)}, 230, 0)`;
        } else {
            const t = (ratio - 0.5) / 0.5;
            return `rgb(230, ${Math.round(230 - t * 230)}, 0)`;
        }
    };

    return (
        <div className="bg-white text-black p-4 rounded-xl shadow-md w-full h-fit hover:cursor-pointer hover:shadow-lg transition-all" 
        onClick={onClick}>

            <div className="flex items-center gap-[3px] bg-[#ebebeb] p-1.25 rounded-md"
                style={{ border: "2px solid #111", boxShadow: "0 0 6px #111 inset" }}>

                {[...Array(segments)].map((_, i) => {
                    const isOn = i < activeCount;
                    const color = getLedColor(i);

                    return (
                        <div
                            key={i}
                            className="h-8 flex-1 rounded-sm"
                            style={{
                                backgroundColor: isOn ? color : "#222",
                                boxShadow: isOn
                                    ? `0 0 5px ${color}`
                                    : "inset 0 0 4px #000",
                                transition: "all 0.2s ease",
                            }}
                        />
                    );
                })}
            </div>

            <p className="md:text-3xl text-xl text-center font-bold mt-2">{value} {units}</p>
        </div>
    );
}
