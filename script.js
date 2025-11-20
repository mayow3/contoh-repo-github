// =============================================
// HAMBURGER MENU FUNCTIONALITY - FIXED
// =============================================
const navLinks = document.getElementById("navLinks");
const showMenu = document.getElementById("showMenu");
const closeMenu = document.getElementById("closeMenu");

// Smooth scroll function
function smoothScrollTo(target) {
  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Show Menu
showMenu.addEventListener("click", () => {
  navLinks.classList.add("active");
  document.body.style.overflow = "hidden";
});

// Hide Menu
closeMenu.addEventListener("click", () => {
  navLinks.classList.remove("active");
  document.body.style.overflow = "auto";
});

// Close menu when clicking on a link
const navItems = document.querySelectorAll(".nav-links ul li a");
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("active");
    document.body.style.overflow = "auto";
  });
});

// Close menu when clicking outside
document.addEventListener("click", (event) => {
  const isClickInsideNav = navLinks.contains(event.target);
  const isClickOnMenuIcon = showMenu.contains(event.target);

  if (
    !isClickInsideNav &&
    !isClickOnMenuIcon &&
    navLinks.classList.contains("active")
  ) {
    navLinks.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Close menu on escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks.classList.contains("active")) {
    navLinks.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    navLinks.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Smooth scroll for anchor links - FIXED VERSION
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    if (this.id === "showMenu" || this.id === "closeMenu") return;

    e.preventDefault();
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);

    if (target) {
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        document.body.style.overflow = "auto";
      }

      // Use our custom smooth scroll function
      smoothScrollTo(target);
    }
  });
});

// Prevent horizontal scroll on wheel
document.addEventListener(
  "wheel",
  (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
    }
  },
  { passive: false }
);

// =============================================
// SLIDESHOW 3D SYSTEM UNTUK PETA - FIXED
// =============================================

let currentMapSlide = 0;
const totalMapSlides = 4;
let mapSlideshowInterval;

// Inisialisasi slideshow peta
function initMapSlideshow() {
  // Set event listeners untuk tabs
  document.querySelectorAll(".map-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      const mapType = this.getAttribute("data-map");
      showMapSlide(getSlideIndexByType(mapType));
    });
  });

  // Set event listeners untuk dots
  document.querySelectorAll(".map-dot").forEach((dot) => {
    dot.addEventListener("click", function () {
      const slideIndex = parseInt(this.getAttribute("data-slide"));
      showMapSlide(slideIndex);
    });
  });

  // Auto slideshow
  startMapSlideshow();

  // Pause slideshow on hover
  const slideshowContainer = document.querySelector(".map-slideshow-container");
  if (slideshowContainer) {
    slideshowContainer.addEventListener("mouseenter", pauseMapSlideshow);
    slideshowContainer.addEventListener("mouseleave", startMapSlideshow);
  }

  // Initialize maps
  setTimeout(() => {
    initAllMaps();
  }, 1000);
}

// Tampilkan slide peta tertentu
function showMapSlide(slideIndex) {
  // Validasi index
  if (slideIndex < 0) slideIndex = totalMapSlides - 1;
  if (slideIndex >= totalMapSlides) slideIndex = 0;

  // Dapatkan slide sebelumnya dan yang baru
  const currentSlide = document.querySelector(".map-slide.active");
  const newSlide = document.querySelectorAll(".map-slide")[slideIndex];

  if (!currentSlide || !newSlide) return;

  // Update current slide
  currentMapSlide = slideIndex;

  // Animasi transisi
  currentSlide.classList.remove("active");
  currentSlide.classList.add("leaving");

  setTimeout(() => {
    currentSlide.classList.remove("leaving");
    newSlide.classList.add("active");

    // Update UI state
    updateMapSlideshowUI();

    // Inisialisasi peta jika belum diinisialisasi
    initMapIfNeeded(slideIndex);
  }, 300);
}

// Dapatkan index slide berdasarkan tipe peta
function getSlideIndexByType(mapType) {
  const mapTypes = ["akap", "akdp", "ajdp", "perintis"];
  return mapTypes.indexOf(mapType);
}

// Slide sebelumnya
function prevMapSlide() {
  showMapSlide(currentMapSlide - 1);
}

// Slide berikutnya
function nextMapSlide() {
  showMapSlide(currentMapSlide + 1);
}

