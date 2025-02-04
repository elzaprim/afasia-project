import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styles from "./Hewanku.module.css";

const images = [
  '/assets/afasia/Lion Transparant.png',
  '/assets/afasia/Goat Transparant.png',
  '/assets/afasia/Cow Transparant.png',
  '/assets/afasia/Snake Transparant.png',
];

function Hewanku() {
  const [correctOrder, setCorrectOrder] = useState([]);
  const [userOrder, setUserOrder] = useState(Array(images.length).fill(null));
  const [showImages, setShowImages] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();  // Added navigate hook

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    generateQuestion();
    setUserOrder(Array(images.length).fill(null));
    setShowImages(true);
    setTimeout(() => setShowImages(false), 5000); // Menyembunyikan gambar setelah beberapa detik
  };

  const generateQuestion = () => {
    let shuffled = [...Array(images.length).keys()].sort(() => Math.random() - 0.5);
    setCorrectOrder(shuffled);
  };

  const submitAnswer = () => {
    if (userOrder.includes(null)) {
      alert('Harap isi semua kotak!');
      return;
    }
    if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
      if (currentLevel < 5) {
        setCurrentLevel(currentLevel + 1);
        setScore(score + 1);
        startGame();
      } else {
        alert('Selamat! Anda telah menyelesaikan semua level!');
      }
    } else {
      alert(`Game Over! Anda mencapai level ${score}.`);
    }
  };

  return (
    <div>
      <h2>Hewanku - Level {currentLevel}</h2>
      {showImages ? (
        <div>
          <h3>Hafalkan Urutannya!</h3>
          {/* Menampilkan gambar dalam grid */}
          <div className={styles.grid}>
            {correctOrder.map((index, i) => (
              <div key={i} className={styles.gridCell} data-number={i + 1}>
                <img 
                  src={images[index]} 
                  alt={`memory ${i + 1}`} 
                  className={styles.gridImage}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3>Pindahkan gambar ke urutan yang benar:</h3>
          {/* Kotak jawaban */}
          <div className={styles.grid}>
            {userOrder.map((imageIndex, i) => (
              <div 
                key={i} 
                className={`${styles.dropZone} ${imageIndex !== null ? styles.filled : ''}`} 
                onDrop={(e) => {
                  let data = e.dataTransfer.getData("text");
                  let newUserOrder = [...userOrder];
                  newUserOrder[i] = Number(data);
                  setUserOrder(newUserOrder);
                }} 
                onDragOver={(e) => e.preventDefault()}
              >
                {imageIndex !== null ? (
                  <img 
                    src={images[imageIndex]} 
                    alt={`selected ${i + 1}`} 
                    className={styles.dropZoneImage}
                  />
                ) : (
                  ''
                )}
                <div className={styles.orderNumber}>{i + 1}</div>
              </div>
            ))}
          </div>
          {/* Grid untuk pilihan gambar */}
          <div className={styles.grid}>
            {images.map((src, index) => (
              <img 
                key={index} 
                src={src} 
                alt={`option ${index + 1}`} 
                className={styles.imageOption}
                draggable 
                onDragStart={(e) => e.dataTransfer.setData("text", index)} 
              />
            ))}
          </div>
        </div>
      )}
      <div className={styles.submitButtonContainer}>
        <button onClick={submitAnswer} className={styles.submitButton}>Submit</button>
      </div>

      {/* Bottom navigation */}
      <nav className={styles.bottomNav}>
        <div className={styles.navItem} onClick={() => navigate("/")}>
          <img src="/assets/afasia/menu.svg" alt="Home" />
        </div>
        <div className={styles.navItem} onClick={() => navigate(-1)}>
          <img src="/assets/afasia/arrow-left.svg" alt="Back" />
        </div>
      </nav>
    </div>
  );
}

export default Hewanku;
