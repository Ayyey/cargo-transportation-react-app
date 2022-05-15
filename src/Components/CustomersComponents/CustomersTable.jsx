import React, { useState, useEffect } from 'react'
import { useFetching } from '../../hooks/useFetching';
import ChangeCustomerModal from './ChangeCustomerModal';
import CustomersService from '../../API/CustomersService';
import AddCustomerModal from './AddCustomerModal';
export default function CustomersTable() {
    const [customers, setCustomers] = useState([])
    const [modal, setModal] = useState(null);
    const [fetchData, isLoading, isError] = useFetching(async () => {
        await CustomersService.fetchCustomers().
            then(result => {
                setCustomers(result);
            })
    })
    useEffect(() => {
        fetchData();
    }, [modal])
    const closeModal = () => {
        setModal(null);
    }
    const openAddModal = () => {
        setModal(<AddCustomerModal isOpen={true} closeModal={closeModal}></AddCustomerModal>)
    }
    const openChangeModal = (customer) => {
        setModal(<ChangeCustomerModal isOpen={true} closeModal={closeModal} customer={customer}></ChangeCustomerModal>)
    }
    const deleteCustomer = (id) => {
        CustomersService.deleteCustomer(id).then(() => {
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
                            <th>Наименование</th>
                            <th>Телефон</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td><div>Loading...</div></td></tr> :
                            customers.map(item => {
                                return (
                                    <tr key={item?.id}>
                                        <td>{item?.id}</td>
                                        <td>{item?.name}</td>
                                        <td>{item?.phoneNumber}</td>
                                        {
                                            <td>
                                                <button onClick={() => { openChangeModal(item) }} className="btn btn-primary mx-3">Изменить</button>
                                                <button onClick={() => { deleteCustomer(item.id) }} className="btn btn-danger">Удалить</button>
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
