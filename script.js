 // Initialize AOS for scroll animations
    AOS.init({ 
      duration: 1000, 
      once: true,
      offset: 100 
    });

    // Dark mode toggle functionality
    const darkToggle = document.getElementById("darkToggle");
    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      darkToggle.innerHTML = document.body.classList.contains("dark-mode")
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
        
      // Save user preference
      localStorage.setItem('darkMode', document.body.classList.contains("dark-mode"));
    });

    // Check dark mode preference on load
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
      darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Background animation with Three.js
    function initBackground() {
      const canvas = document.getElementById('bg-canvas');
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Create particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 1000;
      
      const posArray = new Float32Array(particlesCount * 3);
      const colorArray = new Float32Array(particlesCount * 3);
      
      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
        colorArray[i] = Math.random();
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
      
      // Material for particles
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
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
        particlesMesh.rotation.x += mouseY * 0.0001;
        particlesMesh.rotation.y += mouseX * 0.0001;
        
        renderer.render(scene, camera);
      }
      
      animate();
      
      // Handle window resize
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }
    
    // Initialize background animation
    initBackground();