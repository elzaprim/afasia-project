import React from "react";
import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";

export const Hero = () => {
    const scrollToFooter = () => {
        const footer = document.getElementById("contact");
        footer.scrollIntoView({ behavior: "smooth" });
    };

    return ( 
     <section className={styles.container}>
        <div className={styles.content}>
            <h1 className={styles.title}>Hai, namaku Arimbi!</h1>
            <h2 className={styles.subtitle}>Aku akan menjadi sahabat kesehatanmu di aplikasi ini.</h2>
            <p className={styles.description}>
            Tugas utamaku adalah membantu kamu menjaga kesehatan dengan mudah dan nyaman.
            </p>
            <button onClick={scrollToFooter} className={styles.contactBtn}>
                Hubungi Kami
            </button>
        </div>
        <img src={getImageUrl("arimbi/Salinan 11.png")} 
        alt="Hero image of me"
        className={styles.heroImg}
        />
        <div className={styles.topBlur} />
        <div className={styles.bottomBlur} />
    </section>
    );
};
