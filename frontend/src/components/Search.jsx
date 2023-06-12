import React, {useState, useEffect} from 'react'

import MasonryLayout from './MasonryLayout'
import {client, getFeedQuery, getSearchQuery} from '../sanity'
import Spinner from './Spinner'

const Search = ({ searchTerm }) => {
    const [pins, setPins] = useState(null)

    useEffect(() => {
        // TODO: It should have some sort of debounce here
        if (!searchTerm) {
            return
        }

        setPins(null)
        const query = getSearchQuery(searchTerm)

        client
            .fetch(query)
            .then((data) => setPins(data))
    }, [searchTerm])

    if (!pins && !searchTerm) {
        return (
            <h2 className='text-center text-gray-500'>
                Type your search
            </h2>
        )
    }

    if (!pins) {
        return (
            <Spinner message='Searching for pins...' />
        )
    }

    return (
        <div>
            {pins.length
                ? (
                    <MasonryLayout pins={pins} />
                ) : (
                    <h2 className='text-center text-xl'>No pins found</h2>
                )}
        </div>
    )
}

export default Search
