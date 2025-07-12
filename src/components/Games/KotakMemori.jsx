import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./KotakMemori.module.css";

const KotakMemori = () => {
  const navigate = useNavigate();
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(1);
  const [gridSize, setGridSize] = useState(3);
  const [correctCells, setCorrectCells] = useState([]);
  const [clickedCells, setClickedCells] = useState([]);
  const [message, setMessage] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const [showYellow, setShowYellow] = useState(false);
  const [canClick, setCanClick] = useState(false);
  const [tutorial, setTutorial] = useState(true);
  const [timer, setTimer] = useState(null);
  const [showAllBlue, setShowAllBlue] = useState(true);

  /* ------------- efek awal ------------- */
  useEffect(() => {
    if (!gameFinished && !tutorial) startGame();
  }, [level, round, tutorial]);

  /* ------------- mulai satu ronde ------------- */
  const startGame = () => {
    setClickedCells([]);
    setShowAllBlue(true);
    setShowYellow(false);
    setCanClick(false);
    setMessage("Bersiaplah...");

    setTimeout(() => {
      setShowAllBlue(false);
      setMessage("Perhatikan kotak biru tua dengan baik!");
      setGridSize(level + 2);
      setCorrectCells(generateRandomCells(level + 2));
      setShowYellow(true);

      const duration = 2000 + level * 1000;
      if (timer) clearTimeout(timer);

      const newTimer = setTimeout(() => {
        setShowYellow(false);
        setMessage("Sekarang, pilih kotak yang tadi berwarna biru tua!");
        setTimeout(() => setCanClick(true), 500);
      }, duration);
      setTimer(newTimer);
    }, 1000);
  };

  /* ------------- util ------------- */
  const generateRandomCells = (count) => {
    const cells = [];
    while (cells.length < count) {
      const rand = Math.floor(Math.random() * gridSize * gridSize);
      if (!cells.includes(rand)) cells.push(rand);
    }
    return cells;
  };

  /* ------------- klik kotak ------------- */
  const handleCellClick = (idx) => {
    if (!canClick || clickedCells.includes(idx)) return;

    setClickedCells([...clickedCells, idx]);

    if (correctCells.includes(idx)) {
      const remaining = correctCells.filter((c) => c !== idx);
      setCorrectCells(remaining);

      if (remaining.length === 0 && clickedCells.length === level + 2 - 1) {
        setTimeout(() => {
          if (round < 3) {
            setRound(round + 1);
            startGame();
          } else if (level < 3) {
            setMessage(`Selamat! Anda naik ke Level ${level + 1}.`);
            setLevel(level + 1);
            setRound(1);
          } else {
            setGameFinished(true);
            setMessage("");
          }
        }, 500);
      }
    } else {
      setMessage("Salah! Coba lagi.");
      setClickedCells([]);
      setCorrectCells(generateRandomCells(level + 2));
      setRound(1);
      setTimeout(startGame, 1000);
    }
  };

  const resetGame = () => {
    setLevel(1);
    setRound(1);
    setGameFinished(false);
    setTutorial(true);
  };

  /* =================================================== */
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Kotak Memori</h2>

      {tutorial ? (
        /* -------- TAMPILAN TUTORIAL -------- */
        <div className={styles.tutorial}>
          <p className={styles.instruction}>
            Perhatikan kotak berwarna biru tua yang muncul.
          </p>
          <p className={styles.instruction}>
            Hafalkan lalu pilih kotak yang tadi berwarna biru tua.
          </p>

          <button
            className={styles.startButton}
            onClick={() => {
              setTutorial(false);
              setTimeout(startGame, 100);
            }}
          >
            Mulai Permainan
          </button>
        </div>
      ) : (
        /* -------- TAMPILAN GAME -------- */
        <>
          <p className={styles.level}>Level: {level}</p>
          <p className={styles.round}>Babak: {round} / 3</p>

          {!gameFinished && (
            <div
              className={styles.grid}
              style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
            >
              {[...Array(gridSize * gridSize)].map((_, i) => (
                <div
                  key={i}
                  className={`${styles.gridCell} ${
                    showAllBlue
                      ? styles.blue
                      : showYellow && correctCells.includes(i)
                      ? styles.yellow
                      : styles.blue
                  } ${clickedCells.includes(i) ? styles.selected : ""}`}
                  onClick={() => handleCellClick(i)}
                />
              ))}
            </div>
          )}

          <p className={styles.message}>
            {gameFinished ? (
              <>
                <img
                  src="/assets/afasia/clapping.svg"
                  alt="Tepuk Tangan"
                  className={styles.clappingImage}
                />
                <span>Selamat! Anda memenangkan permainan!</span>
              </>
            ) : (
              message
            )}
          </p>

          {gameFinished && (
            <button className={styles.startButton} onClick={resetGame}>
              Main Lagi
            </button>
          )}
        </>
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
};

export default KotakMemori;
