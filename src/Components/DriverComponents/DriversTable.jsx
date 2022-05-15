import React, { useState, useEffect } from 'react'
import { useFetching } from '../../hooks/useFetching';
import ChangeDriverModal from './ChangeDriverModal';
import DriverService from '../../API/DriverService';
import AddDriverModal from './AddDriverModal';
export default function DriversTable() {
    const [drivers, setDrivers] = useState([])
    const [modal, setModal] = useState(null);
    const [fetchData, isLoading, isError] = useFetching(async () => {
        await DriverService.fetchDrivers().
            then(result => {
                setDrivers(result);
            })
    })
    useEffect(() => {
        fetchData();
    }, [modal])
    const closeModal = () => {
        setModal(null);
    }
    const openAddModal = () => {
        setModal(<AddDriverModal isOpen={true} closeModal={closeModal}></AddDriverModal>)
    }
    const openChangeModal = (driver) => {
        setModal(<ChangeDriverModal isOpen={true} closeModal={closeModal} driver={driver}></ChangeDriverModal>)
    }
    const deleteDriver = (id) => {
        DriverService.deleteDrivers(id).then(() => {
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
                            <th>ФИО</th>
                            <th>Логин</th>
                            <th>Телефон</th>
                            <th>Транспорт</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td><div>Loading...</div></td></tr> :
                            drivers.map(item => {
                                return (
                                    <tr key={item?.id}>
                                        <td>{item?.id}</td>
                                        <td>{item?.name + " " + item?.surname + " " + item?.patronymic}</td>
                                        <td>{item?.login}</td>
                                        <td>{item?.phoneNumber}</td>
                                        <td>{item?.vehicle?.name}</td>
                                        {
                                            <td>
                                                <button onClick={() => { openChangeModal(item) }} className="btn btn-primary mx-3">Изменить</button>
                                                <button onClick={() => { deleteDriver(item.id) }} className="btn btn-danger">Удалить</button>
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
