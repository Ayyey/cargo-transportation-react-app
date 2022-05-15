import React, { useState, useEffect } from 'react'
import Modal from 'react-modal/lib/components/Modal'
import CustomersService from '../../API/CustomersService';
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
export default function ChangeCustomerModal({ closeModal, customer }) {
    const [name, setName] = useState(customer.name);
    const [phoneNumber, setPhoneNumber] = useState(customer.phoneNumber);
    const changeCustomer = () => {
        CustomersService.changeCustomer(customer.id, name, phoneNumber)
            .then(() => {
                closeModal();
            })
    }
    return (
        <Modal isOpen={true} onRequestClose={closeModal} style={customStyles}>
            <h4 className='text-center'>Изменение заказчика</h4>
            <div>
                <div>
                    <input type="text" placeholder='Наименование' className='mb-3 form-control' onChange={(e) => { setName(e.target.value) }} value={name ?? ''} />
                </div>
                <div>
                    <input type="text" placeholder='Телефон' className='mb-3 form-control' onChange={(e) => { setPhoneNumber(e.target.value) }} value={phoneNumber ?? ''} />
                </div>
                <button className='btn btn-primary' onClick={() => { changeCustomer() }}>Отправить</button>
            </div>
        </Modal >
    )
}
