import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddFood.module.css';
import { BottomNav } from '../BottomNav/BottomNav';

// Data makanan
class Food {
  constructor(calories, carbs, protein, fat, name) {
    this.calories = calories;
    this.carbs = carbs;
    this.protein = protein;
    this.fat = fat;
    this.name = name;
  }
}

const food_list = [new Food(360, 79.6, 6, 0.6, "Nasi putih")]; // potong karena panjang, tambahkan lengkap jika perlu
const sayur_list = [
  new Food(27, 0.9, 1.4, 2.1, "Sayur Asem"),
  new Food(78, 4.1, 2.2, 8.5, "Sayur Lodeh"),
  new Food(94.5, 8.9, 3.5, 6.5, "Sayur Cap Cai"),
  new Food(55, 1.8, 0.15, 11.5, "Sayur Sop")
];
const snack_list = [
  new Food(85, 7.7, 0.9, 6.5, "Alpukat"),
  new Food(57, 12.8, 0.5, 0.4, "Apel malang"),
  new Food(90, 15, 2, 3.5, "Fitbar Choco Delight"),
  new Food(108, 24.3, 1, 0.8, "Pisang ambon")
];

const allFoodData = [...food_list, ...sayur_list, ...snack_list];
const allFoods = allFoodData.map((f) => f.name);
const portions = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

export const AddFood = () => {
  const navigate = useNavigate();

  const [meals, setMeals] = useState({
    sarapan: [],
    makanSiang: [],
    makanMalam: [],
    snack: []
  });

  const [selectedMeal, setSelectedMeal] = useState('sarapan');
  const [selectedFood, setSelectedFood] = useState('');
  const [portion, setPortion] = useState(1);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddFood = () => {
    if (!selectedFood || !portion) return;
    const newFood = { food: selectedFood, portion: parseFloat(portion) };

    const updatedMeal = [...meals[selectedMeal]];
    if (editIndex !== null) {
      updatedMeal[editIndex] = newFood;
    } else {
      updatedMeal.push(newFood);
    }

    setMeals({ ...meals, [selectedMeal]: updatedMeal });
    setSelectedFood('');
    setPortion(1);
    setEditIndex(null);
  };

  const handleEdit = (mealType, index) => {
    const item = meals[mealType][index];
    setSelectedMeal(mealType);
    setSelectedFood(item.food);
    setPortion(item.portion);
    setEditIndex(index);
  };

  const handleDelete = (mealType, index) => {
    const updatedMeal = meals[mealType].filter((_, i) => i !== index);
    setMeals({ ...meals, [mealType]: updatedMeal });
  };

  const findFoodData = (foodName) => {
    return allFoodData.find(f => f.name === foodName);
  };

  const hitungTotalNutrisi = () => {
    let total = { kalori: 0, karbo: 0, protein: 0, lemak: 0 };

    Object.values(meals).flat().forEach(item => {
      const data = findFoodData(item.food);
      if (data) {
        const porsi = parseFloat(item.portion);
        total.kalori += data.calories * porsi;
        total.karbo += data.carbs * porsi;
        total.protein += data.protein * porsi;
        total.lemak += data.fat * porsi;
      }
    });

    return {
      kalori: total.kalori.toFixed(1),
      karbo: total.karbo.toFixed(1),
      protein: total.protein.toFixed(1),
      lemak: total.lemak.toFixed(1)
    };
  };

  const renderMealSection = (title, mealKey) => (
    <div className={styles.mealSection}>
      <h3>{title}</h3>
      <ul className={styles.foodList}>
        {meals[mealKey].map((item, index) => (
          <li key={index} className={styles.foodItem}>
            <div className={styles.itemContent}>
              {item.food} - {item.portion} porsi
            </div>
            <div className={styles.actions}>
              <button onClick={() => handleEdit(mealKey, index)} className={styles.editButton}>Edit</button>
              <button onClick={() => handleDelete(mealKey, index)} className={styles.deleteButton}>Hapus</button>
            </div>
          </li>
        ))}
        {meals[mealKey].length === 0 && <p className={styles.empty}>Belum ada makanan</p>}
      </ul>
    </div>
  );

  const totalNutrisi = hitungTotalNutrisi();

  return (
    <div className={styles.foodOuterContainer}>
      <div className={styles.foodInnerContainer}>
        <h2 className={styles.title}>Tambah Makanan</h2>

        <div className={styles.inputGroup}>
          <label>Pilih Waktu Makan</label>
          <select value={selectedMeal} onChange={(e) => setSelectedMeal(e.target.value)}>
            <option value="sarapan">Sarapan</option>
            <option value="makanSiang">Makan Siang</option>
            <option value="makanMalam">Makan Malam</option>
            <option value="snack">Snack</option>
          </select>

          <label>Cari Makanan</label>
          <input
            type="text"
            list="food-options"
            value={selectedFood}
            onChange={(e) => setSelectedFood(e.target.value)}
            placeholder="Ketik nama makanan"
          />
          <datalist id="food-options">
            {allFoods.map((food, idx) => (
              <option key={idx} value={food} />
            ))}
          </datalist>

          <label>Porsi</label>
          <select value={portion} onChange={(e) => setPortion(e.target.value)}>
            {portions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <button className={styles.addButton} onClick={handleAddFood}>
            {editIndex !== null ? 'Update Makanan' : 'Tambah Makanan'}
          </button>
        </div>

        {renderMealSection('Sarapan', 'sarapan')}
        {renderMealSection('Makan Siang', 'makanSiang')}
        {renderMealSection('Makan Malam', 'makanMalam')}
        {renderMealSection('Snack', 'snack')}

        <div className={styles.summaryBox}>
          <h4>Total Nutrisi:</h4>
          <p>Kalori: {totalNutrisi.kalori} kkal</p>
          <p>Karbohidrat: {totalNutrisi.karbo} g</p>
          <p>Protein: {totalNutrisi.protein} g</p>
          <p>Lemak: {totalNutrisi.lemak} g</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
