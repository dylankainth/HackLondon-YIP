import { useState } from 'react'

function HeroHome() {
    return (
        <div className="text-center pb-12 md:pb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">
                Make your website <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">wonderful</span>
            </h1>
            <div className="max-w-3xl mx-auto">
                <p className="text-xl text-gray-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">
                    Our landing page template works on all devices, so you only have to set it up once, and get beautiful results forever.
                </p>
                <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                    <div>
                        <a className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0" href="#0">Start free trial</a>
                    </div>
                    <div>
                        <a className="btn text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto sm:ml-4" href="#0">Learn more</a>
                    </div>
                </div>
            </div>
        </div>

        // <div className="text-center max-w-3xl">
        //     <h1 className="text-5xl font-bold text-gradient">Stay Focused. Stay Accountable. Work Together.</h1>
        //     <p className="text-lg text-gray-700 mt-4">Join real-time study/work sessions with accountability partners and track your productivity with AI-powered summaries.</p>
        //     <div className="mt-6">
        //         <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg shadow-md hover:bg-blue-700">Start Now</button>
        //     </div>
        // </div>
    )
}

export default HeroHome;