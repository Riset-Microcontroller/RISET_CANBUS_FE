"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    // Common styles for the Nav Links to keep code DRY
    const linkStyles = `
    font-7segment font-extrabold text-xl text-black
    px-4 py-1 rounded-md bg-white
    transition-all duration-200
    shadow-[2px_2px_0_#000]
    hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000]
    active:translate-y-0 active:shadow-none
    text-center w-full md:w-auto
  `;

    return (
        <header className="bg-[#c5c5c5] border-b-6 border-[#afafaf] text-black">
            <div className="flex flex-wrap justify-between items-center px-6 py-3">

                {/* Title */}
                <h1 className="text-2xl md:text-4xl text-white font-ferro tracking-wide drop-shadow-[3px_3px_0_#000000]">
                    Vehicle Dashboard
                </h1>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 bg-white border-2 border-black rounded shadow-[2px_2px_0_#000]"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>

                {/* Navigation */}
                <nav className={`
          ${isOpen ? "flex" : "hidden"} 
          md:flex flex-col md:flex-row items-center gap-4 
          w-full md:w-auto mt-4 md:mt-0
        `}>
                    <Link href="/" className={linkStyles} onClick={() => setIsOpen(false)}>
                        Home
                    </Link>

                    <Link href="/upload" className={linkStyles} onClick={() => setIsOpen(false)}>
                        Upload Config
                    </Link>

                    <select
                        className="
              w-full md:w-auto
              bg-white text-black font-7segment font-extrabold text-xl
              rounded-md px-3 py-1.5
              border border-gray-300
              shadow-[2px_2px_0_#000]
              hover:border-[#FFF200]
              focus:outline-none focus:ring-1 focus:ring-[#FFF200]
              transition-all duration-150"
                        defaultValue=""
                    >
                        <option value="" disabled>Select Config</option>
                        <option value="car1">Car 1</option>
                        <option value="car2">Car 2</option>
                        <option value="car3">Car 3</option>
                    </select>
                </nav>
            </div>
        </header>
    );
}