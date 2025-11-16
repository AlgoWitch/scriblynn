// src/components/SmallerComponents/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import './Signup.css'; 

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create username from first and last name
      const username = `${firstName}${lastName}`.toLowerCase().replace(/\s+/g, '');
      
      const response = await authAPI.signup({
        username,
        email,
        password,
      });

      const { token, _id, username: returnedUsername, email: userEmail } = response.data;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ 
        _id, 
        username: returnedUsername, 
        email: userEmail,
        firstName,
        lastName 
      }));

      toast.success("User Registered Successfully!!", {
        position: "top-center"
      });

      // Redirect to feed
      navigate('/feed');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Could not create account. Try again.';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "bottom-center"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      <form onSubmit={handleSignup} className="signup-form">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {error && <p className="signup-error">{error}</p>}
      </form>
      <p className="signup-footer">
        Already have an account?{' '}
        <span onClick={() => navigate('/login')} className="signup-link">Login</span>
      </p>
    </div>
  );
};

export default Signup;
