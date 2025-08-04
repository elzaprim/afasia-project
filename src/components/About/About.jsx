import React, { useState } from 'react'; 
import { getImageUrl } from '../../utils';
import styles from "./About.module.css";

export const About = () => {
    const slides = [
        {
            image: "runner/running_5024672.png",
            title: "FitRun",
            text: "Nutrisi optimal untuk setiap langkah Anda."
        },
        {
            image: "runner/nutrition-icon.svg",
            title: "Perencanaan Menu Harian",
            text: "Dapatkan rekomendasi menu harian yang dipersonalisasi sesuai fase latihan dan tujuan performa Anda."
        },
        {
            image: "runner/sports-running-shoes-color-icon.svg",
            title: "Pencatatan Aktivitas & Asupan",
            text: "Catat makanan dan aktivitas harian Anda untuk memantau asupan nutrisi dan pengeluaran energi secara real-time."
        },
        {
            image: "runner/schedule_2000025.png",
            title: "Analisis & Evaluasi Cerdas",
            text: "Tinjau ringkasan harian Anda untuk tetap sesuai dengan periodisasi nutrisi Anda."
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
            <h2 className={styles.title}>FitRun</h2>
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
                        <button onClick={prevSlide}>Sebelumnya</button>
                    )}
                    {currentSlide < slides.length - 1 && (
                        <button onClick={nextSlide}>Berikutnya</button>
                    )}
                </div>
            </div>
        </section>
    );
};
