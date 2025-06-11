document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isExpanded));
      navLinks.classList.toggle('show');
      
      if (navLinks.hasAttribute('hidden')) {
        navLinks.removeAttribute('hidden');
      } else if (!isExpanded && window.innerWidth <= 768) {
        // Only hide on mobile when closing
        navLinks.hidden = true;
      }
    });
  }

  // Close mobile menu when clicking on links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        hamburger.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('show');
        navLinks.hidden = true;
      }
    });
  });

  // Expandable cards
  document.querySelectorAll('.expand-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.competition-card') || btn.closest('.project-card');
      const details = card.querySelector('.competition-details') || card.querySelector('.project-details');
      const isHidden = details.classList.contains('hidden');
      
      details.classList.toggle('hidden', !isHidden);
      btn.textContent = isHidden ? 'Collapse' : 'Expand';
      card.setAttribute('aria-expanded', String(isHidden));
    });
  });

  // Dark mode toggle
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved preference or system preference
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-mode');
    darkModeToggle.setAttribute('aria-pressed', 'true');
    darkModeToggle.textContent = '☀️';
  }

  // Toggle dark mode
  darkModeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    darkModeToggle.setAttribute('aria-pressed', String(isDark));
    darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Watch for system preference changes
  prefersDarkScheme.addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      const newScheme = e.matches ? 'dark' : 'light';
      document.body.classList.toggle('dark-mode', newScheme === 'dark');
      darkModeToggle.setAttribute('aria-pressed', String(e.matches));
      darkModeToggle.textContent = e.matches ? '☀️' : '🌙';
    }
  });

  // Back to Top Button - More reliable version
const backToTopBtn = document.getElementById('back-to-top');

// Show/hide button on scroll

function toggleBackToTop() {
  if (window.pageYOffset > 10) {
    backToTopBtn.classList.add('visible');
  }
}
// Initial check in case page loads scrolled down
toggleBackToTop();

// Listen for scroll events
window.addEventListener('scroll', toggleBackToTop);

// Smooth scroll to top
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});


