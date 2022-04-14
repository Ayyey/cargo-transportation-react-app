import React, { useState, useEffect } from 'react'
import Modal from 'react-modal/lib/components/Modal'
import CustomersService from '../API/CustomersService';
import RouteService from '../API/RouteService'
import { useFetching } from '../hooks/useFetching';
import useDebounce from '../hooks/useDebounce';
import GraphhopperApi from '../API/GraphhopperApi';
import DriverService from '../API/DriverService';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


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
export default function AssignOrderModal({ closeModal, order }) {
    const [drivers, setDrivers] = useState([])
    const [selectedDriverId, setSelectedDriverId] = useState();
    const [selectedAddresses, setSelectedAddresses] = useState(order.addresses);
    const [map, setMap] = useState(null);
    const [fetchData, isLoading, isError] = useFetching(async () => {
        DriverService.fetchDrivers()
            .then(data => { console.log(data); setDrivers(data); if (data?.length > 0) { setSelectedDriverId(data[0].id); console.log(data[0].id) } })
    });
    useEffect(() => {
        fetchData();
    }, []);
    const createRoute = () => {

    }
    const addRoute = () => {

    }
    return (
        <Modal isOpen={true} onRequestClose={closeModal} style={customStyles}>
            <MapContainer center={[52.30217, 104.30023]} zoom={13} style={{ width: "600px", height: "500px" }} id={'map'}
                whenCreated={setMap}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    selectedAddresses.map((point, index) => {
                        return <Marker position={[point.lat, point.lon]} key={index} ></Marker>
                    })
                }
            </MapContainer>
            <select className="form-select" onChange={(e) => { setSelectedDriverId(e.target.value); }}>
                {
                    drivers.map(item => {
                        return <option key={item.id} value={item?.id}> {item?.name} </option>
                    })
                }
            </select>
            <div>
                <ul>
                    {
                        selectedAddresses.map((item, index) => {
                            return <li key={index}>
                                {item.name}
                            </li>
                        })
                    }
                </ul>
            </div>
            <input type="button" value="Построить маршрут" onClick={() => { }} />
            <input type="button" value="Выдать" onClick={() => { }} />
        </Modal >
    )
}
