import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import styles from "./Progressku.module.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function generateDummyHistory(gameName, levelRange) {
  const data = [];
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      score: Math.floor(Math.random() * (levelRange + 1)),
    });
  }
  return data.reverse();
}

const Progressku = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [filter, setFilter] = useState("harian");

  const scores = [
    {
      id: 1,
      name: "Hewanku",
      score: Math.floor(Math.random() * 6), // Level 0-5
      maxScore: 5,
      history: generateDummyHistory("Hewanku", 5),
    },
    {
      id: 2,
      name: "Kataku",
      score: Math.floor(Math.random() * 10) + 1, // Level 1-10
      maxScore: 10,
      history: generateDummyHistory("Kataku", 10),
    },
    {
      id: 3,
      name: "Kotak Memori",
      score: Math.floor(Math.random() * 6), // Level 0-5
      maxScore: 5,
      history: generateDummyHistory("Kotak Memori", 5),
    },
  ];
  

  const handleViewHistory = (game) => {
    setSelectedGame(game);
  };

  const handleBack = () => {
    setSelectedGame(null);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filterData = (history) => {
    const now = new Date();
    return history.filter((item) => {
      const itemDate = new Date(item.date);
      if (filter === "harian") {
        return itemDate.toDateString() === now.toDateString();
      } else if (filter === "mingguan") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return itemDate >= weekAgo;
      } else if (filter === "bulanan") {
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const renderChart = () => {
    if (!selectedGame) return null;

    const filteredHistory = filterData(selectedGame.history);
    const labels = filteredHistory.map((item) => item.date);
    const dataScores = filteredHistory.map((item) => item.score);

    const data = {
      labels,
      datasets: [
        {
          label: "Skor",
          data: dataScores,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };

    return <Line data={data} />;
  };

  return (
    <div className={styles.progressContainer}>
      {selectedGame === null ? (
        <>
          <h2 className={styles.title}>Progress Permainan</h2>
          <div className={styles.scoreMenu}>
            {scores.map((game) => (
              <div key={game.id} className={styles.scoreItem}>
                <h3 className={styles.gameName}>{game.name}</h3>
                <p className={styles.score}>Skor Hari Ini: {game.score}/{game.maxScore}</p>
                <button className={styles.historyButton} onClick={() => handleViewHistory(game)}>
                  Lihat Riwayat
                </button>
              </div>
            ))}
          </div>

          <nav className={styles.bottomNav}>
            <div className={styles.navItem} onClick={() => navigate("/profile")}> 
              <img src="/assets/afasia/user.svg" alt="Profile" />
            </div>
            <div className={styles.navItem} onClick={() => navigate("/dashboard")}> 
              <img src="/assets/afasia/arrow-left.svg" alt="Back" />
            </div>
          </nav>
        </>
      ) : (
        <div className={styles.chartContainer}>
          <button className={styles.backButton} onClick={handleBack}>
            Kembali
          </button>
          <h2 className={styles.title}>{selectedGame.name} - Riwayat Skor</h2>

          <div className={styles.filterButtons}>
            <button onClick={() => handleFilterChange("harian")}>Harian</button>
            <button onClick={() => handleFilterChange("mingguan")}>Mingguan</button>
            <button onClick={() => handleFilterChange("bulanan")}>Bulanan</button>
          </div>

          <div className={styles.chartWrapper}>{renderChart()}</div>
        </div>
      )}
    </div>
  );
};

export default Progressku;
