  let index = 0;
  let isAnimating = false;
  let animationFinished = false;
  let preloaderSkipped = false;

  const images = ['img/dimsum_ori.png', 'img/Dumpling.png', 'img/dimsum_mentai.png'];
  const productNames = ['Dimsum Ori', 'Dumpling Ayam', 'Dimsum Mentai'];

  const mainImage = document.getElementById('main-image');
  const thumbnails = document.querySelectorAll('.preview-thumbs img');
  const productName = document.getElementById('product-name');
  const audio = document.getElementById('intro-audio');
  const preloader = document.querySelector('.preloader');
  const body = document.body;

  function handleAudio() {
    if (audio) {
      audio.volume = 0.4;
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.log('Audio playback prevented');
        });
      }
    }
  }

  function skipPreloader() {
    if (preloaderSkipped) return;
    preloaderSkipped = true;
    
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        preloader.style.display = 'none';
        body.classList.add('loaded');
        startGSAPAnimation();
      }
    });
    
    if (audio && !audio.paused) {
      gsap.to(audio, {
        volume: 0,
        duration: 0.5,
        onComplete: () => audio.pause()
      });
    }
  }

 function startGSAPAnimation() {
  gsap.from("nav", {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  });

  gsap.from(".hero-content h1", {
    opacity: 0,
    x: -50,
    duration: 1,
    delay: 0.3,
    ease: "power2.out"
  });

  gsap.from(".hero-content p", {
    opacity: 0,
    x: 50,
    duration: 1,
    delay: 0.6,
    ease: "power2.out"
  });

  gsap.from("#product-name", {
    scale: 0.5,
    opacity: 0,
    duration: 0.8,
    delay: 1,
    ease: "back.out(1.7)"
  });

  gsap.from(".hero-content .btn", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 1.2,
    ease: "power2.out"
  });

  gsap.fromTo(mainImage, {
    opacity: 0,
    scale: 0.9,
    y: 20
  }, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 1.2,
    delay: 1.5,
    ease: "power2.out"
  });

  thumbnails.forEach((thumb, i) => {
    gsap.fromTo(thumb, {
      opacity: 0,
      scale: 0.8,
      y: 15
    }, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      delay: 1.7 + i * 0.2,
      ease: "power2.out"
    });
  });

  gsap.from(".btn-rspnsv", {
    y: 100,
    opacity: 0,
    duration: 0.8,
    delay: 2.4,
    ease: "power2.out",
    onComplete: () => {
      animationFinished = true; 
    }
      });
  }

  function changeImage(idx) {
    if (isAnimating || !animationFinished || idx === index) return;
    isAnimating = true;

    gsap.to(mainImage, {
      scale: 0.95,
      opacity: 0.7,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        mainImage.src = images[idx];
        productName.textContent = productNames[idx];
        
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnails[idx].classList.add('active');
        
        gsap.fromTo(mainImage, {
          scale: 1.05,
          opacity: 0.7
        }, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            index = idx;
            isAnimating = false;
          }
        });
      }
    });
  }

  function manualChangeImage(el, idx) {
    changeImage(idx);
  }

  function startImageRotation() {
    if (!animationFinished) return;
    const nextIdx = (index + 1) % images.length;
    changeImage(nextIdx);
  }

  document.addEventListener('DOMContentLoaded', () => {
    handleAudio();
    
    document.addEventListener('click', skipPreloader, { once: true });
    
    setTimeout(() => {
      if (!preloaderSkipped) skipPreloader();
    }, 4000);
    
    setInterval(startImageRotation, 5000);
  });

// Pergantian gambar //
function changeImage(idx) {
  if (isAnimating || !animationFinished || idx === index) return;
  isAnimating = true;

  const newImg = new Image();
  newImg.src = images[idx];

  newImg.onload = () => {
    gsap.to(mainImage, {
      rotate: 360,
      opacity: 0,
      scale: 0.6,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        mainImage.src = newImg.src;
        productName.textContent = productNames[idx];

        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnails[idx].classList.add('active');

        gsap.fromTo(mainImage, {
          rotate: -180,
          opacity: 0,
          scale: 0.6
        }, {
          rotate: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            index = idx;
            isAnimating = false;
          }
        });
      }
    });
  };
}

function manualChangeImage(el, idx) {
  changeImage(idx);
}

setInterval(() => {
  if (!animationFinished) return;
  const nextIdx = (index + 1) % images.length;
  changeImage(nextIdx);
}, 6000);
window.addEventListener('scroll', () => {
  const image = document.getElementById('main-image');
  const scrollY = window.scrollY;
  
  const rotateValue = scrollY * 0.15; 
  
  image.style.transform = `rotate(${rotateValue}deg)`;

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
});

