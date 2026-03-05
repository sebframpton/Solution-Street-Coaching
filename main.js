// Mobile Navigation Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('is-active');
    navLinks.classList.toggle('nav-active');
    
    // Update ARIA expanded
    const isExpanded = menuToggle.classList.contains('is-active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
  });

  // Close menu when a link is clicked
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('is-active');
      navLinks.classList.remove('nav-active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Scroll Reveal Animations using Intersection Observer
const revealElements = document.querySelectorAll(
  '.scroll-reveal-up, .scroll-reveal-left, .scroll-reveal-right, .stagger-up'
);

const revealOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

revealElements.forEach(el => {
  revealOnScroll.observe(el);
});

// Initial trigger for elements already in viewport on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const staggers = document.querySelectorAll('.stagger-up');
    staggers.forEach(el => el.classList.add('is-visible'));
  }, 100);
});

// Form Submission handling (front-end only mock)
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        formStatus.textContent = 'Thank you! Your message has been sent successfully. We will be in touch soon.';
        formStatus.classList.remove('hidden', 'error');
        formStatus.classList.add('success');
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Form submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      formStatus.textContent = 'Oops! Something went wrong. Please try again or contact us directly.';
      formStatus.classList.remove('hidden', 'success');
      formStatus.classList.add('error');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
      
      // Hide message after 5 seconds
      setTimeout(() => {
        formStatus.classList.add('hidden');
      }, 5000);
    }
  });
}
