import { useEffect, useState } from "react";
import { getOdometerHistory } from "@/lib/api";
import OdometerChart from "./OdometerChart";

type OdometerRecord = {
    odo: number;
    bucket: {
        $date: string;
    };
};

const TIME_RANGES = ["1h", "24h", "7d", "30d", "1y", "ytd"];

export default function OdometerHistory({ vehicleId }: { vehicleId: string }) {
    const [range, setRange] = useState("1h");
    const [data, setData] = useState<OdometerRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const result: OdometerRecord[] = await getOdometerHistory(vehicleId, range);
                console.log("Fetched odometer data:", result);

                setData(result);
            } catch (err) {
                console.error(err);
                setError("Could not load odometer data.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [vehicleId, range]);

    return (
        <div className="">
            <h2 className="text-2xl font-extrabold text-black mb-4">Odometer History</h2>

            <div className="flex flex-wrap gap-3 mb-4">
                {TIME_RANGES.map((r) => (
                    <button
                        key={r}
                        onClick={() => setRange(r)}
                        className={`px-4 py-2 rounded-md ${range === r
                            ? "bg-gray-700 text-white font-bold"
                            : "bg-[#cacaca] text-black"
                            }`}                    >
                        {r}
                    </button>
                ))}
            </div>

            {loading && <p className="text-gray-400">Loading data...</p>}
            {error && <p className="text-red-400">Error: {error}</p>}

            <OdometerChart data={data} metric="odometer" />
        </div>
    );
}