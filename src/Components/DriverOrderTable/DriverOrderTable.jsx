import React, { useState, useEffect } from 'react'
import { useFetching } from '../../hooks/useFetching';
import DriverService from '../../API/DriverService';
export default function DriverOrderTable({ driver }) {
    const [routes, setRoutes] = useState([])
    const [modal, setModal] = useState(null);
    const [fetchData, isLoading, isError] = useFetching(async () => {
        DriverService.fetchDriversRoutes(driver.id)
            .then((data) => {
                setRoutes(data);
                console.log(data);
            })
    })
    useEffect(() => {
        fetchData();
    }, [modal])
    const closeModal = () => {
        setModal(null);
    }
    const openOrderViewModal = () => {
        setModal()
    }
    const setOrderFinished = (id) => {

    }
    return (
        <div>
            {modal ?? <></>}
            <div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Адрес</th>
                            <th>Заказчик</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td><div>Loading...</div></td></tr> :
                            routes.map(item => {
                                return (
                                    <tr key={item?.id}>
                                        <td>{item?.id}</td>
                                        <td>{item?.addresses?.map(adr => adr.name + ',')}</td>
                                        {
                                            <td>
                                                <button onClick={() => { }} className="btn btn-primary mx-3">Изменить</button>
                                                <button onClick={() => { }} className="btn btn-danger">Удалить</button>
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
