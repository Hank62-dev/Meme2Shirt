// api.js

// --- PHẦN 1: HIỆU ỨNG 3D (GIỮ NGUYÊN) ---
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
  const container = document.getElementById("model3d");
  if (!container) return; // Kiểm tra tồn tại để tránh lỗi console

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  let model;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  const loader = new THREE.GLTFLoader();
  loader.load(
    "../../assets/img/model3D/tshirts.glb",
    function (gltf) {
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
      pivot.add(loadedModel);
      scene.add(pivot);
    },
    undefined,
    function (error) {
      console.error("Error loading model:", error);
    }
  );

  // Mouse & Touch events (Giữ nguyên logic của bạn)
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

  // Touch
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

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}

// --- PHẦN 2: PARTICLES (GIỮ NGUYÊN) ---
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 100 },
        color: { value: "#fff" },
        shape: { type: "circle" },
        opacity: { value: 1, random: true },
        size: { value: 2, random: true },
        line_linked: { opacity: 0 },
        move: { enable: true, speed: 9 },
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
  }
});

// --- PHẦN 3: XỬ LÝ DỮ LIỆU SẢN PHẨM & SPLIDER ---

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Hàm tạo HTML thẻ Card
function createCardHTML(product, labelType) {
  const oldPriceShow = product.oldPrice ? formatCurrency(product.oldPrice) : "";
  const newPriceShow = product.newPrice
    ? formatCurrency(product.newPrice)
    : "Liên hệ";

  // SỬA: Đường dẫn href trỏ đúng đến page_optionDesign/option.html
  return `
        <li class="splide__slide" id="${product.idProduct}">
          <div class="card">
            <div class="card-img">
              <img class="imageURL" src="${product.imageURL}" alt="${product.nameProduct}" />
            </div>
            <div class="card-infor">
              <div class="card-detail">
                <p class="typeClothes" style="color: #116396; font-size: 2rem; font-weight: bold;">
                  ${labelType}
                </p>
                <p class="nameProduct" style="font-size: 1.5rem; font-weight: 500">
                  ${product.nameProduct}
                </p>
                <p class="oldPrice" style="font-size: 1.5rem; font-weight: 500; text-decoration: line-through; color: gray;">
                  ${oldPriceShow}
                </p>
                <p class="newPrice" style="font-size: 1.8rem; font-weight: 500">
                  ${newPriceShow}
                </p>
              </div>
              <div class="card-control">
                <a href="../page_optionDesign/option.html?id=${product.idProduct}">
                    <button class="btnDesign">DESIGN</button>
                </a>
              </div>
            </div>
          </div>
        </li>
    `;
}

async function loadAllProductsAndSplit() {
  const tShirtContainer = document.querySelector("#splideTShirt .splide__list");
  const poloContainer = document.querySelector(
    "#splidePoloShirt .splide__list"
  );

  // Nếu trang hiện tại không có slider nào thì thoát luôn
  if (!tShirtContainer && !poloContainer) return;

  try {
    // 1. Gọi API lấy TOÀN BỘ sản phẩm
    // SỬA: Dùng đường dẫn tương đối, không fix cứng localhost
    const response = await fetch("/api/products");
    const products = await response.json();

    let tShirtHTML = "";
    let poloHTML = "";

    // 2. DUYỆT VÀ PHÂN LOẠI
    products.forEach((product) => {
      const imgLink = product.imageURL ? product.imageURL.toLowerCase() : "";

      if (imgLink.includes("poloshirt") || imgLink.includes("polo")) {
        poloHTML += createCardHTML(product, "Polo Shirt");
      } else {
        // Mặc định còn lại là T-Shirt
        tShirtHTML += createCardHTML(product, "T - Shirt");
      }
    });

    // 3. Đẩy HTML vào container & Khởi tạo Slider
    const splideConfig = {
      perPage: 5,
      rewind: true,
      perMove: 1,
      type: "loop",
      wheel: true,
      breakpoints: {
        1004: { perPage: 4 },
        804: { perPage: 3 },
        604: { perPage: 2 },
        404: { perPage: 1 },
      },
    };

    if (tShirtContainer) {
      tShirtContainer.innerHTML = tShirtHTML;
      // Chỉ mount nếu có item
      if (tShirtHTML) new Splide("#splideTShirt", splideConfig).mount();
    }

    if (poloContainer) {
      poloContainer.innerHTML = poloHTML;
      if (poloHTML) new Splide("#splidePoloShirt", splideConfig).mount();
    }
  } catch (error) {
    console.error("Lỗi tải sản phẩm:", error);
  }
}

// Chạy hàm khi DOM load xong
document.addEventListener("DOMContentLoaded", loadAllProductsAndSplit);
