import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styles from "./Kataku.module.css";

const questions = {
  animals: [
    { imagePath: '/assets/afasia/Cat Transparant.png', answers: ["Kucing", "Anjing", "Macan", "Gajah"], correctAnswer: "Kucing" },
    { imagePath: '/assets/afasia/Chicken Transparant.png', answers: ["Ikan", "Ayam", "Bebek", "Paus"], correctAnswer: "Ayam" },
    { imagePath: '/assets/afasia/Cow Transparant.png', answers: ["Kuda", "Burung", "Sapi", "Kucing"], correctAnswer: "Sapi" },
    { imagePath: '/assets/afasia/Dog Transparant.png', answers: ["Anjing", "Merpati", "Kelinci", "Kuda"], correctAnswer: "Anjing" },
    { imagePath: '/assets/afasia/Elephant Transparant.png', answers: ["Gajah", "Babi", "Kerbau", "Singa"], correctAnswer: "Gajah" },
    { imagePath: '/assets/afasia/giraffe Transparant.png', answers: ["Jerapah", "Badak", "Kakatua", "Monyet"], correctAnswer: "Jerapah" },
    { imagePath: '/assets/afasia/Goat Transparant.png', answers: ["Kambing", "Beruang", "Landak", "Merpati"], correctAnswer: "Kambing" },
    { imagePath: '/assets/afasia/Lion Transparant.png', answers: ["Singa", "Gagak", "Kelelawar", "Ular"], correctAnswer: "Singa" },
    { imagePath: '/assets/afasia/Shark Transparant.png', answers: ["Hiu", "Paus", "Penguin", "Katak"], correctAnswer: "Hiu" },
    { imagePath: '/assets/afasia/Sheep Transparant.png', answers: ["Domba", "Singa", "Itik", "Ikan"], correctAnswer: "Domba" },
    { imagePath: '/assets/afasia/Snake Transparant.png', answers: ["Ular", "Buaya", "Cacing", "Badak"], correctAnswer: "Ular" },
    { imagePath: '/assets/afasia/Swan Transparant.png', answers: ["Elang", "Angsa", "Hamster", "Tupai"], correctAnswer: "Angsa" },
    { imagePath: '/assets/afasia/Tiger Transparant.png', answers: ["Serigala", "Kerbau", "Harimau", "Buaya"], correctAnswer: "Harimau" },
  ],
  objects: [
    { imagePath: '/assets/afasia/Bucket Transparant.png', answers: ["Ember", "Mangkuk", "Gelas", "Jaket"], correctAnswer: "Ember" },
    { imagePath: '/assets/afasia/Chair Transparant.png', answers: ["Meja", "Kursi", "Jam", "Kaos"], correctAnswer: "Kursi" },
    { imagePath: '/assets/afasia/Fork Transparant.png', answers: ["Pisau", "Garpu", "Sendok", "Celana"], correctAnswer: "Garpu" },
    { imagePath: '/assets/afasia/Glass Transparant.png', answers: ["Wajan", "Gelas", "Piring", "Rok"], correctAnswer: "Gelas" },
    { imagePath: '/assets/afasia/Plate Transparant.png', answers: ["Piring", "Gelas", "Talenan", "Kemeja"], correctAnswer: "Piring" },
    { imagePath: '/assets/afasia/Spoon Transparant.png', answers: ["Garpu", "Sendok", "Pisau", "Pintu"], correctAnswer: "Sendok" },
    { imagePath: '/assets/afasia/Table Transparant.png', answers: ["Sofa", "Meja", "Selimut", "Jendela"], correctAnswer: "Meja" },
    { imagePath: '/assets/afasia/Water dipper Transparant.png', answers: ["Cangkir", "Gayung", "Baki", "Kaca"], correctAnswer: "Gayung" },
    { imagePath: '/assets/afasia/Bowl Transparant.png', answers: ["Gunting", "Mangkuk", "Spatula", "Panci"], correctAnswer: "Mangkuk" },
    { imagePath: '/assets/afasia/Book Transparant.png', answers: ["Dinding", "Buku", "Kertas", "Selimut"], correctAnswer: "Buku" },
  ]
};

export const getAnimalQuestions = () => questions.animals;
export const getObjectQuestions = () => questions.objects;

function Kataku() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false); // Track if Submit button was clicked

  useEffect(() => {
    let animalQuestions = getAnimalQuestions();
    let objectQuestions = getObjectQuestions();
    animalQuestions.sort(() => Math.random() - 0.5);
    objectQuestions.sort(() => Math.random() - 0.5);

    let combinedQuestions = [...animalQuestions.slice(0, 5), ...objectQuestions.slice(0, 5)];
    combinedQuestions.sort(() => Math.random() - 0.5);
    setQuestions(combinedQuestions);
  }, []);

  const submitAnswer = () => {
    if (selectedAnswerIndex !== null) {
      let correctAnswer = questions[currentQuestionIndex].correctAnswer;
      if (questions[currentQuestionIndex].answers[selectedAnswerIndex] === correctAnswer) {
        setScore(score + 1);
        setIsAnswerCorrect(true);
      } else {
        setIsAnswerCorrect(false);
      }
      setIsSubmitClicked(true); // Mark the submit button as clicked
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswerIndex(null);
      setIsAnswerCorrect(null);
      setIsSubmitClicked(false); // Reset submit clicked state
    } else {
      setQuizFinished(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setQuizFinished(false);
    setSelectedAnswerIndex(null);
    setIsAnswerCorrect(null);
    setIsSubmitClicked(false); // Reset submit clicked state
    let animalQuestions = getAnimalQuestions();
    let objectQuestions = getObjectQuestions();
    animalQuestions.sort(() => Math.random() - 0.5);
    objectQuestions.sort(() => Math.random() - 0.5);

    let combinedQuestions = [...animalQuestions.slice(0, 5), ...objectQuestions.slice(0, 5)];
    combinedQuestions.sort(() => Math.random() - 0.5);
    setQuestions(combinedQuestions);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kataku</h1>
      {quizFinished ? (
        <div>
          <h2>Quiz Finished! Your Score: {score}/{questions.length}</h2>
          <button className={styles.submitButton} onClick={resetGame}>Main Lagi</button>
        </div>
      ) : (
        <div>
          <h3>Gambar Apakah Ini?</h3>
          <img src={questions[currentQuestionIndex]?.imagePath} alt="Question" className={styles.image} />
          <div className={styles.answersContainer}>
            {questions[currentQuestionIndex]?.answers.map((answer, index) => (
              <button 
                key={index} 
                onClick={() => setSelectedAnswerIndex(index)}
                className={`${styles.answerButton} ${selectedAnswerIndex === index ? (isAnswerCorrect === null ? styles.selected : isAnswerCorrect ? styles.correct : styles.incorrect) : ''}`}
              >
                {answer}
              </button>
            ))}
          </div>
          {!isSubmitClicked && (
            <button className={styles.submitButton} onClick={submitAnswer}>Submit</button>
          )}
          {isSubmitClicked && (
            <div>
              <p className={styles.feedback}>{isAnswerCorrect ? 'Jawaban Anda Benar!' : 'Jawaban Anda Salah!'}</p>
              <button className={styles.nextButton} onClick={nextQuestion}>Next</button>
            </div>
          )}
        </div>
      )}

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

export default Kataku;
