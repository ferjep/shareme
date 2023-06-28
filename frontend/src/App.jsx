import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './container/Home'
import {Login} from './components'
import {UserContext} from './context'
import { client, getUserQuery } from './sanity'


const App = () => {
    const [userContext, setUserContext] = useState({
        user: null,
        loading: true,
    })

    useEffect(() => {
        const userId = localStorage.getItem('userId') || null

        if (!userId) {
            setUserContext({
                user: null,
                loading: false
            })

            return
        }

        const query = getUserQuery(userId)

        client.fetch(query)
            .then((data) => setUserContext({
                user: data[0] ?? null,
                loading: false,
            }))
    }, [])

    return (
        <UserContext.Provider value={userContext}>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/*' element={<Home />} />
            </Routes>
        </UserContext.Provider>
    )
}

export default App

