import { IonButton, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonRouter,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail } from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './Home.css';
import SideNav from '../../components/menu/SideNav';
import { useEffect, useState } from 'react';
import { checkLogin } from './../../utils/userSession';
import NavMenu from '../sidenav/NavMenu';

const Home: React.FC = () => {
  const navigate = useIonRouter()
    
  // useEffect(()=>{
  //   checkLogin(navigate)
  // },[])
  
  const [items, setItems] = useState<string[]>([]);

  const generateItems = () => {
    const newItems = [];
    for (let i = 0; i < 50; i++) {
      newItems.push(`Item ${1 + items.length + i}`);
    }
    setItems([...items, ...newItems]);
  };

  const resetItems = () => {
    setItems([]);
    generateItems();
  }

  useEffect(() => {
    checkLogin(navigate)
    const newItems = [];
    generateItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      // Any calls to load data go here
      resetItems()
      event.detail.complete();
    }, 2000);
  }

  return (
    <>
      {/* <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>SpotMe</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
        </IonContent>
      </IonMenu> */}
      <NavMenu/>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>SpotMe</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">Content
          <IonRefresher slot="fixed"  onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonList>
            {items.map((item, index) => (
              <IonItem key={item}>
                <IonAvatar slot="start">
                  <img src={'https://picsum.photos/80/80?random=' + index} alt="avatar" />
                </IonAvatar>
                <IonLabel>{item}</IonLabel>
              </IonItem>
            ))}
          </IonList>
          <IonInfiniteScroll onIonInfinite={(ev) => {generateItems();
                                                      setTimeout(() => ev.target.complete(), 500);
          }}>
            <IonInfiniteScrollContent loadingText="Please wait..." loadingSpinner="bubbles">
              scroll
            </IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
