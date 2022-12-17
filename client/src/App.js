import { Routes, Route} from 'react-router-dom'
import Home from './routes/Home';
import Profile from './routes/UserPage';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoutes from './general/auth/protected-route';
import Register from './routes/Register';
import Loading from './general/loading';
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
        <Route path="/register" element={<ProtectedRoutes><Register /></ProtectedRoutes>} />
      </Routes>
    </div>
  );
}

export default App;