// Update UI slideshow
function updateMapSlideshowUI() {
  // Update tabs
  document.querySelectorAll(".map-tab").forEach((tab, index) => {
    if (index === currentMapSlide) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  // Update dots
  document.querySelectorAll(".map-dot").forEach((dot, index) => {
    if (index === currentMapSlide) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// Auto slideshow
function startMapSlideshow() {
  pauseMapSlideshow();
  mapSlideshowInterval = setInterval(() => {
    nextMapSlide();
  }, 5000); // Ganti slide setiap 5 detik
}

// Pause slideshow
function pauseMapSlideshow() {
  if (mapSlideshowInterval) {
    clearInterval(mapSlideshowInterval);
  }
}

// =============================================
// INISIALISASI PETA UNTUK SLIDESHOW - FIXED
// =============================================

const mapInstances = {
  akap: null,
  akdp: null,
  ajdp: null,
  perintis: null,
};

// Data GeoJSON untuk semua tipe
const geoJSONDataAKAP = {
  type: "FeatureCollection",
  name: "DATA JALAN GJ - RUTE AKAP",
  features: [
    {
      type: "Feature",
      properties: {
        DIST_KM: 3631.704,
        DURATION_H: 48.531,
        PROFILE: "driving-car",
        PREF: "fastest",
        OPTIONS: "None",
        Name: "Rute AKAP Lengkap Terminal Kasintuwu",
        color: "#0447ff",
        type: "AKAP",
      },
      geometry: {
        type: "MultiLineString",
        coordinates: [
          [
            [119.905064, -2.968451],
            [119.904905, -2.968442],
          ],
        ],
      },
    },
  ],
};

const geoJSONDataAKDP = {
  type: "FeatureCollection",
  name: "DATA JALAN AKDP - RUTE AKDP",
  features: [
    {
      type: "Feature",
      properties: {
        DIST_KM: 1088.08,
        DURATION_H: 13.623,
        PROFILE: "driving-hgv",
        PREF: "recommended",
        OPTIONS: "None",
        Name: "Rute AKDP Lengkap Terminal Kasintuwu",
        color: "#25d366",
        type: "AKDP",
      },
      geometry: {
        type: "MultiLineString",
        coordinates: [
          [
            [122.810382, -0.939182],
            [122.809864, -0.939157],
          ],
        ],
      },
    },
  ],
};

const geoJSONDataAJDP = {
  type: "FeatureCollection",
  name: "DATA JALAN GJ - RUTE AJDP",
  features: [
    {
      type: "Feature",
      properties: {
        DIST_KM: 85.5,
        DURATION_H: 2.5,
        PROFILE: "driving-car",
        PREF: "fastest",
        OPTIONS: "None",
        Name: "Rute AJDP Lengkap Terminal Kasintuwu",
        color: "#9c27b0",
        type: "AJDP",
      },
      geometry: {
        type: "MultiLineString",
        coordinates: [
          [
            [120.752772, -1.414091],
            [120.753, -1.4142],
          ],
        ],
      },
    },
  ],
};

const geoJSONDataPerintis = {
  type: "FeatureCollection",
  name: "DATA JALAN PERINTIS - RUTE PERINTIS",
  features: [
    {
      type: "Feature",
      properties: {
        DIST_KM: 120.3,
        DURATION_H: 3.5,
        PROFILE: "driving-hgv",
        PREF: "recommended",
        OPTIONS: "None",
        Name: "Rute Perintis Lengkap Terminal Kasintuwu",
        color: "#ff9800",
        type: "PERINTIS",
      },
      geometry: {
        type: "MultiLineString",
        coordinates: [
          [
            [120.752772, -1.414091],
            [120.755, -1.416],
          ],
        ],
      },
    },
  ],
};

// Titik lokasi terminal
const titikLokasiAKAP = [
  {
    name: "TERMINAL DAYA",
    coordinates: [-5.11132129342511, 119.507587242782],
    type: "AKAP",
    description: "Terminal Daya - Makassar",
  },
  {
    name: "TERMINAL MAROS",
    coordinates: [-5.01362289258128, 119.578676677876],
    type: "AKAP",
    description: "Terminal Maros",
  },
  {
    name: "TERMINAL SINJAI",
    coordinates: [-5.1137104, 120.2516189],
    type: "AKAP",
    description: "Terminal Sinjai",
  },
  {
    name: "TERMINAL SIMBUANG",
    coordinates: [-2.68986376646645, 118.865609569597],
    type: "AKAP",
    description: "Terminal Simbuang - Mamuju",
  },
  {
    name: "TERMINAL KASINTUWU",
    coordinates: [-1.41401755600109, 120.752736643694],
    type: "TERMINAL_UTAMA",
    description: "Terminal Tipe A Kasintuwu - Poso",
  },
  {
    name: "SOPENG",
    coordinates: [-4.350601698153311, 119.88662788903234],
    type: "TERMINAL_UTAMA",
    description: "Sopeng",
  },
  {
    name: "KASIMBAR",
    coordinates: [-0.181998555735278, 120.005095168211341],
    type: "TERMINAL_UTAMA",
    description: "Kasimbar",
  },
  {
    name: "BUNGKU",
    coordinates: [-2.547459503079377, 121.973800559567024],
    type: "TERMINAL_UTAMA",
    description: "Bungku",
  },
];

const titikLokasiAKDP = [
  {
    name: "AMPANA",
    coordinates: [-0.867985225852234, 121.585798170617],
    description: "Terminal Ampana",
    type: "AKDP",
  },
  {
    name: "BUNGKU",
    coordinates: [-2.5445405, 121.9661071],
    description: "Terminal Bungku - Morowali",
    type: "AKDP",
  },
  {
    name: "PALU",
    coordinates: [-0.897186627706361, 119.868769377542321],
    description: "KOTA PALU",
    type: "AKDP",
  },
  {
    name: "TERMINAL KASINTUWU",
    coordinates: [-1.41401755600109, 120.752736643694],
    type: "TERMINAL_UTAMA",
    description: "Terminal Tipe A Kasintuwu - Poso",
  },
];

const titikLokasiAJDP = [
  {
    name: "PALU",
    coordinates: [-0.897167204525222, 119.868686387586308],
    type: "AJDP",
    description: "KOTA PALU",
  },
  {
    name: "TENTENA",
    coordinates: [-1.743996714548728, 120.656013864971825],
    type: "AJDP",
    description: "Tentena",
  },
  {
    name: "AMPANA",
    coordinates: [-0.867852326910654, 121.621762684571479],
    type: "AJDP",
    description: "Ampana",
  },
  {
    name: "LUWUK",
    coordinates: [-0.953858173124967, 122.788276567704443],
    type: "AJDP",
    description: "Luwuk",
  },
  {
    name: "TERMINAL KASINTUWU",
    coordinates: [-1.41401755600109, 120.752736643694],
    type: "TERMINAL_UTAMA",
    description: "Terminal Tipe A Kasintuwu",
  },
];

const titikLokasiPerintis = [
  {
    name: "NAPU",
    coordinates: [-1.465643105222346, 120.386063430116153],
    type: "PERINTIS",
    description: "NAPU",
  },
  {
    name: "BADA",
    coordinates: [-1.864552868574371, 120.271685613445683],
    type: "PERINTIS",
    description: "BADA",
  },
  {
    name: "PENDOLO",
    coordinates: [-2.074287910319768, 120.684982656812551],
    type: "PERINTIS",
    description: "BADA",
  },
  {
    name: "TERMINAL KASINTUWU",
    coordinates: [-1.41401755600109, 120.752736643694],
    type: "TERMINAL_UTAMA",
    description: "Terminal Tipe A Kasintuwu - Poso",
  },
];

// Inisialisasi semua peta
function initAllMaps() {
  initMapIfNeeded(0); // Inisialisasi peta pertama
}

// Inisialisasi peta jika diperlukan - FIXED
function initMapIfNeeded(slideIndex) {
  const mapTypes = ["akap", "akdp", "ajdp", "perintis"];
  const currentType = mapTypes[slideIndex];
  const mapElement = document.getElementById(`${currentType}Map`);

  if (!mapElement) return;

  // Pastikan element peta visible sebelum inisialisasi
  if (!mapInstances[currentType] && mapElement.offsetParent !== null) {
    setTimeout(() => {
      mapInstances[currentType] = createLeafletMapWithGeoJSON(
        `${currentType}Map`,
        getPointsByType(currentType),
        getGeoJSONByType(currentType),
        `RUTE ${currentType.toUpperCase()}`,
        true
      );
    }, 100);
  } else if (mapInstances[currentType]) {
    // Invalidasi ukuran peta jika sudah ada
    setTimeout(() => {
      mapInstances[currentType].invalidateSize();
    }, 300);
  }
}

// Helper functions untuk data peta
function getPointsByType(type) {
  const points = {
    akap: titikLokasiAKAP,
    akdp: titikLokasiAKDP,
    ajdp: titikLokasiAJDP,
    perintis: titikLokasiPerintis,
  };
  return points[type] || [];
}

function getGeoJSONByType(type) {
  const geoJSONs = {
    akap: geoJSONDataAKAP,
    akdp: geoJSONDataAKDP,
    ajdp: geoJSONDataAJDP,
    perintis: geoJSONDataPerintis,
  };
  return geoJSONs[type] || null;
}

// Fungsi untuk membuat peta dengan GeoJSON
function createLeafletMapWithGeoJSON(
  containerId,
  points,
  geoJSONData,
  mapTitle,
  showRoutes = false
) {
  const mapContainer = document.getElementById(containerId);
  if (!mapContainer) {
    console.error(`Container ${containerId} tidak ditemukan!`);
    return null;
  }

  mapContainer.style.height = "100%";
  mapContainer.style.width = "100%";

  // Buat peta dengan view yang sesuai
  const map = L.map(containerId).setView([-1.5, 121], 6);

  // Tambahkan tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 18,
  }).addTo(map);

  // Tambahkan marker untuk setiap titik terminal
  points.forEach((point) => {
    const isTerminalKasintuwu = point.name === "TERMINAL KASINTUWU";

    let markerColor, markerIcon;
    if (isTerminalKasintuwu) {
      markerColor = "#ff6b35";
      markerIcon = "🏠";
    } else if (mapTitle.includes("AJDP")) {
      markerColor = "#9c27b0";
      markerIcon = "🚐";
    } else if (mapTitle.includes("PERINTIS")) {
      markerColor = "#ff9800";
      markerIcon = "🚌";
    } else if (mapTitle.includes("AKDP")) {
      markerColor = "#25d366";
      markerIcon = "🚌";
    } else {
      markerColor = "#0447ff";
      markerIcon = "🚌";
    }

    const busIcon = L.divIcon({
      className: "custom-bus-marker",
      html: `<div style="
        background-color: ${markerColor};
        color: white;
        padding: 8px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 12px;
        width: 35px;
        height: 35px;
      ">${markerIcon}</div>`,
      iconSize: [35, 35],
      iconAnchor: [17, 17],
    });

    const marker = L.marker(point.coordinates, { icon: busIcon }).addTo(map);

    const popupContent = `
      <div style="text-align: center; min-width: 200px;">
        <strong style="color: ${markerColor}; font-size: 14px;">${
      point.name
    }</strong><br>
        <small style="color: #666;">${
          point.description || point.name
        }</small><br>
        <hr style="margin: 8px 0;">
        <small><strong>Koordinat:</strong></small><br>
        <small>Lat: ${point.coordinates[0].toFixed(6)}</small><br>
        <small>Lng: ${point.coordinates[1].toFixed(6)}</small>
        ${
          isTerminalKasintuwu
            ? '<br><em style="color: #ff6b35;">📍 Terminal Utama</em>'
            : ""
        }
      </div>
    `;

    marker.bindPopup(popupContent);
  });

  // Tambahkan rute GeoJSON jika diminta
  if (showRoutes && geoJSONData) {
    displayGeoJSONRoutes(map, geoJSONData);
  }

  // Fit bounds untuk menampilkan semua marker
  if (points.length > 0) {
    const group = new L.featureGroup(
      points.map((point) => L.marker(point.coordinates))
    );
    map.fitBounds(group.getBounds().pad(0.1));
  }

  return map;
}

// Fungsi untuk menampilkan rute GeoJSON
function displayGeoJSONRoutes(map, geoJSONData) {
  L.geoJSON(geoJSONData, {
    style: function (feature) {
      return {
        color: feature.properties.color || "#0447ff",
        weight: 4,
        opacity: 0.7,
        lineJoin: "round",
        dashArray: feature.properties.type === "AKDP" ? "5, 5" : null,
      };
    },
    onEachFeature: function (feature, layer) {
      if (feature.properties && feature.properties.name) {
        layer.bindTooltip(feature.properties.name, {
          permanent: false,
          direction: "top",
        });

        layer.bindPopup(`
          <div style="text-align: center; min-width: 200px;">
            <strong style="color: ${feature.properties.color}">${
          feature.properties.name
        }</strong><br>
            <small>Tipe: ${feature.properties.type}</small><br>
            <small>${feature.properties.description || ""}</small>
          </div>
        `);
      }
    },
  }).addTo(map);
}

// =============================================
// SISTEM JADWAL BUS TERPADU - FIXED
// =============================================

let currentScheduleCategory = "akap";
let currentScheduleSlide = {
  akap: 0,
  akdp: 0,
  ajdp: 0,
  perintis: 0,
};

// Inisialisasi sistem jadwal terpadu
function initIntegratedScheduleSystem() {
  // Set event listeners untuk tabs jadwal
  document.querySelectorAll(".schedule-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      showScheduleCategory(category);
    });
  });

  // Inisialisasi kategori pertama
  showScheduleCategory("akap");
}

