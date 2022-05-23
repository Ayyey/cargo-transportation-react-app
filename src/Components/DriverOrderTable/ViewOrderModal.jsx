import React, { useEffect, useState } from 'react'
import Modal from 'react-modal/lib/components/Modal'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet/dist/leaflet.css';
import '../../styles/leaflet-option.css'
import { icon } from '../../marker';
const customStyles = {
    content: {
        width: 600,
        height: 600,
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

export default function ViewOrderModal({ closeModal, order }) {
    const [map, setMap] = useState(null);
    setTimeout(() => {
        order.addresses.unshift({
            lat: order.driver.vehicle.startAddress.lat,
            lon: order.driver.vehicle.startAddress.lon
        })
        order.addresses.push({
            lat: order.driver.vehicle.startAddress.lat,
            lon: order.driver.vehicle.startAddress.lon
        })
        if (!map)
            map = L.map('map');
        map.setView([52.30217, 104.30023], 14)
        const points = order.addresses.map(item => {
            const points = [];
            points.push(item.lat);
            points.push(item.lon);
            return points;
        })
        L.Routing.control({
            waypoints: points,
            lineOptions: {
                addWaypoints: false
            },
            createMarker: function () { return icon }
        }).addTo(map);
        for (const point of points) {
            const marker = new L.marker([
                point.lat,
                point.lon
            ], { icon: icon }
            )
            map.addLayer(marker)
        }
    }, 400)
    return (
        <Modal isOpen={true} onRequestClose={closeModal} style={customStyles}>
            <h4 className='text-center'>Маршрут</h4>
            <MapContainer center={[52.30217, 104.30023]} zoom={13} style={{ width: "600px", height: "500px" }} id={'map'}
                whenCreated={setMap}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </Modal >
    )
}

