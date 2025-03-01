import { useState } from 'react'

function Testimonies() {
    return (
        <div className="text-center max-w-3xl">
            <h1 className="text-5xl font-bold text-gradient">Stay Focused. Stay Accountable. Work Together.</h1>
            <p className="text-lg text-gray-700 mt-4">Join real-time study/work sessions with accountability partners and track your productivity with AI-powered summaries.</p>
            <div className="mt-6">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg shadow-md hover:bg-blue-700">Start Now</button>
            </div>
        </div>
    )
}

export default Testimonies;