// Tampilkan kategori jadwal
function showScheduleCategory(category) {
  // Update UI tabs
  document.querySelectorAll(".schedule-tab").forEach((tab) => {
    if (tab.getAttribute("data-category") === category) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  // Update current category
  currentScheduleCategory = category;

  // Render slider untuk kategori yang dipilih
  renderScheduleSlider(category);
}

// Render slider untuk kategori tertentu
function renderScheduleSlider(category) {
  const container = document.querySelector(".schedule-slider-container");
  const scheduleData = getScheduleDataByCategory(category);

  if (!container) return;

  container.innerHTML = `
    <div class="slider-container">
      <button class="slider-nav slider-prev" onclick="slideScheduleLeft('${category}')">
        <i class="fas fa-chevron-left"></i>
      </button>
      
      <div class="slider-wrapper">
        <div class="bus-slider" id="${category}Slider">
          ${scheduleData
            .map(
              (bus, index) => `
            <div class="bus-card-slider ${
              index === currentScheduleSlide[category] ? "active" : ""
            }">
              <div class="bus-image">
                <img src="${bus.image}" alt="${bus.name}" class="bus-photo"
                  onerror="this.src='data:image/svg+xml;base64,${getPlaceholderSVG(
                    category
                  )}'">
              </div>
              <div class="bus-info">
                <h5>${bus.name}</h5>
                <div class="route-info">
                  <i class="fas fa-route"></i>
                  <span>${bus.route}</span>
                </div>
                <div class="capacity-info">
                  <i class="fas fa-users"></i>
                  <span>Kapasitas: ${bus.capacity} Penumpang</span>
                </div>
                <div class="contact-info">
                  <i class="fab fa-whatsapp"></i>
                  <span>${bus.contact}</span>
                </div>
                <button class="book-btn" onclick="openWhatsAppBooking('${bus.contact.replace(
                  "+",
                  ""
                )}', '${bus.name} - ${bus.route}')">
                  <i class="fab fa-whatsapp"></i> Pesan via WhatsApp
                </button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
      
      <button class="slider-nav slider-next" onclick="slideScheduleRight('${category}')">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Dots Indicator -->
    <div class="slider-dots" id="${category}Dots"></div>
  `;

  // Inisialisasi slider
  initScheduleSlider(category);
  updateSchedulePosition(category);
}

// Data jadwal untuk semua kategori
function getScheduleDataByCategory(category) {
  const scheduleData = {
    akap: [
      {
        name: "Borlindo",
        route: "Poso - Makassar",
        capacity: 32,
        contact: "+6282188295208",
        image: "gambar/AKAP/bus borlindo.jpg",
      },
      {
        name: "Raja Trans",
        route: "Poso - Makassar",
        capacity: 32,
        contact: "+6282118182375",
        image: "gambar/AKAP/raja trans.jpg",
      },
      {
        name: "Batutumonga",
        route: "Palu - Toraja",
        capacity: 32,
        contact: "+6282261975824",
        image: "gambar/AKAP/BATUTUMONGA.jpg",
      },
      {
        name: "Munawara",
        route: "Kasimbar - Sopeng",
        capacity: 23,
        contact: "+6282395162930",
        image: "gambar/AKAP/MUNAWARA.jpg",
      },
      {
        name: "Alifka",
        route: "Sopeng - Poso",
        capacity: 25,
        contact: "+6281355765848",
        image: "gambar/AKAP/ALIFKA.jpg",
      },
      {
        name: "Rappan Marannu",
        route: "Palu - Toraja",
        capacity: 25,
        contact: "+6282193261398",
        image: "gambar/AKAP/RAPPAN MARANU.jpg",
      },
      {
        name: "Surya Litha",
        route: "Sopeng - Poso",
        capacity: 23,
        contact: "+6281245194949",
        image: "gambar/AKAP/SURYA LITHA.jpg",
      },
      {
        name: "Madina Trans",
        route: "Bungku - Mamuju",
        capacity: 32,
        contact: "+6285185657742",
        image: "gambar/AKAP/MADINA TRANS.jpg",
      },
    ],
    akdp: [
      {
        name: "Family",
        route: "Bungku - Palu",
        capacity: 8,
        contact: "+6281234567894",
        image: "gambar/AKDP/NEW FAMILY.jpg",
      },
      {
        name: "Hidayat Express",
        route: "Bungku - Palu",
        capacity: 8,
        contact: "+6281234567895",
        image: "gambar/AKDP/HIDAYAT EXPRESS.jpg",
      },
      {
        name: "Lorena",
        route: "Bungku - Palu",
        capacity: 12,
        contact: "+6281234567897",
        image: "gambar/AKDP/LORENA.jpg",
      },
      {
        name: "Megan Jaya",
        route: "Palu - Ampana",
        capacity: 8,
        contact: "+6281234567897",
        image: "gambar/AKDP/MEGAN JAYA.jpg",
      },
      {
        name: "Prima",
        route: "Palu - Bungku",
        capacity: 8,
        contact: "+6281234567897",
        image: "gambar/AKDP/PRIMA TRAVEL.jpg",
      },
    ],
    ajdp: [
      {
        name: "Kesayangan Anda",
        route: "Palu - Luwuk",
        capacity: 8,
        contact: "+6281234567898",
        image: "gambar/AJDP/KESAYANGAN ANDA.jpg",
      },
      {
        name: "Mandiri Pratama",
        route: "Palu - Luwuk",
        capacity: 12,
        contact: "+6281234567898",
        image: "gambar/AJDP/MANDIRI PRATAMA.jpg",
      },
      {
        name: "New Armada",
        route: "Palu - Poso",
        capacity: 8,
        contact: "+6281234567898",
        image: "gambar/AJDP/NEW ARMADA.jpeg",
      },
      {
        name: "Omega",
        route: "Palu - Tentena",
        capacity: 8,
        contact: "+6281234567900",
        image: "gambar/AJDP/OMEGA.jpg",
      },
      {
        name: "Pamona Raya",
        route: "Palu - Tentena",
        capacity: 8,
        contact: "+6281234567900",
        image: "gambar/AJDP/PAMONA RAYA.jpg",
      },
      {
        name: "Togean Indah",
        route: "Palu - Ampana",
        capacity: 8,
        contact: "+6281234567900",
        image: "gambar/AJDP/TOGEAN INDAH.jpg",
      },
      {
        name: "Touna Indah",
        route: "Ampana - Palu",
        capacity: 8,
        contact: "+6281234567900",
        image: "gambar/AJDP/TOUNA INDAH.jpg",
      },
    ],
    perintis: [
      {
        name: "Damri",
        route: "Poso - Bada",
        capacity: 19,
        contact: "+6285241256318",
        image: "gambar/PERINTIS/DAMRI BADA.jpeg",
      },
      {
        name: "Damri",
        route: "Poso - Pendolo",
        capacity: 19,
        contact: "+6285241256318",
        image: "gambar/PERINTIS/DAMRI PENDOLO.jpeg",
      },
      {
        name: "Damri",
        route: "Poso - Napu",
        capacity: 19,
        contact: "+6285241256318",
        image: "gambar/PERINTIS/DAMRI NAPU.jpeg",
      },
    ],
  };

  return scheduleData[category] || [];
}

// Helper untuk placeholder SVG
function getPlaceholderSVG(category) {
  const colors = {
    akap: "0447ff",
    akdp: "25d366",
    ajdp: "9c27b0",
    perintis: "ff9800",
  };

  const color = colors[category] || "0447ff";

  return btoa(`
    <svg width="200" height="120" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="120" fill="#${color}"/>
      <text x="100" y="60" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">Bus ${category.toUpperCase()}</text>
    </svg>
  `);
}

// Fungsi slider untuk jadwal
function initScheduleSlider(category) {
  const dotsContainer = document.getElementById(`${category}Dots`);
  const cards = document.querySelectorAll(
    `#${category}Slider .bus-card-slider`
  );

  if (!dotsContainer || !cards) return;

  // Generate dots
  dotsContainer.innerHTML = "";
  cards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = `slider-dot ${
      index === currentScheduleSlide[category] ? "active" : ""
    }`;
    dot.addEventListener("click", () => goToScheduleSlide(category, index));
    dotsContainer.appendChild(dot);
  });
}

