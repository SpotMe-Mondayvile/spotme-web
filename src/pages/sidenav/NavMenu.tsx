import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonMenu, IonTitle, IonToolbar } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import ProfileCard from './ProfileCard'
import { userGetInfo,getProfile } from './../../utils/services/userServices';
import Logout from './../login/Logout';

const NavMenu = () => {
  const [userProf,setUserProf] = useState({})
  
  
  // const getUserProfile=()=>{
  //   try{
  //     const userInfo = userGetInfo()
  //     setUserProf(userInfo)
  //     console.log("got prof info", userInfo)
  //   }catch(e){
  //  console.log("Could not get the profile")
  //   }
  // }

  const getUserProfile = async()=>{
    try{
      const{data}= await userGetInfo()
      localStorage.setItem('userProfData',data.access_token);
      setUserProf(data)
      console.log("got prof info", data)
    }catch(err){
      if(err.response && err.response.status<500 && err.response.status>=400 ){
         console.log(err.response.data.message)
      }
    }  
  }

  useEffect(()=>{
    getUserProfile()
  },[])


  return (
  <>
       <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>SpotMe</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <ProfileCard userProf={userProf}/>
          <IonItem>Profile</IonItem>
          <IonItem>Messages</IonItem>
          <IonItem>Account</IonItem>
          <IonItem>Settings</IonItem>
          <IonButton onClick={()=>{
            localStorage.removeItem('token')          
            window.location.reload();
            }}>Logout</IonButton>
        </IonContent>
      </IonMenu>
      </>
  )
}

export default NavMenu