 document.addEventListener('DOMContentLoaded', () => {
      async function loadHTML(id, path) {
        const el = document.getElementById(id);
        if (!el) {
          console.error('Placeholder not found:', id);
          return;
        }
        try {
          const res = await fetch(path, {cache: "no-store"});
          if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
          const text = await res.text();
          el.innerHTML = text;
        } catch (err) {
          console.error('Failed to load', path, err);
          el.innerHTML = '<!-- error loading ' + path + ' -->';
        }
      }

      loadHTML('header', '../header.html');
      loadHTML('footer', '../footer.html');
    });
	
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        // allow normal behavior if the link has target or is external
        if (this.getAttribute('href') === '#') return;
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Animate on scroll
    function animateOnScroll() {
      const items = document.querySelectorAll('.fade-in');
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      }, { threshold: 0.12 });
      items.forEach(i => io.observe(i));
    }

    // Mobile menu & header toggle logic
    function setupMobileMenu() {
      const mobileToggle = document.getElementById('mobileToggle');
      const navMenu = document.getElementById('navMenu');
      const hamburger = document.getElementById('hamburger');
      const header = document.getElementById('pageHeader');

      if (!mobileToggle || !navMenu || !header) return;

      const setMenuState = (open) => {
        if (open) {
          navMenu.classList.add('active');
          navMenu.setAttribute('aria-hidden', 'false');
          mobileToggle.setAttribute('aria-expanded', 'true');
          hamburger.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
        } else {
          navMenu.classList.remove('active');
          navMenu.setAttribute('aria-hidden', 'true');
          mobileToggle.setAttribute('aria-expanded', 'false');
          hamburger.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        }
      };

      const toggleMenu = () => setMenuState(!navMenu.classList.contains('active'));
      const closeMenu = () => setMenuState(false);
      const openMenu = () => setMenuState(true);

      // Make sure the toggle doesn't immediately bubble to header
      mobileToggle.addEventListener('click', (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        toggleMenu();
      });
	  
      navMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          setTimeout(() => closeMenu(), 220);
        });
      });

      document.addEventListener('click', (ev) => {
        if (window.innerWidth > 768) return;
        // if the click is outside the header area and the menu is open, close it
        if (!header.contains(ev.target) && navMenu.classList.contains('active')) {
          closeMenu();
        }
      }, { passive: true });

      document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
      });
    }

    function setupContactForm() {
      const form = document.getElementById('contactForm');
      if (!form) return;
      const success = document.getElementById('contactMessage');
      const fail = document.getElementById('failMessage');

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = new FormData(form);
        fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        }).then(response => {
          if (response.ok) {
            form.style.display = 'none';
            success.style.display = 'block';
            success.classList.add('visible');
            // optionally update location hash
            location.hash = '#contactMessage';
          } else {
            fail.style.display = 'block';
            fail.classList.add('visible');
            location.hash = '#failMessage';
          }
        }).catch(err => {
          console.error('Form submit error:', err);
          fail.style.display = 'block';
          fail.classList.add('visible');
          location.hash = '#failMessage';
        });
      });
    }

    function headerScrollEffect() {
      const header = document.querySelector('header');
      if (!header) return;
      window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
          header.style.background = 'rgba(15,15,35,0.96)';
        } else {
          header.style.background = 'rgba(15,15,35,0.9)';
        }
      });
    }

    document.addEventListener('DOMContentLoaded', function () {
      animateOnScroll();
      setupMobileMenu();
      setupContactForm();
      headerScrollEffect();
    });
	
		function toggleFAQ(element) {
		const answer = element.nextElementSibling;
		const toggle = element.querySelector('.faq-toggle');
		
		answer.classList.toggle('active');
		toggle.classList.toggle('active');
	}
	
	
	        let currentSlide = 0;
        const totalSlides = 3;
        const track = document.getElementById('carouselTrack');
        const indicators = document.querySelectorAll('.indicator');
        
        function updateCarousel() {
            track.style.transform = `translateX(-${currentSlide * 33.333}%)`;
            
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
        
        function previousSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
        
        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateCarousel();
        }
        
        // Auto-advance carousel
        setInterval(nextSlide, 5000);
        
        // Touch/swipe support for mobile
        let startX = 0;
        let isDown = false;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDown = true;
        });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
        });
        
        track.addEventListener('touchend', (e) => {
            if (!isDown) return;
            isDown = false;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }
            }
        });
        
        // Mouse drag support
        track.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDown = true;
            track.style.cursor = 'grabbing';
        });
        
        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
        });
        
        track.addEventListener('mouseup', (e) => {
            if (!isDown) return;
            isDown = false;
            track.style.cursor = 'grab';
            
            const endX = e.clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }
            }
        });
        
        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });