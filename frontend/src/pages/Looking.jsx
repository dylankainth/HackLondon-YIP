import { useAuth } from '../components/AuthContext';
import { signalingServerUrl } from '../consts';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';


const socket = io(signalingServerUrl);


function Looking() {
  const { searchTerm } = useParams()
  const { user, setUser } = useAuth();

  socket.connect();
  socket.emit('searchRoom',  searchTerm);
  
  socket.on('roomFound', (roomId) => { 
    console.log('Room found:', roomId);
    navigate(`/call/${roomId}`);
  });

  return (
    <div>
      <h1>Looking for {searchTerm}</h1>
    </div>
  )
}

export default Looking;