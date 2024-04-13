import * as React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Admin/Login/Login';
import Home from './components/Client/Home/Home';
import HomeAdmin from './components/Admin/HomeAdmin/HomeAdmin';
import Popup from './components/Admin/Popup/Popup';
import Hall from './components/Client/Hall/Hall';
import Payment from './components/Client/Payment/Payment';
import Ticket from './components/Client/Ticket/Ticket';
import HandleFetchError from './components/HandleFetchError/HandleFetchError';

function App() {
  return (
    <>
      <Router basename={"/"}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/homeAdmin" element={<HomeAdmin/>}/>
          <Route path="/popup" element={<Popup children={<></>} status={""}/>}/>
          <Route path="/hall/:id" element={<Hall/>}/>
          <Route path="/payment" element={<Payment/>}/>
          <Route path="/ticket" element={<Ticket/>}/>
          <Route path="/fetchError" element={<HandleFetchError/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
