const borders = [
    [-28.239057466703663, -52.360110462617754],
    [-28.241515486440136, -52.35980740662215],
    [-28.241312229263894, -52.35702894634385],
    [-28.23871479265864, -52.35736670056089]
];

const center = borders.reduce(
    (acc, [lat, lng]) => [acc[0] + lat, acc[1] + lng],
    [0, 0]
).map(v => v / borders.length);

var map = L.map('map', {
    boxZoom: false,

    center: center,
    maxBounds: borders,
    maxBoundsViscosity: 0.9,

    zoom: 18
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 18,
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

async function loadMarkers() {
    try {
        const response = await fetch('./data/markers.json');
        const data = await response.json();
        data.forEach(el => {
            switch (el.type) {
                case 'label':
                    L.marker(el.location, { zIndexOffset: 1000, interactive: false, icon: L.divIcon({  className: `l-marker lm-${el.color}`, html: `<div>${el.name}</div>`, iconSize: [32, 32], iconAnchor: [16, 16] }) })
                        .addTo(map);
                    break;

                case 'marker':
                    L.marker(el.location, { icon: L.icon({ iconUrl: './assets/icons/' + el.id + '.svg', iconSize: [32, 32], iconAnchor: [16, 16], tooltipAnchor: [16, 0] }) })
                        .bindTooltip(el.name)
                        .on('click', () => openDoors(el))
                        .addTo(map);
                    break;

                case 'area':
                    L.polygon(el.locations)
                        .bindTooltip(el.name)
                        .addTo(map);
                    break;

                default:
                    break;
            }
        });
    }
    catch (error) {
        console.error('Falha ao carregar marcadores!\n', error);
    }
}

loadMarkers();

/////////////////////////////////////////////////////////////////////////////////////////////

map.on('click', function (e) {
    if (e.originalEvent.shiftKey) {
        const { lat, lng } = e.latlng;
        const text = lat + ', ' + lng;
        navigator.clipboard.writeText(text);
    }
})

function openDoors(el) {
    map.once('moveend', async () => {
        const div = document.createElement('div');
        div.id = 'room#' + el.id;
        div.classList.add('room')

        const clsbtn = document.createElement('button');
        clsbtn.classList.add('room-back')
        clsbtn.addEventListener('click', () => {
            document.getElementById(`room#${el.id}`).remove();
            map.flyTo(center, 18);
        })

        const bg = document.createElement('div');
        bg.classList.add('room-bg')
        bg.style.backgroundImage = `url(./assets/rooms/${el.id}.jpeg)`;

        try {
            const response = await fetch('../../data/dados.json');
            const data = await response.json();

            data.forEach(mkr => {

                if (!mkr.roomid || mkr.roomid !== el.id)
                    return;

                // marker container
                const mkrDiv = document.createElement('div');
                mkrDiv.classList.add('r-marker');
                mkrDiv.style.left = mkr.position[0] + '%';
                mkrDiv.style.top = mkr.position[1] + '%';

                // marker image
                const img = document.createElement('img');
                img.src = 'https://example.com';
                img.classList.add('marker-img');

                // popup container
                const popup = document.createElement('div');
                popup.classList.add('marker-popup');

                popup.innerHTML = `
                    <h4>${mkr.code}</h4>
                    <span class="details">${mkr.name}</span>
                    <hr>
                    ${mkr.person ? `<b>Responsável:</b><br>${mkr.person}<br>` : ''}
                    ${mkr.description ? `<b>Sobre:</b><br>${mkr.description}<br>` : ''}
                    ${mkr.contacts ? '<b>Contatos:</b><br>' : ''}
                    ${mkr.contacts.tel ? (mkr.contacts.whatsapp ? `<i class='bi bi-whatsapp'></i> <a href="https://wa.me/${mkr.contacts.tel.replace(/[ +\-]/g, '')}" target="_blank">${mkr.contacts.tel}</a><br>` : `<i class='bi bi-telephone-fill'></i> ${mkr.contacts.tel}<br>`) : ''}
                    ${mkr.contacts.email ? `<i class='bi bi-envelope-fill'></i> <a href="mailto:${mkr.contacts.email}">${mkr.contacts.email}</a><br>` : ''}
                `;

                if (mkr.contacts.links) {
                    for (const link of mkr.contacts.links) {
                        popup.innerHTML += `<i class='bi bi-link-45deg'></i> <a href="${link}">${link}</a><br>`
                    }
                }

                // assemble
                mkrDiv.appendChild(img);
                mkrDiv.appendChild(popup);
                div.appendChild(mkrDiv);
            });

        }
        catch (error) {
            console.log(error);
        }

        div.append(clsbtn);
        div.append(bg);
        document.getElementById('map-container').appendChild(div);
    })

    map.flyTo(el.location, 22)
}