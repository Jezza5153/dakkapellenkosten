/**
 * DakkapellenKosten.nl — Main JavaScript
 * Handles: navigation, sticky header, FAQ accordion, form validation,
 * scroll animations, blog filters, mobile CTA
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');

  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close nav when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Sticky Header ---
  const header = document.getElementById('header');
  let lastScroll = 0;

  if (header) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // --- Sticky Mobile CTA ---
  const mobileCta = document.getElementById('mobileCta');
  const heroSection = document.querySelector('.hero') || document.querySelector('.blog-hero') || document.querySelector('.article-hero');

  if (mobileCta && heroSection) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          mobileCta.classList.remove('visible');
        } else {
          mobileCta.classList.add('visible');
        }
      },
      { threshold: 0 }
    );
    observer.observe(heroSection);
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const btn = otherItem.querySelector('.faq-item__question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Form Validation ---
  const quoteForm = document.getElementById('quoteForm');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Remove previous error states
      quoteForm.querySelectorAll('.form-input').forEach(input => {
        input.style.borderColor = '';
      });

      // Validate required fields
      const requiredFields = quoteForm.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value || field.value.trim() === '') {
          field.style.borderColor = '#ef4444';
          isValid = false;
        }
      });

      // Validate email
      const emailField = document.getElementById('email');
      if (emailField && emailField.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
          emailField.style.borderColor = '#ef4444';
          isValid = false;
        }
      }

      // Validate postcode (Dutch format)
      const postcodeField = document.getElementById('postcode');
      if (postcodeField && postcodeField.value) {
        const postcodePattern = /^\d{4}\s?[A-Za-z]{2}$/;
        if (!postcodePattern.test(postcodeField.value.trim())) {
          postcodeField.style.borderColor = '#ef4444';
          isValid = false;
        }
      }

      if (isValid) {
        const submitBtn = quoteForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'Bezig met verzenden...';
          submitBtn.disabled = true;

          // Collect form data
          const formData = {
            dakkapelType: document.getElementById('dakkapel-type')?.value || 'weet_niet',
            breedte: document.getElementById('breedte')?.value || 'weet_niet',
            postcode: document.getElementById('postcode')?.value?.trim() || '',
            naam: document.getElementById('naam')?.value?.trim() || '',
            email: document.getElementById('email')?.value?.trim() || '',
            telefoon: document.getElementById('telefoon')?.value?.trim() || '',
          };

          // Send to API
          fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          })
            .then(res => res.json().then(data => ({ ok: res.ok, data })))
            .then(({ ok, data }) => {
              if (ok) {
                submitBtn.textContent = '✓ Aanvraag verzonden!';
                submitBtn.style.background = '#2E8B57';
                submitBtn.style.color = '#fff';
                setTimeout(() => {
                  submitBtn.textContent = originalText;
                  submitBtn.style.background = '';
                  submitBtn.style.color = '';
                  submitBtn.disabled = false;
                  quoteForm.reset();
                }, 4000);
              } else {
                submitBtn.textContent = data.error || 'Er is iets misgegaan';
                submitBtn.style.background = '#ef4444';
                submitBtn.style.color = '#fff';
                setTimeout(() => {
                  submitBtn.textContent = originalText;
                  submitBtn.style.background = '';
                  submitBtn.style.color = '';
                  submitBtn.disabled = false;
                }, 3000);
              }
            })
            .catch(() => {
              submitBtn.textContent = 'Netwerk fout. Probeer het opnieuw.';
              submitBtn.style.background = '#ef4444';
              submitBtn.style.color = '#fff';
              setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                submitBtn.disabled = false;
              }, 3000);
            });
        }
      }
    });

    // Real-time field validation feedback
    quoteForm.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && (!input.value || input.value.trim() === '')) {
          input.style.borderColor = '#ef4444';
        } else {
          input.style.borderColor = '#2E8B57';
        }
      });

      input.addEventListener('focus', () => {
        input.style.borderColor = '';
      });
    });
  }

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Blog Category Filters ---
  const blogFilters = document.getElementById('blogFilters');

  if (blogFilters) {
    const filterButtons = blogFilters.querySelectorAll('.blog-filter');
    const blogCards = document.querySelectorAll('.blog-card[data-category]');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;

        blogCards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById('header')?.offsetHeight || 72;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- Postcode auto-formatting ---
  const postcodeInput = document.getElementById('postcode');
  if (postcodeInput) {
    postcodeInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\s/g, '').toUpperCase();
      if (val.length > 4) {
        val = val.slice(0, 4) + ' ' + val.slice(4, 6);
      }
      e.target.value = val;
    });
  }

  // --- Cookie Consent Banner ---
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');

  if (cookieBanner && cookieAccept) {
    const cookieConsent = localStorage.getItem('dk_cookie_consent');

    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => {
        cookieBanner.classList.add('visible');
      }, 1500);
    } else {
      cookieBanner.classList.add('hidden');
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('dk_cookie_consent', 'accepted');
      cookieBanner.classList.remove('visible');
      setTimeout(() => {
        cookieBanner.classList.add('hidden');
      }, 400);
    });
  }

  // --- Animated Counters (Trust Stats) ---
  const statNumbers = document.querySelectorAll('.trust-stats__number');

  if (statNumbers.length > 0) {
    const animateCounter = (el) => {
      const text = el.textContent.trim();
      const hasPlus = text.includes('+');
      const numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);

      if (isNaN(numericValue) || numericValue > 9999) return; // Skip year-like numbers (2026)

      const duration = 1200;
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * numericValue);
        el.textContent = current + (hasPlus ? '+' : '');
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(el => counterObserver.observe(el));
  }
});
