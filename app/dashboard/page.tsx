"use client";

import { useEffect, useState } from "react";
import ParameterCard from "../components/ParameterCard";
import { getLatestData, subscribeToData } from "@/lib/mqtt";
import { GearPosition } from "@/lib/enums/gear";
import VerticalBar from "../components/VerticalBar";
import HorizontalBar from "../components/HorizontalBar";
import { isTelemetryKey, pushTelemetry, TelemetryKey } from "@/lib/telemetryBuffer";
import MetricChart from "../components/MetricChart";
import OdometerHistory from "../components/OdometerHistory";
import GeneralHorizontalBar from "../components/GeneralHorizontalBar";

export default function Dashboard() {
    const [data, setData] = useState({
        rpm: 0,
        speed: 0,
        throttle: 0,
        gear: 0,
        brake: 0,
        engineCoolantTemp: 0,
        airIntakeTemp: 0,
        odoMeter: 0,
        steeringAngle: 0,
    });

    useEffect(() => {
        const initialData = getLatestData();
        setData(prevData => ({
            ...prevData,
            ...initialData
        }));

        const unsubscribe = subscribeToData((mqttData) => {
            setData(prevData => ({
                ...prevData,
                ...mqttData
            }));

            Object.entries(mqttData).forEach(([k, v]) => {
                if (typeof v === "number" && isTelemetryKey(k)) {
                    pushTelemetry(k, v);
                }
            });

        });

        return unsubscribe;
    }, []);

    const [selectedMetric, setSelectedMetric] = useState<TelemetryKey | null>(null);

    function handleMetricClick(metric: TelemetryKey) {
        setSelectedMetric(prev => (prev === metric ? null : metric));
    }

    function getGearLabel(gearValue: number): string {
        switch (gearValue) {
            case GearPosition.P:
                return "P";
            case GearPosition.R:
                return "R";
            case GearPosition.N:
                return "N";
            case GearPosition.D:
                return "D";
            case GearPosition.S:
                return "S";
            case GearPosition.L:
                return "L";
            case GearPosition.T:
                return "T";
            default:
                return "Unknown";
        }
    }


    return (
        <div className="min-h-screen bg-[#e6e6e6]">
            <div className="flex justify-center p-10 w-full h-[60%] flex-wrap font-7segment">
                <h1 className="md:text-5xl text-2xl font-extrabold md:mb-8 mb-2 w-full text-center font-7segment text-black">MOBIL HAFIZ</h1>
                <div className="w-full h-full flex flex-wrap md:flex-nowrap justify-center gap-6">
                    <div className="hidden md:flex">
                        <VerticalBar name="Throttle" value={data.throttle} color="#00A551" width={80} onClick={() => handleMetricClick("throttle")} />
                    </div>

                    <div className="w-full flex justify-center flex-wrap gap-6 ">
                        <div className="w-full flex justify-center">
                            <HorizontalBar name="RPM" max={5000} value={data.rpm} onClick={() => handleMetricClick("rpm")} units="RPM" />
                        </div>
                        <div className="flex flex-wrap w-full md:hidden gap-1">
                            <GeneralHorizontalBar name="Throttle" value={data.throttle} color="#00A551" height={40} onClick={() => handleMetricClick("throttle")} />
                            <GeneralHorizontalBar name="Brake" value={data.brake} color="#EF1A2D" height={40} onClick={() => handleMetricClick("brake")} />
                        </div>

                        <div className="flex justify-center flex-wrap gap-1 md:gap-6 w-full m-2">
                            <ParameterCard name="Odometer" value={data.odoMeter} unit="km" onClick={() => handleMetricClick("odoMeter")} />
                            <ParameterCard name="Speed" value={data.speed} unit="km/h" onClick={() => handleMetricClick("speed")} />
                            <ParameterCard name="Gear" value={getGearLabel(data.gear)} onClick={() => handleMetricClick("gear")} />


                            <ParameterCard name="Engine Coolant Temp" value={data.engineCoolantTemp} unit="°C" onClick={() => handleMetricClick("engineCoolantTemp")} />
                            <ParameterCard name="Intake Temp" value={data.airIntakeTemp} unit="°C" onClick={() => handleMetricClick("airIntakeTemp")} />
                            {/* <ParameterCard name="Steering Angle" value={data.steeringAngle} unit="units" onClick={() => handleMetricClick("steeringAngle")} /> */}
                        </div>
                    </div>
                    <div className="hidden md:flex">
                        <VerticalBar name="Brake" value={data.brake} color="#EF1A2D" width={80} onClick={() => handleMetricClick("brake")} />
                    </div>
                </div>

                {selectedMetric && (
                    <div className="w-full mt-10 bg-white p-6 rounded-xl shadow-xl">
                        {selectedMetric === "odoMeter" ? (
                            <OdometerHistory vehicleId="ESP32" />
                        ) : (
                            <MetricChart metric={selectedMetric} />
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
