import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import jwtDecode from 'jwt-decode'
import { client, createUser } from '../sanity'

import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'

const Login = () => {
    const handleGoogle = async (response) => {
        const decodedResponse = jwtDecode(response.credential)
        const { name, sub: googleId, picture: imageUrl } = decodedResponse

        const user = createUser(googleId, name, imageUrl)

        const userDoc = await client.createIfNotExists(user)
        localStorage.setItem('userId', userDoc._id)

        window.location.replace('/')
    }

    return (
        <GoogleOAuthProvider
            clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
        >
            <div className='flex justify-start items-center flex-col h-screen'>
                <div className='relative w-full h-full'>
                    <video
                        className='w-full h-full object-cover'
                        src={shareVideo}
                        type="video/mp4"
                        controls={false}
                        muted
                        autoPlay
                    />
                    <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
                        <div className='p-5'>
                            <img src={logo} width="130px" alt='logo'/>
                        </div>
                        <div className='shadow-2xl'>
                            <GoogleLogin
                                onSuccess={handleGoogle}
                                onFailure={handleGoogle}
                                cookiePolicy="single_host_origin"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    )
}

export default Login
