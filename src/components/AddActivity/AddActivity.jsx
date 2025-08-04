import React, { useState, useEffect } from 'react';
import styles from './AddActivity.module.css';
import { BottomNav } from '../BottomNav/BottomNav';

const activities = {
  1: ['Tidur', 0.9],
  2: ['Duduk diam / menonton TV', 1.3],
  3: ['Membaca buku', 1.3],
  4: ['Menyapu lantai', 3.3],
  5: ['Mengepel', 3.5],
  6: ['Mencuci piring', 2.5],
  7: ['Membersihkan kamar mandi', 3.8],
  8: ['Menyedot debu', 3.5],
  9: ['Memasak', 2.0],
  10: ['Belanja bahan makanan', 2.3],
  11: ['Naik tangga (sedang)', 4.0],
  12: ['Berjalan santai (2 mph)', 2.0],
  13: ['Berjalan normal (3 mph)', 3.3],
  14: ['Berjalan cepat (4 mph)', 5.0],
  15: ['Lari pelan (5 mph)', 8.3],
  16: ['Lari sedang (6 mph)', 10.0],
  17: ['Lari cepat (7 mph)', 11.5],
  18: ['Bersepeda santai (10-12 mph)', 6.0],
  19: ['Bersepeda cepat (14-16 mph)', 10.0],
  20: ['Senam ringan', 3.0],
  21: ['Yoga', 2.5],
  22: ['Zumba / aerobik intens', 8.0],
  23: ['Berenang santai', 6.0],
  24: ['Berenang gaya bebas cepat', 9.8],
  25: ['Mencuci mobil', 2.5],
  26: ['Membawa anak kecil', 3.0],
  27: ['Menari (umum)', 5.5],
  28: ['Berkebun', 4.0],
  29: ['Menebang rumput dengan mesin', 5.5],
  30: ['Membersihkan jendela', 3.0],
};

export const AddActivity = () => {
  const [activityList, setActivityList] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [editId, setEditId] = useState(null);
  const [userWeight, setUserWeight] = useState(60);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchProfile(storedUserId);
      fetchActivities(storedUserId);
    }
  }, []);

  const fetchProfile = async (user_id) => {
    try {
      const res = await fetch(`http://food_recommendation.test/profile/${user_id}`);
      const json = await res.json();
      if (json.success && json.data) {
        const { berat_badan } = json.data;
        if (berat_badan) {
          setUserWeight(parseFloat(berat_badan));
        }
      }
    } catch (error) {
      console.error('Gagal mengambil profil:', error);
    }
  };

  const fetchActivities = async (user_id) => {
    try {
      setLoading(true);
      const res = await fetch(`http://food_recommendation.test/aktivitas/${user_id}`);
      const json = await res.json();
      if (json.success) {
        setActivityList(json.data);
      }
    } catch (err) {
      console.error('Gagal mengambil aktivitas:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateCalories = (met, weight, durationMin) => {
    const durationHr = durationMin / 60;
    return met * weight * durationHr;
  };

  const handleAddOrUpdate = async () => {
    const durasiNumber = parseFloat(duration);

    if (!selectedActivity || isNaN(durasiNumber) || !userId) {
      alert('Harap isi aktivitas dan durasi yang valid.');
      return;
    }

    const [name, met] = activities[selectedActivity];
    const calories = calculateCalories(met, userWeight, durasiNumber);

    const payload = {
      user_id: userId,
      jenis_aktivitas: name,
      durasi: durasiNumber,
      kalori_bakar: parseFloat(calories.toFixed(2)),
    };

    try {
      setLoading(true);
      if (editId) {
        const res = await fetch(`http://food_recommendation.test/aktivitas/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          fetchActivities(userId);
          setEditId(null);
        }
      } else {
        const res = await fetch(`http://food_recommendation.test/aktivitas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          fetchActivities(userId);
        }
      }
      setSelectedActivity('');
      setDuration('');
    } catch (err) {
      console.error('Gagal menyimpan aktivitas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (activity) => {
    const selected = Object.entries(activities).find(([_, [n]]) => n === activity.jenis_aktivitas);
    if (selected) setSelectedActivity(selected[0]);
    setDuration(activity.durasi);
    setEditId(activity.id);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await fetch(`http://food_recommendation.test/aktivitas/${id}`, { method: 'DELETE' });
      fetchActivities(userId);
    } catch (err) {
      console.error('Gagal menghapus aktivitas:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerBox}>
        <h2 className={styles.title}>Tambah Aktivitas</h2>

        <div className={styles.formCard}>
          <label htmlFor="activity">Jenis Aktivitas:</label>
          <select
            id="activity"
            name="activity"
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
          >
            <option value="">Pilih Aktivitas</option>
            {Object.entries(activities).map(([key, [name]]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>

          <label htmlFor="duration">Durasi (menit):</label>
          <input
            id="duration"
            name="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Masukkan durasi (menit)"
          />

          <button className={styles.addButton} onClick={handleAddOrUpdate} disabled={loading}>
            {editId ? 'Perbarui Aktivitas' : 'Tambah Aktivitas'}
          </button>
        </div>

        <div className={styles.listContainer}>
          <h3>Aktivitas Tersimpan</h3>
          {loading ? (
            <p>Loading...</p>
          ) : activityList.length === 0 ? (
            <p className={styles.empty}>Belum ada aktivitas</p>
          ) : (
            <ul className={styles.activityList}>
              {activityList.map((activity) => (
                <li key={activity.id} className={styles.activityItem}>
                  <div className={styles.itemContent}>
                    <strong>{activity.jenis_aktivitas}</strong> - {activity.durasi} menit
                    <span className={styles.kcal}>Kalori: {activity.kalori_bakar} kkal</span>
                  </div>
                  <div className={styles.actions}>
                    <button onClick={() => handleEdit(activity)}>Edit</button>
                    <button onClick={() => handleDelete(activity.id)}>Hapus</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};
