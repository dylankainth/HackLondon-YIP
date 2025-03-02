import { useState, useEffect } from 'react';

function CheckInTime() {
    const [time, setTime] = useState(() => {
        const savedTime = localStorage.getItem('checkInTime');
        return savedTime ? JSON.parse(savedTime) : 30; // Default value 30 minutes
    });

    useEffect(() => {
        localStorage.setItem('checkInTime', JSON.stringify(time));
    }, [time]);

    // Function to handle input changes (only allows integers)
    const handleChange = (e) => {
        let value = parseInt(e.target.value, 10);

        if (!isNaN(value)) {
            if (value < 1) value = 1; // Minimum is 1 minute
            if (value > 120) value = 120; // Maximum is 120 minutes
            setTime(value);
        }
    };

    // Function to increase time by 5 minutes
    const increaseTime = () => {
        setTime((prev) => Math.min(prev + 5, 120));
    };

    // Function to decrease time by 5 minutes
    const decreaseTime = () => {
        setTime((prev) => Math.max(prev - 5, 1));
    };

    return (
        <div className="bg-blue-50 py-100 pt-32 mb-32 px-8 text-gray-900 flex flex-col items-center gap-y-4">
            {/* Section Title */}
            <h2 className="text-5xl font-extrabold text-center mb-12 w-full">
                Check In Time
            </h2>

            <p className="text-gray-600 mt-2">Set your check-in time (1 min - 2 hours)</p>

            {/* Time Input Section */}
            <div className="relative mt-6 w-full max-w-lg flex items-center space-x-4">
                <input
                    type="number"
                    value={time}
                    onChange={handleChange}
                    min="1"
                    max="120"
                    className="h-12 w-24 p-3 text-center border rounded-lg text-lg"
                />
                <button
                    onClick={decreaseTime}
                    className="h-12 px-4 bg-gray-400 text-white rounded-md hover:bg-gray-500 flex items-center justify-center"
                >
                    -5 min
                </button>
                <button
                    onClick={increaseTime}
                    className="h-12 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center"
                >
                    +5 min
                </button>
            </div>
        </div>
    );
}

export default CheckInTime;
