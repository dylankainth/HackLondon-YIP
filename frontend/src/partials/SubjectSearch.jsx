import { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

function SubjectSearch({ }) {
    const navigate = useNavigate();

    const subjects = ['Math', 'Science', 'History', 'English', 'Art', 'Music', 'Physical Education', 'Computer Science', 'Foreign Language', 'Other'];
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const inputRef = useRef(null);
    const [inputWidth, setInputWidth] = useState(0);

    useEffect(() => {
        if (inputRef.current) {
            setInputWidth(inputRef.current.offsetWidth);
        }
    }, [searchTerm]);

    const handleSearch = (event) => {
        event.preventDefault();
        //navigate('/call');
        navigate(`/call/${nanoid(8)}/${'testRoomId'}`);
    }

    const chooseRandomSubject = (event) => {
        event.preventDefault();
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        setSearchTerm(randomSubject);
        setShowDropdown(false);
    }

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value) {
            const filtered = subjects.filter(subject =>
                subject.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSubjects(filtered);
            setShowDropdown(true);
        } else {
            setFilteredSubjects([]);
            setShowDropdown(false);
        }
    };

    const handleSelectSubject = (subject) => {
        setSearchTerm(subject);
        setShowDropdown(false);
    };

    return (


        <div className="bg-blue-50 py-100 pt-32 mb-32 px-8 text-gray-900 flex flex-col items-center gap-y-4">
            {/* Section Title */}
            <h2 className="text-5xl font-extrabold text-center mb-24 w-full">
                Find Your Partner
            </h2>


            <div className="relative mt-16 w-full max-w-lg">
                <form onSubmit={handleSearch} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
                    <input
                        type="text"
                        placeholder="Search for a subject..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={() => setShowDropdown(true)}
                        className="flex-grow p-3 border rounded-lg"
                        ref={inputRef}
                    />
                    <button type="submit" className="p-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">Search</button>
                    <button onClick={chooseRandomSubject} className="p-3 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600">Random</button>
                </form>

                {showDropdown && filteredSubjects.length > 0 && (
                    <ul className="absolute border border-gray-300 bg-white w-full mt-2 rounded-lg shadow-md z-10">
                        {filteredSubjects.map((subject, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelectSubject(subject)}
                                className="p-3 hover:bg-gray-200 cursor-pointer"
                            >
                                {subject}
                            </li>
                        ))}
                    </ul>
                )}
            </div>


        </div>




    );
}

export default SubjectSearch;