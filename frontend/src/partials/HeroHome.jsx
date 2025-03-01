import { useState } from 'react';

function HeroHome() {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-[60vh] px-8 md:px-16 lg:px-24 gap-12 bg-gradient-to-r from-blue-100 to-indigo-200">
            {/* Adjust min-h from 85vh to 60vh */}
            {/* Left Side */}
            <div className="w-1/3 flex flex-col justify-center items-center space-y-4">
                <h1 className="text-center">
                    Main Name
                </h1>
                <h2>Stay Focused.</h2>
                <h2>Stay Accountable.</h2>
                <h2>Stay Productive.</h2>
                <button className="px-8 py-4 text-xl font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition">
                    Find Your Partner
                </button>
            </div>

            {/* Right Side */}
            <div className="w-1/3 flex justify-center items-center">
                <img src="path/to/your/image.jpg" alt="Description" className="max-w-full h-auto" />
            </div>
        </div>
    );
}

export default HeroHome;
