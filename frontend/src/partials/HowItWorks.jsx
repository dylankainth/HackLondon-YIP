import { useState } from 'react';

function HowItWorks() {
    return (
        <div className="bg-gradient-to-r from-blue-100 to-indigo-200
 py-100 pt-32 mb-32 px-8 text-gray-900 flex flex-col items-center gap-y-4">
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
                        <h3 className="text-2xl font-bold">Step 1: Sign In</h3>
                        <p className="text-gray-700 text-lg">Create an account through Gmail.</p>
                        <p className="text-gray-700 text-lg">Get started in seconds with your Gmail.</p>

                    </div>
                </div>

                {/* Tile 2 */}
                <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-lg flex justify-between items-center w-3/4 mx-auto">
                    <div>
                        <h3 className="text-2xl font-bold">Step 2: Get a Partner</h3>
                        <p className="text-gray-700 text-lg">Set your preferences or go random.</p>
                        <p className="text-gray-700 text-lg">Choose a subject and let the system match you with the right accountability partner.</p>

                    </div>
                </div>

                {/* Tile 3 */}
                <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-lg flex justify-between items-center w-3/4 mx-auto">
                    <div>
                        <h3 className="text-2xl font-bold">Step 3: Lock In & Focus
                        </h3>
                        <p className="text-gray-700 text-lg">Join a video call and stay on track.</p>
                        <p className="text-gray-700 text-lg">JWork together in real-time to stay accountable and productive.
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default HowItWorks;
