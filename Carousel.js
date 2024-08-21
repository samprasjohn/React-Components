import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Carousel.css';

const Carousel = ({ slides, autoPlayInterval, showDots }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic slide change
  useEffect(() => {
    const autoPlay = () => {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
      }, autoPlayInterval);

      return () => clearInterval(timer);
    };

    if (autoPlayInterval > 0) {
      autoPlay();
    }
  }, [autoPlayInterval, slides.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel">
      <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide">
            {slide}
          </div>
        ))}
      </div>
      <button className="carousel-control prev" onClick={goToPrevious}>
        &#10094;
      </button>
      <button className="carousel-control next" onClick={goToNext}>
        &#10095;
      </button>
      {showDots && (
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

Carousel.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.node).isRequired,
  autoPlayInterval: PropTypes.number,
  showDots: PropTypes.bool,
};

Carousel.defaultProps = {
  autoPlayInterval: 3000,
  showDots: true,
};

export default Carousel;

//EXAMPLE///////////////////////////////////////////////////////////////
import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from './Carousel';
import './styles.css';

const slides = [
  <div key="1" className="slide-content"><img src="https://via.placeholder.com/800x400" alt="Slide 1" /></div>,
  <div key="2" className="slide-content"><img src="https://via.placeholder.com/800x400" alt="Slide 2" /></div>,
  <div key="3" className="slide-content"><img src="https://via.placeholder.com/800x400" alt="Slide 3" /></div>,
  <div key="4" className="slide-content">This is a testimonial slider: "Great service!"</div>,
];

const App = () => {
  return (
    <div className="app">
      <h1>Image Carousel</h1>
      <Carousel slides={slides} autoPlayInterval={5000} showDots={true} />
    </div>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

