// src/App.js

import React, { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import Clock from './components/Clock/Clock';
import WeatherCard from './components/Weather/WeatherCard';
import DinnerCard from './components/Dinner/DinnerCard';
import EventsCard from './components/Events/EventsCard';
import TasksCard from './components/Tasks/TasksCard';
import { auth } from './firebase';
import './styles/styles.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes.
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log('User:', currentUser); // Log the user object for debugging
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="container">
        <Login />
      </div>
    );
  }

  return (
    <div className="container">
      <header 
        className="header" 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <img
          src="/lilholtHubLogo.png"
          alt="Lilholt Hub Logo"
          style={{ height: '60px' }} // adjust size as needed
        />
        <div 
          className="user-info" 
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <span>{user.displayName}</span>
          <button onClick={() => auth.signOut()}>Sign Out</button>
        </div>
      </header>
      <div className="dashboard">
        {/* Row of cards for Clock, Weather, Dinner, and Events */}
        <div
          className="dashboard-top"
          style={{ 
            display: 'flex', 
            gap: '20px', 
            flexWrap: 'nowrap', 
            justifyContent: 'center', 
            maxWidth: '1400px', // Increase as needed
            margin: '0 auto'
          }}
        >
          <div className="card">
            <Clock />
          </div>
          <div className="card">
            <WeatherCard />
          </div>
          <div className="card">
            <DinnerCard />
          </div>
          <div className="card">
            <EventsCard />
          </div>
        </div>

        {/* TasksCard on its own row */}
        <div className="dashboard-bottom" style={{ marginTop: '20px' }}>
          <div className="card">
            <TasksCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
