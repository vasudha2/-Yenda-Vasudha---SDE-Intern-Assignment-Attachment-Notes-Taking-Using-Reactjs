import React, { useState } from 'react';
import "./Register.css";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Password and confirm password do not match.');
      return;
    }
  
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/.test(password)
    ) {
      alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }
  
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert('Invalid email format. Please enter a valid email address.');
      return;
    }
  
    try {
      
      const userExistsResponse = await fetch(`http://localhost:8081/user?email=${email}`);
      const userExistsData = await userExistsResponse.json();
  
      if (userExistsData.exists) {
        alert('User with the same email already exists.');
        return;
      }
  
      const response = await fetch('http://localhost:8081/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (response.ok) {
        alert('Registration successful!');
        window.location.href = '/'; 
      } else {
        alert('Registration failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while registering.');
    }
  };
  

  return (
    <div className='main'>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className='a'>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            placeholder='Enter your name'
            value={name}
            onChange={handleNameChange}
          />
        </div>
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
            type="password"
            id="password"
            placeholder='Enter your password'
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className='a'>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder='Confirm your password'
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <div className="create-account">
        <span>Already have an account? </span>
        <a href='/' data-testid='SigninLink' id='SigLink'>Login</a>
      </div>
    </div>
  );
};

export default Register;
