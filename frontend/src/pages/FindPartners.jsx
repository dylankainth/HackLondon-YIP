import { useAuth } from '../components/AuthContext';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SubjectSearch from '../partials/SubjectSearch';
import CheckinAsk from '../partials/CheckinAsk';

function FindPartners() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    // Redirect to home only if user is NOT in localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/');
        }
    }, [navigate]);

    // Logout Function
    const signOut = () => {
        googleLogout();
        setUser(null);
        localStorage.removeItem('user'); // Clear storage
        navigate('/'); // Redirect to home after logout
    };

    return (
        <div className="min-h-screen left-0 right-0 bg-blue-50">
            {/* Header */}
            <div className="top-0 left-0 right-0 w-full h-16 shadow-md z-50 flex items-center justify-between px-6">
                <img src={user?.picture} alt="Profile" className="w-12 h-12 rounded-full ml-4" />
                <h2 className="text-xl font-semibold">Welcome, {user?.name} 👋</h2>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 shadow"
                    onClick={signOut}>
                    Sign Out
                </button>
            </div>

            {/* Find Your Partner Section */}
            <div className="w-full px-4 md:px-8 lg:px-16">
                <CheckinAsk />
                <SubjectSearch />
            </div>
        </div>
    );
}

export default FindPartners;
