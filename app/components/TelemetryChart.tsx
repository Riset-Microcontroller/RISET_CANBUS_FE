"use client";

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);

type TelemetryPoint = {
    t: number;
    value: number;
};

type TelemetryChartProps = {
    data: TelemetryPoint[];
    metric: string;
};

export default function TelemetryChart({ data, metric }: TelemetryChartProps) {

    const chartData = data.map(d => ({
        x: d.t,
        y: d.value,
    }));

    const chartDataObject = {
        datasets: [
            {
                label: metric.charAt(0).toUpperCase() + metric.slice(1),
                data: chartData,
                borderColor: '#00ff66',
                backgroundColor: 'rgba(0, 255, 102, 0.1)',
                pointRadius: 0,
                pointHitRadius: 10, // Increased for easier finger tapping
                tension: 0.2,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0,
        },
        scales: {
            x: {
                type: 'time' as const,
                time: {
                    unit: 'second' as const,
                    tooltipFormat: 'HH:mm:ss',
                    displayFormats: {
                        second: 'HH:mm:ss',
                        minute: 'HH:mm',
                    },
                },
                ticks: { 
                    color: '#000',
                    maxRotation: 0, // Keep labels horizontal for readability
                    autoSkip: true,
                    maxTicksLimit: 5, // Prevents crowding on mobile
                    font: {
                        size: 10, // Slightly smaller for mobile
                    }
                },
                title: { 
                    display: true, 
                    text: 'Time (Live)', 
                    color: '#000',
                    font: { weight: 'bold' as const } 
                },
                grid: { color: 'rgba(0, 0, 0, 0.1)' }
            },
            y: {
                ticks: { 
                    color: '#000',
                    font: { size: 10 }
                },
                title: { 
                    display: true, 
                    text: metric.toUpperCase(), 
                    color: '#000',
                    font: { weight: 'bold' as const }
                },
                grid: { color: 'rgba(0, 0, 0, 0.1)' },
                beginAtZero: true,
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                mode: 'index' as const,
                intersect: false,
            }
        }
    };

    return (
        /* Increased height on mobile (h-[350px]) vs desktop (md:h-[400px]) */
        <div className="w-full h-[250px] md:h-[400px] bg-[#e6e6e6] p-2 md:p-4 rounded-xl shadow-md text-black relative"
            style={{
                boxShadow: "inset 0 0 10px #969696, 0 0 10px rgba(255,255,255,0.2)",
            }}>
            {/* Grid Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundSize: "20px 20px",
                    backgroundImage:
                        "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                }}
            />
            <div className="relative w-full h-full">
                <Line data={chartDataObject} options={options} />
            </div>
        </div>
    );
}