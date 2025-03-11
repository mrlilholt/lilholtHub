// src/components/Auth/Login.js

import React from 'react';
import { auth, provider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
  const signIn = () => {
    signInWithPopup(auth, provider).catch((error) => console.error(error));
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}
    >
      <h2 style={{ marginBottom: '20px' }}>Login To The Lilholt Hub</h2>
      <button
        onClick={signIn}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google Logo"
          style={{ width: '20px', height: '20px' }}
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
