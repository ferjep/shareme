import React, {useState, useEffect} from 'react'
import {MdDownloadForOffline} from 'react-icons/md'
import { useParams } from 'react-router-dom'
import { v4 as uuidv4} from 'uuid'

import {client, urlFor, getPinDetailQuery, getRelatedPinsQuery} from '../sanity'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import UserLink from './UserLink'

const PinDetail = ({user}) => {
    const [pins, setPins] = useState(null)
    const [pinDetails, setPinDetails] = useState(null)
    const [comment, setComment] = useState('')
    const [addingComment, setAddingComment] = useState(false)
    const {pinId} = useParams()

    const fetchPinDetails = async (pinId) => {
        const query = getPinDetailQuery(pinId)
        const data = await client.fetch(query)

        setPinDetails(data[0])

        if (data[0]) {
            const relatedQuery = getRelatedPinsQuery(data[0])
            const relatedData = await client.fetch(relatedQuery)

            setPins(relatedData)
        }
    }

    const addComment = async () => {
        if (!comment) {
            return
        }

        try {
            setAddingComment(true)

            await client
                .patch(pinId)
                .setIfMissing({comments: []})
                .insert('after', 'comments[-1]', [{
                    _key: uuidv4(),
                    content: comment,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user._id,
                    }
                }])
                .commit()

            fetchPinDetails(pinId)
            setComment('')
        } finally {
            setAddingComment(false)
        }
    }

    useEffect(() => {
        fetchPinDetails(pinId)
    }, [pinId])

    if (!pinDetails) {
        return <Spinner message='Loading pin...' />
    }

    return (
        <>
        <div className='flex lg:flex-row flex-col m-auto bg-white' style={{maxWidth: '1500px', borderRadius: '32px'}}>
            <div className='flex justify-center items-center md:items-start flex-initial'>
                <img
                    className='rounded-lg'
                    src={urlFor(pinDetails.image).url()}
                    alt='pin-pic'
                />
            </div>
            <div className='w-full p-5 flex-1 xl:min-width-620'>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <a
                            href={`${pinDetails.image.asset.url}?dl=`}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                        >
                            <MdDownloadForOffline />
                        </a>
                    </div>
                    <a
                        href={pinDetails.destination}
                        target='_blank'
                        rel='noreferrer'
                    >
                        {pinDetails.destination}
                    </a>
                </div>
                <div>
                    <h1 className='text-4xl font-bold break-words mt-3'>
                        {pinDetails.title}
                    </h1>
                    <p className='mt-3'>
                        {pinDetails.about}
                    </p>
                </div>
                <div className='mt-5'>
                    <UserLink user={pinDetails.postedBy}/>
                </div>
                <h2 className='mt-5 text-2xl'>
                    Comments
                </h2>
                <div className='max-h-370 overflow-y-auto'>
                    {pinDetails.comments?.map((comment, i) => (
                            <div key={i} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
                                <img
                                    src={comment.postedBy.image}
                                    alt='user-profile'
                                    className='w-10 h-10 rounded-full cursor-pointer'
                                />
                                <div className='flex flex-col'>
                                    <p className='font-bold'>{comment.postedBy.username}</p>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                    ))}
                </div>
                <div className='flex flex-wrap mt-6 gap-3 items-center'>
                    <UserLink user={pinDetails.postedBy} showName={false} />
                    <input
                        className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                        type='text'
                        placeholder='Add a comment'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        type='button'
                        className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
                        onClick={() => addComment()}
                    >
                        {addingComment ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </div>
        {pins ? (
            <>
                <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
                    More like this
                </h2>
                <MasonryLayout pins={pins} />
            </>
        ): (
            <Spinner message={'Loading more pins'}/>
        )}
        </>
    )
}

export default PinDetail
