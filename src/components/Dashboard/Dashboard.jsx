import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();

  // Fungsi untuk logout
  const handleLogout = () => {
    // Hapus data sesi pengguna atau lakukan logout
    localStorage.removeItem("user"); // Contoh, hapus data pengguna di localStorage
    navigate("/login"); // Arahkan ke halaman login
  };

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.title}>Pilih Permainan</h2>

      <div className={styles.gameMenu}>
        <div className={styles.gameItem} onClick={() => navigate("/hewanku")}>
          <img src="/assets/afasia/cat-about.svg" alt="Hewanku" />
          <button className={styles.gameButton}>Hewanku</button>
        </div>

        <div className={styles.gameItem} onClick={() => navigate("/kataku")}>
          <img src="/assets/afasia/blocks-abc 1.svg" alt="Kataku" />
          <button className={styles.gameButton}>Kataku</button>
        </div>

        <div className={styles.gameItem} onClick={() => navigate("/kotak-memori")}>
          <img src="/assets/afasia/tic-tac-toe-flat 1.svg" alt="Kotak Memori" />
          <button className={styles.gameButton}>Kotak Memori</button>
        </div>

        <div className={styles.gameItem} onClick={() => navigate("/progressku")}>
          <img src="/assets/afasia/star.svg" alt="Progressku" />
          <button className={styles.gameButton}>Progressku</button>
        </div>

      </div>

      <nav className={styles.bottomNav}>
        <div className={styles.navItem} onClick={() => navigate("/profile")}>
          <img src="/assets/afasia/user.svg" alt="Profile" />
        </div>
        <div className={styles.navItem} onClick={handleLogout}>
          <img src="/assets/afasia/arrow-left.svg" alt="Logout" />
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
