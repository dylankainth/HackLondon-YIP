import { useState } from 'react';

function HeroHome() {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-[85vh] px-8 md:px-16 lg:px-24 gap-12">
            {/* Left Side */}
            <div className="w-1/3 flex flex-col justify-center items-center space-y-4">
                {/* Add space-y-4 to increase spacing */}
                <h1 className="text-center">
                    Main Name
                </h1>
                <h2>Stay Focused.</h2>
                <h2>Stay Accountable.</h2>
                <h2>Stay Productive.</h2>
                <button className="">
                    Find a Partner Now
                </button>
            </div>

            {/* Right Side */}
            <div className="w-1/3 flex justify-center items-center">
                {/* Content for the right side */}
                <img src="path/to/your/image.jpg" alt="Description" className="max-w-full h-auto" />
            </div>
        </div>
    );
}

export default HeroHome;
