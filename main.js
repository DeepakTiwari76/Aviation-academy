document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const header = document.getElementById('main-header');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.menu-overlay');

    function toggleMenu() {
        if (navMenu) navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-active');
        if (overlay) overlay.classList.toggle('active');
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Sticky header shadow & transparency on scroll
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
            }
        }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Stats Counter Animation
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    
                    let count = 0;
                    const updateCount = () => {
                        count += increment;
                        if (count < target) {
                            counter.innerText = Math.ceil(count);
                            setTimeout(updateCount, 16);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats-container');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // FAQ Accordion Logic
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const accordionHeader = item.querySelector('.accordion-header');
        if (accordionHeader) {
            accordionHeader.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all items
                accordionItems.forEach(i => {
                    i.classList.remove('active');
                    const icon = i.querySelector('.icon i');
                    if (icon) icon.classList.replace('fa-minus', 'fa-plus');
                });

                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                    const icon = accordionHeader.querySelector('.icon i');
                    if (icon) icon.classList.replace('fa-plus', 'fa-minus');
                }
            });
        }
    });

    // Gallery Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => item.style.opacity = '1', 10);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                });
            });
        });
    }

    // Generic Form Submission Switch
    const formsToHandle = [
        { id: 'contact-page-form', successId: 'form-success' },
        { id: 'home-enquiry-form', successId: 'home-form-success' }
    ];

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyjxC42M6CUMx636gnHG-MFM5DSiIpjfyhy5NDZe9BQOO8fkvmGcihyF3-_7Z3T2dwJ/exec';

    formsToHandle.forEach(formConfig => {
        const form = document.getElementById(formConfig.id);
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const successMsg = document.getElementById(formConfig.successId);

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Show loading state
                const originalText = submitBtn.innerText;
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerText = 'Sending...';
                }

                // Prepare form data for GAS (as URLSearchParams)
                const formData = new FormData(form);
                
                // Send data
                fetch(scriptURL, { 
                    method: 'POST', 
                    mode: 'no-cors', 
                    body: new URLSearchParams(formData)
                })
                .then(() => {
                    console.log(`Success! (Opaque response from GAS for ${formConfig.id})`);
                    
                    // Show success message
                    if (successMsg) {
                        successMsg.style.display = 'block';
                        successMsg.innerText = 'Thank you! Your inquiry has been submitted successfully.';
                        successMsg.style.color = '#28a745';
                    }
                    
                    // Reset form and UI
                    form.reset();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalText;
                    }
                    
                    // Hide message after 10 seconds
                    setTimeout(() => {
                        if (successMsg) successMsg.style.display = 'none';
                    }, 10000);
                })
                .catch(error => {
                    console.error('Submission Error!', error.message);
                    if (successMsg) {
                        successMsg.style.display = 'block';
                        successMsg.innerText = 'Something went wrong. Please try again.';
                        successMsg.style.color = '#dc3545';
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalText;
                    }
                });
            });
        }
    });
});
