
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 30;

    function animate() {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.005;
      torus.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();

    // 3D card reveal on scroll
    const cards = document.querySelectorAll('.card');
    window.addEventListener('scroll', () => {
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          card.style.transform = 'translateY(0) scale(1)';
          card.style.opacity = '1';
        }
      });
    });

    // Responsive resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let index = 0;
    const slides = document.querySelectorAll('.gallery-image');

    function showImage(n) {
      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === n) slide.classList.add('active');
      });
    }

    function nextImage() {
      index = (index + 1) % slides.length;
      showImage(index);
    }

    function prevImage() {
      index = (index - 1 + slides.length) % slides.length;
      showImage(index);
    }

    setInterval(nextImage, 3000);