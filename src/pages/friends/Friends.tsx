import { IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './Friends.css';
import NavMenu from '../sidenav/NavMenu';


const Friends = () => {
  const navigate = useIonRouter()

  const handleProfileClick=()=>{
    navigate.push("/Profile","root","replace")
    console.log("Pushed profile button")
    window.location.reload()
  }
  return (
    <>
    <NavMenu/>
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
          <IonTitle>Friends</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
              <ExploreContainer name="Friends" />
      </IonContent>
    </IonPage>
    </>
  );
};

export default Friends;