function slideScheduleLeft(category) {
  const cards = document.querySelectorAll(
    `#${category}Slider .bus-card-slider`
  );
  const totalSlides = cards.length;

  currentScheduleSlide[category] =
    (currentScheduleSlide[category] - 1 + totalSlides) % totalSlides;
  updateSchedulePosition(category);
}

function slideScheduleRight(category) {
  const cards = document.querySelectorAll(
    `#${category}Slider .bus-card-slider`
  );
  const totalSlides = cards.length;

  currentScheduleSlide[category] =
    (currentScheduleSlide[category] + 1) % totalSlides;
  updateSchedulePosition(category);
}

function goToScheduleSlide(category, slideIndex) {
  currentScheduleSlide[category] = slideIndex;
  updateSchedulePosition(category);
}

// Update schedule position - FIXED untuk mobile
function updateSchedulePosition(category) {
  const slider = document.getElementById(`${category}Slider`);
  const cards = slider?.querySelectorAll(".bus-card-slider");
  const dots = document.querySelectorAll(`#${category}Dots .slider-dot`);

  if (!slider || !cards || !dots) return;

  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 768;

  if (isMobile) {
    // Untuk mobile: gunakan display none/block
    cards.forEach((card, index) => {
      if (index === currentScheduleSlide[category]) {
        card.style.display = "block";
        card.classList.add("active");
      } else {
        card.style.display = "none";
        card.classList.remove("active");
      }
    });
    slider.style.transform = "translateX(0)";
  } else {
    // Untuk desktop: gunakan transform asli
    const cardWidth = cards[0]?.offsetWidth || 350;
    const gap = 30;
    const offset =
      -(currentScheduleSlide[category] * (cardWidth + gap)) +
      (screenWidth <= 1024 ? cardWidth * 0.1 : cardWidth * 0.3);

    slider.style.transform = `translateX(${offset}px)`;

    cards.forEach((card, index) => {
      card.style.display = "flex";
      card.classList.toggle("active", index === currentScheduleSlide[category]);
    });
  }

  // Update dots
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentScheduleSlide[category]);
  });
}

// =============================================
// FUNGSI UNTUK BOOKING VIA WHATSAPP
// =============================================

function openWhatsAppBooking(phoneNumber, busInfo) {
  const message = `Halo, saya ingin memesan tiket bus:\n${busInfo}\n\nBisa info harga dan ketersediaan kursi?`;
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(url, "_blank");
}

