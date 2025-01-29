import React, { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthdate: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [accountCreated, setAccountCreated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleAccountSwitch = () => {
    setIsCreatingAccount(!isCreatingAccount);
    setErrors({});
    setFormData({
      name: '',
      gender: '',
      birthdate: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setAccountCreated(false);
    setLoginError(false);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(formData.email)) {
      setLoginError(true);
      setIsLoading(false);
    } else {
      setLoginError(false);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      console.log('Login submitted', formData);
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    setIsLoading(true);

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email tidak valid';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.password = 'Password dan konfirmasi password tidak cocok';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAccountCreated(true);
      setErrors({});
      setFormData({
        name: '',
        gender: '',
        birthdate: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setIsLoading(false);
      console.log('Account created', formData);
      navigate('/dashboard');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Selamat Datang di Teman Afasia</h2>
      <img
        src='/assets/afasia/hero-afa.svg'
        alt='Login Animation'
        className={styles.heroImg}
      />

      {accountCreated ? (
        <div className={styles.successContainer}>
          <h3>Akun sudah berhasil dibuat!</h3>
        </div>
      ) : isCreatingAccount ? (
        <div className={styles.formContainer}>
          <h3>Buat Akun</h3>
          <input type='text' name='name' placeholder='Nama Lengkap' className={styles.inputField} value={formData.name} onChange={handleInputChange} />
          <select name='gender' className={styles.selectField} value={formData.gender} onChange={handleInputChange}>
            <option value=''>Pilih Jenis Kelamin</option>
            <option value='Laki-laki'>Laki-laki</option>
            <option value='Perempuan'>Perempuan</option>
          </select>
          <input type='date' name='birthdate' className={styles.inputField} value={formData.birthdate} onChange={handleInputChange} />
          <input type='email' name='email' placeholder='Email' className={styles.inputField} value={formData.email} onChange={handleInputChange} />
          {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          <input type='password' name='password' placeholder='Password' className={styles.inputField} value={formData.password} onChange={handleInputChange} />
          <input type='password' name='confirmPassword' placeholder='Konfirmasi Password' className={styles.inputField} value={formData.confirmPassword} onChange={handleInputChange} />
          {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
          <button className={styles.submitButton} onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Loading...' : 'Buat Akun'}</button>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <h3>Login</h3>
          <input type='email' name='email' placeholder='Email' className={styles.inputField} value={formData.email} onChange={handleInputChange} />
          <input type='password' name='password' placeholder='Password' className={styles.inputField} value={formData.password} onChange={handleInputChange} />
          <button className={styles.submitButton} onClick={handleLoginSubmit} disabled={isLoading}>{isLoading ? 'Loading...' : 'Login'}</button>
          {loginError && <p className={styles.errorMessage}>Email atau Password salah!</p>}
        </div>
      )}
      <p onClick={handleAccountSwitch} className={styles.switchLink}>{isCreatingAccount ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Buat Akun'}</p>
    </div>
  );
};