// Timeline functionality
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineContents = document.querySelectorAll('.timeline-content');
  
  // Create popup and overlay elements
  const popup = document.createElement('div');
  popup.className = 'timeline-popup';
  popup.innerHTML = `
    <div class="popup-content"></div>
    <button class="close-popup" aria-label="Close popup">×</button>
  `;
  document.body.appendChild(popup);

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  // Mouse hover functionality for preview
  timelineItems.forEach(item => {
    const dot = item.querySelector('.timeline-dot');
    const preview = item.querySelector('.timeline-preview');
    
    // Show preview on hover
    item.addEventListener('mouseenter', () => {
      preview.style.opacity = '1';
      preview.style.visibility = 'visible';
    });
    
    // Hide preview when leaving
    item.addEventListener('mouseleave', () => {
      preview.style.opacity = '0';
      preview.style.visibility = 'hidden';
    });
  });

  // Click functionality for popup
  timelineItems.forEach(item => {
    const dot = item.querySelector('.timeline-dot');
    const year = dot.getAttribute('data-year');
    const content = document.querySelector(`.timeline-content[data-year="${year}"]`);

    dot.addEventListener('click', function() {
      // Copy content to popup
      popup.querySelector('.popup-content').innerHTML = content.innerHTML;
      
      // Show popup and overlay
      popup.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close popup
  function closeTimelinePopup() {
    popup.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', closeTimelinePopup);
  popup.querySelector('.close-popup').addEventListener('click', closeTimelinePopup);

  // Close with Escape key
  function handleEscape(e) {
    if (e.key === 'Escape') {
      closeTimelinePopup();
    }
  }
  document.addEventListener('keydown', handleEscape);

// Tech Stack Switcher with Auto-Rotation

  const categories = document.querySelectorAll('.tech-category');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const categoryTitle = document.querySelector('.category-title h3');
  
  const categoryNames = {
    programming: "Programming Languages",
    fullstack: "Full Stack Development",
    cloud: "Cloud & DevOps",
    data: "Data Analytics"
  };
  
  let currentIndex = 0;
  let autoRotateInterval;
  
  function updateCategory(direction = 'next') {
    // Remove active class from current category with exit animation
    const currentActive = document.querySelector('.tech-category.active');
    if (currentActive) {
      currentActive.classList.remove('active');
      currentActive.classList.add(`exit-${direction}`);
    }
    
    // Update current index
    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % categories.length;
    } else {
      currentIndex = (currentIndex - 1 + categories.length) % categories.length;
    }
    
    // Add active class to new category
    setTimeout(() => {
      if (currentActive) currentActive.classList.remove(`exit-${direction}`);
      categories[currentIndex].classList.add('active');
      
      // Update indicators
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
      
      // Update category title with animation
      categoryTitle.style.opacity = '0';
      setTimeout(() => {
        const currentCategory = categories[currentIndex].dataset.category;
        categoryTitle.textContent = categoryNames[currentCategory];
        categoryTitle.style.opacity = '1';
      }, 300);
    }, 50);
  }
  
  function nextCategory() {
    updateCategory('next');
    resetAutoRotate();
  }
  
  function prevCategory() {
    updateCategory('prev');
    resetAutoRotate();
  }
  
  function resetAutoRotate() {
    clearInterval(autoRotateInterval);
    startAutoRotate();
  }
  
  function startAutoRotate() {
    autoRotateInterval = setInterval(nextCategory, 3000);
  }
  
  // Button events
  nextBtn.addEventListener('click', nextCategory);
  prevBtn.addEventListener('click', prevCategory);
  
  // Indicator events
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      if (index !== currentIndex) {
        const direction = index > currentIndex ? 'next' : 'prev';
        currentIndex = index;
        updateCategory(direction);
        resetAutoRotate();
      }
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextCategory();
    if (e.key === 'ArrowLeft') prevCategory();
  });
  
  // Start auto rotation
  startAutoRotate();
  
  // Pause on hover
  const techContainer = document.querySelector('.tech-container');
  techContainer.addEventListener('mouseenter', () => {
    clearInterval(autoRotateInterval);
  });
  
  techContainer.addEventListener('mouseleave', () => {
    startAutoRotate();
  });





  // Initialize gallery scrolling
const galleries = document.querySelectorAll('.competitions-gallery');

galleries.forEach(gallery => {
  const track = gallery.querySelector('.gallery-track');
  const container = gallery.querySelector('.gallery-container');
  const scrollLeftBtn = gallery.querySelector('.scroll-btn.left');
  const scrollRightBtn = gallery.querySelector('.scroll-btn.right');
  
  // Set initial button visibility
  updateButtonVisibility();
  
  // Scroll left button click handler
  scrollLeftBtn.addEventListener('click', () => {
    container.scrollBy({
      left: -getScrollAmount(),
      behavior: 'smooth'
    });
  });
  
  // Scroll right button click handler
  scrollRightBtn.addEventListener('click', () => {
    container.scrollBy({
      left: getScrollAmount(),
      behavior: 'smooth'
    });
  });
  
  // Update button visibility on scroll
  container.addEventListener('scroll', updateButtonVisibility);
  
  // Update button visibility on resize
  window.addEventListener('resize', updateButtonVisibility);
  
  // Calculate scroll amount based on card width
  function getScrollAmount() {
    const card = track.querySelector('.competition-card');
    if (!card) return 400; // Default fallback
    return card.offsetWidth + parseInt(getComputedStyle(track).gap.replace('px', '')) || 32;
  }
  
  // Show/hide buttons based on scroll position
  function updateButtonVisibility() {
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    // Left button visibility
    if (scrollLeft <= 10) {
      scrollLeftBtn.style.opacity = '0';
      scrollLeftBtn.style.pointerEvents = 'none';
    } else {
      scrollLeftBtn.style.opacity = '1';
      scrollLeftBtn.style.pointerEvents = 'auto';
    }
    
    // Right button visibility
    if (scrollLeft >= maxScroll - 10) {
      scrollRightBtn.style.opacity = '0';
      scrollRightBtn.style.pointerEvents = 'none';
    } else {
      scrollRightBtn.style.opacity = '1';
      scrollRightBtn.style.pointerEvents = 'auto';
    }
  }
});

  


// Tech Stack Switcher
  const techCategories = document.querySelectorAll('.tech-category');
  if (techCategories.length) {
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev') || document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.next') || document.querySelector('.nav-arrow.next');
    const categoryTitle = document.querySelector('.category-title h3');
    const techContainer = document.querySelector('.tech-container');
    
    const categoryNames = {
      programming: "Programming Languages",
      fullstack: "Full Stack Development",
      cloud: "Cloud & DevOps",
      data: "Data Analytics"
    };
    
    let currentIndex = 0;
    let autoRotateInterval;
    
    function updateCategory(direction = 'next') {
      const currentActive = document.querySelector('.tech-category.active');
      if (currentActive) {
        currentActive.classList.remove('active');
        currentActive.classList.add(`exit-${direction}`);
      }
      
      if (direction === 'next') {
        currentIndex = (currentIndex + 1) % techCategories.length;
      } else {
        currentIndex = (currentIndex - 1 + techCategories.length) % techCategories.length;
      }
      
      setTimeout(() => {
        if (currentActive) currentActive.classList.remove(`exit-${direction}`);
        techCategories[currentIndex].classList.add('active');
        
        indicators.forEach((indicator, index) => {
          indicator.classList.toggle('active', index === currentIndex);
        });
        
        if (categoryTitle) {
          categoryTitle.style.opacity = '0';
          setTimeout(() => {
            const currentCategory = techCategories[currentIndex].dataset.category;
            categoryTitle.textContent = categoryNames[currentCategory] || currentCategory;
            categoryTitle.style.opacity = '1';
          }, 300);
        }
      }, 50);
    }
    
    function startAutoRotate() {
      autoRotateInterval = setInterval(() => updateCategory('next'), 5000);
    }
    
    function resetAutoRotate() {
      clearInterval(autoRotateInterval);
      startAutoRotate();
    }
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
      updateCategory('next');
      resetAutoRotate();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
      updateCategory('prev');
      resetAutoRotate();
    });
    
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        if (index !== currentIndex) {
          const direction = index > currentIndex ? 'next' : 'prev';
          currentIndex = index;
          updateCategory(direction);
          resetAutoRotate();
        }
      });
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        updateCategory('next');
        resetAutoRotate();
      }
      if (e.key === 'ArrowLeft') {
        updateCategory('prev');
        resetAutoRotate();
      }
    });
    
    if (techContainer) {
      techContainer.addEventListener('mouseenter', () => {
        clearInterval(autoRotateInterval);
      });
      
      techContainer.addEventListener('mouseleave', () => {
        startAutoRotate();
      });
    }
    
    // Initialize
    startAutoRotate();
  }
  

});


