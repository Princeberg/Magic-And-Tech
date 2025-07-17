 // Particules technologiques
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: document.getElementById('bg'),
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Création des particules
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1500;
    
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
      colorArray[i] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Ajout de connexions entre particules
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x3a7bd5,
      transparent: true,
      opacity: 0.3
    });

    const linePositions = new Float32Array(particleCount * 3 * 2);
    for(let i = 0; i < particleCount; i++) {
      if(i % 10 === 0) { // Connecter seulement certaines particules
        const i3 = i * 3;
        const j = Math.floor(Math.random() * particleCount);
        const j3 = j * 3;
        
        linePositions[i3 * 2] = posArray[i3];
        linePositions[i3 * 2 + 1] = posArray[i3 + 1];
        linePositions[i3 * 2 + 2] = posArray[i3 + 2];
        
        linePositions[i3 * 2 + 3] = posArray[j3];
        linePositions[i3 * 2 + 4] = posArray[j3 + 1];
        linePositions[i3 * 2 + 5] = posArray[j3 + 2];
      }
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 5;

    // Animation des particules
    function animate() {
      requestAnimationFrame(animate);
      
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.001;
      
      // Animation des lignes
      const positions = lineGeometry.attributes.position.array;
      for(let i = 0; i < positions.length; i += 6) {
        positions[i] += (Math.random() - 0.5) * 0.01;
        positions[i+1] += (Math.random() - 0.5) * 0.01;
        positions[i+2] += (Math.random() - 0.5) * 0.01;
      }
      lineGeometry.attributes.position.needsUpdate = true;
      
      renderer.render(scene, camera);
    }
    animate();

    // Effets de scroll
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      particlesMesh.rotation.y = scrollY * 0.0005;
      
      // Header scroll effect
      if(scrollY > 50) {
        document.querySelector('header').classList.add('scrolled');
      } else {
        document.querySelector('header').classList.remove('scrolled');
      }
    });

    // Responsive
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Gallery
    let index = 0;
    const slides = document.querySelectorAll('.gallery-image');
    const totalSlides = slides.length;

    function showImage(n) {
      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === n) slide.classList.add('active');
      });
      
      // Mise à jour de l'indicateur
      document.querySelector('.gallery-indicator').textContent = `${n+1}/${totalSlides}`;
    }

    function nextImage() {
      index = (index + 1) % totalSlides;
      showImage(index);
    }

    function prevImage() {
      index = (index - 1 + totalSlides) % totalSlides;
      showImage(index);
    }

    // Auto-rotation de la galerie
    let galleryInterval = setInterval(nextImage, 5000);

    // Pause au survol
    document.querySelector('.gallery-container').addEventListener('mouseenter', () => {
      clearInterval(galleryInterval);
    });

    document.querySelector('.gallery-container').addEventListener('mouseleave', () => {
      galleryInterval = setInterval(nextImage, 5000);
    });

    // Initialisation
    showImage(0);