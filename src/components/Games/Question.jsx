const questions = {
    animals: [
      { imagePath: 'assets/images/Hewanku/Cat Transparant.png', answers: ["Kucing", "Anjing", "Macan", "Gajah"], correctAnswer: "Kucing" },
      { imagePath: 'assets/images/Hewanku/Chicken Transparant.png', answers: ["Ikan", "Ayam", "Bebek", "Paus"], correctAnswer: "Ayam" },
      { imagePath: 'assets/images/Hewanku/Cow Transparant.png', answers: ["Kuda", "Burung", "Sapi", "Kucing"], correctAnswer: "Sapi" },
      { imagePath: 'assets/images/Hewanku/Dog Transparant.png', answers: ["Anjing", "Merpati", "Kelinci", "Kuda"], correctAnswer: "Anjing" },
      { imagePath: 'assets/images/Hewanku/Elephant Transparant.png', answers: ["Gajah", "Babi", "Kerbau", "Singa"], correctAnswer: "Gajah" },
    ],
    objects: [
      { imagePath: 'assets/images/Hewanku/Bucket Transparant.png', answers: ["Ember", "Mangkuk", "Gelas", "Jaket"], correctAnswer: "Ember" },
      { imagePath: 'assets/images/Hewanku/Chair Transparant.png', answers: ["Meja", "Kursi", "Jam", "Kaos"], correctAnswer: "Kursi" },
      { imagePath: 'assets/images/Hewanku/Fork Transparant.png', answers: ["Pisau", "Garpu", "Sendok", "Celana"], correctAnswer: "Garpu" },
      { imagePath: 'assets/images/Hewanku/Glass Transparant.png', answers: ["Wajan", "Gelas", "Piring", "Rok"], correctAnswer: "Gelas" },
      { imagePath: 'assets/images/Hewanku/Plate Transparant.png', answers: ["Piring", "Gelas", "Talenan", "Kemeja"], correctAnswer: "Piring" },
    ]
  };
  
  export const getAnimalQuestions = () => questions.animals;
  export const getObjectQuestions = () => questions.objects;
  