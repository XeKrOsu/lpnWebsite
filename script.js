window.addEventListener('scroll', function() {
    const header = document.querySelector('.sticky-header');
    if (window.scrollY === 0) {
        header.classList.add('transparent');
    } else {
        header.classList.remove('transparent');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // Enveloppez tout le contenu principal dans une div
    const mainSections = document.querySelectorAll('section:not(.page-section)');
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';
    mainSections[0].parentNode.insertBefore(mainContent, mainSections[0]);
    mainSections.forEach(section => mainContent.appendChild(section));

    // Gestionnaire de navigation modifié
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Afficher l'écran de chargement
            const loadingScreen = document.querySelector('.loading-screen');
            loadingScreen.classList.add('active');

            // Attendre la fin de l'animation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Cacher tout le contenu
            document.querySelector('.main-content').classList.add('hidden');
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.add('hidden');
            });

            // Attendre un peu pour l'effet
            await new Promise(resolve => setTimeout(resolve, 500));

            // Afficher la section ciblée ou le contenu principal
            if (targetId) {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.remove('hidden');
                }
            } else {
                document.querySelector('.main-content').classList.remove('hidden');
            }

            // Cacher l'écran de chargement
            loadingScreen.classList.remove('active');

            // Mettre à jour l'URL
            history.pushState({}, '', link.getAttribute('href'));
        });
    });

    // Gestion du bouton retour du navigateur
    window.addEventListener('popstate', () => {
        const hash = window.location.hash;
        if (!hash) {
            document.querySelector('.main-content').classList.remove('hidden');
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.add('hidden');
            });
        } else {
            document.querySelector('.main-content').classList.add('hidden');
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.add('hidden');
            });
            document.querySelector(hash)?.classList.remove('hidden');
        }
    });

    // Modal pour les images
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeModal = document.querySelector('.close-modal');

    // Ouvrir la modal au clic sur une image
    document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalImg.src = img.src;
        });
    });

    // Fermer la modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fermer la modal en cliquant en dehors de l'image
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Carrousel des employés
    const carousel = document.querySelector('.employee-cards');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cardWidth = 320; // Largeur de la carte + gap

    // Détection des couleurs dominantes des images
    document.querySelectorAll('.employee-card').forEach(card => {
        const img = card.querySelector('.employee-img');
        getAverageColor(img).then(color => {
            card.style.background = `linear-gradient(135deg, ${color}, ${adjustColor(color, -20)})`;
        });
    });

    // Navigation du carrousel
    nextBtn?.addEventListener('click', () => {
        carousel.scrollLeft += cardWidth;
    });

    prevBtn?.addEventListener('click', () => {
        carousel.scrollLeft -= cardWidth;
    });

    // Menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Fermer le menu au clic à l'extérieur
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.mobile-menu-btn')) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Fermer le menu au clic sur un lien
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Ajuster la hauteur des iframes vidéo
    function resizeVideoIframes() {
        const videoItems = document.querySelectorAll('.video-item');
        videoItems.forEach(item => {
            const width = item.offsetWidth;
            item.style.height = `${width * 0.5625}px`; // Ratio 16:9
        });
    }

    window.addEventListener('resize', resizeVideoIframes);
    resizeVideoIframes();

    // Gestion du header transparent
    const header = document.querySelector('.sticky-header');
    const threshold = 100; // Distance de défilement avant changement

    function updateHeader() {
        if (window.pageYOffset > threshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Appliquer au chargement
    updateHeader();

    // Écouter le défilement
    window.addEventListener('scroll', updateHeader);
});

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    // Fonction d'easing
    function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 3000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Applique l'easing à la progression
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(target * easedProgress);
            
            stat.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(updateCounter);
    });
}

// Fonction pour obtenir la couleur moyenne d'une image
function getAverageColor(imgElement) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        imgElement.onload = () => {
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;
            context.drawImage(imgElement, 0, 0);
            
            const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
            let r = 0, g = 0, b = 0;
            
            for(let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i+1];
                b += data[i+2];
            }
            
            r = Math.floor(r / (data.length / 4));
            g = Math.floor(g / (data.length / 4));
            b = Math.floor(b / (data.length / 4));
            
            resolve(`rgb(${r},${g},${b})`);
        };
    });
}

// Fonction pour ajuster la luminosité d'une couleur
function adjustColor(color, amount) {
    const rgb = color.match(/\d+/g).map(Number);
    return `rgb(${rgb.map(c => Math.max(0, Math.min(255, c + amount))).join(',')})`;
}
