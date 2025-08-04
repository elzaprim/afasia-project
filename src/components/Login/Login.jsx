import React, { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    setLoginSuccess(false);

    try {
      const res = await fetch('http://food_recommendation.test/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const text = await res.text(); // ambil mentah dulu
      console.log("📥 RESPON MENTAH:", text);

      if (!res.ok) {
        throw new Error('HTTP error! status: ' + res.status);
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        throw new Error("❌ Gagal parse JSON: " + jsonError.message);
      }

      if (data.token && data.user_id) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.user_id);
        setLoginSuccess(true);

        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else {
        setLoginError(data.error || 'Login gagal. Coba lagi.');
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setLoginError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>Selamat Datang di <span className={styles.brand}>FitRun</span></h2>
        <div className={styles.formContainer}>
          <h3 className={styles.subtitle}>Login</h3>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={styles.inputField}
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.inputField}
            value={formData.password}
            onChange={handleInputChange}
          />
          <button
            className={styles.submitButton}
            onClick={handleLoginSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>

          {loginError && (
            <p className={styles.errorMessage}>❌ {loginError}</p>
          )}

          {loginSuccess && (
            <p className={styles.successMessage}>✅ Login sukses! Mengarahkan ke beranda...</p>
          )}

          <p onClick={() => navigate('/register')} className={styles.switchLink}>
            Belum punya akun? <span className={styles.linkAccent}>Buat Akun</span>
          </p>
        </div>
      </div>
    </div>
  );
};
