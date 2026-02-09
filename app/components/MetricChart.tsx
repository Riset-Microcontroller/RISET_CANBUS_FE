"use client";

import { useEffect, useState } from "react";
import { getTelemetryRange, TelemetryKey } from "@/lib/telemetryBuffer";
import TelemetryChart from "./TelemetryChart";

type TelemetryPoint = {
    t: number;
    value: number;
};

const ranges = [
    { label: "10s", value: 10 },
    { label: "30s", value: 30 },
    { label: "60s", value: 60 },
    { label: "10m", value: 600 },
];

export default function MetricChart({ metric }: { metric: TelemetryKey }) {
    const [range, setRange] = useState<number>(30);
    const [data, setData] = useState<TelemetryPoint[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            const result = getTelemetryRange(metric, range);
            setData(result);
        }, 300);

        return () => clearInterval(timer);
    }, [metric, range]);

    return (
        <div>
            <h2 className="text-2xl font-extrabold mb-4 capitalize text-black">
                {metric} History
            </h2>

            <div className="flex gap-3 mb-4">
                {ranges.map((r) => (
                    <button
                        key={r.value}
                        onClick={() => setRange(r.value)}
                        className={`px-4 py-2 rounded-md ${range === r.value
                            ? "bg-gray-700 text-white font-bold"
                            : "bg-[#cacaca] text-black"
                            }`}
                    >
                        {r.label}
                    </button>
                ))}
            </div>

            <TelemetryChart data={data} metric={metric} />
        </div>
    );
}
