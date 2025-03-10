function FeaturesHome() {
    return (
        <div className="w-full py-16 bg-gradient-to-b from-blue-200 to-purple-300




 flex flex-col items-center">
            <h2 className="text-4xl font-extrabold text-center mb-12">
                Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-11/12 max-w-6xl">
                <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                    <h3 className="text-2xl font-semibold">Real-Time Pairing</h3>
                    <p className="text-gray-600 mt-2">Instantly connect with an accountability partner.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                    <h3 className="text-2xl font-semibold">Timed Check-ins</h3>
                    <p className="text-gray-600 mt-2">Stay on track with periodic reminders.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                    <h3 className="text-2xl font-semibold">Gamified AI Work-Insights</h3>
                    <p className="text-gray-600 mt-2">Track and compare your productivity in real-time.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default FeaturesHome
