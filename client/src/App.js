import { Routes, Route} from 'react-router-dom'
import Home from './routes/Home';
import Profile from './routes/UserPage';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoutes from './general/auth/protected-route';
import Register from './routes/Register';
import Loading from './general/loading';
import WaitingRoom from './general/waiting-room';
import './styles/main/css/style.css';

function App() {

  const { isLoading } = useAuth0();
  
  if (isLoading) {
    return <Loading></Loading>
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/waiting" element={<ProtectedRoutes><WaitingRoom /></ProtectedRoutes>} />
        <Route path="/register" element={<ProtectedRoutes><Register /></ProtectedRoutes>} />
        <Route path="/userpage" element={<ProtectedRoutes><Profile/></ProtectedRoutes>} />
      </Routes>
    </div>
  );
}

export default App;
