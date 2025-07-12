import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Hewanku.module.css";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const images = [
  "/assets/foto/Herbivora/Copy of Kuda.png",
  "/assets/foto/Herbivora/Copy of Sapi.png",
  "/assets/foto/Herbivora/domba.png",
  "/assets/foto/Herbivora/Gajah.png",
];

/* ---------- DRAGGABLE ---------- */
function DraggableImage({ id, src }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    touchAction: "none",
    cursor: "grab",
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

/* ---------- DROP ZONE ---------- */
function DropZone({ id, imageIndex, onRemove }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`${styles.dropZone} ${
        imageIndex !== null ? styles.filled : ""
      }`}
    >
      {imageIndex !== null && (
        <img
          src={images[imageIndex]}
          alt={`selected ${id + 1}`}
          className={styles.dropZoneImage}
          onClick={() => onRemove(id)}
          title="Klik untuk hapus gambar"
          style={{ cursor: "pointer" }}
        />
      )}
      <div className={styles.orderNumber}>{Number(id) + 1}</div>
    </div>
  );
}

/* ====================================================== */
function Hewanku() {
  const [correctOrder, setCorrectOrder] = useState([]);
  const [userOrder, setUserOrder] = useState(Array(images.length).fill(null));
  const [showImages, setShowImages] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [showCorrectMsg, setShowCorrectMsg] = useState(false);
  const navigate = useNavigate();

  /* ---------- init ---------- */
  useEffect(() => generateQuestion(), []);

  /* ---------- helpers ---------- */
  const startGame = () => {
    setGameStarted(true);
    setUserOrder(Array(images.length).fill(null));
    setShowImages(true);
    setTimeout(() => setShowImages(false), 5000);
  };

  const generateQuestion = () => {
    const shuffled = [...Array(images.length).keys()].sort(
      () => Math.random() - 0.5
    );
    setCorrectOrder(shuffled);
    setUserOrder(Array(images.length).fill(null));
  };

  /* ------------- RETRY (SAME ORDER) ------------- */
  const handleRetry = () => {
    setIsWrongAnswer(false);                     // tutup pesan salah
    setUserOrder(Array(images.length).fill(null));
    setShowImages(true);                         // tampilkan urutan lama
    setTimeout(() => setShowImages(false), 5000);
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setGameOver(false);
    setIsWrongAnswer(false);
    generateQuestion();
  };

  /* ---------- submit logic ---------- */
  const submitAnswer = () => {
    if (userOrder.includes(null)) {
      alert("Harap isi semua kotak!");
      return;
    }
    if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
      setShowCorrectMsg(true);
      setTimeout(() => {
        setShowCorrectMsg(false);
        if (currentLevel < 5) {
          setCurrentLevel((lv) => lv + 1);
          setScore((s) => s + 1);
          generateQuestion();
          setShowImages(true);
          setTimeout(() => setShowImages(false), 5000);
        } else setGameOver(true);
      }, 2000);
    } else {
      setIsWrongAnswer(true);
    }
  };

  const removeImageFromDropZone = (idx) =>
    setUserOrder((prev) => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });

  /* =================================================== */
  return (
    <div className={styles.container}>
      {/* POPUP BENAR */}
      {showCorrectMsg && (
        <div className={styles.correctPopup}>
          <h3>Jawaban Anda Benar! 😊</h3>
        </div>
      )}

      {/* PANEL SALAH */}
      {isWrongAnswer ? (
        <div className={styles.errorPage}>
          <h3>Yah :( Coba Lagi Yuk!</h3>
          <p>Anda mencapai level {score}.</p>
          <button onClick={handleRetry} className={styles.submitButton}>
            Ulangi Lagi
          </button>
        </div>
      ) : gameOver ? (
        /* GAME SELESAI */
        <div>
          <h3>Selamat! Anda telah menyelesaikan permainan!</h3>
          <p>Skor Anda: {score}</p>
          <button onClick={resetGame} className={styles.submitButton}>
            Main Lagi
          </button>
        </div>
      ) : !gameStarted ? (
        /* INTRO */
        <div>
          <p className={styles.introText}>
            Hafalkan lalu susun kembali dalam urutan yang benar!
          </p>
          <button onClick={startGame} className={styles.submitButton}>
            Mulai
          </button>
        </div>
      ) : showImages ? (
        /* FASE HAFAL */
        <div>
          <h3>Hafalkan Urutannya!</h3>
          <div className={styles.grid}>
            {correctOrder.map((idx, i) => (
              <div key={i} className={styles.gridCell} data-number={i + 1}>
                <img
                  src={images[idx]}
                  alt={`memory ${i + 1}`}
                  className={styles.gridImage}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* FASE DND */
        <DndContext
          onDragEnd={({ active, over }) => {
            if (over && !userOrder.includes(Number(active.id))) {
              setUserOrder((prev) => {
                const next = [...prev];
                next[Number(over.id)] = Number(active.id);
                return next;
              });
            }
          }}
        >
          <div className={styles.dndStage}>
            <h3>Pindahkan gambar ke urutan yang benar:</h3>

            <div className={styles.grid}>
              {userOrder.map((imgIdx, i) => (
                <DropZone
                  key={i}
                  id={i.toString()}
                  imageIndex={imgIdx}
                  onRemove={removeImageFromDropZone}
                />
              ))}
            </div>

            <div className={styles.grid}>
              {images.map((src, idx) => (
                <DraggableImage key={idx} id={idx.toString()} src={src} />
              ))}
            </div>

            <div className={styles.submitButtonContainer}>
              <button onClick={submitAnswer} className={styles.submitButton}>
                Cek Jawaban
              </button>
            </div>
          </div>
        </DndContext>
      )}

      {/* NAV BAR */}
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
