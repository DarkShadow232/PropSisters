// Animation utilities for scroll-based animations

// Function to check if an element is in viewport
const isInViewport = (element, offset = 100) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= window.innerHeight - offset &&
    rect.bottom >= 0
  );
};

// Initialize scroll animations
export const initScrollAnimations = () => {
  // Get all elements with reveal-on-scroll class
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const staggerElements = document.querySelectorAll('.stagger-children');
  
  // Function to check and reveal elements
  const checkReveal = () => {
    revealElements.forEach(element => {
      if (isInViewport(element)) {
        element.classList.add('revealed');
      }
    });
    
    staggerElements.forEach(element => {
      if (isInViewport(element)) {
        element.classList.add('revealed');
      }
    });
  };
  
  // Run on initial load
  checkReveal();
  
  // Add scroll event listener
  window.addEventListener('scroll', checkReveal, { passive: true });
  
  return () => {
    // Cleanup function
    window.removeEventListener('scroll', checkReveal);
  };
};

// Add parallax effect to elements
export const initParallaxEffects = () => {
  const parallaxElements = document.querySelectorAll('.parallax-element');
  
  const handleParallax = () => {
    parallaxElements.forEach(element => {
      const scrollPosition = window.pageYOffset;
      const speed = element.dataset.speed || 0.5;
      element.style.transform = `translateY(${scrollPosition * speed}px)`;
    });
  };
  
  window.addEventListener('scroll', handleParallax, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleParallax);
  };
};

// Initialize all animations
export const initAllAnimations = () => {
  const cleanupScrollAnimations = initScrollAnimations();
  const cleanupParallaxEffects = initParallaxEffects();
  
  // Return cleanup function
  return () => {
    cleanupScrollAnimations();
    cleanupParallaxEffects();
  };
};

export default initAllAnimations;
