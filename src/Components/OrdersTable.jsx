import React, { useState, useEffect } from 'react'
import OrdersService from '../API/OrdersService';
import CustomersService from '../API/CustomersService';
import Modal from 'react-modal/lib/components/Modal';
import { useFetching } from '../hooks/useFetching';
import SearchAddress from './SearchAddress';
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
    const [items, setItems] = useState(null)
    const [filter, setFilter] = useState('finished')
    const [modalState, setModalState] = useState({ isOpen: false, modal: null });
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
    }, [filter])
    const closeModal = () => {
        setModalState({ isOpen: false, modal: null });
    }
    const openAddModal = async () => {
        let customers = await CustomersService.fetchCustomers();
        console.log(customers);
        const modal = (
            <Modal isOpen={true} onRequestClose={closeModal} style={customStyles}>
                <select className="form-select" id="customerId">
                    {customers.map(item => {
                        return (
                            <option key={item.id} value={item?.id}>
                                {item?.name}
                            </option>
                        )
                    })}
                </select>
                <SearchAddress></SearchAddress>
            </Modal >
        )
        setModalState({ isOpen: true, modal: modal })
    }
    const openChangeModal = async (item) => {
        const modal = (
            <Modal isOpen={true} onRequestClose={closeModal} style={customStyles}>
                Изменить
            </Modal>
        )
        setModalState({ isOpen: true, modal: modal })
    }
    const openAssignmentModal = async (item) => {
        const modal = (
            <Modal isOpen={true} onRequestClose={closeModal} style={customStyles}>
                Выдать
            </Modal>
        )
        setModalState({ isOpen: true, modal: modal })
    }
    return (
        <div>
            {modalState.isOpen && modalState.modal}
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
                                            <td><button onClick={() => { openAssignmentModal(item) }}>Выдать</button><button onClick={() => { openChangeModal(item) }}>Изменить</button><button>Удалить</button></td> :
                                            <td><button onClick={() => { openChangeModal(item) }}>Изменить</button><button>Удалить</button></td>
                                    }
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        </div>
    )
}
