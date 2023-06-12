import { googleLogout } from '@react-oauth/google'
import React, {useState, useEffect } from 'react'
import {AiOutlineLogout} from 'react-icons/ai'
import {useParams, useNavigate} from 'react-router-dom'
import {client, getUserQuery, getUserSavedPinsQuery, getUserCreatedPinsQuery} from '../sanity'
import MasonryLayout from './MasonryLayout'
import ProfilePinsBtn from './ProfilePinsBtn'
import Spinner from './Spinner'

const randomImgUrl = 'https://source.unsplash.com/1600x900/?nature,photography,technology'

const UserProfile = () => {
    const [user, setUser] = useState(null)
    const [pins, setPins] = useState(null)
    const [activeBtn, setActiveBtn] = useState('created')
    const {userId} = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        const query = getUserQuery(userId)

        client.fetch(query)
            .then((data) => {
                setUser(data[0])
            })
    }, [userId])

    useEffect(() => {
        setPins(null)

        const query = 'created' === activeBtn
            ? getUserCreatedPinsQuery(userId)
            : getUserSavedPinsQuery(userId)

        client
            .fetch(query)
            .then((data) => setPins(data))
    }, [activeBtn, userId])

    if (!user) {
        return <Spinner message='Loading profile...' />
    }

    const doLogout = () => {
        googleLogout()
        localStorage.clear('user')
        navigate('/login')
    }

    return (
        <div className='relative pb-2 h-full justify-center items-center'>
            <div className='flex flex-col pb-5'>
                <div className='relative flex-col mb-7'>
                    <div className='flex flex-col justify-center items-center'>
                        <img
                            className='w-full h-370 2xl:h-510 shadow-lg object-cover'
                            src={randomImgUrl}
                            alt='banner-pic'
                        />
                        <img
                            className='rounded-full w-20 h-20 -mt-10 shadow-xl'
                            src={user.image}
                            alt='user-pic'
                        />
                        <h1 className='font-bold text-3xl text-center mt-3'>
                            {user.username}
                        </h1>
                        <div className='absolute top-0 z-1 right-0 p-2'>
                            {userId === user._id && (
                                <button
                                    className='bg-white p-2 rounded-full cursor-pointer'
                                    onClick={() => doLogout()}
                                >
                                    <AiOutlineLogout color='red' fontSize={21}/>
                                </button>
                            )}
                        </div>

                    </div>
                    <div className='text-center mb-7 mt-3'>
                        <ProfilePinsBtn active={activeBtn} textId='created' setActiveBtn={setActiveBtn} />
                        <ProfilePinsBtn active={activeBtn} textId='saved' setActiveBtn={setActiveBtn} />
                    </div>
                    <div className='px-2'>
                        {pins ? (
                            pins.length 
                                ? <MasonryLayout pins={pins} />
                                : <h2 className='text-center text-xl font-bold'>No pins {activeBtn}</h2>
                        ) : (
                            <Spinner message='Loading pins...' />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile
