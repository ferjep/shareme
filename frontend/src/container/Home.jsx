import React, {useState, useRef, useEffect, useContext} from 'react'
import {HiMenu} from 'react-icons/hi'
import {AiFillCloseCircle} from 'react-icons/ai'
import {Link, Route, Routes, useNavigate} from 'react-router-dom'

import Pins from './Pins'
import {Sidebar, UserProfile} from '../components'
import logo from '../assets/logo.png'
import { UserContext } from '../context'
import Spinner from '../components/Spinner'

const Home = () => {
    const [toggleSidebar, setToggleSidebar] = useState(false)
    const {user, loading: userLoading} = useContext(UserContext)
    const scrollRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user && !userLoading) {
            navigate('/login', {replace: true})
        }
    }, [user, userLoading, navigate])

    useEffect(() => {
        scrollRef.current?.scrollTo(0, 0)
    }, [])

    if (!user) {
        return (
            <div className='h-screen'>
                <Spinner />
            </div>
        )
    }

    return (
        <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height ease-out'>
            <div className='hidden md:flex h-screen flex-initial'>
                <Sidebar user={user} />
            </div>
            <div className='flex md:hidden flex-row'>
                {toggleSidebar && (
                    <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
                        <div className='absolute w-full flex justify-end items-center p-2'>
                            <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)}/>
                        </div>
                        <Sidebar user={user} setToggleSidebar={setToggleSidebar}/>
                    </div>
                )}
                <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
                    <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)}/>
                    <Link to='/'>
                        <img src={logo} alt='logo' className='w-28' />
                    </Link>
                    <Link to={`user-profile/${user?.id}`}>
                        <img src={user?.image} alt='logo' className='w-12 rounded-full' />
                    </Link>
                </div>
            </div>
            <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
                <Routes>
                    <Route path='/user-profile/:userId' element={<UserProfile />}/>
                    <Route path='/*' element={<Pins user={user}/>}/>
                </Routes>
            </div>
        </div>
    )
}

export default Home
