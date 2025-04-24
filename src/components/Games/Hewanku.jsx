import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styles from "./Hewanku.module.css";
import {
  DndContext,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';

const images = [
  '/assets/afasia/Lion Transparant.png',
  '/assets/afasia/Goat Transparant.png',
  '/assets/afasia/Cow Transparant.png',
  '/assets/afasia/Snake Transparant.png',
];

// Komponen draggable
function DraggableImage({ id, src }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    touchAction: 'none',
    cursor: 'grab',
  };

  return (
    <img
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      src={src}
      alt={`option ${id}`}
      style={style}
      className={styles.imageOption}
    />
  );
}

// Komponen droppable
function DropZone({ id, imageIndex, onRemove }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.dropZone} ${imageIndex !== null ? styles.filled : ''}`}
    >
      {imageIndex !== null ? (
        <img
          src={images[imageIndex]}
          alt={`selected ${id + 1}`}
          className={styles.dropZoneImage}
          onClick={() => onRemove(id)}
          title="Klik untuk hapus gambar"
          style={{ cursor: "pointer" }}
        />
      ) : null}
      <div className={styles.orderNumber}>{Number(id) + 1}</div>
    </div>
  );
}

function Hewanku() {
  const [correctOrder, setCorrectOrder] = useState([]);
  const [userOrder, setUserOrder] = useState(Array(images.length).fill(null));
  const [showImages, setShowImages] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
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

  const removeImageFromDropZone = (indexToClear) => {
    const newOrder = [...userOrder];
    newOrder[indexToClear] = null;
    setUserOrder(newOrder);
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
        <DndContext
          onDragEnd={({ active, over }) => {
            if (over && !userOrder.includes(Number(active.id))) {
              const newOrder = [...userOrder];
              newOrder[Number(over.id)] = Number(active.id);
              setUserOrder(newOrder);
            }
          }}
        >
          <div>
            <h3>Pindahkan gambar ke urutan yang benar:</h3>
            <div className={styles.grid}>
              {userOrder.map((imageIndex, i) => (
                <DropZone
                  key={i}
                  id={i.toString()}
                  imageIndex={imageIndex}
                  onRemove={removeImageFromDropZone}
                />
              ))}
            </div>
            <div className={styles.grid}>
              {images.map((src, index) => (
                <DraggableImage key={index} id={index.toString()} src={src} />
              ))}
            </div>
            <div className={styles.submitButtonContainer}>
              <button onClick={submitAnswer} className={styles.submitButton}>Cek Jawaban</button>
            </div>
          </div>
        </DndContext>
      )}

      <nav className={styles.bottomNav}>
        <div className={styles.navItem} onClick={() => navigate("/")}> <img src="/assets/afasia/menu.svg" alt="Home" /> </div>
        <div className={styles.navItem} onClick={() => navigate(-1)}> <img src="/assets/afasia/arrow-left.svg" alt="Back" /> </div>
      </nav>
    </div>
  );
}

export default Hewanku;
