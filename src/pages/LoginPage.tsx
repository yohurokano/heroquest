import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';
import styles from './LoginPage.module.css';
import { playSound } from '../utils/soundManager';
import { authenticateUser, createNewUser } from '../utils/authManager';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click');
    
    try {
      if (isSignUp) {
        await createNewUser(email, password, username);
      } else {
        await authenticateUser(email, password);
      }
      
      // Redirect to home page after successful login/signup
      navigate('/');
    } catch (err) {
      setError(err.message);
      playSound('error');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Hero Learning</h1>
        <p className={styles.heroSubtitle}>Learn like a hero!</p>
      </div>

      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {isSignUp && (
            <div className={styles.inputGroup}>
              <FaUser className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Hero Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.input}
              />
            </div>
          )}
          
          <div className={styles.inputGroup}>
            <FaUser className={styles.inputIcon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <FaLock className={styles.inputIcon} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className={styles.input}
            />
          </div>
          
          <button type="submit" className={styles.submitButton}>
            {isSignUp ? 'Sign Up' : 'Login'} 
            <FaArrowRight className={styles.arrowIcon} />
          </button>
        </form>

        <div className={styles.toggleAuth}>
          <p>
            {isSignUp ? 'Already have an account?' : 'New hero?'}
            <button 
              onClick={() => {
                playSound('click');
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className={styles.toggleButton}
            >
              {isSignUp ? 'Login' : 'Create Account'}
            </button>
          </p>
        </div>

        <div className={styles.guestOption}>
          <button 
            onClick={() => {
              playSound('click');
              navigate('/');
            }}
            className={styles.guestButton}
          >
            Continue as Guest
          </button>
          <p className={styles.guestNote}>Guest progress won't be saved across devices</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;