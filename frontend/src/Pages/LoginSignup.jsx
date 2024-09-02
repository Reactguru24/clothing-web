import React, { useState } from 'react';
import './Loginsignup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faBan } from '@fortawesome/free-solid-svg-icons'; // Import icons
import { useNavigate } from 'react-router-dom';

function LoginSignup() {
  const [state, setState] = useState('login'); // Set initial state to 'login'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [forgotPassword, setForgotPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false); // New state for checkbox
  const [showWarning, setShowWarning] = useState(false); // New state for warning icon

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
    setShowWarning(false); // Hide warning icon when checkbox is checked
  };

  const signup = async () => {
    if (!termsAccepted) {
      setShowWarning(true); // Show warning icon if terms are not accepted
      return;
    }

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
      navigate('/login'); // Navigate to login after requesting password reset
    } else {
      alert(responseData.errors);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{forgotPassword ? 'Forgot Password' : state}</h1>
        {forgotPassword ? (
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
            ) : null}
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
          <button
            onClick={() => (state === 'login' ? login() : signup())}
            disabled={state === 'Sign Up' && !termsAccepted} // Disable signup button if terms are not accepted
          >
            Continue
            {state === 'Sign Up' && showWarning && !termsAccepted && (
              <FontAwesomeIcon icon={faBan} className="warning-icon" color="red" />
            )}
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
        {state === 'Sign Up' && !forgotPassword && (
          <div className="loginsignup-agree">
            <input
              type="checkbox"
              name="terms"
              id="terms"
              onChange={handleCheckboxChange} // Update checkbox state on change
            />
            <label htmlFor="terms">
              <span className="checkbox-icon">
                {termsAccepted ? (
                  <FontAwesomeIcon icon={faCheckCircle} color="green" />
                ) : (
                  <FontAwesomeIcon icon={faTimesCircle} color="red" />
                )}
              </span>
              By continuing, I agree to the terms of use & privacy policy
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginSignup;