// testi
const container = document.getElementById('cardContainer');
let autoplay;
let isSliding = false;
function toggleArrows() {
  const arrows = document.querySelector('.arrows');
  if (window.innerWidth <= 767) {
    arrows.style.display = 'none';
  } else {
    arrows.style.display = 'flex';
  }
}

let visibleCount = getVisibleCount();

function getVisibleCount() {
  if (window.innerWidth >= 1025) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

function updateUI() {
  const cards = container.children;
  Array.from(cards).forEach(card => card.classList.remove('selected'));

  const center = Math.floor(getVisibleCount() / 2);
  if (cards[center]) cards[center].classList.add('selected');

  updateActiveDot();
}

function renderDots() {
  const dotsContainer = document.getElementById('dots');
  if (!dotsContainer) return;

  const totalDots = 3;

  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.dataset.index = i;
    dot.addEventListener('click', () => {
      slideToIndex(i);
    });
    dotsContainer.appendChild(dot);
  }
}


function updateActiveDot() {
  const dots = document.querySelectorAll('.dot');
  if (!dots.length) return;

  const center = Math.floor(getVisibleCount() / 2);
  const cards = Array.from(container.children);
  const textInCenter = cards[center]?.querySelector('h4')?.textContent;

  dots.forEach(dot => dot.classList.remove('active'));

  if (textInCenter?.includes('rina')) dots[0].classList.add('active');
  else if (textInCenter?.includes('dimas')) dots[1].classList.add('active');
  else if (textInCenter?.includes('sari')) dots[2].classList.add('active');
}


function slide(direction) {
  if (isSliding) return;
  isSliding = true;

  const cardWidth = container.children[0].offsetWidth + 20;
  const moveX = direction * cardWidth;

  container.style.transition = 'transform 0.5s ease';
  container.style.transform = `translateX(${-moveX}px)`;

  setTimeout(() => {
    container.style.transition = 'none';
    container.style.transform = 'translateX(0)';

    if (direction === 1) {
      container.appendChild(container.firstElementChild);
    } else {
      container.insertBefore(container.lastElementChild, container.firstElementChild);
    }

    updateUI();
    isSliding = false;
  }, 500);

  resetAutoplay();
}

function slideToIndex(index) {
  const cardsArr = Array.from(container.children);
  const center = Math.floor(getVisibleCount() / 2);
  const activeIndex = cardsArr.findIndex(card => card.classList.contains('selected'));
  const offset = index - activeIndex;
  if (offset === 0) return;
  slide(offset);
}

function startAutoplay() {
  autoplay = setInterval(() => slide(1), 4000);
}

function resetAutoplay() {
  clearInterval(autoplay);
  startAutoplay();
}

let startX = 0;
container.addEventListener('touchstart', e => startX = e.touches[0].clientX);
container.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].clientX - startX;
  if (Math.abs(diff) > 50) slide(diff < 0 ? 1 : -1);
});

window.addEventListener('resize', () => {
  visibleCount = getVisibleCount();
  updateUI();
  toggleArrows();
});


window.addEventListener('load', () => {
  updateUI();
  renderDots();
  startAutoplay();
  toggleArrows(); 
});

  // maskot
  window.addEventListener('scroll', function () {
    const section = document.querySelector('.cara-order-section');
    const bubbleParent = section.querySelector('.about-image');
    const bubble = bubbleParent.querySelector('.bubble-chat');
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 100 && !bubble.classList.contains('typed')) {
      bubbleParent.classList.add('reveal-bubble');
      typeBubbleText(bubble, "Pesan dimsum mu sekarang!!..");
    }
  });

  function typeBubbleText(element, text, speed = 40) {
    element.classList.add('typed');
    element.textContent = "";
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        element.textContent += text[i];
        i++;
      } else {
        clearInterval(typing);
      }
    }, speed);
  }

  // cara order
  document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('.order-steps li');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate');
          }, index * 150);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    steps.forEach(step => {
      observer.observe(step);
    });
  });

    window.addEventListener('scroll', function () {
    const section = document.querySelector('.game-voucher-section');
    const bubbleParent = section.querySelector('.game-voucher-image');
    const bubble = bubbleParent.querySelector('.game-bubble');
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 100 && !bubble.classList.contains('typed')) {
      bubbleParent.classList.add('reveal-bubble');
      typeBubbleText(bubble, "Yuk mainkan memory game & dapatkan kode vouchermu sekarang!");
    }
  });

  function typeBubbleText(element, text, speed = 40) {
    element.classList.add('typed');
    element.textContent = "";
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        element.textContent += text[i++];
      } else {
        clearInterval(typing);
      }
    }, speed);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const steps = document.querySelectorAll('.game-step-list li');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate');
          }, index * 150);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    steps.forEach(step => observer.observe(step));
  });
