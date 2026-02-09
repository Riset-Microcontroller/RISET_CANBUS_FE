"use client";

import React, { useState } from 'react';

export default function UploadPage() {
    const [configName, setConfigName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [status, setStatus] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setStatus('');
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            setStatus("Error: Please select a file first.");
            return;
        }
        if (!configName.trim()) {
            setStatus("Error: Please enter a config name.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);

                const configData = {
                    name: configName,
                    content: json,
                    timestamp: new Date().toISOString()
                };

                localStorage.setItem(`config_${configName}`, JSON.stringify(configData));

                setStatus(`Success: Config "${configName}" saved locally!`);
                setSelectedFile(null);
                setConfigName('');
            } catch (err) {
                setStatus("Error: Invalid JSON file.");
            }
        };
        reader.readAsText(selectedFile);
    };

    return (
        <div className="min-h-screen bg-[#e6e6e6] text-black">
            <div className="flex flex-col items-center justify-center p-10 space-y-8 font-7segment">
                <h1 className="text-5xl font-extrabold text-center">UPLOAD CONFIG</h1>

                <div className='flex items-center text-3xl w-full max-w-2xl'>
                    <label className='font-bold whitespace-nowrap'>Config Name:</label>
                    <input
                        type="text"
                        value={configName}
                        onChange={(e) => setConfigName(e.target.value)}
                        placeholder="Enter name..."
                        className='ml-4 p-2 border-2 border-black rounded w-full'
                    />
                </div>

                <div className='flex items-center text-3xl w-full max-w-2xl'>
                    <label className='font-bold whitespace-nowrap'>Select JSON:</label>
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        className='ml-4 p-2 border-2 border-black rounded w-full bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-700'
                    />
                </div>

                <button
                    onClick={handleUpload}
                    className="px-4 py-2 bg-black text-white text-2xl font-bold rounded hover:bg-gray-800 transition-colors active:scale-95 hover:cursor-pointer"
                >
                    SAVE TO LOCAL
                </button>

                {status && (
                    <div className={`mt-6 p-4 text-2xl border-2 border-black rounded ${status.startsWith('Error') ? 'bg-red-200' : 'bg-green-200'
                        }`}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}