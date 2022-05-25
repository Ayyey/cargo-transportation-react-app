import React, { useState, useEffect } from 'react'
import Modal from 'react-modal/lib/components/Modal'
import RouteService from '../../API/RouteService'
import { useFetching } from '../../hooks/useFetching';
import GraphhopperApi from '../../API/GraphhopperApi';
import HopperService from '../../API/HopperService';
import DriverService from '../../API/DriverService';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { icon, greenIcon } from '../../marker';
import 'leaflet-routing-machine'
import 'leaflet/dist/leaflet.css';
const customStyles = {
    content: {
        width: 800,
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
        HopperService.optimization(selectedAddresses, selectedDrivers)
            .then((data) => {
                setSolutions(data.routeLists)
                const routes = data.routeLists;
                for (const [index, route] of routes.entries()) {
                    const ways = route.groupedOrder
                    const points = ways.map((item) => {
                        const points = []
                        points.push(item.latitude)
                        points.push(item.longitude)
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
                        addWaypoints: false,
                        lineOptions: {
                            addWaypoints: false,
                            styles: [routeStyle]
                        },
                        createMarker: function () { return null }
                    }).addTo(map);
                    if (index == 0 || index == routes.length) {
                        const marker = new L.marker([
                            ways[0].latitude,
                            ways[0].longitude
                        ], { icon: greenIcon }
                        )
                        map.addLayer(marker)
                    }
                }
            })
    }
    const addRoute = () => {
        if (solutions != null) {
            const orderId = order.id;
            for (const driver of selectedDrivers) {
                const routeList = solutions.find((item) => item.driver.truck.id === driver.vehicle.id)
                const addresses = [];
                for (let i = 0; i < routeList.groupedOrder.length; i++) {
                    addresses.push(routeList.groupedOrder[i].id);
                }
                RouteService.addRoute(orderId, driver.id, addresses)
                    .then((data) => {
                        closeModal();
                    })
            }
        }
    }
    return (
        <Modal isOpen={true} onRequestClose={closeModal} style={customStyles}>
            <h4 className='text-center'>Назначение заявки</h4>
            <div className="d-flex">
                <div className="mx-3" style={{ maxWidth: "194px" }}>
                    <div className='d-block' >
                        Доступные водители:
                        <div className='form-control' style={{ width: "200px", height: "100px" }}>
                            {
                                drivers.map((driver, index) => {
                                    return <div onClick={() => { addSelectedDriver(driver) }} key={index}>{driver.name}</div>
                                })
                            }
                        </div>
                        Выбранные водители:
                        <div className='form-control' style={{ width: "200px", height: "100px" }}>
                            {
                                selectedDrivers.map((driver, index) => {
                                    return <div onClick={() => { removeSelectedDriver(driver) }} key={index}>{driver.name}</div>
                                })
                            }
                        </div>
                    </div>
                    <div>Адреса:
                        <ul className='p-0'>
                            {
                                selectedAddresses.map((item, index) => {
                                    return <li className='list-group-item' key={index}>
                                        {item.name}
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                    <input className='mb-3 btn btn-success' type="button" value="Построить маршрут" onClick={() => { createRoute() }} />
                    <input className='btn btn-primary' type="button" value="Выдать" onClick={() => { addRoute() }} />
                </div>
                <MapContainer center={[52.30217, 104.30023]} zoom={13} style={{ width: "600px", height: "500px" }} id={'map'}
                    whenCreated={setMap}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        selectedAddresses.map((point, index) => {
                            return <Marker position={[point.lat, point.lon]} key={index} icon={icon} ></Marker>
                        })
                    }

                </MapContainer>
            </div>
        </Modal >
    )
}
