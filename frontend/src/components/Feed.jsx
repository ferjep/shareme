import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'

import {client, getSearchQuery, getFeedQuery} from '../sanity'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

const Feed = () => {
    const [pins, setPins] = useState(null)
    const {categoryId} = useParams()

    useEffect(() => {
        setPins(null)

        const query = categoryId
            ? getSearchQuery(categoryId)
            : getFeedQuery()

        client.fetch(query)
            .then(data => {
                setPins(data)
            })
    }, [categoryId])

    if (!pins) {
        return (
            <Spinner message='We are adding new ideas to your feed!'/>
        )
    }

    if (!pins.length) {
        return (
            <h2 className='text-center text-2xl text-bold'>
                There are no pins, be the first one to post one!
            </h2>
        )
    }

    return (
        <div>
            {pins.length && <MasonryLayout pins={pins} />}
        </div>
    )
}

export default Feed
