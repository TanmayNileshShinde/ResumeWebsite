document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const downloadBtn = document.getElementById('downloadBtn');
  const contactForm = document.getElementById('contactForm');
  const formSuccessToast = document.getElementById('formSuccessToast');
  const backToTop = document.getElementById('backToTop');
  const currentYearSpan = document.getElementById('currentYear');

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  const THEME_KEY = 'resume_theme';

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' 
        ? '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  };

  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem(THEME_KEY, newTheme);
    });
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const sections = document.querySelectorAll('section[id]');

  const handleActiveNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    if (backToTop) {
      if (scrollY > 300) {
        backToTop.style.opacity = '1';
        backToTop.style.pointerEvents = 'auto';
      } else {
        backToTop.style.opacity = '0';
        backToTop.style.pointerEvents = 'none';
      }
    }
  };

  window.addEventListener('scroll', handleActiveNavOnScroll);
  handleActiveNavOnScroll();

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const clearErrors = () => {
      nameError.textContent = '';
      emailError.textContent = '';
      subjectError.textContent = '';
      messageError.textContent = '';
    };

    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          clearErrors();
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        nameError.textContent = 'Name must be at least 2 characters long.';
        isValid = false;
      }

      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email address.';
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      if (!subjectInput.value.trim()) {
        subjectError.textContent = 'Please enter a subject.';
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please enter your message.';
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'Message should be at least 10 characters long.';
        isValid = false;
      }

      if (isValid) {
        if (formSuccessToast) {
          formSuccessToast.classList.remove('hidden');
          formSuccessToast.style.opacity = '1';
        }

        contactForm.reset();

        setTimeout(() => {
          if (formSuccessToast) {
            formSuccessToast.style.opacity = '0';
            setTimeout(() => {
              formSuccessToast.classList.add('hidden');
            }, 300);
          }
        }, 4000);
      }
    });
  }
});