// =============================================
// DATA PRODUKSI SYSTEM (DATA DIPERBARUI DARI EXCEL)
// =============================================

// Data dari Excel Anda (DATA TERBARU)
const dataAKAP = [
  {
    bulan: "JANUARI",
    kendaraanKedatangan: 74,
    penumpangKedatangan: 1228,
    kendaraanKeberangkatan: 74,
    penumpangKeberangkatan: 1233,
  },
  {
    bulan: "FEBRUARI",
    kendaraanKedatangan: 65,
    penumpangKedatangan: 895,
    kendaraanKeberangkatan: 69,
    penumpangKeberangkatan: 953,
  },
  {
    bulan: "MARET",
    kendaraanKedatangan: 62,
    penumpangKedatangan: 1107,
    kendaraanKeberangkatan: 67,
    penumpangKeberangkatan: 1063,
  },
  {
    bulan: "APRIL",
    kendaraanKedatangan: 58,
    penumpangKedatangan: 1139,
    kendaraanKeberangkatan: 59,
    penumpangKeberangkatan: 1131,
  },
  {
    bulan: "MEI",
    kendaraanKedatangan: 65,
    penumpangKedatangan: 980,
    kendaraanKeberangkatan: 66,
    penumpangKeberangkatan: 929,
  },
  {
    bulan: "JUNI",
    kendaraanKedatangan: 64,
    penumpangKedatangan: 1518,
    kendaraanKeberangkatan: 62,
    penumpangKeberangkatan: 1214,
  },
  {
    bulan: "JULI",
    kendaraanKedatangan: 84,
    penumpangKedatangan: 1585,
    kendaraanKeberangkatan: 78,
    penumpangKeberangkatan: 1474,
  },
  {
    bulan: "AGUSTUS",
    kendaraanKedatangan: 74,
    penumpangKedatangan: 1238,
    kendaraanKeberangkatan: 77,
    penumpangKeberangkatan: 1418,
  },
  {
    bulan: "SEPTEMBER",
    kendaraanKedatangan: 80,
    penumpangKedatangan: 1151,
    kendaraanKeberangkatan: 79,
    penumpangKeberangkatan: 1101,
  },
  {
    bulan: "OKTOBER",
    kendaraanKedatangan: 78,
    penumpangKedatangan: 1195,
    kendaraanKeberangkatan: 83,
    penumpangKeberangkatan: 1123,
  },
  {
    bulan: "NOVEMBER",
    kendaraanKedatangan: 0,
    penumpangKedatangan: 0,
    kendaraanKeberangkatan: 0,
    penumpangKeberangkatan: 0,
  },
  {
    bulan: "DESEMBER",
    kendaraanKedatangan: 0,
    penumpangKedatangan: 0,
    kendaraanKeberangkatan: 0,
    penumpangKeberangkatan: 0,
  },
];

const dataAKDP = [
  {
    bulan: "JANUARI",
    kendaraanKedatangan: 256,
    penumpangKedatangan: 2214,
    kendaraanKeberangkatan: 256,
    penumpangKeberangkatan: 2213,
  },
  {
    bulan: "FEBRUARI",
    kendaraanKedatangan: 207,
    penumpangKedatangan: 1539,
    kendaraanKeberangkatan: 207,
    penumpangKeberangkatan: 1540,
  },
  {
    bulan: "MARET",
    kendaraanKedatangan: 262,
    penumpangKedatangan: 2159,
    kendaraanKeberangkatan: 262,
    penumpangKeberangkatan: 2156,
  },
  {
    bulan: "APRIL",
    kendaraanKedatangan: 316,
    penumpangKedatangan: 2891,
    kendaraanKeberangkatan: 316,
    penumpangKeberangkatan: 2894,
  },
  {
    bulan: "MEI",
    kendaraanKedatangan: 220,
    penumpangKedatangan: 1826,
    kendaraanKeberangkatan: 220,
    penumpangKeberangkatan: 1832,
  },
  {
    bulan: "JUNI",
    kendaraanKedatangan: 212,
    penumpangKedatangan: 2060,
    kendaraanKeberangkatan: 212,
    penumpangKeberangkatan: 2060,
  },
  {
    bulan: "JULI",
    kendaraanKedatangan: 232,
    penumpangKedatangan: 2015,
    kendaraanKeberangkatan: 232,
    penumpangKeberangkatan: 2007,
  },
  {
    bulan: "AGUSTUS",
    kendaraanKedatangan: 175,
    penumpangKedatangan: 1443,
    kendaraanKeberangkatan: 175,
    penumpangKeberangkatan: 1456,
  },
  {
    bulan: "SEPTEMBER",
    kendaraanKedatangan: 147,
    penumpangKedatangan: 1187,
    kendaraanKeberangkatan: 147,
    penumpangKeberangkatan: 1187,
  },
  {
    bulan: "OKTOBER",
    kendaraanKedatangan: 71,
    penumpangKedatangan: 604,
    kendaraanKeberangkatan: 71,
    penumpangKeberangkatan: 602,
  },
  {
    bulan: "NOVEMBER",
    kendaraanKedatangan: 0,
    penumpangKedatangan: 0,
    kendaraanKeberangkatan: 0,
    penumpangKeberangkatan: 0,
  },
  {
    bulan: "DESEMBER",
    kendaraanKedatangan: 0,
    penumpangKedatangan: 0,
    kendaraanKeberangkatan: 0,
    penumpangKeberangkatan: 0,
  },
];

const dataAJDP = [
  {
    bulan: "JANUARI",
    kendaraanKedatangan: 162,
    penumpangKedatangan: 1282,
    kendaraanKeberangkatan: 162,
    penumpangKeberangkatan: 1311,
  },
  {
    bulan: "FEBRUARI",
    kendaraanKedatangan: 107,
    penumpangKedatangan: 820,
    kendaraanKeberangkatan: 111,
    penumpangKeberangkatan: 924,
  },
  {
    bulan: "MARET",
    kendaraanKedatangan: 121,
    penumpangKedatangan: 942,
    kendaraanKeberangkatan: 121,
    penumpangKeberangkatan: 974,
  },
  {
    bulan: "APRIL",
    kendaraanKedatangan: 129,
    penumpangKedatangan: 1062,
    kendaraanKeberangkatan: 135,
    penumpangKeberangkatan: 1135,
  },
  {
    bulan: "MEI",
    kendaraanKedatangan: 114,
    penumpangKedatangan: 908,
    kendaraanKeberangkatan: 123,
    penumpangKeberangkatan: 1028,
  },
  {
    bulan: "JUNI",
    kendaraanKedatangan: 141,
    penumpangKedatangan: 1222,
    kendaraanKeberangkatan: 145,
    penumpangKeberangkatan: 1211,
  },
  {
    bulan: "JULI",
    kendaraanKedatangan: 127,
    penumpangKedatangan: 1040,
    kendaraanKeberangkatan: 134,
    penumpangKeberangkatan: 1264,
  },
  {
    bulan: "AGUSTUS",
    kendaraanKedatangan: 112,
    penumpangKedatangan: 864,
    kendaraanKeberangkatan: 119,
    penumpangKeberangkatan: 1016,
  },
  {
    bulan: "SEPTEMBER",
    kendaraanKedatangan: 116,
    penumpangKedatangan: 863,
    kendaraanKeberangkatan: 116,
    penumpangKeberangkatan: 927,
  },
  {
    bulan: "OKTOBER",
    kendaraanKedatangan: 146,
    penumpangKedatangan: 1197,
    kendaraanKeberangkatan: 149,
    penumpangKeberangkatan: 1230,
  },
  {
    bulan: "NOVEMBER",
    kendaraanKedatangan: 0,
    penumpangKedatangan: 0,
    kendaraanKeberangkatan: 0,
    penumpangKeberangkatan: 0,
  },
  {
    bulan: "DESEMBER",
    kendaraanKedatangan: 0,
    penumpangKedatangan: 0,
    kendaraanKeberangkatan: 0,
    penumpangKeberangkatan: 0,
  },
];

