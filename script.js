 const navbar       = document.getElementById('navbar');
    const progressBar  = document.getElementById('progress-bar');
    const backToTop    = document.getElementById('back-to-top');

    window.addEventListener('scroll', function () {

      // Toggle navbar background on scroll
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Update scroll progress bar width
      const scrollTotal    = document.body.scrollHeight - window.innerHeight;
      const scrollProgress = (window.scrollY / scrollTotal) * 100;
      progressBar.style.width = scrollProgress + '%';

      // Show / hide back-to-top button
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }

      // Highlight active nav link based on section in view
      const sections = ['about', 'services', 'portfolio', 'pricing', 'process', 'contact'];
      sections.forEach(function (sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const link = document.querySelector('.nav-links a[href="#' + sectionId + '"]');
        if (link) {
          if (rect.top < 100 && rect.bottom > 100) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      });

    }, { passive: true });


    // ============================================================
    // 2. MOBILE HAMBURGER MENU
    // ============================================================

    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');

      // Prevent body scroll when menu is open
      if (mobileMenu.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu (called on link click)
    function closeMobileMenu() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }


    // ============================================================
    // 3. SCROLL REVEAL ANIMATION
    //    Uses IntersectionObserver to add 'visible' class
    //    when elements enter the viewport
    // ============================================================

    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.10 });

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-2, .reveal-3').forEach(function (el) {
      revealObserver.observe(el);
    });


    // ============================================================
    // 4. ANIMATED COUNTERS
    //    Counts up from 0 to target value when in view
    // ============================================================

    function animateCounter(el, target, suffix) {
      let current = 0;
      const step  = target / 55;

      const timer = setInterval(function () {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current) + (suffix || '');
      }, 22);
    }

    // Observer for section counters
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.50 });

    document.querySelectorAll('[data-target]').forEach(function (el) {
      counterObserver.observe(el);
    });

    // Observer for hero stats counters
    const heroCounterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.heroCount);
          animateCounter(el, target, '+');
          heroCounterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.50 });

    document.querySelectorAll('[data-hero-count]').forEach(function (el) {
      heroCounterObserver.observe(el);
    });


    // ============================================================
    // 5. GSAP ANIMATIONS
    //    Hero entrance + mouse parallax on orbs
    // ============================================================

    if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Hero section: staggered entrance animation
      gsap.from('#hero-content > *', {
        opacity:  0,
        y:        40,
        stagger:  0.12,
        duration: 0.90,
        ease:     'power3.out',
        delay:    0.20,
      });

      // Hero visual mockup: slide in from right
      gsap.from('#hero-visual', {
        opacity:  0,
        x:        60,
        duration: 1.00,
        ease:     'power3.out',
        delay:    0.50,
      });

      // Mouse parallax: orbs follow cursor gently
      document.addEventListener('mousemove', function (e) {
        const moveX = (e.clientX / window.innerWidth  - 0.5) * 28;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 28;

        gsap.to('.orb-1', { x: moveX * 0.40, y: moveY * 0.40, duration: 1.5, ease: 'power1.out' });
        gsap.to('.orb-2', { x: moveX * -0.25, y: moveY * -0.25, duration: 1.5, ease: 'power1.out' });
      });
    }


    // ============================================================
    // 6. SUBTLE 3D TILT ON CARDS (mousemove effect)
    //    Cards tilt slightly towards cursor on hover
    // ============================================================

    document.querySelectorAll('.service-card, .why-card, .testimonial-card, .pricing-card').forEach(function (card) {

      card.addEventListener('mousemove', function (e) {
        const rect  = card.getBoundingClientRect();
        const tiltX = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
        const tiltY = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;

        card.style.transform  = 'translateY(-7px) rotateX(' + tiltY + 'deg) rotateY(' + tiltX + 'deg)';
        card.style.transition = 'transform 0.1s ease';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform  = '';
        card.style.transition = 'transform 0.4s ease';
      });

    });


    // ============================================================
    // 7. CONTACT FORM SUBMISSION HANDLER
    //    Validates required fields and shows success / error message
    // ============================================================

    function handleFormSubmit(event) {
      event.preventDefault();

      // Get field values
      const nameVal    = document.getElementById('field-name').value.trim();
      const emailVal   = document.getElementById('field-email').value.trim();
      const messageVal = document.getElementById('field-message').value.trim();

      const feedbackEl = document.getElementById('form-feedback');
      const submitBtn  = document.getElementById('submit-btn');

      // Validate required fields
      if (!nameVal || !emailVal || !messageVal) {
        feedbackEl.style.display    = 'block';
        feedbackEl.style.background = 'rgba(239, 68, 68, 0.12)';
        feedbackEl.style.border     = '1px solid rgba(239, 68, 68, 0.30)';
        feedbackEl.style.color      = '#f87171';
        feedbackEl.textContent      = '⚠️ Please fill in all required fields.';

        // Auto-hide after 3.5 seconds
        setTimeout(function () { feedbackEl.style.display = 'none'; }, 3500);
        return;
      }

      // Show loading state on button
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled    = true;

      // Simulate form submission (1.4 second delay)
      setTimeout(function () {

        // Show success message
        feedbackEl.style.display    = 'block';
        feedbackEl.style.background = 'rg       ba(16, 185, 129, 0.12)';
        feedbackEl.style.border     = '1px solid rgba(16, 185, 129, 0.30)';
        feedbackEl.style.color      = '#34d399';
        feedbackEl.textContent      = '✅ Message sent! We\'ll get back to you within 24 hours.';

        // Reset button
        submitBtn.textContent = '🚀 Send Message';
        submitBtn.disabled    = false;

        // Clear all fields
        document.getElementById('field-name').value    = '';
        document.getElementById('field-email').value   = '';
        document.getElementById('field-phone').value   = '';
        document.getElementById('field-message').value = '';

        // Auto-hide success message after 5 seconds
        setTimeout(function () { feedbackEl.style.display = 'none'; }, 5000);

      }, 1400);
    }

    // private policy //