//project.html
document.addEventListener('DOMContentLoaded', function() {
  // Project Filtering Functionality (Updated for multiple categories)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Update active filter button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const filterValue = this.dataset.filter;
        
        // Filter projects (supports space-separated categories)
        projectCards.forEach(card => {
          if (filterValue === 'all') {
            card.style.display = 'flex';
          } else {
            const categories = card.dataset.category.split(' ');
            card.style.display = categories.includes(filterValue) ? 'flex' : 'none';
          }
        });
      });
    });
  }

  // Expand/Collapse Project Details (unchanged)
  const expandButtons = document.querySelectorAll('.expand-btn');
  
  expandButtons.forEach(button => {
    button.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const detailsId = this.getAttribute('aria-controls');
      const details = document.getElementById(detailsId);
      
      if (!details) return;
      
      // Toggle visibility
      this.setAttribute('aria-expanded', String(!isExpanded));
      details.hidden = isExpanded;
      
      // Rotate chevron icon if present
      const icon = this.querySelector('i');
      if (icon) {
        icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
      }
      
      // Smooth scroll to show details
      if (!isExpanded) {
        setTimeout(() => {
          details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  });

  // Make project cards keyboard accessible (unchanged)
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const button = this.querySelector('.expand-btn');
        if (button) {
          button.click();
          e.preventDefault();
        }
      }
    });
  });
});

// Slideshow functionality
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.gallery-slide');
  const prevBtn = document.querySelector('.scroll-btn.left');
  const nextBtn = document.querySelector('.scroll-btn.right');
  let currentSlide = 0;
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }
  
  // Button event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Auto-advance slides (optional)
  let slideInterval = setInterval(nextSlide, 5000);
  
  // Pause on hover
  const slideshow = document.querySelector('.gallery-slideshow');
  slideshow.addEventListener('mouseenter', () => clearInterval(slideInterval));
  slideshow.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
  });
});


// Create interactive background bubbles
  document.addEventListener('DOMContentLoaded', function() {
    const bubblesContainer = document.getElementById('bubbles-container');
    const heroSection = document.getElementById('hero-section');
    
    // Create bubbles
    for (let i = 0; i < 15; i++) {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
      
      // Random size between 20px and 100px
      const size = Math.random() * 80 + 20;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      
      // Random position
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.top = `${Math.random() * 100}%`;
      
      // Random animation duration and delay
      bubble.style.animationDuration = `${Math.random() * 20 + 10}s`;
      bubble.style.animationDelay = `${Math.random() * 5}s`;
      
      bubblesContainer.appendChild(bubble);
    }
    
    // Make bubbles interactive
    bubblesContainer.addEventListener('mousemove', (e) => {
      const bubbles = document.querySelectorAll('.bubble');
      bubbles.forEach(bubble => {
        const rect = bubble.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const distance = Math.sqrt(x * x + y * y);
        
        if (distance < 100) {
          bubble.style.transform = `translate(${x/10}px, ${y/10}px)`;
        }
      });
    });
    
    // Collapse hero section on scroll
    const scrollPrompt = document.getElementById('scroll-prompt');
    scrollPrompt.addEventListener('click', () => {
      window.scrollTo({
        top: heroSection.offsetHeight - 80,
        behavior: 'smooth'
      });
    });
    
    let lastScrollPosition = 0;
    window.addEventListener('scroll', () => {
      const currentScrollPosition = window.pageYOffset;
      
      if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 100) {
        // Scrolling down
        heroSection.classList.add('collapsed');
      } else if (currentScrollPosition < lastScrollPosition && currentScrollPosition < 50) {
        // Scrolling up near top
        heroSection.classList.remove('collapsed');
      }
      
      lastScrollPosition = currentScrollPosition;
    });
    
    // Faster Role Changer
    const roles = ["AI & Machine Learning", "Data Analyst", "Web Developer", "Cloud Engineer"];
    const roleElement = document.querySelector('.current-role');
    let currentRole = 0;
    
    function changeRole() {
      currentRole = (currentRole + 1) % roles.length;
      roleElement.style.opacity = 0;
      
      setTimeout(() => {
        roleElement.textContent = roles[currentRole];
        roleElement.style.opacity = 1;
      }, 300);
    }
    
    setInterval(changeRole, 2000);
  });

  