const dataPerintis = [
  {
    bulan: "JANUARI",
    kendaraanKedatangan: 43,
    penumpangKedatangan: 69,
    kendaraanKeberangkatan: 41,
    penumpangKeberangkatan: 22,
  },
  {
    bulan: "FEBRUARI",
    kendaraanKedatangan: 3,
    penumpangKedatangan: 2,
    kendaraanKeberangkatan: 1,
    penumpangKeberangkatan: 1,
  },
  {
    bulan: "MARET",
    kendaraanKedatangan: 25,
    penumpangKedatangan: 34,
    kendaraanKeberangkatan: 24,
    penumpangKeberangkatan: 10,
  },
  {
    bulan: "APRIL",
    kendaraanKedatangan: 19,
    penumpangKedatangan: 17,
    kendaraanKeberangkatan: 22,
    penumpangKeberangkatan: 6,
  },
  {
    bulan: "MEI",
    kendaraanKedatangan: 33,
    penumpangKedatangan: 9,
    kendaraanKeberangkatan: 42,
    penumpangKeberangkatan: 8,
  },
  {
    bulan: "JUNI",
    kendaraanKedatangan: 25,
    penumpangKedatangan: 14,
    kendaraanKeberangkatan: 24,
    penumpangKeberangkatan: 9,
  },
  {
    bulan: "JULI",
    kendaraanKedatangan: 42,
    penumpangKedatangan: 31,
    kendaraanKeberangkatan: 43,
    penumpangKeberangkatan: 11,
  },
  {
    bulan: "AGUSTUS",
    kendaraanKedatangan: 43,
    penumpangKedatangan: 33,
    kendaraanKeberangkatan: 44,
    penumpangKeberangkatan: 10,
  },
  {
    bulan: "SEPTEMBER",
    kendaraanKedatangan: 36,
    penumpangKedatangan: 41,
    kendaraanKeberangkatan: 34,
    penumpangKeberangkatan: 23,
  },
  {
    bulan: "OKTOBER",
    kendaraanKedatangan: 20,
    penumpangKedatangan: 26,
    kendaraanKeberangkatan: 22,
    penumpangKeberangkatan: 19,
  },
  {
    bulan: "NOVEMBER",
    kendaraanKedatangan: 0,
    penumpangKedatangan: 0,
    kendaraanKeberangkatan: 0,
    penumpangKeberangkatan: 0,
  },
  {
    bulan: "DESEMBER",
    kendaraanKedatangan: 0,
    penumpangKedatangan: 0,
    kendaraanKeberangkatan: 0,
    penumpangKeberangkatan: 0,
  },
];

// Fungsi untuk menghitung total
function calculateTotals(data) {
  return {
    totalKendaraanKedatangan: data.reduce(
      (sum, item) => sum + item.kendaraanKedatangan,
      0
    ),
    totalPenumpangKedatangan: data.reduce(
      (sum, item) => sum + item.penumpangKedatangan,
      0
    ),
    totalKendaraanKeberangkatan: data.reduce(
      (sum, item) => sum + item.kendaraanKeberangkatan,
      0
    ),
    totalPenumpangKeberangkatan: data.reduce(
      (sum, item) => sum + item.penumpangKeberangkatan,
      0
    ),
  };
}

// Fungsi untuk memformat angka dengan separator
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Fungsi untuk mengisi tabel
function populateTable(tableId, data, totalIds) {
  const tbody = document.getElementById(tableId);
  if (!tbody)
    return {
      totalKendaraanKedatangan: 0,
      totalPenumpangKedatangan: 0,
      totalKendaraanKeberangkatan: 0,
      totalPenumpangKeberangkatan: 0,
    };

  const totals = calculateTotals(data);

  // Isi data per bulan
  tbody.innerHTML = data
    .map(
      (item) => `
    <tr>
      <td>${item.bulan}</td>
      <td>${formatNumber(item.kendaraanKedatangan)}</td>
      <td>${formatNumber(item.penumpangKedatangan)}</td>
      <td>${formatNumber(item.kendaraanKeberangkatan)}</td>
      <td>${formatNumber(item.penumpangKeberangkatan)}</td>
    </tr>
  `
    )
    .join("");

  // Update total
  if (
    totalIds.kendaraanKedatangan &&
    document.getElementById(totalIds.kendaraanKedatangan)
  ) {
    document.getElementById(totalIds.kendaraanKedatangan).textContent =
      formatNumber(totals.totalKendaraanKedatangan);
  }
  if (
    totalIds.penumpangKedatangan &&
    document.getElementById(totalIds.penumpangKedatangan)
  ) {
    document.getElementById(totalIds.penumpangKedatangan).textContent =
      formatNumber(totals.totalPenumpangKedatangan);
  }
  if (
    totalIds.kendaraanKeberangkatan &&
    document.getElementById(totalIds.kendaraanKeberangkatan)
  ) {
    document.getElementById(totalIds.kendaraanKeberangkatan).textContent =
      formatNumber(totals.totalKendaraanKeberangkatan);
  }
  if (
    totalIds.penumpangKeberangkatan &&
    document.getElementById(totalIds.penumpangKeberangkatan)
  ) {
    document.getElementById(totalIds.penumpangKeberangkatan).textContent =
      formatNumber(totals.totalPenumpangKeberangkatan);
  }

  return totals;
}

// Fungsi untuk update summary
function updateSummary(akapTotals, akdpTotals, ajdpTotals, perintisTotals) {
  if (document.getElementById("totalBusAKAP")) {
    document.getElementById("totalBusAKAP").textContent = formatNumber(
      akapTotals.totalKendaraanKedatangan
    );
  }
  if (document.getElementById("totalPenumpangAKAP")) {
    document.getElementById("totalPenumpangAKAP").textContent = formatNumber(
      akapTotals.totalPenumpangKedatangan
    );
  }
  if (document.getElementById("totalBusAKDP")) {
    document.getElementById("totalBusAKDP").textContent = formatNumber(
      akdpTotals.totalKendaraanKedatangan
    );
  }
  if (document.getElementById("totalPenumpangAKDP")) {
    document.getElementById("totalPenumpangAKDP").textContent = formatNumber(
      akdpTotals.totalPenumpangKedatangan
    );
  }
  // Tambahan untuk AJDP dan Perintis
  if (document.getElementById("totalBusAJDP")) {
    document.getElementById("totalBusAJDP").textContent = formatNumber(
      ajdpTotals.totalKendaraanKedatangan
    );
  }
  if (document.getElementById("totalPenumpangAJDP")) {
    document.getElementById("totalPenumpangAJDP").textContent = formatNumber(
      ajdpTotals.totalPenumpangKedatangan
    );
  }
  if (document.getElementById("totalBusPerintis")) {
    document.getElementById("totalBusPerintis").textContent = formatNumber(
      perintisTotals.totalKendaraanKedatangan
    );
  }
  if (document.getElementById("totalPenumpangPerintis")) {
    document.getElementById("totalPenumpangPerintis").textContent =
      formatNumber(perintisTotals.totalPenumpangKedatangan);
  }
}

