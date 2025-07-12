import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Kataku.module.css";

/* ---------- BANK SOAL ---------- */
const questionBank = {
  herbivore: [
    { imagePath: "/assets/foto/Herbivora/Copy of Kuda.png", answers: ["Kuda", "Sapi", "Domba", "Gajah"], correctAnswer: "Kuda" },
    { imagePath: "/assets/foto/Herbivora/Copy of Sapi.png", answers: ["Sapi", "Domba", "Gajah", "Kuda"], correctAnswer: "Sapi" },
    { imagePath: "/assets/foto/Herbivora/domba.png", answers: ["Domba", "Gajah", "Kuda", "Sapi"], correctAnswer: "Domba" },
    { imagePath: "/assets/foto/Herbivora/Gajah.png", answers: ["Gajah", "Kuda", "Sapi", "Domba"], correctAnswer: "Gajah" }
  ],
  carnivore: [
    { imagePath: "/assets/foto/Karnivora/Anjing.jpeg", answers: ["Anjing", "Hiu", "Kucing", "Harimau"], correctAnswer: "Anjing" },
    { imagePath: "/assets/foto/Karnivora/Hiu-1.png", answers: ["Singa", "Anjing", "Hiu", "Kucing"], correctAnswer: "Hiu" },
    { imagePath: "/assets/foto/Karnivora/Kucing-1.png", answers: ["Harimau", "Singa", "Anjing", "Kucing"], correctAnswer: "Kucing" },
    { imagePath: "/assets/foto/Karnivora/Macan-1.png", answers: ["Kucing", "Harimau", "Singa", "Anjing"], correctAnswer: "Harimau" },
    { imagePath: "/assets/foto/Karnivora/Singa.png", answers: ["Hiu", "Kucing", "Harimau", "Singa"], correctAnswer: "Singa" }
  ],
  ruminansia: [
    { imagePath: "/assets/foto/Hewan Ternak/Ayam.png", answers: ["Ayam", "Bebek", "Domba", "Kuda"], correctAnswer: "Ayam" },
    { imagePath: "/assets/foto/Hewan Ternak/Bebek.png", answers: ["Sapi", "Ayam", "Bebek", "Domba"], correctAnswer: "Bebek" },
    { imagePath: "/assets/foto/Hewan Ternak/Copy of domba.png", answers: ["Kuda", "Sapi", "Ayam", "Domba"], correctAnswer: "Domba" },
    { imagePath: "/assets/foto/Hewan Ternak/Kuda.png", answers: ["Domba", "Kuda", "Sapi", "Ayam"], correctAnswer: "Kuda" },
    { imagePath: "/assets/foto/Hewan Ternak/Sapi.png", answers: ["Bebek", "Domba", "Kuda", "Sapi"], correctAnswer: "Sapi" }
  ],
  mandi: [
    { imagePath: "/assets/foto/Toilet/Ember-1.png", answers: ["Ember", "Gayung", "Handuk", "Sikat Gigi"], correctAnswer: "Ember" },
    { imagePath: "/assets/foto/Toilet/Gayung-1.png", answers: ["Gayung", "Handuk", "Sikat Gigi", "Ember"], correctAnswer: "Gayung" },
    { imagePath: "/assets/foto/Toilet/Handuk.png", answers: ["Handuk", "Sikat Gigi", "Gayung", "Ember"], correctAnswer: "Handuk" }
  ],
  makan: [
    { imagePath: "/assets/foto/Alat Makan/Garpu-1.png", answers: ["Garpu", "Gelas", "Mangkuk", "Piring"], correctAnswer: "Garpu" },
    { imagePath: "/assets/foto/Alat Makan/Gelas-1.png", answers: ["Sendok", "Garpu", "Gelas", "Mangkuk"], correctAnswer: "Gelas" },
    { imagePath: "/assets/foto/Alat Makan/Mangkuk-1.png", answers: ["Piring", "Mangkuk", "Garpu", "Gelas"], correctAnswer: "Mangkuk" },
    { imagePath: "/assets/foto/Alat Makan/Piring-1.png", answers: ["Mangkuk", "Piring", "Gelas", "Mangkuk"], correctAnswer: "Piring" },
    { imagePath: "/assets/foto/Alat Makan/Sendok-1.png", answers: ["Piring", "Sendok", "Garpu", "Gelas"], correctAnswer: "Sendok" }
  ],
  other: [
    { imagePath: "/assets/foto/Lain2/Buku-1.png", answers: ["Buku", "Kursi", "Meja", "Pulpen"], correctAnswer: "Buku" },
    { imagePath: "/assets/foto/Lain2/Kursi-1.png", answers: ["Kursi", "Meja", "Pulpen", "Buku"], correctAnswer: "Kursi" },
    { imagePath: "/assets/foto/Lain2/Meja-1.png", answers: ["Meja", "Pulpen", "Buku", "Kursi"], correctAnswer: "Meja" },
    { imagePath: "/assets/foto/Lain2/pulpen.png", answers: ["Pulpen", "Buku", "Kursi", "Meja"], correctAnswer: "Pulpen" }
  ]
};

