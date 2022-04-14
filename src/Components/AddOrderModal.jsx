import React, { useState, useEffect } from 'react'
import Modal from 'react-modal/lib/components/Modal'
import CustomersService from '../API/CustomersService';
import { useFetching } from '../hooks/useFetching';
import useDebounce from '../hooks/useDebounce';
import GraphhopperApi from '../API/GraphhopperApi';
import OrdersService from '../API/OrdersService';
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

export default function AddOrderModal({ closeModal }) {
    const [customers, setCustomers] = useState([])
    const [selectedCustomerId, setSelectedCustomerId] = useState();
    const [inputAddress, setInputAddress] = useState();
    const [foundAddresses, setFoundAddresses] = useState([]);
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [map, setMap] = useState(null);
    const debouncedSearchedTerm = useDebounce(inputAddress, 500);
    const [fetchData, isLoading, isError] = useFetching(async () => {
        CustomersService.fetchCustomers()
            .then(data => { setCustomers(data); if (data?.length > 0) setSelectedCustomerId(data[0].id) });
    });
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        if (debouncedSearchedTerm)
            GraphhopperApi.searchAddress(debouncedSearchedTerm).then(data => {
                setFoundAddresses(data?.hits)
            })
    }, [debouncedSearchedTerm])
    const addAddress = (adr) => {
        setSelectedAddresses([...selectedAddresses, adr]);
        map.setView([adr.lat, adr.lon])
        setFoundAddresses([]);
        setInputAddress("");
        document.getElementById("adressInput").value = ""
    }
    const addOrder = async () => {
        await OrdersService.addOrder(selectedAddresses, selectedCustomerId);
        closeModal();
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
                        return <Marker position={[point.lat, point.lon]} key={index}></Marker>
                    })
                }
            </MapContainer>
            <select className="form-select" onChange={(e) => { setSelectedCustomerId(e.target.value) }}>
                {
                    customers.map(item => {
                        return (
                            <option key={item.id} value={item?.id}>
                                {item?.name}
                            </option>
                        )
                    })
                }
            </select>
            <div>
                <div>
                    <input id="adressInput" type="text" placeholder='Адрес' onChange={(e) => { setInputAddress(e.target.value) }} />
                    <ul>
                        {
                            foundAddresses.map((item, index) => {
                                let adr = { name: '', lat: item.point.lat, lon: item.point.lng };
                                adr.name = item.housenumber ? item.housenumber + ', ' : '';
                                adr.name += item.name ? item.name + ', ' : '';
                                adr.name += item.postcode ? item.postcode + ', ' : '';
                                adr.name += item.city ? item.city + ', ' : '';
                                adr.name += item.country ?? '';
                                adr.osm_id = item.osm_id
                                return (<li key={index} onClick={() => { addAddress(adr) }}>{adr.name}</li>)
                            })
                        }
                    </ul>
                </div>
                <ul>
                    {
                        selectedAddresses.map((item, index) => {
                            return (<li key={index}>{item.name}</li>)
                        })
                    }
                </ul>
            </div>
            <input type="button" value="Добавить" onClick={addOrder} />
        </Modal >
    )
}

