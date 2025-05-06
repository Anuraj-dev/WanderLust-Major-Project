/**
 * Global map configuration
 * Change these values to update default location across the entire application
 */
const mapConfig = {
  // Default coordinates (New Delhi, India)
  defaultLng: 77.2088,
  defaultLat: 28.6139,

  // Default zoom levels
  defaultZoom: 9,
  closeZoom: 10,

  // Mapbox styles
  mapStyle: "mapbox://styles/mapbox/streets-v12",

  // Marker color
  markerColor: "#fe424d",

  // Mapbox access token
  accessToken:
    "pk.eyJ1IjoicmFqYS1kZXYiLCJhIjoiY21hODlxNmFvMThyMTJqc2RjMzFzZzl1NiJ9.g5ZUQVBO_aWyE8HQg2q_5Q",
};

// Map initialization with improved styling and features
mapboxgl.accessToken = mapToken;

// Show loading indicator
document.getElementById("map-loading").classList.remove("d-none");

// Get coordinates from data attributes, falling back to global config if unavailable
const mapElement = document.getElementById("map");
const coordinates = [
  parseFloat(mapElement.dataset.lng) || mapConfig.defaultLng,
  parseFloat(mapElement.dataset.lat) || mapConfig.defaultLat,
];
const listingTitle = mapElement.dataset.title || "Location";
const listingLocation = mapElement.dataset.location || "Unknown location";

// Check if we have valid coordinates from the listing itself
const hasCustomCoordinates =
  mapElement.dataset.lng !== "null" &&
  mapElement.dataset.lat !== "null" &&
  !isNaN(parseFloat(mapElement.dataset.lng)) &&
  !isNaN(parseFloat(mapElement.dataset.lat));

// Initialize map with listing coordinates or fallback
const map = new mapboxgl.Map({
  container: "map",
  style: mapConfig.mapStyle,
  center: coordinates,
  zoom: hasCustomCoordinates ? mapConfig.closeZoom : mapConfig.defaultZoom,
  interactive: true,
});

// Add map controls
map.addControl(new mapboxgl.NavigationControl(), "top-right");
map.addControl(new mapboxgl.FullscreenControl(), "top-right");

// Add marker only if we have valid coordinates
if (hasCustomCoordinates) {
  // Create custom interactive marker element
  const customMarkerElement = document.createElement("div");
  customMarkerElement.className = "custom-marker";

  // Create marker container for 3D flip effect
  const markerContainer = document.createElement("div");
  markerContainer.className = "marker-container";

  // Create front of marker (pin)
  const markerFront = document.createElement("div");
  markerFront.className = "marker-front";
  markerFront.innerHTML = '<i class="bi bi-geo-alt-fill"></i>';

  // Create back of marker (logo)
  const markerBack = document.createElement("div");
  markerBack.className = "marker-back";
  markerBack.innerHTML = '<i class="fa-solid fa-location-arrow"></i>';

  // Create pulsating radius effect
  const pulseRadius = document.createElement("div");
  pulseRadius.className = "pulse-radius";

  // Assemble the marker
  markerContainer.appendChild(markerFront);
  markerContainer.appendChild(markerBack);
  customMarkerElement.appendChild(pulseRadius);
  customMarkerElement.appendChild(markerContainer);

  // Create the marker
  const marker = new mapboxgl.Marker({
    element: customMarkerElement,
    anchor: "bottom",
    draggable: false,
  })
    .setLngLat(coordinates)
    .addTo(map);

  // Create a popup for the marker
  const popup = new mapboxgl.Popup({
    offset: 25,
    closeButton: false,
    className: "custom-popup",
  }).setHTML(`<strong>${listingTitle}</strong><p>${listingLocation}</p>`);

  // Show popup on marker click
  customMarkerElement.addEventListener("click", () => {
    marker.setPopup(popup);
    popup.addTo(map);
  });

  // Marker hover effects
  customMarkerElement.addEventListener("mouseenter", () => {
    pulseRadius.style.animation = "pulse 1.5s infinite";
  });

  customMarkerElement.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!popup.isOpen()) {
        pulseRadius.style.animation = "pulse 2s infinite";
      }
    }, 500);
  });
} else {
  // Add a notice when exact coordinates aren't available
  map.on("load", function () {
    new mapboxgl.Popup({ closeButton: false })
      .setLngLat([mapConfig.defaultLng, mapConfig.defaultLat])
      .setHTML("<p>Exact location not available</p>")
      .addTo(map);
  });
}

// Hide loading indicator when map is loaded
map.on("load", function () {
  document.getElementById("map-loading").classList.add("d-none");
});

// Center map button functionality
document
  .getElementById("zoomToLocation")
  .addEventListener("click", function () {
    map.flyTo({
      center: coordinates,
      zoom: hasCustomCoordinates ? mapConfig.closeZoom : mapConfig.defaultZoom,
      essential: true,
    });
  });
