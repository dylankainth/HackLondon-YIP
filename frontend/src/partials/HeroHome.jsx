import { useState } from 'react';

function HeroHome() {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-[60vh] px-8 md:px-16 lg:px-24 gap-12 bg-blue-50">
            {/* Adjust min-h from 85vh to 60vh */}
            {/* Left Side */}
            <div className="w-1/3 flex flex-col justify-center items-center space-y-4">
                <h1 className="text-center text-gradient">
                    LockedIn
                </h1>
                <h2>Stay Focused.</h2>
                <h2>Stay Accountable.</h2>
                <h2>Stay Productive.</h2>

            </div>

            {/* Right Side */}
            <div className="w-1/3 flex justify-center items-center ml-4">
                {/* Add ml-4 to add margin-left */}
                <img src="path/to/your/image.jpg" alt="Description" className="max-w-full h-auto" />
            </div>
        </div>
    );
}

export default HeroHome;
