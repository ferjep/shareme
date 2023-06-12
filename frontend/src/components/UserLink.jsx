import React from "react";
import { Link } from "react-router-dom";

const UserLink = ({user, showName = true, showImg = true}) => (
    <Link
        className='flex gap-2 items-center bg-white rounded-lg'
        to={`/user-profile/${user._id}`}
    >
        {showImg && (
            <img
                className='w-8 h-8 rounded-full object-cover'
                src={user.image}
                alt='user-profile'
            />
        )}
        {showName && (
            <p className='font-semibold capitalize'>{user.username}</p>
        )}
    </Link>
)

export default UserLink
