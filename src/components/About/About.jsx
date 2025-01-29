import React, { useState } from 'react'; 
import { getImageUrl } from '../../utils';
import styles from "./About.module.css";

export const About = () => {
    const slides = [
        {
            image: "afasia/hero-afa.svg",
            title: "For Better Life",
            text: "Aku akan membantumu mengenal aplikasi ini. Mulai mengenal fitur-fitur pada aplikasi."
        },
        {
            image: "afasia/blocks-abc 1.svg",
            title: "Kataku",
            text: "Menebak kata sesuai dengan pertanyaan"
        },
        {
            image: "afasia/tic-tac-toe-flat 1.svg",
            title: "Kotak Memori",
            text: "Memilih posisi kotak putih pada matriks"
        },
        {
            image: "afasia/cat-about.svg",
            title: "Hewanku",
            text: "Memilih  gambar hewan sesuai dengan urutannya"
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <section className={styles.container} id="about">
            <h2 className={styles.title}>Teman Afasia</h2>
            <div className={styles.content}>
                <img
                    src={getImageUrl(slides[currentSlide].image)}
                    alt={slides[currentSlide].title}
                    className={styles.aboutImage}
                />
                <div className={styles.aboutText}>
                    <h3>{slides[currentSlide].title}</h3>
                    <p>{slides[currentSlide].text}</p>
                </div>
                <div className={styles.navigation}>
                    {currentSlide > 0 && (
                        <button onClick={prevSlide}>Kembali</button>
                    )}
                    {currentSlide < slides.length - 1 && (
                        <button onClick={nextSlide}>Selanjutnya</button>
                    )}
                </div>
            </div>
        </section>
    );
};
