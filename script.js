// Initialize AOS for scroll animations
AOS.init({ 
    duration: 1000, 
    once: true,
    offset: 100 
});

// Background animation with Three.js
function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    // Vérifier si WebGL est supporté
    try {
        const renderer = new THREE.WebGLRenderer({ 
            canvas, 
            alpha: true,
            antialias: true 
        });
        
        if (!renderer) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500; // Réduit pour meilleures performances
        
        const posArray = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i += 3) {
            posArray[i] = (Math.random() - 0.5) * 10; // x
            posArray[i + 1] = (Math.random() - 0.5) * 10; // y
            posArray[i + 2] = (Math.random() - 0.5) * 10; // z
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        // Material for particles
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xffffff,
            transparent: true,
            opacity: 0.6
        });
        
        // Create points system
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        camera.position.z = 5;
        
        // Mouse movement effect
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            particlesMesh.rotation.x += 0.001;
            particlesMesh.rotation.y += 0.001;
            
            // Add subtle movement based on mouse position
            particlesMesh.rotation.x += mouseY * 0.0005;
            particlesMesh.rotation.y += mouseX * 0.0005;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
    } catch (error) {
        console.warn("Three.js n'a pas pu s'initialiser:", error);
        canvas.style.display = 'none';
    }
}

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser l'animation de fond
    initBackground();
    
    // Script pour les statistiques
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                animateValue(target, 0, count, 2000);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
    
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Afficher la valeur actuelle
            const currentValue = Math.floor(progress * (end - start) + start);
            const countSpan = obj.querySelector('.count');
            if (countSpan) {
                countSpan.textContent = currentValue;
            } else {
                obj.querySelector('.stat-number').textContent = currentValue;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Animation terminée
                const plusSpan = obj.querySelector('.plus');
                if (countSpan && plusSpan) {
                    countSpan.textContent = end;
                }
            }
        };
        window.requestAnimationFrame(step);
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileMenu) return;

  // Toggle menu
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  // Fermer le menu quand on clique sur un lien
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  // Fermer en cliquant à l'extérieur
  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('active') &&
      !hamburger.contains(e.target) &&
      !mobileMenu.contains(e.target)
    ) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });

  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });
});
