import React, { useState, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import DriversTable from '../Components/DriverComponents/DriversTable'
import OrdersTable from '../Components/OrderComponents/OrdersTable'
import TransportTable from '../Components/TransportComponents/TransportTable'
import CustomersTable from '../Components/CustomersComponents/CustomersTable'
import DriverOrderTable from '../Components/DriverOrderTable/DriverOrderTable'

export default function Home({ role, navigate }) {
    const currentRoute = useLocation();
    switch (role.toLowerCase()) {
        case 'admin':
            return (<div>
                <div className='mt-5 d-flex ' style={{ paddingLeft: "32px", marginBottom: "16px" }}>
                    <button onClick={() => { navigate('home/orders') }} className={currentRoute.pathname.includes("orders") ? 'btn btn-primary' : 'btn btn-outline-primary'} >Заявки</button>
                    <button onClick={() => { navigate('home/drivers') }} className={currentRoute.pathname.includes("drivers") ? 'btn btn-primary' : 'btn btn-outline-primary'}>Водители</button>
                    <button onClick={() => { navigate('home/transports') }} className={currentRoute.pathname.includes("transports") ? 'btn btn-primary' : 'btn btn-outline-primary'}>Транспорт</button>
                    <button onClick={() => { navigate('home/customers') }} className={currentRoute.pathname.includes("customers") ? 'btn btn-primary' : 'btn btn-outline-primary'}>Заказчики</button>
                </div>
                <Routes>
                    <Route path='orders' element={<OrdersTable></OrdersTable>}></Route>
                    <Route path='drivers' element={<div><DriversTable></DriversTable></div>}></Route>
                    <Route path='transports' element={<div><TransportTable></TransportTable></div>}></Route>
                    <Route path='customers' element={<div><CustomersTable></CustomersTable></div>}></Route>
                </Routes>
            </div >
            )
        case 'driver':
            return (<div>
                <DriverOrderTable></DriverOrderTable>
            </div>)
        default:
            return (<div>Something went wrong:(</div>)
    }
}
