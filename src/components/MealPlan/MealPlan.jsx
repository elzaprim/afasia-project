import React, { useState, useEffect } from 'react';
import styles from './MealPlan.module.css';
import { BottomNav } from '../BottomNav/BottomNav';

const foodList = [
  { calories: 360, carbs: 79.6, protein: 6, fat: 0.6, nama_makanan: "Nasi putih" },
  { calories: 410, carbs: 74.8, protein: 19.4, fat: 3.5, nama_makanan: "Gurame Asam Manis Seadanya" },
  { calories: 418, carbs: 74, protein: 9.6, fat: 11.2, nama_makanan: "Gurame saos mangga" },
  { calories: 433, carbs: 50.1, protein: 31.2, fat: 17.5, nama_makanan: "Pindang Serani Ikan Patin" },
  { calories: 452, carbs: 19.3, protein: 27, fat: 29.7, nama_makanan: "Hot Tuna Puffs Super Simple" },
  { calories: 122, carbs: 5.7, protein: 7, fat: 6, nama_makanan: "Tumis Tahu Tempe Kecap" }
];

const snackList = [
  { calories: 85, carbs: 7.7, protein: 0.9, fat: 6.5, nama_makanan: "Alpukat" },
  { calories: 57, carbs: 12.8, protein: 0.5, fat: 0.4, nama_makanan: "Apel malang" },
  { calories: 58, carbs: 14.9, protein: 0.3, fat: 0.4, nama_makanan: "Apel" },
  { calories: 36, carbs: 8.8, protein: 0.4, fat: 0.4, nama_makanan: "Belimbing" },
  { calories: 150, carbs: 8, protein: 6, fat: 10, nama_makanan: "Soyjoy Danish Cheese" }
];

const sayurList = [
  { calories: 60, carbs: 8, protein: 2, fat: 1, nama_makanan: "Tumis Kangkung" },
  { calories: 50, carbs: 6, protein: 1.5, fat: 1.2, nama_makanan: "Sayur Bayam" }
];

const calculateBMR = (height, weight, age, gender) => {
  const heightM = height / 100;
  return gender === 'male'
    ? 662 - (9.53 * age) + (15.91 * weight) + (539.6 * heightM)
    : 354 - (6.91 * age) + (9.36 * weight) + (726 * heightM);
};

const calculateTDEE = (bmr, activityLevel) => {
  const factor = {
    sedentary: 1,
    moderate: 1.11,
    active: 1.25,
    very_active: 1.48
  };
  return bmr * (factor[activityLevel] || 1);
};

const getMacroRanges = (season, weight) => {
  const range = {
    'pre-season': {
      carbs: [3 * weight, 7 * weight],
      protein: [1.2 * weight, 2.5 * weight],
      fat: [0.9 * weight, 1.3 * weight]
    },
    'on-season': {
      carbs: [5 * weight, 12 * weight],
      protein: [1.4 * weight, 2 * weight],
      fat: [1 * weight, 1.5 * weight]
    },
    'off-season': {
      carbs: [3 * weight, 4 * weight],
      protein: [1.5 * weight, 2.3 * weight],
      fat: [1 * weight, 1.2 * weight]
    }
  };
  return range[season] || range['pre-season'];
};

const formatMealItem = (item) =>
  `- ${item.nama_makanan} | Kalori: ${item.calories} | Karbo: ${item.carbs}g | Protein: ${item.protein}g | Lemak: ${item.fat}g`;

