// Profile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Profile.module.css';
import profileImg from '/assets/icon/profile-image.svg';
import proteinImg from '/assets/food/protein.png';
import carbsImg from '/assets/food/carbohydrate.svg';
import fatImg from '/assets/food/fat.png';
import { BottomNav } from '../BottomNav/BottomNav';

export const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    if (!token || !userId) {
      navigate('/login');
      return;
    }

    axios.get('http://food_recommendation.test/profile', {
      headers: {
        Authorization: token
      }
    })
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          const userProfile = res.data.data.find(user => String(user.user_id) === userId);
          if (userProfile) {
            const weight = parseFloat(userProfile.berat_badan);
            const height = parseFloat(userProfile.tinggi_badan);
            const age = calculateAge(userProfile.tanggal_lahir);
            const gender = userProfile.jenis_kelamin;
            const activityLevel = userProfile.level_aktivitas;
            const bmi = calculateBMI(weight, height);
            //const calories = calculateTDEE(weight, height, age, gender, activityLevel);

            setUserData({
              name: userProfile.nama,
              gender,
              weight,
              height,
              age,
              activityLevel,
              periodization: userProfile.tahap_periodisasi,
              bmi,
              dailyCalories: Math.round(userProfile.kalori),
              macros: {
                protein: userProfile["protein"] ?? userProfile["protein(g)"],
                carbs: userProfile["karbohidrat"] ?? userProfile["karbohidrat(g)"],
                fat: userProfile["lemak"] ?? userProfile["lemak(g)"]
              }
            });
          }
        }
      })
      .catch(err => {
        console.error("Gagal mengambil data profil:", err);
        if (err.response && err.response.status === 401) {
          alert("Sesi Anda telah habis. Silakan login ulang.");
          localStorage.clear();
          navigate('/login');
        }
      });
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const calculateBMI = (weight, height) => {
    const heightM = height / 100;
    return weight / (heightM * heightM);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://food_recommendation.test/logout', {}, {
        headers: {
          Authorization: token
        }
      });
    } catch (error) {
      console.warn("Logout gagal:", error);
    }
    localStorage.clear();
    navigate('/login');
  };

  if (!userData) {
    return <div className={styles.profileContainer}>Loading...</div>;
  }

  const bmiPercentage = Math.min(100, Math.max(0, ((userData.bmi - 10) / (40 - 10)) * 100));

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h2>Profile</h2>
        <div>
          <button className={styles.editButton} onClick={() => navigate('/edit-profile')}>✎</button>
          <button className={styles.logoutButton} onClick={handleLogout}>⎋</button>
        </div>
      </div>

      <div className={styles.profileImageContainer}>
        <img src={profileImg} alt="Profile" className={styles.profileImage} />
        <h3>{userData.name}!</h3>
        <p className={styles.bio}>{userData.gender === 'Pria' ? '👨 Pria' : '👩 Wanita'}</p>
      </div>

      <div className={styles.basicInfo}>
        <div><h4>{userData.weight} kg</h4><p>Weight</p></div>
        <div><h4>{userData.height} cm</h4><p>Height</p></div>
        <div><h4>{userData.age} yrs</h4><p>Age</p></div>
      </div>

      <div className={styles.statusInfo}>
        <div><p className={styles.label}>Activity Level</p><div className={styles.statusBox}>{userData.activityLevel}</div></div>
        <div><p className={styles.label}>Stage Periodization</p><div className={styles.statusBox}>{userData.periodization}</div></div>
      </div>

      <div className={styles.bmiContainer}>
        <div className={styles.bmiLabel}>BMI & Daily Calories</div>
        <div className={styles.bmiBarWrapper}>
          <div className={styles.bmiBarTrack}></div>
          <div
            className={styles.bmiIndicator}
            style={{ left: `${bmiPercentage}%` }}>
            <span className={styles.bmiIndicatorText}>{userData.bmi.toFixed(1)}</span>
          </div>
        </div>
        <div className={styles.bmiInfo}>
          <span className={styles.caloriesValue}>Daily Calories: {userData.dailyCalories} kcal</span>
        </div>
      </div>

      <div className={styles.macrosSection}>
        <h4>Macronutrient Goals</h4>
        <div className={styles.macrosGrid}>
          <div className={styles.macroItem}>
            <img src={proteinImg} alt="Protein" />
            <p className={styles.macroLabel}>Protein</p>
            <p className={styles.macroValue}>{userData.macros.protein}g/day</p>
          </div>
          <div className={styles.macroItem}>
            <img src={carbsImg} alt="Carbs" />
            <p className={styles.macroLabel}>Carbs</p>
            <p className={styles.macroValue}>{userData.macros.carbs}g/day</p>
          </div>
          <div className={styles.macroItem}>
            <img src={fatImg} alt="Fat" />
            <p className={styles.macroLabel}>Fat</p>
            <p className={styles.macroValue}>{userData.macros.fat}g/day</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};
