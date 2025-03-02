import { useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { signalingServerUrl } from '../consts';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io(signalingServerUrl);

function Looking() {
  const { searchTerm } = useParams();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();
    socket.emit('searchRoom', searchTerm);

    socket.on('roomFound', (roomId) => { 
      console.log('Room found:', roomId);
      navigate(`/call/${roomId}`);
    });

    // Clean up the listener on unmount
    return () => {
      socket.off('roomFound');
    };
  }, [searchTerm, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <svg
            className="animate-spin h-80 w-80 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            />
            <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>

        <h1 className="mt-4">Looking for {searchTerm}</h1>
    </div>
  );
}

export default Looking;