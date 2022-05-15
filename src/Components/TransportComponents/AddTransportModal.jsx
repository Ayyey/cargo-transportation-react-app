import React, { useState, useEffect } from 'react'
import Modal from 'react-modal/lib/components/Modal'
import TransportService from '../../API/TransportService';
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
export default function AddTransportModal({ closeModal }) {
    const [name, setName] = useState('');
    const addTransport = () => {
        TransportService.addTransports(name);
        closeModal();
    }
    return (
        <Modal isOpen={true} onRequestClose={closeModal} style={customStyles}>
            <h4 className='text-center'>Добавление транспортного средства</h4>
            <div>
                <div>
                    <input type="text" placeholder='Название' className='mb-3 form-control' onChange={(e) => { setName(e.target.value) }} />
                </div>
                <button className='btn btn-primary' onClick={() => { addTransport() }}>Отправить</button>
            </div>
        </Modal >
    )
}
