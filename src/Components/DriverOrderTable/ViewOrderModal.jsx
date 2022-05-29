import React, { useEffect, useState } from 'react'
import Modal from 'react-modal/lib/components/Modal'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet/dist/leaflet.css';
import '../../styles/leaflet-option.css'
import { greenIcon, icon } from '../../marker';
import { point } from 'leaflet';
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
    const loadRoutes = (loadedMap) => {
        setMap(loadedMap)
        loadedMap.setView([52.30217, 104.30023], 13)
        const points = order.addresses.map(item => {
            const points = [];
            points.push(item.lat);
            points.push(item.lon);
            return points;
        })
        const startPoint = [order.driver.vehicle.startAddress.lat, order.driver.vehicle.startAddress.lon]
        points.unshift(startPoint);
        points.push(startPoint)
        L.Routing.control({
            waypoints: points,
            lineOptions: {
                addWaypoints: false
            },
            createMarker: function () { return null }
        }).addTo(loadedMap);
        for (const point of points) {
            const marker = new L.marker(point, { icon: icon })
            loadedMap.addLayer(marker)
        }
        const startMarker = new L.marker(startPoint, { icon: greenIcon })
        loadedMap.addLayer(startMarker)
    }
    return (
        <Modal isOpen={true} onRequestClose={closeModal} style={customStyles}>
            <h4 className='text-center'>Маршрут</h4>
            <MapContainer center={[52.30217, 104.30023]} zoom={13} style={{ width: "600px", height: "500px" }} id={'map'}
                whenCreated={loadRoutes}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </Modal >
    )
}