// Fungsi untuk membuat chart
function createChart(akapData, akdpData, ajdpData, perintisData) {
  const chartCanvas = document.getElementById("productionChart");
  if (!chartCanvas) return;

  const ctx = chartCanvas.getContext("2d");

  const months = akapData.map((item) => item.bulan);
  const akapPenumpang = akapData.map((item) => item.penumpangKedatangan);
  const akdpPenumpang = akdpData.map((item) => item.penumpangKedatangan);
  const ajdpPenumpang = ajdpData.map((item) => item.penumpangKedatangan);
  const perintisPenumpang = perintisData.map(
    (item) => item.penumpangKedatangan
  );

  // Cek jika Chart.js tersedia
  if (typeof Chart === "undefined") {
    console.warn("Chart.js tidak tersedia");
    return;
  }

  new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "AKAP - Penumpang",
          data: akapPenumpang,
          borderColor: "#0447ff",
          backgroundColor: "rgba(4, 71, 255, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "AKDP - Penumpang",
          data: akdpPenumpang,
          borderColor: "#ff6b35",
          backgroundColor: "rgba(255, 107, 53, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "AJDP - Penumpang",
          data: ajdpPenumpang,
          borderColor: "#9c27b0",
          backgroundColor: "rgba(156, 39, 176, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Perintis - Penumpang",
          data: perintisPenumpang,
          borderColor: "#ff9800",
          backgroundColor: "rgba(255, 152, 0, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Trend Jumlah Penumpang Bulanan",
        },
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Jumlah Penumpang",
          },
        },
        x: {
          title: {
            display: true,
            text: "Bulan",
          },
        },
      },
    },
  });
}

// Tab functionality
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      button.classList.add("active");
      const tabId = button.getAttribute("data-tab");
      const tabContent = document.getElementById(tabId);
      if (tabContent) {
        tabContent.classList.add("active");
      }
    });
  });
}

// Initialize data system
function initDataSystem() {
  // Cek jika elemen data produksi ada di halaman
  const dataSection = document.getElementById("data");
  if (!dataSection) return;

  // Populate tables and get totals
  const akapTotals = populateTable("akapTableBody", dataAKAP, {
    kendaraanKedatangan: "akapTotalKendaraanKedatangan",
    penumpangKedatangan: "akapTotalPenumpangKedatangan",
    kendaraanKeberangkatan: "akapTotalKendaraanKeberangkatan",
    penumpangKeberangkatan: "akapTotalPenumpangKeberangkatan",
  });

  const akdpTotals = populateTable("akdpTableBody", dataAKDP, {
    kendaraanKedatangan: "akdpTotalKendaraanKedatangan",
    penumpangKedatangan: "akdpTotalPenumpangKedatangan",
    kendaraanKeberangkatan: "akdpTotalKendaraanKeberangkatan",
    penumpangKeberangkatan: "akdpTotalPenumpangKeberangkatan",
  });

  const ajdpTotals = populateTable("ajdpTableBody", dataAJDP, {
    kendaraanKedatangan: "ajdpTotalKendaraanKedatangan",
    penumpangKedatangan: "ajdpTotalPenumpangKedatangan",
    kendaraanKeberangkatan: "ajdpTotalKendaraanKeberangkatan",
    penumpangKeberangkatan: "ajdpTotalPenumpangKeberangkatan",
  });

  const perintisTotals = populateTable("perintisTableBody", dataPerintis, {
    kendaraanKedatangan: "perintisTotalKendaraanKedatangan",
    penumpangKedatangan: "perintisTotalPenumpangKedatangan",
    kendaraanKeberangkatan: "perintisTotalKendaraanKeberangkatan",
    penumpangKeberangkatan: "perintisTotalPenumpangKeberangkatan",
  });

  // Update summary
  updateSummary(akapTotals, akdpTotals, ajdpTotals, perintisTotals);

  // Create chart
  createChart(dataAKAP, dataAKDP, dataAJDP, dataPerintis);

  // Initialize tabs
  initTabs();
}

// =============================================
// FUNGSI KONTAK DAN MAPS
// =============================================

const terminalLocation = {
  latitude: -1.4140910278425702,
  longitude: 120.75277267260425,
};

