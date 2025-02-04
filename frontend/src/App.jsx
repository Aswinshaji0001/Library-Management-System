import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Components/Login/Login'
import Signup from './Components/Signup/Signup'
import Email from './Components/Email/Email'
import Nav from './Components/Nav/Nav'
import Home from './Components/Home/Home'
import Admin from './Components/Admin/Admin';
import AddBook from './Components/AddBook/AddBook';
import EditBook from './Components/EditBook/EditBook';
import BookDetails from './Components/BookDetails/BookDetails';
import Borrowed from './Components/Borrowed/Borrowed';
import Profile from './Components/Profile/Profile';

function App() {
  const [user,setUser]=useState(" ")
  const [login,setLogin]=useState(" ")

  return (
    <>
      <BrowserRouter>
      {user && <Nav user={user} login={login}></Nav>}

      <Routes>
      <Route path="/" element={<Home setUser={setUser} setLogin={setLogin}/> }></Route>
        <Route path="/login" Component={Login}></Route>
        <Route path="/signup" Component={Signup}></Route>
        <Route path="/email" Component={Email}></Route>
        <Route path='/admin' element={<Admin setUser={setUser} setLogin={setLogin}/> }></Route>
        <Route path='/addbook' element={<AddBook setUser={setUser} setLogin={setLogin}/> }></Route>
        <Route path='/borrowed' element={<Borrowed setUser={setUser} setLogin={setLogin}/> }></Route>
        <Route path='/editbook/:id' element={<EditBook setUser={setUser} setLogin={setLogin}/> }></Route>
        <Route path='/bookdetails/:id' element={<BookDetails setUser={setUser} setLogin={setLogin}/> }></Route>
        <Route path='/profile' element={<Profile setUser={setUser} setLogin={setLogin}/> }></Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
