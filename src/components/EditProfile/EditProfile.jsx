import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './EditProfile.module.css';

export const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    jenis_kelamin: '',
    berat_badan: '',
    tinggi_badan: '',
    tanggal_lahir: '',
    level_aktivitas: '',
    tahap_periodisasi: '',
    preferensi_protein: [],
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    axios.get('http://food_recommendation.test/profile', {
      headers: { Authorization: token }
    })
      .then(res => {
        const profile = res.data.data.find(user => String(user.user_id) === userId);
        if (profile) {
          setFormData({
            nama: profile.nama,
            jenis_kelamin: profile.jenis_kelamin,
            berat_badan: profile.berat_badan,
            tinggi_badan: profile.tinggi_badan,
            tanggal_lahir: profile.tanggal_lahir,
            level_aktivitas: profile.level_aktivitas,
            tahap_periodisasi: profile.tahap_periodisasi,
            preferensi_protein: profile.preferensi_protein
              ? profile.preferensi_protein.split(',')
              : [],
          });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProteinChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      let updated = [...prev.preferensi_protein];
      if (checked) {
        updated.push(value);
      } else {
        updated = updated.filter(item => item !== value);
      }
      return { ...prev, preferensi_protein: updated };
    });
  };

  // TDEE & Makronutrien Related Functions
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMR = (height_cm, weight_kg, age, gender) => {
    const height_m = height_cm / 100;
    if (gender === 'Pria') {
      return 662 - (9.53 * age) + (15.91 * weight_kg) + (539.6 * height_m);
    } else {
      return 354 - (6.91 * age) + (9.36 * weight_kg) + (726 * height_m);
    }
  };

  const calculateTDEE = (bmr, activityLevel) => {
    const factors = {
      Sedentary: 1,
      Sedang: 1.11,
      Aktif: 1.25,
      SangatAktif: 1.48,
    };
    return bmr * (factors[activityLevel] || 1);
  };

  const getMacronutrientRanges = (season, weight_kg) => {
    if (!season) return { carbs: [0, 0], protein: [0, 0], fat: [0, 0] };
    const s = season.toLowerCase();
    if (s === 'pre-season') {
      return {
        carbs: [3 * weight_kg, 7 * weight_kg],
        protein: [1.2 * weight_kg, 2.5 * weight_kg],
        fat: [0.9 * weight_kg, 1.3 * weight_kg]
      };
    } else if (s === 'on-season') {
      return {
        carbs: [5 * weight_kg, 12 * weight_kg],
        protein: [1.4 * weight_kg, 2 * weight_kg],
        fat: [1 * weight_kg, 1.5 * weight_kg]
      };
    } else if (s === 'off-season') {
      return {
        carbs: [3 * weight_kg, 4 * weight_kg],
        protein: [1.5 * weight_kg, 2.3 * weight_kg],
        fat: [1 * weight_kg, 1.2 * weight_kg]
      };
    }
    return { carbs: [0, 0], protein: [0, 0], fat: [0, 0] };
  };

  const handleSave = () => {
    const age = calculateAge(formData.tanggal_lahir);
    const bmr = calculateBMR(Number(formData.tinggi_badan), Number(formData.berat_badan), age, formData.jenis_kelamin);
    const tdee = Math.round(calculateTDEE(bmr, formData.level_aktivitas));
    const macros = getMacronutrientRanges(formData.tahap_periodisasi, Number(formData.berat_badan));

    const dataToSend = {
      ...formData,
      kalori: tdee,
      protein: Math.round(macros.protein[0]),
      karbohidrat: Math.round(macros.carbs[0]),
      lemak: Math.round(macros.fat[0]),
      preferensi_protein: formData.preferensi_protein.join(','),
    };

    axios.put(`http://food_recommendation.test/profile/${userId}`, dataToSend, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      }
    })
      .then(() => {
        setShowSuccessPopup(true);
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      })
      .catch(err => {
        console.error("Gagal menyimpan perubahan:", err);
        alert('Terjadi kesalahan saat menyimpan data.');
      });
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const proteinOptions = [
    { label: '🍗 Ayam', value: 'Ayam' },
    { label: '🥩 Sapi', value: 'Sapi' },
    { label: '🍖 Kambing', value: 'Kambing' },
    { label: '🦐 Udang', value: 'Udang' },
    { label: '🥚 Telur', value: 'Telur' },
    { label: '🍳 Tahu', value: 'Tahu' },
    { label: '🍘 Tempe', value: 'Tempe' },
    { label: '🐟 Ikan', value: 'Ikan' },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Edit Profile</h2>

      <div className={styles.formGroup}>
        <label>Nama</label>
        <input name="nama" value={formData.nama} onChange={handleChange} />
      </div>

      <div className={styles.formGroup}>
        <label>Jenis Kelamin</label>
        <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange}>
          <option value="">Pilih</option>
          <option value="Pria">👨 Pria</option>
          <option value="Wanita">👩 Wanita</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Berat Badan (kg)</label>
        <input name="berat_badan" type="number" value={formData.berat_badan} onChange={handleChange} />
      </div>

      <div className={styles.formGroup}>
        <label>Tinggi Badan (cm)</label>
        <input name="tinggi_badan" type="number" value={formData.tinggi_badan} onChange={handleChange} />
      </div>

      <div className={styles.formGroup}>
        <label>Tanggal Lahir</label>
        <input name="tanggal_lahir" type="date" value={formData.tanggal_lahir} onChange={handleChange} />
      </div>

      <div className={styles.formGroup}>
        <label>Level Aktivitas</label>
        <select name="level_aktivitas" value={formData.level_aktivitas} onChange={handleChange}>
          <option value="">Pilih</option>
          <option value="Sedentary">Sedentary</option>
          <option value="Sedang">Sedang</option>
          <option value="Aktif">Aktif</option>
          <option value="SangatAktif">Sangat Aktif</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Periodisasi</label>
        <select name="tahap_periodisasi" value={formData.tahap_periodisasi} onChange={handleChange}>
          <option value="">Pilih</option>
          <option value="Pre-Season">Pre-Season</option>
          <option value="On-Season">On-Season</option>
          <option value="Off-Season">Off-Season</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Preferensi Protein</label>
        <div className={styles.checkboxGroup}>
          {proteinOptions.map(option => (
            <label key={option.value} className={styles.checkboxItem}>
              <input
                type="checkbox"
                value={option.value}
                checked={formData.preferensi_protein.includes(option.value)}
                onChange={handleProteinChange}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.saveButton} onClick={handleSave}>Simpan</button>
        <button className={styles.cancelButton} onClick={handleCancel}>Batal</button>
      </div>

      {showSuccessPopup && (
        <div className={styles.popupSuccess}>
          ✅ Profil berhasil diperbarui!
        </div>
      )}
    </div>
  );
};
