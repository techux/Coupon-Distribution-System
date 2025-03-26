import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes and Route
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import CouponList from './components/CouponList';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';


const App = () => {
  return (
    <Router> {/* Wrap your components with Router */}
      <div className='bg-[#111827] h-screen text-[#ffffff]'>
        <Navbar />
        <Routes> 
          <Route path="/" element={<CouponList />} />
          <Route path="/login" element={<Login/>} /> 
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
