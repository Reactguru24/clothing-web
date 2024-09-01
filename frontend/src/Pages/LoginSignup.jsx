import React, { useState } from 'react';
import './Loginsignup.css';

function LoginSignup() {
  const [state, setState] = useState('login'); // Set initial state to 'login'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [forgotPassword, setForgotPassword] = useState(false);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signup = async () => {
    let responseData;
    await fetch('http://localhost:4001/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/');
    } else {
      alert(responseData.errors);
    }
  };

  const login = async () => {
    let responseData;
    await fetch('http://localhost:4001/login', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/');
    } else {
      alert(responseData.errors);
    }
  };

  const handleForgotPassword = async () => {
    const { email } = formData;

    if (!email) {
      alert('Please enter your email address.');
      return;
    }

    let responseData;
    await fetch('http://localhost:4001/forgot-password', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      alert('A password reset link has been sent to your email.');
      setState('login'); // Go back to login after requesting password reset
    } else {
      alert(responseData.errors);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        {forgotPassword && state === 'login' ? (
          <div className="forgot-password">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={changeHandler}
              placeholder="Email Address"
            />
            <button onClick={handleForgotPassword}>Request Password Reset</button>
            <p onClick={() => setForgotPassword(false)}>Back to Login</p>
          </div>
        ) : (
          <div className="loginsignup-field">
            {state === 'Sign Up' ? (
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={changeHandler}
                placeholder="Username"
              />
            ) : (
              <></>
            )}
            <input
              name="email"
              value={formData.email}
              onChange={changeHandler}
              type="email"
              placeholder="Email Address"
            />
            <input
              name="password"
              value={formData.password}
              onChange={changeHandler}
              type="password"
              placeholder="Password"
            />
          </div>
        )}
        {!forgotPassword && (
          <button onClick={() => (state === 'login' ? login() : signup())}>
            Continue
          </button>
        )}
        {!forgotPassword && state === 'login' && (
          <p className="loginsignup-login">
            Create an account <span onClick={() => setState('Sign Up')}>Click here</span>
            <br />
            <span onClick={() => setForgotPassword(true)}>Forgot Password?</span>
          </p>
        )}
        {!forgotPassword && state === 'Sign Up' && (
          <p className="loginsignup-login">
            Already have an account? <span onClick={() => setState('login')}>Login here</span>
          </p>
        )}
        {!forgotPassword && (
          <div className="loginsignup-agree">
            <input type="checkbox" name="" id="" />
            <p>By continuing, I agree to the terms of use & privacy policy</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginSignup;
