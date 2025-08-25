// Portfolio Content Loader - Loads all content from config.js
document.addEventListener('DOMContentLoaded', function() {
    // Load all content from configuration
    loadPortfolioContent();
    
    // Initialize other functionality
    initializePortfolio();
});

// Load all portfolio content from config
function loadPortfolioContent() {
    if (typeof PORTFOLIO_CONFIG === 'undefined') {
        console.error('Portfolio configuration not found!');
        return;
    }

    const config = PORTFOLIO_CONFIG;

    // Load personal information
    loadPersonalInfo(config.personal);
    
    // Load work/projects
    loadWorkSection(config.work);
    
    // Load about/info section
    loadAboutSection(config.about);
    
    // Load skills section
    loadSkillsSection(config.skills);
    
    // Load contact section
    loadContactSection(config.contact, config.social);
    
    // Load footer
    loadFooter(config.personal, config.social);
    
    // Update page title
    document.getElementById('page-title').textContent = `${config.personal.name} - ${config.personal.title}`;
}

// Load personal information
function loadPersonalInfo(personal) {
    document.getElementById('nav-logo').textContent = personal.shortName;
    document.getElementById('hero-title-line1').textContent = personal.title.split(',')[0];
    document.getElementById('hero-title-line2').textContent = personal.title.split(',')[1] || '';
    document.getElementById('hero-location').textContent = personal.location;
    document.getElementById('hero-tagline').textContent = personal.tagline;
}

// Load work section
function loadWorkSection(work) {
    const workGrid = document.getElementById('work-grid');
    workGrid.innerHTML = '';

    work.forEach(project => {
        const workItem = document.createElement('div');
        workItem.className = 'work-item';
        
        workItem.innerHTML = `
            <div class="work-image">
                ${project.image ? 
                    `<img src="${project.image}" alt="${project.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : 
                    ''
                }
                <div class="image-placeholder" style="${project.image ? 'display: none;' : 'display: flex;'}">
                    <i class="${project.icon}"></i>
                </div>
            </div>
            <div class="work-info">
                <h3 class="work-title">${project.title}</h3>
                <p class="work-category">${project.category}</p>
                ${project.description ? `<p class="work-description">${project.description}</p>` : ''}
                ${project.link ? `<a href="${project.link}" class="work-link" target="_blank">View Project</a>` : ''}
            </div>
        `;
        
        workGrid.appendChild(workItem);
    });
}

// Load about section
function loadAboutSection(about) {
    document.getElementById('about-description').textContent = about.description;
    
    const statsContainer = document.getElementById('info-stats');
    statsContainer.innerHTML = '';
    
    about.stats.forEach(stat => {
        const statElement = document.createElement('div');
        statElement.className = 'stat';
        statElement.innerHTML = `
            <span class="stat-number">${stat.number}</span>
            <span class="stat-label">${stat.label}</span>
        `;
        statsContainer.appendChild(statElement);
    });
}

// Load skills section
function loadSkillsSection(skills) {
    const skillsGrid = document.getElementById('skills-grid');
    skillsGrid.innerHTML = '';
    
    Object.entries(skills).forEach(([category, skillList]) => {
        const skillCategory = document.createElement('div');
        skillCategory.className = 'skill-category';
        
        skillCategory.innerHTML = `
            <h3 class="category-title">${category}</h3>
            <div class="skill-items">
                ${skillList.map(skill => `
                    <div class="skill-item">
                        <span>${skill}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        skillsGrid.appendChild(skillCategory);
    });
}

// Load contact section
function loadContactSection(contact, social) {
    document.getElementById('contact-heading').textContent = contact.heading;
    document.getElementById('contact-message').textContent = contact.message;
    
    // Load contact methods
    const contactMethods = document.getElementById('contact-methods');
    contactMethods.innerHTML = '';
    
    // Add email
    if (PORTFOLIO_CONFIG.personal.email) {
        const emailMethod = document.createElement('a');
        emailMethod.href = `mailto:${PORTFOLIO_CONFIG.personal.email}`;
        emailMethod.className = 'contact-method';
        emailMethod.innerHTML = `
            <i class="fas fa-envelope"></i>
            <span>${PORTFOLIO_CONFIG.personal.email}</span>
        `;
        contactMethods.appendChild(emailMethod);
    }
    
    // Add social links
    Object.entries(social).forEach(([platform, url]) => {
        if (url && url !== 'https://example.com/yourusername') {
            const socialMethod = document.createElement('a');
            socialMethod.href = url;
            socialMethod.className = 'contact-method';
            socialMethod.target = '_blank';
            
            const iconClass = getSocialIcon(platform);
            const displayName = getSocialDisplayName(platform);
            
            socialMethod.innerHTML = `
                <i class="${iconClass}"></i>
                <span>${displayName}</span>
            `;
            contactMethods.appendChild(socialMethod);
        }
    });
    
    // Load contact form
    if (contact.formEnabled) {
        loadContactForm();
    }
}

// Load contact form
function loadContactForm() {
    const contactForm = document.getElementById('contact-form');
    contactForm.innerHTML = `
        <form id="portfolio-contact-form">
            <div class="form-group">
                <input type="text" id="name" name="name" placeholder="Your Name" required>
            </div>
            <div class="form-group">
                <input type="email" id="email" name="email" placeholder="Your Email" required>
            </div>
            <div class="form-group">
                <textarea id="message" name="message" placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Send Message</button>
        </form>
    `;
    
    // Add form submission handler
    document.getElementById('portfolio-contact-form').addEventListener('submit', handleContactForm);
}

// Load footer
function loadFooter(personal, social) {
    document.getElementById('footer-location').textContent = `${personal.location} | <span id="footer-time">${getCurrentTime()}</span>`;
    document.getElementById('footer-copyright').textContent = `© ${new Date().getFullYear()} ${personal.name}`;
    
    const footerLinks = document.getElementById('footer-links');
    footerLinks.innerHTML = '';
    
    Object.entries(social).forEach(([platform, url]) => {
        if (url && url !== 'https://example.com/yourusername') {
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.textContent = getSocialDisplayName(platform);
            footerLinks.appendChild(link);
        }
    });
}

// Helper functions
function getSocialIcon(platform) {
    const icons = {
        github: 'fab fa-github',
        linkedin: 'fab fa-linkedin',
        instagram: 'fab fa-instagram',
        twitter: 'fab fa-twitter',
        behance: 'fab fa-behance'
    };
    return icons[platform] || 'fas fa-link';
}

function getSocialDisplayName(platform) {
    const names = {
        github: 'GitHub',
        linkedin: 'LinkedIn',
        instagram: 'Instagram',
        twitter: 'Twitter',
        behance: 'Behance'
    };
    return names[platform] || platform;
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} WAT`;
}

// Initialize portfolio functionality
function initializePortfolio() {
    // Update time every minute
    setInterval(() => {
        const currentTimeElement = document.getElementById('current-time');
        const footerTimeElement = document.getElementById('footer-time');
        if (currentTimeElement) currentTimeElement.textContent = getCurrentTime();
        if (footerTimeElement) footerTimeElement.textContent = getCurrentTime();
    }, 60000);
    
    // Initialize mobile navigation
    initializeMobileNav();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize animations
    initializeAnimations();
}

// Mobile Navigation Toggle
function initializeMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize animations
function initializeAnimations() {
    // Navbar background change on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.work-item, .skill-category, .stat').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Contact form handler
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Here you would typically send the data to your backend
    // For now, we'll just show a success message
    alert('Thank you for your message! I\'ll get back to you soon.');
    e.target.reset();
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
