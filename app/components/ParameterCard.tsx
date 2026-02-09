"use client";

interface ParameterCardProps {
    name: string;
    value: number | string;
    unit?: string;
    onClick?: () => void;
}

export default function ParameterCard({
    name,
    value,
    unit,
    onClick,
}: ParameterCardProps) {

    const cardContent = (
        <div
            onClick={onClick}>
            <div className="bg-white p-2 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer min-w-64 md:w-96">

                <div
                    className="bg-[#ebebeb] text-[#000000] rounded-md p-4 shadow-inner border-2 border-white tracking-wider font-7segment relative"
                    style={{
                        boxShadow:
                            "inset 0 0 10px #969696, 0 0 10px rgba(255,255,255,0.2)",
                    }}
                >
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            backgroundSize: "6px 6px",
                            backgroundImage:
                                "linear-gradient(#00000018 2px, transparent 2px), linear-gradient(90deg, #00000018 2px, transparent 2px)",
                        }}
                    />

                    <h2 className="text-lg mb-2 font-bold relative z-10">{name}</h2>
                    <p className="text-3xl font-bold relative z-10">
                        {value} {unit}
                    </p>
                </div>

            </div>
        </div>
    )

    return cardContent;
}
