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
export default function ChangeTransportModal({ closeModal, transport }) {
    const [name, setName] = useState(transport.name);
    const addTransport = () => {
        TransportService.changeTransports(transport.id, name).then(() => {
            closeModal();
        })
    }
    return (
        <Modal isOpen={true} onRequestClose={closeModal} style={customStyles}>
            <h4 className='text-center'>Изменение транспортного средства</h4>
            <div>
                <div>
                    <input type="text" placeholder='Название' className='mb-3 form-control' onChange={(e) => { setName(e.target.value) }} value={name ?? ''} />
                </div>
                <button className='btn btn-primary' onClick={() => { addTransport() }}>Отправить</button>
            </div>
        </Modal >
    )
}