function openWhatsApp() {
  const phone = "6281234567890";
  const message = "Halo, saya ingin bertanya tentang Terminal Kasintuwu";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function getDirections() {
  const url = `https://www.google.com/maps/dir//${terminalLocation.latitude},${terminalLocation.longitude}`;
  window.open(url, "_blank");
}

function openInGoogleMaps() {
  const url = `https://www.google.com/maps?q=${terminalLocation.latitude},${terminalLocation.longitude}`;
  window.open(url, "_blank");
}

function openInOpenStreetMap() {
  const url = `https://www.openstreetmap.org/?mlat=${terminalLocation.latitude}&mlon=${terminalLocation.longitude}#map=17/${terminalLocation.latitude}/${terminalLocation.longitude}`;
  window.open(url, "_blank");
}

function openInWaze() {
  const url = `https://www.waze.com/ul?ll=${terminalLocation.latitude},${terminalLocation.longitude}&navigate=yes`;
  window.open(url, "_blank");
}

// =============================================
// FUNGSI UNTUK PETA LOKASI TERMINAL (ZOOM IN)
// =============================================

function initTerminalMap() {
  const terminalMapContainer = document.getElementById("terminalMap");
  if (!terminalMapContainer) return;

  // Koordinat Terminal Kasintuwu
  const terminalCoords = [-1.4140910278425702, 120.75277267260425];

  // Buat peta dengan zoom yang lebih dekat
  const terminalMap = L.map("terminalMap").setView(terminalCoords, 16);

  // Tambahkan tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 18,
  }).addTo(terminalMap);

  // Tambahkan custom marker untuk terminal
  const terminalIcon = L.divIcon({
    className: "custom-terminal-marker",
    html: `
      <div style="
        background: #ff6b35;
        color: white;
        padding: 12px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        width: 50px;
        height: 50px;
      ">🏠</div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });

  // Tambahkan marker terminal
  const terminalMarker = L.marker(terminalCoords, { icon: terminalIcon }).addTo(
    terminalMap
  );

  // Popup info terminal
  const popupContent = `
    <div style="text-align: center; min-width: 250px;">
      <strong style="color: #ff6b35; font-size: 16px;">TERMINAL KASINTUWU</strong><br>
      <small style="color: #666;">Terminal Tipe A - Poso</small><br>
      <hr style="margin: 10px 0;">
      <div style="text-align: left;">
        <small><strong>Alamat:</strong></small><br>
        <small>Jalan Trans Sulawesi No. 123, Kelurahan Kasintuwu</small><br>
        <small>Poso, Sulawesi Tengah 94616</small>
      </div>
      <hr style="margin: 10px 0;">
      <div style="font-size: 12px; color: #888;">
        <strong>Koordinat:</strong><br>
        Lat: ${terminalCoords[0].toFixed(6)}<br>
        Lng: ${terminalCoords[1].toFixed(6)}
      </div>
    </div>
  `;

  terminalMarker.bindPopup(popupContent).openPopup();

  // Tambahkan circle untuk menunjukkan area terminal
  L.circle(terminalCoords, {
    color: "#ff6b35",
    fillColor: "#ff6b35",
    fillOpacity: 0.1,
    radius: 100,
  }).addTo(terminalMap);

  // Handle resize dengan debounce
  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      terminalMap.invalidateSize();
    }, 250);
  });

  return terminalMap;
}

// =============================================
// FORM FEEDBACK HANDLING - EMAILJS FIXED
// =============================================

function initFeedbackForm() {
  const feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Ambil data form
      const formData = new FormData(this);
      const name = formData.get("name");
      const contact = formData.get("contact");
      const message = formData.get("message");
      const rating = formData.get("rating") || "Tidak ada rating";

      // Validasi form
      if (!name || !contact || !message) {
        alert("Harap lengkapi semua field yang wajib diisi!");
        return;
      }

      // Kirim email menggunakan EmailJS
      sendFeedbackEmail(name, contact, message, rating);
    });
  }
}

// Fungsi untuk mengirim email menggunakan EmailJS
function sendFeedbackEmail(name, contact, message, rating) {
  // EmailJS Configuration dengan credential Anda
  const serviceID = "service_TTA_KASINTUWU";
  const templateID = "template_lctwza2";
  const publicKey = "N_1Ob00ZuQhyWMLOV";

  // Data yang akan dikirim ke email
  const templateParams = {
    from_name: name,
    from_contact: contact,
    message: message,
    rating: rating,
    to_email: "satpelttakasintuwu@gmail.com",
    subject: `Saran & Kritik dari ${name} - Terminal Kasintuwu`,
    reply_to: contact.includes("@") ? contact : undefined,
  };

  // Tampilkan loading state
  const submitBtn = document.querySelector(".submit-btn-symmetric");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  submitBtn.disabled = true;

  // Menggunakan EmailJS untuk mengirim email
  emailjs
    .send(serviceID, templateID, templateParams, publicKey)
    .then(function (response) {
      // Sukses mengirim
      console.log("Email berhasil dikirim:", response);
      showFeedbackMessage(
        "success",
        "Terima kasih! Feedback Anda telah berhasil dikirim."
      );
      document.getElementById("feedbackForm").reset();
    })
    .catch(function (error) {
      // Error handling
      console.error("Error sending email:", error);
      showFeedbackMessage(
        "error",
        `Maaf, terjadi kesalahan: ${
          error.text || "Silakan coba lagi"
        }. Atau hubungi kami langsung melalui email satpelttakasintuwu@gmail.com.`
      );
    })
    .finally(function () {
      // Reset button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
}

// Fungsi untuk menampilkan pesan feedback
function showFeedbackMessage(type, message) {
  // Hapus pesan sebelumnya jika ada
  const existingMessage = document.querySelector(".feedback-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Buat elemen pesan baru
  const messageDiv = document.createElement("div");
  messageDiv.className = `feedback-message ${type}`;
  messageDiv.innerHTML = `
    <div style="
      padding: 15px;
      margin: 20px 0;
      border-radius: 8px;
      text-align: center;
      font-weight: 500;
      background: ${type === "success" ? "#d4edda" : "#f8d7da"};
      color: ${type === "success" ? "#155724" : "#721c24"};
      border: 1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"};
    ">
      <i class="fas ${
        type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
      }"></i>
      ${message}
    </div>
  `;

  // Sisipkan pesan sebelum form
  const form = document.getElementById("feedbackForm");
  if (form && form.parentNode) {
    form.parentNode.insertBefore(messageDiv, form);
  }

  // Auto-hide pesan sukses setelah 5 detik
  if (type === "success") {
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

// =============================================
// UPDATE WAKTU TERAKHIR
// =============================================

function updateLastUpdate() {
  const now = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Makassar",
  };
  const lastUpdate = document.getElementById("lastUpdate");
  if (lastUpdate) {
    lastUpdate.textContent = now.toLocaleDateString("id-ID", options) + " WITA";
  }
}

// =============================================
// ERROR HANDLING DAN PERFORMANCE OPTIMIZATION
// =============================================

// Handle image errors
function initImageErrorHandling() {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      this.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNGRjZCMzUiLz48dGV4dCB4PSIxMDAiIHk9IjYwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+";
      this.alt = "Gambar tidak tersedia";
    });
  });
}

// Debounce resize events untuk performance
let globalResizeTimeout;
window.addEventListener("resize", function () {
  clearTimeout(globalResizeTimeout);
  globalResizeTimeout = setTimeout(() => {
    // Reinitialize maps and sliders
    Object.values(mapInstances).forEach((map) => {
      if (map) map.invalidateSize();
    });

    // Update slider positions
    updateSchedulePosition(currentScheduleCategory);
  }, 250);
});

// =============================================
// INITIALIZATION DENGAN SEMUA FITUR - FIXED
// =============================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded, initializing all features...");

  // Initialize navigation system
  updateLastUpdate();

  // Clear URL hash on load
  if (window.location.hash) {
    history.replaceState(null, null, " ");
  }

  // Initialize data production system
  initDataSystem();

  // Initialize map slideshow system
  setTimeout(() => {
    initMapSlideshow();
  }, 1000);

  // Initialize integrated schedule system
  setTimeout(() => {
    initIntegratedScheduleSystem();
  }, 1500);

  // Initialize feedback form dengan EmailJS
  initFeedbackForm();

  // Initialize terminal map
  setTimeout(() => {
    initTerminalMap();
  }, 2000);

  // Initialize image error handling
  initImageErrorHandling();

  // Update setiap menit
  setInterval(updateLastUpdate, 60000);
});

// Error handling untuk Leaflet
window.addEventListener("error", function (e) {
  if (e.message.includes("Leaflet") || e.message.includes("L")) {
    console.error("Error Leaflet:", e.error);
    // Tampilkan pesan error ke user
    const mapContainers = document.querySelectorAll(".leaflet-map");
    mapContainers.forEach((container) => {
      container.innerHTML = `
        <div style="height: 400px; display: flex; align-items: center; justify-content: center; background: #f8f9fa; border: 2px dashed #ccc; border-radius: 10px;">
          <div style="text-align: center; color: #666;">
            <i class="fas fa-map-marked-alt" style="font-size: 48px; margin-bottom: 15px;"></i>
            <h4>Peta Sedang Dimuat...</h4>
            <p>Jika peta tidak muncul, silakan refresh halaman</p>
          </div>
        </div>
      `;
    });
  }
});
