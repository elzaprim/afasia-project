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
  const [showImages, setShowImages] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false); // State baru
  const navigate = useNavigate();

  useEffect(() => {
    generateQuestion();
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setUserOrder(Array(images.length).fill(null));
    setShowImages(true);
    setTimeout(() => setShowImages(false), 5000);
  };

  const generateQuestion = () => {
    let shuffled = [...Array(images.length).keys()].sort(() => Math.random() - 0.5);
    setCorrectOrder(shuffled);
    setUserOrder(Array(images.length).fill(null));
  };

  const handleRetry = () => {
    setIsWrongAnswer(false);
    setUserOrder(Array(images.length).fill(null));
    generateQuestion();
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setGameOver(false);
    setIsWrongAnswer(false);
    generateQuestion();
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
        generateQuestion();
        setShowImages(true);
        setTimeout(() => setShowImages(false), 5000);
      } else {
        setGameOver(true);
      }
    } else {
      setIsWrongAnswer(true);
    }
  };

  return (
    <div className={styles.container}>
      {isWrongAnswer ? (
        <div className={styles.errorPage}>
          <h3>Yah :(. Coba Lagi Yuk!</h3>
          <p>Anda mencapai level {score}.</p>
          <button onClick={handleRetry} className={styles.submitButton}>Ulangi Lagi</button>
        </div>
      ) : gameOver ? (
        <div>
          <h3>Selamat! Anda telah menyelesaikan permainan!</h3>
          <p>Skor Anda: {score}</p>
          <button onClick={resetGame} className={styles.submitButton}>Main Lagi</button>
        </div>
      ) : !gameStarted ? (
        <div>
          <p>Permainan ini menguji ingatan Anda! Hafalkan urutan gambar yang muncul, lalu susun kembali dalam urutan yang benar.</p>
          <button onClick={startGame} className={styles.submitButton}>Mulai</button>
        </div>
      ) : showImages ? (
        <div>
          <h3>Hafalkan Urutannya!</h3>
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
          <div className={styles.submitButtonContainer}>
            <button onClick={submitAnswer} className={styles.submitButton}>Cek Jawaban</button>
          </div>
        </div>
      )}

      <nav className={styles.bottomNav}>
        <div className={styles.navItem} onClick={() => navigate("/")}> <img src="/assets/afasia/menu.svg" alt="Home" /> </div>
        <div className={styles.navItem} onClick={() => navigate(-1)}> <img src="/assets/afasia/arrow-left.svg" alt="Back" /> </div>
      </nav>
    </div>
  );
}

export default Hewanku;
