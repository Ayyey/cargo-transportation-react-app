import React, { useState, useEffect } from 'react'
import Modal from 'react-modal/lib/components/Modal'
import CustomersService from '../API/CustomersService';
import RouteService from '../API/RouteService'
import { useFetching } from '../hooks/useFetching';
import useDebounce from '../hooks/useDebounce';
import GraphhopperApi from '../API/GraphhopperApi';
import DriverService from '../API/DriverService';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine'
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
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [selectedAddresses, setSelectedAddresses] = useState(order.addresses);
    const [solutions, setSolutions] = useState(null);
    const [map, setMap] = useState(null);
    const [fetchData, isLoading, isError] = useFetching(async () => {
        DriverService.fetchDrivers()
            .then(data => { setDrivers(data) })
    });
    useEffect(() => {
        fetchData();
    }, []);
    const addSelectedDriver = (driver) => {
        setSelectedDrivers([...selectedDrivers, driver])
        setDrivers(drivers.filter((driverFltr) => { return driverFltr.id != driver.id }))
    }
    const removeSelectedDriver = (driver) => {
        setDrivers([...drivers, driver])
        setSelectedDrivers(selectedDrivers.filter((driverFltr) => { return driverFltr.id != driver.id }))
    }
    const createRoute = () => {
        GraphhopperApi.optimization(selectedAddresses, selectedDrivers)
            .then((data) => {
                console.log("optimized")
                GraphhopperApi.getSolution(data['job_id'])
                    .then((data) => {
                        console.log("got solution")
                        setSolutions(data.solution.routes);
                        const routes = data.solution.routes;
                        for (const [index, route] of routes.entries()) {
                            const ways = route.activities
                            const points = ways.map((item) => {
                                const points = []
                                points.push(item.address.lat)
                                points.push(item.address.lon)
                                return points
                            })
                            let routeStyle;
                            if (index === 2) {
                                routeStyle = { color: 'cyan' }
                            } else if (index === 1) {
                                routeStyle = { color: 'black' }
                            } else if (index === 0) {
                                routeStyle = { color: 'green' }
                            } else {
                                routeStyle = { color: 'blue' }
                            }
                            L.Routing.control({
                                waypoints: points,
                                lineOptions: {
                                    addWaypoints: false,
                                    styles: [routeStyle]
                                }
                            }).addTo(map);
                            const marker = new L.marker([
                                selectedDrivers[0].vehicle.startAddress.lat,
                                selectedDrivers[0].vehicle.startAddress.lon,])
                            map.addLayer(marker);
                            marker._icon.classList.add('huechange')
                        }
                    })
            })
    }
    const addRoute = () => {
        if (solutions != null) {
            const orderId = order.id;
            for (const driver of selectedDrivers) {
                const route = solutions.find((item) => +item['vehicle_id'] === driver.vehicle.id)

                const addresses = [];
                for (let i = 1; i < route.activities.length - 1; i++) {
                    addresses.push(+route.activities[i]['location_id']);
                }
                console.log(addresses)
                RouteService.addRoute(orderId, driver.id, addresses)
                    .then((data) => {
                        closeModal();
                    })
            }
        }
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
            <div style={{ display: "flex" }}>
                <div style={{ width: "200px", height: "100px", border: "1px solid black" }}>
                    {
                        drivers.map((driver, index) => {
                            return <div onClick={() => { addSelectedDriver(driver) }} key={index}>{driver.name}</div>
                        })
                    }
                </div>
                <div style={{ width: "200px", height: "100px", border: "1px solid black" }}>
                    {
                        selectedDrivers.map((driver, index) => {
                            return <div onClick={() => { removeSelectedDriver(driver) }} key={index}>{driver.name}</div>
                        })
                    }
                </div>
            </div>
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
            <input type="button" value="Построить маршрут" onClick={() => { createRoute() }} />
            <input type="button" value="Выдать" onClick={() => { addRoute() }} />
        </Modal >
    )
}
