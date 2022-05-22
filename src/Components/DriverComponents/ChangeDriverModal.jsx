import React, { useState, useEffect } from 'react'
import Modal from 'react-modal/lib/components/Modal'
import DriverService from '../../API/DriverService';
import TransportService from '../../API/TransportService';
import { useFetching } from '../../hooks/useFetching';
const customStyles = {
    content: {
        width: 600,
        height: 520,
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
export default function ChangeDriverModal({ closeModal, driver }) {
    const [name, setName] = useState(driver.name);
    const [surname, setSurname] = useState(driver.surname);
    const [patronymic, setPatronymic] = useState(driver.patronymic);
    const [login, setLogin] = useState(driver.login);
    const [phoneNumber, setPhoneNumber] = useState(driver.phoneNumber);
    const [freeTransport, setFreeTransport] = useState([]);
    const [selectedTransportId, setSelectedTransportId] = useState(driver.vehicle.id);
    const [fetchFreeTransport, isLoading, isError] = useFetching(async () => {
        await TransportService.fetchFreeTransports().then((data) => {
            data.push(driver.vehicle)
            setFreeTransport(data);
        })
    })
    useEffect(() => {
        fetchFreeTransport();
    }, [])
    const addDriver = () => {
        DriverService.changeDrivers(driver.id, name, surname, patronymic, login, '123', phoneNumber, selectedTransportId)
            .then(() => {
                closeModal();
            })
    }
    return (
        <Modal isOpen={true} onRequestClose={closeModal} style={customStyles}>
            <h4 className='text-center'>Изменение водителя</h4>
            <div>
                ФИО
                <div className='d-flex'>
                    <input type="text" placeholder='Имя' className='mb-3 form-control' onChange={(e) => { setName(e.target.value) }} value={name ?? ''} />
                    <input type="text" placeholder='Фамилия' className='mb-3 form-control' onChange={(e) => { setSurname(e.target.value) }} value={surname ?? ''} />
                    <input type="text" placeholder='Отчество' className='mb-3 form-control' onChange={(e) => { setPatronymic(e.target.value) }} value={patronymic ?? ''} />
                </div>
                <div>
                    Логин
                    <input type="text" placeholder='Логин' className='mb-3 form-control' onChange={(e) => { setLogin(e.target.value) }} value={login ?? ''} />
                </div>
                <div>
                    Телефон
                    <input type="text" placeholder='Телефон' className='mb-3 form-control' onChange={(e) => { setPhoneNumber(e.target.value) }} value={phoneNumber ?? ''} />
                </div>
                <div>
                    Транспортное средство
                    <select type="text" placeholder='Транспорт' className='mb-3 form-control' onChange={(e) => { setSelectedTransportId(e.target.value) }}>
                        {freeTransport.map((item) => {
                            return item.id == selectedTransportId ?
                                <option selected key={item.id} value={item.id}>{item?.name}</option> :
                                <option key={item.id} value={item.id}>{item?.name}</option>
                        })}
                    </select>
                </div>
                <button className='btn btn-primary' onClick={() => { addDriver() }}>Отправить</button>
            </div>
        </Modal >
    )
}
