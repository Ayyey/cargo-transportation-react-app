import React, { useState, useEffect } from 'react'
import OrdersService from '../API/OrdersService';
import { useFetching } from '../hooks/useFetching';
import AddOrderModal from './AddOrderModal';
import AssignOrderModal from './AssignOrderModal';
import ChangeOrderModal from './ChangeOrderModal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

export default function OrdersTable() {
    const [items, setItems] = useState([])
    const [filter, setFilter] = useState('finished')
    const [modal, setModal] = useState(null);
    const [fetchData, isLoading, isError] = useFetching(async () => {
        await OrdersService.fetchOrders().
            then(result => {
                switch (filter) {
                    case 'assigned':
                        result = result.filter(item => item.assigned)
                        break;
                    case 'notassigned':
                        result = result.filter(item => !item.assigned)
                        break;
                    case 'finished':
                        result = result.filter(item => item.finished)
                        break;
                }
                setItems(result);
            })
    })
    useEffect(() => {
        fetchData();
    }, [filter, modal])
    const closeModal = () => {
        setModal(null);
    }
    const openAddModal = () => {
        setModal(<AddOrderModal isOpen={true} closeModal={closeModal} />)
    }
    const openChangeModal = (order) => {
        setModal(<ChangeOrderModal isOpen={true} closeModal={closeModal} order={order} />)
    }
    const openAssignmentModal = (order) => {
        setModal(<AssignOrderModal isOpen={true} closeModal={closeModal} order={order} />)
    }
    const deleteOrder = (order) => {
        OrdersService.deleteOrder(order.id).then(data => {
            fetchData();
        })
    }
    return (
        <div>
            {modal ?? <></>}
            <ul>
                <li><button onClick={() => { openAddModal(); }}>Добавить</button></li>
                <li><button onClick={() => { setFilter('assigned') }}>Выданные</button></li>
                <li><button onClick={() => { setFilter('notassigned') }}>Невыданные</button></li>
                <li><button onClick={() => { setFilter('finished') }}>Выполненные</button></li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Адрес</th>
                        <th>Заказчик</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? <tr><td><div>Loading...</div></td></tr> :
                        items.map(item => {
                            return (
                                <tr key={item?.id}>
                                    <td>{item?.id}</td>
                                    <td>{item?.addresses?.map(adr => adr.name + ',')}</td>
                                    <td>{item?.customer?.name}</td>
                                    {
                                        filter == "notassigned" ?
                                            <td>
                                                <button onClick={() => { openAssignmentModal(item) }}>Выдать</button>
                                                <button onClick={() => { openChangeModal(item) }}>Изменить</button>
                                                <button onClick={() => { deleteOrder(item) }}>Удалить</button>
                                            </td> :
                                            <td>
                                                <button onClick={() => { openChangeModal(item) }}>Изменить</button>
                                                <button onClick={() => { deleteOrder(item) }}>Удалить</button>
                                            </td>
                                    }
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        </div>
    )
}
