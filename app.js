document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Sticky Navbar on Scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Intersection Observer for Reveal Animations
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Counter Animation
  const statsCounters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetValue = parseInt(target.getAttribute('data-target'), 10);
        const suffix = target.getAttribute('data-suffix') || '';
        let start = 0;
        const duration = 1500; // ms
        const stepTime = Math.abs(Math.floor(duration / targetValue));
        
        // Ensure step time is at least 15ms for smooth visual updates
        const intervalTime = Math.max(stepTime, 15);
        const increment = targetValue / (duration / intervalTime);

        const timer = setInterval(() => {
          start += increment;
          if (start >= targetValue) {
            target.textContent = targetValue.toLocaleString() + suffix;
            clearInterval(timer);
          } else {
            target.textContent = Math.floor(start).toLocaleString() + suffix;
          }
        }, intervalTime);

        observer.unobserve(target);
      }
    });
  }, {
    threshold: 0.5
  });

  statsCounters.forEach(counter => counterObserver.observe(counter));

  // Interactive Timeline Selection
  const timelineSteps = document.querySelectorAll('.timeline-step');
  const progressLine = document.querySelector('.timeline-line-progress');

  function updateTimeline() {
    let activeIndex = 0;
    timelineSteps.forEach((step, idx) => {
      if (step.classList.contains('active')) {
        activeIndex = idx;
      }
    });

    // Update progress bar width on desktop
    if (progressLine) {
      const percentage = (activeIndex / (timelineSteps.length - 1)) * 90; // scale slightly lower than 100 to align nicely
      progressLine.style.width = `${percentage}%`;
    }
  }

  if (timelineSteps.length > 0) {
    timelineSteps.forEach((step, index) => {
      step.addEventListener('click', () => {
        // Remove active class from all
        timelineSteps.forEach(s => s.classList.remove('active'));
        // Add to clicked and all prior steps
        for (let i = 0; i <= index; i++) {
          timelineSteps[i].classList.add('active');
        }
        updateTimeline();
      });
    });
    // Init state
    updateTimeline();
  }

  // Opportunity Portal Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portalCards = document.querySelectorAll('.portal-card');

  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active Button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        // Filter Cards
        portalCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
            // Trigger quick animation re-entry
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Application Modal Logic
  const modal = document.getElementById('applyModal');
  const modalClose = document.querySelector('.modal-close');
  const applyForm = document.getElementById('applyForm');
  const successMsg = document.querySelector('.modal-success-msg');
  const programInput = document.getElementById('modalProgram');

  // Open modal buttons
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('open-apply-modal') || e.target.closest('.open-apply-modal')) {
      const btn = e.target.classList.contains('open-apply-modal') ? e.target : e.target.closest('.open-apply-modal');
      const programName = btn.getAttribute('data-program') || 'General Inquiry';
      
      if (programInput) {
        programInput.value = programName;
      }
      
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scrolling
      }
    }
  });

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      // Reset form view after close animation
      setTimeout(() => {
        if (applyForm && successMsg) {
          applyForm.style.display = 'block';
          successMsg.style.display = 'none';
          applyForm.reset();
        }
      }, 300);
    }
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Handle Form Submission Simulation
  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validation
      const name = document.getElementById('modalName').value.trim();
      const email = document.getElementById('modalEmail').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();
      
      if (name && email && phone) {
        // Show success
        applyForm.style.display = 'none';
        if (successMsg) {
          successMsg.style.display = 'block';
        }
      }
    });
  }
});
