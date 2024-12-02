class LeafletMap {
    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();
        this.markers = [];
    }

    initTileLayer() {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> WATERWISE'
        }).addTo(this.map);
    }

    addMarker(lat, long, message, imageUrl, title, description) {
        const customIcon = L.icon({
            iconUrl: 'assets/Drop-droplet-raindrop-water_23-1024.webp',
            iconSize: [58, 68],
            iconAnchor: [19, 48],
            popupAnchor: [0, -48]
        });

        const popupContent = `
            <div style="text-align: center;">
                <img src="${imageUrl}" alt="Marker Image" style="width: 300px; height: auto; margin-bottom: 10px;" />
                <h5> ${message}</h5>
                <p><strong>Description:</strong> ${description}</p>
            </div>
        `;

        const marker = L.marker([lat, long], { icon: customIcon })
            .addTo(this.map)
            .bindPopup(popupContent);

        this.markers.push({ title, marker });
    }

    loadMarkersFromJson(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(markerData => {
                    this.addMarker(
                        markerData.latitude,
                        markerData.longitude,
                        markerData.message,
                        markerData.imageUrl,
                        markerData.message,
                        markerData.description
                    );
                });
                this.createInteractiveList();
            })
            .catch(error => console.error("Error loading markers:", error));
    }

    createInteractiveList() {
        const listElement = document.getElementById("marker-list");
        listElement.innerHTML = '';

        this.markers.forEach(markerData => {
            const listItem = document.createElement('li');
            listItem.textContent = markerData.title;
            listItem.style.cursor = "pointer"; 
            listItem.onclick = () => this.centerMarker(markerData.marker);
            listElement.appendChild(listItem);
        });
    }

    centerMarker(marker) {
        const latLng = marker.getLatLng();
        this.map.flyTo(latLng, 17, { duration: 1.5 });
        marker.openPopup();
    }
}

const Mymap = new LeafletMap('map', [8.359974, 124.868492], 7);

Mymap.loadMarkersFromJson('map.json');