export const MealPlan = () => {
  const [form, setForm] = useState({
    height: '', weight: '', age: '', gender: 'male', activity: 'moderate', season: 'pre-season'
  });
  const [result, setResult] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('fitrunMealPlan');
    if (stored) {
      console.log("Loaded meal plan from localStorage.");
      setResult(stored);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValidInput = () => {
    const { height, weight, age } = form;
    return height && weight && age && !isNaN(height) && !isNaN(weight) && !isNaN(age);
  };

  const generateMealPlan = () => {
    if (!isValidInput()) {
      alert("Mohon lengkapi semua input angka (tinggi, berat, usia).");
      return;
    }

    const { height, weight, age, gender, activity, season } = form;
    const h = parseFloat(height), w = parseFloat(weight), a = parseInt(age);
    const bmr = calculateBMR(h, w, a, gender);
    const tdee = calculateTDEE(bmr, activity);
    const macro = getMacroRanges(season, w);

    const portion = {
      sarapan: 0.25 * tdee,
      makan_siang: 0.35 * tdee,
      makan_malam: 0.25 * tdee,
      snack: 0.15 * tdee
    };

    const nasi = foodList.find(f => f.nama_makanan === "Nasi putih");
    const foodWoNasi = foodList.filter(f => f.nama_makanan !== "Nasi putih");
    const randomPick = (list) => list[Math.floor(Math.random() * list.length)];

    const createMeal = (targetKal, mealName) => {
      const base = nasi;
      const sayur = randomPick(sayurList);
      const main = randomPick(foodWoNasi);
      const total = {
        calories: base.calories + sayur.calories + main.calories,
        carbs: base.carbs + sayur.carbs + main.carbs,
        protein: base.protein + sayur.protein + main.protein,
        fat: base.fat + sayur.fat + main.fat
      };
      return {
        name: mealName,
        items: [base, sayur, main],
        ...total
      };
    };

    const sarapan = createMeal(portion.sarapan, 'Sarapan');
    const makanSiang = createMeal(portion.makan_siang, 'Makan Siang');
    const makanMalam = createMeal(portion.makan_malam, 'Makan Malam');
    const snack = [randomPick(snackList)];

    const totalKalori = sarapan.calories + makanSiang.calories + makanMalam.calories + snack[0].calories;
    const totalKarbo = sarapan.carbs + makanSiang.carbs + makanMalam.carbs + snack[0].carbs;
    const totalProtein = sarapan.protein + makanSiang.protein + makanMalam.protein + snack[0].protein;
    const totalLemak = sarapan.fat + makanSiang.fat + makanMalam.fat + snack[0].fat;

    const macroStr = (g, calPerG) => `${g.toFixed(1)}g (${((g * calPerG) / totalKalori * 100).toFixed(1)}%)`;

    let output = `\n=== Rencana Makan Harian ===\n`;
    output += `TDEE: ${tdee.toFixed(2)} kalori\n\n`;
    output += `Target Makronutrien:\n`;
    output += `- Karbohidrat: ${macro.carbs[0].toFixed(1)} - ${macro.carbs[1].toFixed(1)}g\n`;
    output += `- Protein: ${macro.protein[0].toFixed(1)} - ${macro.protein[1].toFixed(1)}g\n`;
    output += `- Lemak: ${macro.fat[0].toFixed(1)} - ${macro.fat[1].toFixed(1)}g\n\n`;

    [sarapan, makanSiang, makanMalam].forEach(meal => {
      output += `\n${meal.name} (${meal.calories.toFixed(0)} kal):\n`;
      meal.items.forEach(i => output += formatMealItem(i) + "\n");
    });

    output += `\nSnack:\n`;
    snack.forEach(i => output += formatMealItem(i) + "\n");

    output += `\nTotal Kalori: ${totalKalori.toFixed(1)} kal\n`;
    output += `Karbohidrat: ${macroStr(totalKarbo, 4)}\n`;
    output += `Protein: ${macroStr(totalProtein, 4)}\n`;
    output += `Lemak: ${macroStr(totalLemak, 9)}\n`;

    setResult(output);
    localStorage.setItem('fitrunMealPlan', output);
  };

  return (
    <div className={styles.container}>
      <h2>Meal Plan Generator</h2>
      <div className={styles.form}>
        <input name="height" placeholder="Tinggi (cm)" onChange={handleChange} />
        <input name="weight" placeholder="Berat (kg)" onChange={handleChange} />
        <input name="age" placeholder="Usia" onChange={handleChange} />
        <select name="gender" onChange={handleChange}>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
        <select name="activity" onChange={handleChange}>
          <option value="sedentary">Sedentary</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>
        <select name="season" onChange={handleChange}>
          <option value="pre-season">Pre-season</option>
          <option value="on-season">On-season</option>
          <option value="off-season">Off-season</option>
        </select>
        <button onClick={generateMealPlan}>Generate</button>
      </div>
      <div className={styles.result}>
        {result || "Belum ada rencana makan. Silakan isi dan klik Generate."}
      </div>
      <BottomNav />
    </div>
  );
};
