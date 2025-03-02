import { useEffect, useState } from 'react';
import { signalingServerUrl } from '../consts';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io(signalingServerUrl);

function Looking() {
  const { searchTerm } = useParams();
  const navigate = useNavigate();

  // find another partner here
  const findAnotherPartner = () => {
    socket.emit('cancelSearch',searchTerm);
    navigate('/findpartners');
  }
    const[ran, setRan] = useState(false);

    if (!ran) {
        socket.connect();
        socket.emit('searchRoom', searchTerm);
        socket.on('roomFound', (roomId) => { 
          console.log('Room found:', roomId);
          navigate(`/call/${roomId}`);
        });
    
        setRan(true);
    }

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


      <button
        className="mt-4 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md 
                   hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
        onClick={findAnotherPartner} // Replace with your actual function
      >
        Find Another Partner
      </button>
    </div>
  );
}

export default Looking;