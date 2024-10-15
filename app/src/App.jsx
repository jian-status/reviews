import { useState, useEffect } from 'react'
import { LoginForm } from './components/auth.jsx';
import HomePage from './components/HomePage.jsx';

import './App.css'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [IsLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetch('http://localhost:3000/auth', {credentials: "include"})
            .then(res => res.json())
            .then(data => {
                setIsLoggedIn(data.loggedIn); // boolean
                setIsLoading(false);
            })
    }, [])
    return (
        <>
            {IsLoading ? 'Loading!' : (isLoggedIn ? <HomePage/> : <LoginForm/>)}
        </>
    )
}

export default App
