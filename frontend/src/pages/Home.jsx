import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import SubjectSearch from '../partials/SubjectSearch';
import HeroHome from '../partials/HeroHome';
import FeaturesHome from '../partials/FeaturesHome';
import Footer from '../partials/Footer';
import Header from '../partials/Header';
import HowItWorks from '../partials/HowItWorks';

function Home() {
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
        //navigate('/call');
        navigate(`/room/${nanoid(8)}/${'testRoomId'}`);
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
        <div className="flex flex-col min-h-screen bg-white text-gray-900">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-grow w-screen">
                <HeroHome />
                <HowItWorks />
                <FeaturesHome />
                <SubjectSearch navigate={navigate} />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default Home;
