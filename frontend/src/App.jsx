import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './container/Home'
import {Login} from './components'

const App = () => 
    <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={<Home />} />
    </Routes>

export default App

