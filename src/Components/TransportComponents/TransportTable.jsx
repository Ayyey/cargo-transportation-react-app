import React, { useState, useEffect } from 'react'
import { useFetching } from '../../hooks/useFetching';
import DriverService from '../../API/DriverService';
import TransportService from '../../API/TransportService';
import ChangeTransportModal from './ChangeTransportModal';
import AddTransportModal from './AddTransportModal';
export default function TransportTable() {
    const [transports, setTransports] = useState([])
    const [modal, setModal] = useState(null);
    const [fetchData, isLoading, isError] = useFetching(async () => {
        await TransportService.fetchTransports().
            then(result => {
                setTransports(result);
            })
    })
    useEffect(() => {
        fetchData();
    }, [modal])
    const closeModal = () => {
        setModal(null);
    }
    const openAddModal = () => {
        setModal(<AddTransportModal isOpen={true} closeModal={closeModal}></AddTransportModal>)
    }
    const openChangeModal = (transport) => {
        setModal(<ChangeTransportModal isOpen={true} closeModal={closeModal} transport={transport}></ChangeTransportModal>)
    }
    const deleteTransport = (id) => {
        TransportService.deleteTransports(id).then(() => {
            fetchData();
        })
    }
    return (
        <div>
            {modal ?? <></>}
            <div>
                <button onClick={() => { openAddModal(); }} className="btn btn-success mx-3">Добавить</button>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Название</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td><div>Loading...</div></td></tr> :
                            transports.map(item => {
                                return (
                                    <tr key={item?.id}>
                                        <td>{item?.id}</td>
                                        <td>{item?.name}</td>
                                        {
                                            <td>
                                                <button onClick={() => { openChangeModal(item) }} className="btn btn-primary mx-3">Изменить</button>
                                                <button onClick={() => { deleteTransport(item.id) }} className="btn btn-danger">Удалить</button>
                                            </td>
                                        }
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
