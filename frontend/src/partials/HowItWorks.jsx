import { useState } from 'react';

function HowItWorks() {
    return (
        <div className="bg-blue-50 py-100 pt-32 mb-32 px-8 text-gray-900 flex flex-col items-center gap-y-4">
            {/* Section Title */}
            <h2 className="text-5xl font-extrabold text-center mb-24 w-full">
                How It Works
            </h2>

            {/* Tiles Section - Centered */}
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-y-8 mt-12">
                {/* Add mt-8 to increase spacing */}
                {/* Tile 1 */}
                <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-lg flex justify-between items-center w-3/4 mx-auto">
                    <div>
                        <h3 className="text-2xl font-bold">Step 1: Sign Up</h3>
                        <p className="text-gray-700 text-lg">Create an account to get started.</p>
                    </div>
                    <span className="text-gray-500 text-3xl">⚡</span>
                </div>

                {/* Tile 2 */}
                <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-lg flex justify-between items-center w-3/4 mx-auto">
                    <div>
                        <h3 className="text-2xl font-bold">Step 2: Set Up Profile</h3>
                        <p className="text-gray-700 text-lg">Complete your profile to match with others.</p>
                    </div>
                    <span className="text-gray-500 text-3xl">🚀</span>
                </div>

                {/* Tile 3 */}
                <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-lg flex justify-between items-center w-3/4 mx-auto">
                    <div>
                        <h3 className="text-2xl font-bold">Step 3: Start Collaborating</h3>
                        <p className="text-gray-700 text-lg">Connect and work with partners instantly.</p>
                    </div>
                    <span className="text-gray-500 text-3xl">🌙</span>
                </div>
            </div>
        </div>
    );
}

export default HowItWorks;
