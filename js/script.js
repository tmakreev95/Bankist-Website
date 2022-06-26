'use strict';

///////////////////////////////////////
// Selections
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
// Nav
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

// Tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//Sections
const sections = document.querySelectorAll('.section');

//Images
const imgTargets = document.querySelectorAll('img[data-src]');

//Slider
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRigh = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
// Selections


const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function (e) {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Page navigation
// Smooth Scrolling with calculating coordinats
btnScroll.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});
// Smooth Scrolling

// Event Delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event (matching strategy)
navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth'
    });
  }
});
// Event Delegation
//Page navigation

// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const tab = e.target.closest('.operations__tab');

  // Guard clause
  if (!tab) return;

  //Active tab / tab content logic
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tabContent => tabContent.classList.remove('operations__content--active'));

  tab.classList.add('operations__tab--active');

  document.querySelector(`.operations__content--${tab.dataset.tab}`)
    .classList.add('operations__content--active');
});
// Tabbed component

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');;

    siblings.forEach(sibling => {
      if (sibling !== link) sibling.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};
//Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
// Menu fade animation

//Intersection Observer API - Sticky navigation
const stickyNavCallback = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

const stickyNavObserverOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNavCallback, stickyNavObserverOptions);
headerObserver.observe(header);
//Intersection Observer API - Sticky navigation

//Scroll Reveal
const revealSectionCallback = function (entries, observer) {
  const [entry] = entries;

  // Guard Clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const revealSectionObserverOptions = {
  root: null,
  threshold: 0.15
};

const sectionObserver = new IntersectionObserver(revealSectionCallback, revealSectionObserverOptions);
sections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
//Scroll Reveal

//Lazy Loading Images
const imgObserverCallback = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Replace src with data-src 
  entry.target.src = entry.target.dataset.src;

  //Handling load event for slow network
  entry.target.addEventListener('load', function (e) {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserverOptions = {
  root: null,
  threshold: 0,
  rootMargin: '+200px'
};

const imgObserver = new IntersectionObserver(imgObserverCallback, imgObserverOptions);
imgTargets.forEach(img => { imgObserver.observe(img); });
//Lazy Loading Images

//Slider Component
const sliderFunction = function () {
  let currentSlide = 0;
  const maxSlides = slides.length;

  const createDots = function () {
    slides.forEach((slide, i) => {
      dotsContainer.insertAdjacentHTML('beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  }

  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => {
        dot.classList.remove('dots__dot--active');
      });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => {
        s.style.transform = `translateX(${100 * (i - slide)}%)`;
      });
  }

  const nextSlide = function () {
    if (currentSlide === maxSlides - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
    activeDot(currentSlide)
  }

  const previousSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlides - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activeDot(currentSlide);
  }

  const init = function () {
    goToSlide(0);
    createDots();
    activeDot(0);
  }

  init();

  sliderBtnRigh.addEventListener('click', nextSlide);
  sliderBtnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === "ArrowLeft") {
      previousSlide();
    }

    if (e.key === "ArrowRight") {
      nextSlide();
    }
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });
}

sliderFunction();
//Slider Component

//References to live-code
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree bult!', e);
// });

// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded!', e);
// });

// window.addEventListener('beforeunload', function (e) {
//   console.log('beforeunload happened', e);
//   e.returnValue = '';
// });

//Intersection Observer API - Sticky navigation

// const observerCallback = function (entries, observer) {
//   entries.forEach(entry => {

//   });
// };

// const observerOptions = {
//   root: null,
//   threshold: [0, 0.2]
// };

// const headerObserver = new IntersectionObserver(observerCallback, observerOptions);
// headerObserver.observe(header);
//Intersection Observer API - Sticky navigation


// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1);
// Sticky Navigation
// const initialCoordinates = section1.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > initialCoordinates.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }

// });
// Sticky Navigation
// Event Delegation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');

//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth'
//     });
//   });
// });
// Event Delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event (matching strategy)
// btnScroll.addEventListener('click', function (e) {
// const section1Coordinates = section1.getBoundingClientRect();
// console.log(section1Coordinates);
// console.log(e.target.getBoundingClientRect());
// console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
// console.log('Height/Width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

// window.scrollTo(
//   section1Coordinates.left + window.pageXOffset,
//   section1Coordinates.top + window.pageYOffset
// );

// window.scrollTo({
//   left: section1Coordinates.left + window.pageXOffset,
//   top: section1Coordinates.top + window.pageYOffset,
//   behavior: 'smooth'
// });
//References to live-code

//Exercise - Selecting elements
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// const section = document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// const btns = document.getElementsByClassName('btn');
// console.log(btns);

//Creating and inserting elements
// .insertAdjacentHTML
// const header = document.querySelector('.header');
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookie for improved functionality and analytics.';
// message.innerHTML = 'We use cookie for improved functionality and analytics. <button class="btn btn--close-cookie">Got it! </button>';

// header.append(message);
// // document.querySelector('.header').append(message);
// // header.before(message);
// // header.after(message);

// //Delete elements
// document.querySelector('.btn--close-cookie').addEventListener('click', function (e) {
//   // message.remove();

//   //DOM traversing
//   message.parentElement.removeChild(message);
// });

// //Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '100%';

// console.log(message.style.backgroundColor);
// console.log(getComputedStyle(message).height);

// message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //Attributes
// const logo = document.querySelector('.nav__logo');

// //Non-standard property
// console.log(logo.designer);

// console.log(logo.getAttribute('designer'));
// console.log(logo.className);

// logo.setAttribute('company', 'Bankist');

// console.log('Absolute address', logo.src);
// console.log('Relative', logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.getAttribute('href'));

// // Data attributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('test');
// logo.classList.remove('test');
// logo.classList.toggle('test');
// logo.classList.contains('test');

// // Overrides all classes 
// logo.className = 'jonas';

//Events and Event Handlers
// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Great!');
// };

// // h1.onmouseenter = alertH1;

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// Event Propagation 
// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   console.log('LINK', e.target, e.currentTarget);
//   this.style.backgroundColor = randomColor();  
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   console.log('LINKS', e.target, e.currentTarget);
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   console.log('NAV', e.target, e.currentTarget);
//   this.style.backgroundColor = randomColor();
// });

//Stop propagation
// Event Propagation 

//DOM Traversing

//Goind downwards: child
// const h1 = document.querySelector('h1');
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.children);


// //Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);
//DOM Traversing