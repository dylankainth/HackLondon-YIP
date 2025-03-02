import React from "react";
import personWorking from "../images/person_working.png";

const HeroHome = () => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-[50vh] px-6 md:px-12 lg:px-32 gap-12 bg-gray-100">
            {/* Left Side - Adjusted width for better centering */}
            <div className="w-full md:w-2/3 lg:w-1/2 text-center md:text-left md:pl-16">
                <h1 className="text-5xl md:text-8xl font-extrabold leading-tight text-gray-900">
                    Locked<span className="bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text">In</span>
                </h1>
                <p className="mt-4 text-xl md:text-2xl text-gray-700">
                    Stay <span className="font-semibold text-blue-600">Focused.</span>
                    <br />
                    Stay <span className="font-semibold text-teal-500">Accountable.</span>
                    <br />
                    Stay <span className="font-semibold text-indigo-500">Productive.</span>
                </p>
            </div>

            {/* Right Side - Image Placement Improved */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-start ">
                <img
                    src={personWorking}
                    alt="Productivity Illustration"
                    className="max-w-sm md:max-w-md w-full h-auto rounded-lg"
                />
            </div>
        </div>
    );
};

export default HeroHome;
