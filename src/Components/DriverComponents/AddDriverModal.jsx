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
export default function AddDriverModal({ closeModal }) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [freeTransport, setFreeTransport] = useState([]);
    const [selectedTransportId, setSelectedTransportId] = useState(null);
    const [fetchFreeTransport, isLoading, isError] = useFetching(async () => {
        await TransportService.fetchFreeTransports().then((data) => {
            if (data.length > 0)
                setSelectedTransportId(data[0].id)
            setFreeTransport(data);
        })
    })
    useEffect(() => {
        fetchFreeTransport();
    }, [])
    const addDriver = () => {
        DriverService.addDrivers(name, surname, patronymic, login, password, phoneNumber, selectedTransportId)
            .then(() => {
                closeModal();
            })
    }
    return (
        <Modal isOpen={true} onRequestClose={closeModal} style={customStyles}>
            <h4 className='text-center'>Добавление водителя</h4>
            <div>
                ФИО
                <div className='d-flex'>
                    <input type="text" placeholder='Имя' className='mb-3 form-control' onChange={(e) => { setName(e.target.value) }} />
                    <input type="text" placeholder='Фамилия' className='mb-3 form-control' onChange={(e) => { setSurname(e.target.value) }} />
                    <input type="text" placeholder='Отчество' className='mb-3 form-control' onChange={(e) => { setPatronymic(e.target.value) }} />
                </div>
                Логин
                <div>
                    <input type="text" placeholder='Логин' className='mb-3 form-control' onChange={(e) => { setLogin(e.target.value) }} />
                </div>
                Пароль
                <div>
                    <input type="text" placeholder='Пароль' className='mb-3 form-control' onChange={(e) => { setPassword(e.target.value) }} />
                </div>
                Телефон
                <div>
                    <input type="text" placeholder='Телефон' className='mb-3 form-control' onChange={(e) => { setPhoneNumber(e.target.value) }} />
                </div>
                Транспортное средство
                <div>
                    <select type="text" placeholder='Транспорт' className='mb-3 form-control' onChange={(e) => { setSelectedTransportId(e.target.value) }}>
                        {freeTransport.map((item) => {
                            return (
                                <option key={item.id} value={item.id}>
                                    {item?.name}
                                </option>
                            )
                        })}
                    </select>
                </div>
                <button className='btn btn-primary' onClick={() => { addDriver() }}>Отправить</button>
            </div>
        </Modal >
    )
}
