import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

function Home() {

    const subjects = ['Math', 'Science', 'History', 'English', 'Art', 'Music', 'Physical Education', 'Computer Science', 'Foreign Language', 'Other'];

    const navigate = useNavigate();
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

    // search for a partner (for now just go to the call page)
    const handleSearch = (event) => {
        event.preventDefault();
        // Implement search logic here
        navigate('/call');
    }

    // choosing a random subject (im feeling lucky)
    const chooseRandomSubject = (event) => {
        event.preventDefault();
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        setSearchTerm(randomSubject);
        setShowDropdown(false);
    }

    // handle the input change, deal with logic as user types into text box

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
        <div>
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search for a subject..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => {
                        setShowDropdown(true);
                    }}
                    style={{ flex: 1 }}
                    ref={inputRef}
                />
                <button type="submit" style={{ marginLeft: '10px' }}>Search</button>
                <button onClick={chooseRandomSubject} style={{ marginLeft: '10px' }}>Random</button>
            </form>

            {showDropdown && filteredSubjects.length > 0 && (
                <ul style={{
                    border: '1px solid #ccc',
                    padding: '5px',
                    listStyleType: 'none',
                    position: 'absolute',
                    background: 'white',
                    width: `${inputWidth}px`, // same width as input
                    cursor: 'pointer',
                    marginTop: '5px'
                }}>
                    {filteredSubjects.map((subject, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectSubject(subject)}
                            style={{ padding: '5px', borderBottom: '1px solid #eee' }}
                        >
                            {subject}
                        </li>
                    ))}
                </ul>
            )}


        </div>
    )
}
export default Home