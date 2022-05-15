import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import DriversTable from '../Components/DriverComponents/DriversTable'
import OrdersTable from '../Components/OrderComponents/OrdersTable'
import TransportTable from '../Components/TransportComponents/TransportTable'
import CustomersTable from '../Components/CustomersComponents/CustomersTable'
import DriverOrderTable from '../Components/DriverOrderTable/DriverOrderTable'
export default function Home({ role, token, navigate }) {
    const currentRoute = useLocation();
    switch (role.toLowerCase()) {
        case 'admin':
            return (<div>
                <h1>admin panel</h1>
                <div className='mt-5 d-flex'>
                    <button onClick={() => { navigate('home/orders') }} className={currentRoute.pathname.includes("orders") ? 'btn-primary' : 'btn-outline-primary'} >Заявки</button>
                    <button onClick={() => { navigate('home/drivers') }} className={currentRoute.pathname.includes("drivers") ? 'btn-primary' : 'btn-outline-primary'}>Водители</button>
                    <button onClick={() => { navigate('home/transports') }} className={currentRoute.pathname.includes("transports") ? 'btn-primary' : 'btn-outline-primary'}>Транспорт</button>
                    <button onClick={() => { navigate('home/customers') }} className={currentRoute.pathname.includes("customers") ? 'btn-primary' : 'btn-outline-primary'}>Заказчики</button>
                </div>
                <Routes>
                    <Route path='orders' element={<OrdersTable></OrdersTable>}></Route>
                    <Route path='drivers' element={<div><DriversTable></DriversTable></div>}></Route>
                    <Route path='transports' element={<div><TransportTable></TransportTable></div>}></Route>
                    <Route path='customers' element={<div><CustomersTable></CustomersTable></div>}></Route>
                </Routes>
                <button onClick={() => { localStorage.clear(); navigate('login') }}>Выйти</button>
            </div>
            )
        case 'driver':
            return (<div>
                <h1>driver panel</h1>
                <div className='mt-5 d-flex'>
                    <button onClick={() => { navigate('home/newOrders') }} className={currentRoute.pathname.includes("newOrders") ? 'btn-primary' : 'btn-outline-primary'}>Новые заявки</button>
                    <button onClick={() => { navigate('home/doneOrders') }} className={currentRoute.pathname.includes("doneOrders") ? 'btn-primary' : 'btn-outline-primary'}>Выполненные</button>
                </div>
                <Routes>
                    <Route path='newOrders' element={<DriverOrderTable></DriverOrderTable>}></Route>
                    <Route path='doneOrders' element={<div>doneOrders</div>}></Route>
                </Routes>
                <button onClick={() => { localStorage.clear(); navigate('login') }}>Выйти</button>
            </div>)
        default:
            return (<div>Pusto:(</div>)
    }
}
