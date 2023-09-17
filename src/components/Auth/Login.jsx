import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert('Login successful!');
        window.location.href = '/Homepage'; 
      } else {
        alert('Login failed. Please check your email and password.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while logging in.');
    }
  };

  return (
    <div className='main'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className='a'>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder='Enter your email'
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className='a'>
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? "text" : "password"} 
            id="password"
            placeholder='Enter your Password'
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="show-password">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={togglePasswordVisibility}
            id="showPasswordCheckbox"
          />
          <label htmlFor="showPasswordCheckbox">Show Password</label>
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="create-account">
        <span>Don't have an account? </span>
        <a href='/register' data-testid='RegisterLink' id='RegisterLink'>Register</a>
      </div>
    </div>
  );
};

export default Login;
