import React from "react";

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none capitalize'
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none capitalize'

const ProfilePinsBtn = ({active, textId, setActiveBtn}) => (
    <button
        type='button'
        onClick={() => setActiveBtn(textId)}
        className={active === textId ? activeBtnStyles : notActiveBtnStyles}
    >
        {textId}
    </button>
)

export default ProfilePinsBtn
