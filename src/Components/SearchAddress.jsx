import React, { useState } from 'react'

export default function SearchAddress() {
    const [address, setAddress] = useState('');
    return (
        <div>
            <div>
                <input type="text" placeholder='Адрес' onChange={(e) => { setAddress(e.target.value) }} />
                <ul>

                </ul>
            </div>
            <ul>

            </ul>
        </div>
    )
}
