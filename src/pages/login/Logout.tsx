import { useIonRouter } from '@ionic/react';
import React, { useEffect } from 'react'

const Logout = () => {
    const navigate = useIonRouter()

    useEffect(()=>{
        localStorage.removeItem("token");
        navigate.push("/home")
    },[])
  return null;
}

export default Logout