/* ---------- HELPER ---------- */
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const getAnimalQuestions = () =>
  shuffle([
    ...questionBank.herbivore,
    ...questionBank.carnivore,
    ...questionBank.ruminansia
  ]);

const getObjectQuestions = () =>
  shuffle([
    ...questionBank.mandi,
    ...questionBank.makan,
    ...questionBank.other
  ]);

function Kataku() {
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState([]);
  const [idx, setIdx] = useState(0);

  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  /* ---------- BUILD QUIZ ---------- */
  useEffect(() => {
    const animalQs = getAnimalQuestions().slice(0, 5);
    const objectQs = getObjectQuestions().slice(0, 5);
    setQuiz(shuffle([...animalQs, ...objectQs]));
  }, []);

  /* ---------- HANDLERS ---------- */
  const submitAnswer = () => {
    if (selected === null) return;

    const correct = quiz[idx].answers[selected] === quiz[idx].correctAnswer;
    setIsCorrect(correct);
    setIsSubmit(true);
    if (correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx < quiz.length - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
      setIsCorrect(null);
      setIsSubmit(false);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setIdx(0);
    setSelected(null);
    setIsCorrect(null);
    setIsSubmit(false);
    setScore(0);
    setFinished(false);
    const animalQs = getAnimalQuestions().slice(0, 5);
    const objectQs = getObjectQuestions().slice(0, 5);
    setQuiz(shuffle([...animalQs, ...objectQs]));
  };

  /* ---------- RENDER ---------- */
  if (quiz.length === 0) {
    return <p className={styles.loading}>Loading…</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kataku</h1>

      {finished ? (
        <div>
          <h2>
            Kuis selesai! Skor Anda: {score}/{quiz.length}
          </h2>
          <button className={styles.submitButton} onClick={restart}>
            Main lagi
          </button>
        </div>
      ) : (
        <div>
          <h3>Gambar apakah ini?</h3>
          <img
            src={quiz[idx].imagePath}
            alt="Soal"
            className={styles.image}
          />
          <div className={styles.answersContainer}>
            {quiz[idx].answers.map((ans, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={[
                  styles.answerButton,
                  selected === i && isCorrect === null && styles.selected,
                  selected === i && isCorrect === true && styles.correct,
                  selected === i && isCorrect === false && styles.incorrect
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {ans}
              </button>
            ))}
          </div>

          {!isSubmit && (
            <button className={styles.submitButton} onClick={submitAnswer}>
              Cek jawaban
            </button>
          )}

          {isSubmit && (
            <>
              <p className={styles.feedback}>
                {isCorrect ? "Jawaban Anda benar!" : "Jawaban Anda salah!"}
              </p>
              <button className={styles.nextButton} onClick={next}>
                Selanjutnya
              </button>
            </>
          )}
        </div>
      )}

      {/* Bottom nav */}
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

export default Kataku;
