import React, { useState, useEffect } from 'react'
import Modal from 'react-modal/lib/components/Modal'
import CustomersService from '../../API/CustomersService';
const customStyles = {
    content: {
        width: 600,
        height: 300,
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
export default function AddCustomerModal({ closeModal, customer }) {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const addCustomer = () => {
        CustomersService.addCustomer(name, phoneNumber)
            .then(() => {
                closeModal();
            })
    }
    return (
        <Modal isOpen={true} onRequestClose={closeModal} style={customStyles}>
            <h4 className='text-center'>Добавление заказчика</h4>
            <div>
                <div >
                    Наименование заказчика
                    <input type="text" placeholder='Наименование' className='mb-3 form-control' onChange={(e) => { setName(e.target.value) }} value={name ?? ''} />
                </div>
                <div>
                    Телефон заказчика
                    <input type="text" placeholder='Телефон' className='mb-3 form-control' onChange={(e) => { setPhoneNumber(e.target.value) }} value={phoneNumber ?? ''} />
                </div>
                <button className='btn btn-primary' onClick={() => { addCustomer() }}>Отправить</button>
            </div>
        </Modal >
    )
}
