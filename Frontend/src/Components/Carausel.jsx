import React, { useState, useEffect } from "react";
import "../styles/carausel.css";

const images = [
  "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg", // Hospital Exterior
  "https://images.pexels.com/photos/7088484/pexels-photo-7088484.jpeg", // Healthcare Professionals
  "https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg", // Medicines
  "https://images.pexels.com/photos/6129197/pexels-photo-6129197.jpeg", // Doctor Consultation
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="carousel-container">
      <button className="prev" onClick={prevSlide}>
        ❮
      </button>
      <div className="image-container">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={index === currentIndex ? "active" : "inactive"}
          />
        ))}
      </div>
      <button className="next" onClick={nextSlide}>
        ❯
      </button>
    </div>
  );
};

export default Carousel;
