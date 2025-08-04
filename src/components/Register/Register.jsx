
import React, { useState } from 'react';
import styles from './Register.module.css';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    gender: '',
    birthdate: '',
    weight: '',
    height: '',
    period: '',
    activityLevel: '',
    proteinChoices: [],
    password: '',
    confirmPassword: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPeriodInfo, setShowPeriodInfo] = useState(null);
  const [showActivityInfo, setShowActivityInfo] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleProteinChoice = (protein) => {
    setFormData((prev) => {
      const updated = prev.proteinChoices.includes(protein)
        ? prev.proteinChoices.filter((p) => p !== protein)
        : [...prev.proteinChoices, protein];
      return { ...prev, proteinChoices: updated };
    });
  };

  const validateEmail = (email) => /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email);

  // Kalkulasi Umum
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const calculateBMR = (height_cm, weight_kg, age, gender) => {
    const height_m = height_cm / 100;
    return gender === 'Pria'
      ? 662 - (9.53 * age) + (15.91 * weight_kg) + (539.6 * height_m)
      : 354 - (6.91 * age) + (9.36 * weight_kg) + (726 * height_m);
  };

  const calculateTDEE = (bmr, activityLevel) => {
    const factors = {
      Sedentary: 1,
      Ringan: 1.11,
      Aktif: 1.25,
      SangatAktif: 1.48,
    };
    return bmr * (factors[activityLevel] || 1);
  };

  const getMacroRanges = (season, weight) => {
    const w = parseFloat(weight);
    const seasonLower = season.toLowerCase();
    if (seasonLower === 'pre-season') {
      return {
        carbs: [3 * w, 7 * w],
        protein: [1.2 * w, 2.5 * w],
        fat: [0.9 * w, 1.3 * w]
      };
    } else if (seasonLower === 'on-season') {
      return {
        carbs: [5 * w, 12 * w],
        protein: [1.4 * w, 2 * w],
        fat: [1 * w, 1.5 * w]
      };
    } else if (seasonLower === 'off-season') {
      return {
        carbs: [3 * w, 4 * w],
        protein: [1.5 * w, 2.3 * w],
        fat: [1 * w, 1.2 * w]
      };
    } else {
      return {
        carbs: [0, 0],
        protein: [0, 0],
        fat: [0, 0]
      };
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
      return;
    }

    // Perhitungan
    const age = calculateAge(formData.birthdate);
    const bmr = calculateBMR(Number(formData.height), Number(formData.weight), age, formData.gender);
    const tdee = Math.round(calculateTDEE(bmr, formData.activityLevel));
    const macros = getMacroRanges(formData.period, formData.weight);

    const mean = (arr) => Math.round((arr[0] + arr[1]) / 2);
    const protein = mean(macros.protein);
    const carbs = mean(macros.carbs);
    const fat = mean(macros.fat);

    try {
      const response = await fetch('http://food_recommendation.test/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          jenis_kelamin: formData.gender,
          tanggal_lahir: formData.birthdate,
          berat_badan: Number(formData.weight),
          tinggi_badan: Number(formData.height),
          tahap_periodisasi: formData.period,
          level_aktivitas: formData.activityLevel,
          kalori: tdee,
          protein,
          karbohidrat: carbs,
          lemak: fat,
          preferensi_protein: formData.proteinChoices.join(', ')
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (jsonError) {
        console.warn('Gagal parsing JSON:', jsonError);
      }

      if (response.ok || response.status === 201) {
        setShowSuccessModal(true);
        setTimeout(() => navigate('/login'), 2500);
      } else {
        console.error('Status response error:', response.status, data);
        setErrors({ api: data.message || 'Terjadi kesalahan saat mendaftar.' });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setErrors({ api: 'Gagal terhubung ke server' });
    } finally {
      setIsLoading(false);
    }
  };

  // ... (UI rendering bagian JSX tidak berubah, tetap gunakan yang sudah kamu tulis)
};
