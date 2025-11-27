// hiệu ứng 3D model xoay trục
const script = document.createElement("script");
script.src =
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
script.onload = function () {
  const loaderScript = document.createElement("script");
  loaderScript.src =
    "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js";
  loaderScript.onload = initScene;
  document.head.appendChild(loaderScript);
};
document.head.appendChild(script);

function initScene() {
  const THREE = window.THREE;

  // Khởi tạo scene, camera, renderer
  const container = document.getElementById("model3d");
  const scene = new THREE.Scene();
  // Bỏ background

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true, // Cho phép nền trong suốt
  });
  renderer.setClearColor(0x000000, 0); // Đặt nền trong suốt
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Thêm ánh sáng
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  //lưu model
  let model;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  // Load GLB model
  const loader = new THREE.GLTFLoader();
  loader.load(
    "/client/assets/img/model3D/tshirts.glb", // Thay đổi đường dẫn này
    function (gltf) {
      // xoay quanh tâm
      const pivot = new THREE.Group();
      model = pivot;

      const loadedModel = gltf.scene;

      const box = new THREE.Box3().setFromObject(loadedModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = (2 / maxDim) * 2;

      loadedModel.scale.setScalar(scale);
      loadedModel.position.sub(center.multiplyScalar(scale));

      // Thêm model vào pivot để xoay
      pivot.add(loadedModel);
      scene.add(pivot);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error("Error loading model:", error);
    }
  );

  // Xử lý sự kiện chuột
  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  container.addEventListener("mousemove", (e) => {
    if (isDragging && model) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      model.rotation.y += deltaX * 0.01;
      model.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  });

  container.addEventListener("mouseup", () => {
    isDragging = false;
  });

  container.addEventListener("mouseleave", () => {
    isDragging = false;
  });

  // Xử lý sự kiện touch cho mobile
  container.addEventListener("touchstart", (e) => {
    isDragging = true;
    previousMousePosition = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  });

  container.addEventListener("touchmove", (e) => {
    if (isDragging && model) {
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      model.rotation.y += deltaX * 0.01;
      model.rotation.x += deltaY * 0.01;

      previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  });

  container.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Xử lý resize
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}

// hiệu ứng nền particles.js
document.addEventListener("DOMContentLoaded", function () {
  particlesJS("particles-js", {
    particles: {
      number: { value: 100 },
      color: { value: "#fff" },
      shape: { type: "circle" },
      opacity: {
        value: 1,
        random: true,
      },
      size: {
        value: 2,
        random: true,
      },
      line_linked: {
        opacity: 0,
      },
      move: {
        enable: true,
        speed: 9,
      },
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { particles_nb: 4 },
      },
    },
    retina_detect: true,
  });
});

// hiệu ứng slider cho T-Shirt và Graphic Tees
document.addEventListener("DOMContentLoaded", function () {
  var splide = new Splide("#spildeTShirt", {
    perPage: 5,
    rewind: true,
    perMove: 1,
    type: "loop",
    wheel: true,
    breakpoints: {
      1004: {
        perPage: 4,
      },
      804: {
        perPage: 3,
      },
      604: {
        perPage: 2,
      },
      404: {
        perPage: 1,
      },
    },
  });
  splide.mount();
});

document.addEventListener("DOMContentLoaded", function () {
  var splide = new Splide("#spildeGraphicTees", {
    perPage: 5,
    rewind: true,
    perMove: 1,
    type: "loop",
    wheel: true,
    breakpoints: {
      1004: {
        perPage: 4,
      },
      804: {
        perPage: 3,
      },
      604: {
        perPage: 2,
      },
      404: {
        perPage: 1,
      },
    },
  });
  splide.mount();
});

// lấy thông tin card product
