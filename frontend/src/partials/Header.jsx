import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../components/AuthContext'; // Import Auth Context
import logo from '../logo.png'; // Import logo image

function Header() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth(); // Use global state

    // Google Login Function
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse); // Save user token in context
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    // Fetch User Data from Google API
    useEffect(() => {
        if (user?.access_token) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    setUser(res.data); // Save user profile data globally
                    navigate('/findpartners'); // Redirect to Dashboard
                })
                .catch((err) => console.log(err));
        }
    }, [user, navigate, setUser]);

    return (
        <header className="fixed top-0 left-0 w-full h-16 bg-white shadow-md z-50 flex items-center">
            <div className="container mx-auto px-12 h-full flex justify-between items-center">
                <img src={logo} alt="Logo" className="w-12 h-12 rounded-full ml-8" />
                <nav>
                    <div className="flex space-x-6">
                        <button
                            className="px-4 py-2 text-gray-700 bg-blue-500 text-white border border-gray-300 rounded-md hover:bg-blue-600"
                            onClick={login}
                        >
                            Sign In with Google 🚀
                        </button>
                    </div>
                </nav>
            </div>
        </header>

    );
}

export default Header;
