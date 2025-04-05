import React, { useEffect, useState } from 'react'
import ProfileHeader from './ProfileHeader'
import {userGetInfo} from '../../utils/services/userServices'


const Profile = (props) => {
    const[profData,setProfData] =useState({})
    
    const getProfile = async()=>{
        const {data} = await userGetInfo()
        console.log("Got User Profile")
        console.log(data)
        setProfData(data)
    }

    const setProfile=()=>{

    }

    useEffect(()=>{
        getProfile()
    },[])


    return (
        <div>
            <div className='header'>
                <ProfileHeader />
            </div>
            <div className='profile_stats'>

            </div>
            <div className='profile_data'>

            </div>
        </div>
    )
}

export default Profile