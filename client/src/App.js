import { Routes, Route} from 'react-router-dom'
import Home from './routes/Home';
import Profile from './routes/UserPage';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoutes from './general/auth/protected-route';
import Register from './routes/Register';
import Loading from './general/loading';
import WaitingRoom from './general/waiting-room';
import './styles/main/css/style.css';
import ProtectedRoutesUser from './general/auth/protected-route-user';
import Chat from './routes/Chat';
import Connect from './routes/Connect';
import StrangerPage from './routes/StrangerPage';
import Live from './routes/Live';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {

  const { isLoading } = useAuth0();
  
  // Loading autenticazione Auth0
  if (isLoading) {
    return <Loading></Loading>
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/waiting" element={<ProtectedRoutes><WaitingRoom /></ProtectedRoutes>} />
        <Route path="/register" element={<ProtectedRoutes><Register /></ProtectedRoutes>} />
        <Route path="/userpage" element={<ProtectedRoutesUser><Profile/></ProtectedRoutesUser>} />
        <Route path="/chat" element={<ProtectedRoutesUser><Chat/></ProtectedRoutesUser>} />
        <Route path="/connect" element={<ProtectedRoutesUser><Connect /></ProtectedRoutesUser>} />
        <Route path="/strangerpage" element={<ProtectedRoutesUser><StrangerPage /></ProtectedRoutesUser>} />
        <Route path="/live" element={<ProtectedRoutesUser><Live /></ProtectedRoutesUser>} />
      </Routes>
    </div>
  );
}

export default App;
