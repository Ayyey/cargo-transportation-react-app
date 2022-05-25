import React, { useState, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useFetching } from '../../hooks/useFetching';
import DriverService from '../../API/DriverService';
import RouteService from '../../API/RouteService';
import ViewOrderModal from './ViewOrderModal';
export default function DriverOrderTable() {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const currentRoute = useLocation();
    const [routes, setRoutes] = useState([]);
    const [modal, setModal] = useState(null);
    const [filter, setFilter] = useState('');
    const [fetchData, isLoading, isError] = useFetching(async () => {
        for (let i = 0; i < 5; i++) {
            const closureConst = i;
            DriverService.fetchDriversRoutes(userId)
                .then((data) => {
                    data = data.filter((item) => {
                        if (filter == 'finished')
                            return item.finished;
                        else if (filter == 'notfinished')
                            return !item.finished
                    })
                    setRoutes(data);
                })
        }
    })

    useEffect(() => {
        fetchData();
    }, [modal, filter])
    const closeModal = () => {
        setModal(null);
    }
    const openOrderViewModal = (order) => {
        setModal(<ViewOrderModal closeModal={closeModal} order={order}></ViewOrderModal>);
    }
    const setOrderFinished = (id) => {
        RouteService.setRouteFinished(id).then(() => { fetchData() });
    }
    return (
        <div>
            {modal ?? <></>}
            <div>
                <div className='mt-5 d-flex' style={{ paddingLeft: '32px' }}>
                    <button onClick={() => { navigate('home/newOrders');; setFilter('notfinished') }} className={currentRoute.pathname.includes("newOrders") ? 'btn btn-primary' : 'btn btn-outline-primary'}>Новые заявки</button>
                    <button onClick={() => { navigate('home/doneOrders'); setFilter('finished') }} className={currentRoute.pathname.includes("doneOrders") ? 'btn btn-primary' : 'btn btn-outline-primary'}>Выполненные</button>
                </div>
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
                                        <td>{item?.order.customer.name}</td>
                                        {
                                            <td>
                                                <button onClick={() => { openOrderViewModal(item) }} className="btn btn-primary mx-3">Просмотр</button>
                                                {filter == 'notfinished' ? <button onClick={() => { setOrderFinished(item.id) }} className="btn btn-primary mx-3">Выполнено</button> : <></>}
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
