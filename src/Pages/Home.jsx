import React, { useState, useEffect } from 'react'
import { Route, Routes} from 'react-router-dom'
import OrdersTable from '../Components/OrdersTable'

export default function Home({ role, token, navigate }) {
    switch (role.toLowerCase()) {
        case 'admin':
            return (<div>
                <h1>admin panel</h1>
                <ul>
                    <li><button onClick={()=>{navigate('home/orders')}}>Заявки</button></li>
                    <li><button onClick={()=>{navigate('home/drivers')}}>Водители</button></li>
                    <li><button onClick={()=>{navigate('home/transports')}}>Транспорт</button></li>
                    <li><button onClick={()=>{navigate('home/customers')}}>Заказчики</button></li>
                </ul>
                <Routes>
                    <Route path='orders' element={<OrdersTable></OrdersTable>}></Route>
                    <Route path='drivers' element={<div>drivers</div>}></Route>
                    <Route path='transports' element={<div>transports</div>}></Route>
                    <Route path='customers' element={<div>customers</div>}></Route>
                </Routes>
                <button onClick={() => { localStorage.clear();navigate('login') }}>Выйти</button>
            </div>
            )
        case 'driver':
            return (<div>
                <h1>driver panel</h1>
                <ul>
                    <li><button onClick={()=>{navigate('home/newOrders')}}>Новые заявки</button></li>
                    <li><button onClick={()=>{navigate('home/doneOrders')}}>Выполненные</button></li>
                </ul>
                <Routes>
                    <Route path='newOrders' element={<div>newOrders</div>}></Route>
                    <Route path='doneOrders' element={<div>doneOrders</div>}></Route>
                </Routes>
                <button onClick={() => { localStorage.clear(); navigate('login') }}>Выйти</button>
            </div>)
        default:
            return (<div>Pusto:(</div>)
    }
}
