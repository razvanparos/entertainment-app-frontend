import './App.css';
import CheckLoggedIn from './pages/CheckLoggedIn/CheckLoggedIn';
import RegisterPage from './pages/RegisterPage/RegistePage';
import Dashboard from './pages/dashboard/Dashboard';
import LoginPage from './pages/loginPage/LoginPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  
  return (
    <div className="App">
        <Router>
        <Routes>
          <Route path="/"  element={<CheckLoggedIn/>}/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
