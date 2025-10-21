(function() {
  const supportsWebGL = (() => {
    try {
      const canvas = document.createElement('canvas');
      return !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  })();

  if (!supportsWebGL) {
    document.body.classList.add('no-webgl');
    return;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  Promise.all([
    loadScript('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js')
  ]).then(() => Promise.all([
    loadScript('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.js'),
    loadScript('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/loaders/GLTFLoader.js'),
    loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.4/dist/gsap.min.js'),
    loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.4/dist/ScrollTrigger.min.js')
  ])).then(initialize3D).catch(() => {
    console.warn('3D libraries could not be loaded.');
  });

  function initialize3D() {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    document.querySelectorAll('[data-background-canvas]').forEach(canvasContainer => {
      createGradientBackground(canvasContainer);
    });

    document.querySelectorAll('[data-hero-model]').forEach(el => {
      const model = el.dataset.model;
      loadModel(el, model);
    });
  }

  function createGradientBackground(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(2, 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x2d6cdf,
      metalness: 0.4,
      roughness: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const light = new THREE.PointLight(0xffffff, 1.2);
    light.position.set(5, 5, 5);
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.002;
      mesh.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    });
  }

  function loadModel(container, modelPath) {
    if (!window.THREE) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 4);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = THREE.OrbitControls ? new THREE.OrbitControls(camera, renderer.domElement) : null;
    if (controls) {
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.2;
    }

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7.5);
    scene.add(dir);

    const loader = THREE.GLTFLoader ? new THREE.GLTFLoader() : null;
    if (loader && modelPath) {
      loader.load(`/files/${modelPath}`, (gltf) => {
        const model = gltf.scene;
        model.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        model.scale.set(1.5, 1.5, 1.5);
        scene.add(model);
      }, undefined, () => {
        fallbackGeometry(scene);
      });
    } else {
      fallbackGeometry(scene);
    }

    function fallbackGeometry(sceneRef) {
      const geo = new THREE.TorusKnotGeometry(1, 0.3, 128, 16);
      const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3 });
      sceneRef.add(new THREE.Mesh(geo, mat));
    }

    const animate = () => {
      requestAnimationFrame(animate);
      if (controls) controls.update();
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    });
  }
})();
