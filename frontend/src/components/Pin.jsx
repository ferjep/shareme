import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import {MdDownloadForOffline} from 'react-icons/md'
import {AiTwotoneDelete, AiOutlineLoading3Quarters} from 'react-icons/ai'
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs'

import {client, urlFor} from '../sanity'
import UserLink from './UserLink'

const Pin = ({pin}) => {
    const [postHovered, setPostHovered] = useState(false)
    const [savingPost, setSavingPost] = useState(false)
    const navigate = useNavigate()

    const user = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user'))
        : null

    const alreadySaved = !!(pin.save?.find(item => item?.postedBy._id === user?._id))

    const savePin = async () => {
        if (alreadySaved || savingPost || !user) {
            return
        }

        setSavingPost(true)

        await client
            .patch(pin._id)
            .setIfMissing({save: []})
            .insert('after', 'save[-1]', [{
                _key: uuidv4(),
                userId: user._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id,
                }
            }])
            .commit()

        window.location.reload()
    }

    const deletePin = async () => {
        await client.delete(pin._id)

        window.location.reload()
    }

    return (
        <div className='m-2'>
            <div
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${pin._id}`)}
            >
                <img
                    className='rounded-lg w-full'
                    alt='user-post'
                    src={urlFor(pin.image).width(250).url()}
                />
                {postHovered && (
                    <div
                        className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
                        style={{height: '100%'}}
                    >
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a
                                    className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                                    href={`${pin.image.asset.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            <button
                                type='button'
                                className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    savePin()
                                }}
                            >
                                {alreadySaved ?
                                    `${pin.save.length} Saved)`
                                    : savingPost ? <AiOutlineLoading3Quarters className='animate-spin'/> : 'Save' 
                                }
                            </button>
                        </div>
                        <div className='flex justify-between items-center gap-2 w-full'>
                            {pin.destination && (
                                <a
                                    href={pin.destination}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='bg-white flex items-center gap-2 text-black overflow-hidden font-bold py-2 px-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <BsFillArrowUpRightCircleFill />
                                    <span className='truncate'>
                                        {pin.destination.replace(/^https?:\/\/(www.)?/, '')}
                                    </span>
                                </a>
                            )}
                            {pin.postedBy?._id === user?._id && (
                                <button
                                    type='button'
                                    className='bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark text-base rounded-3xl hover:shadow-md outline-none'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deletePin()
                                    }}
                                >
                                    <AiTwotoneDelete />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className='mt-3'>
                <UserLink user={pin.postedBy} />
            </div>
        </div>
    )
}

export default Pin
