import { useState } from 'react'

function FeaturesHome() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl">
            <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-semibold">Real-Time Pairing</h3>
                <p className="text-gray-600 mt-2">Instantly connect with an accountability partner.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-semibold">AI Check-ins</h3>
                <p className="text-gray-600 mt-2">Stay on track with periodic AI reminders.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-semibold">AI-Generated Timelines</h3>
                <p className="text-gray-600 mt-2">Get a detailed breakdown of your work sessions.</p>
            </div>
        </div>
    )
}

export default FeaturesHome;