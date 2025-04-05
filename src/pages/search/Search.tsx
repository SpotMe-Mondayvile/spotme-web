import { IonBreadcrumb, IonBreadcrumbs, IonButton, IonButtons, IonContent, IonHeader, IonList, IonItem, IonInput, IonIcon, IonLabel, IonMenuButton, IonPage, IonSearchbar, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonTabs, IonTab, IonTabBar, IonTitle, IonToolbar, useIonRouter, IonTabButton } from '@ionic/react';
import {useState} from 'react'
import { searchSharp, barbellOutline } from 'ionicons/icons';
import ExploreContainer from '../../components/ExploreContainer';
//import './Friends.css';
import NavMenu from '../sidenav/NavMenu';
import apiClient from '../../utils/api-client'



const Search = () => {
    const navigate = useIonRouter()

    const handleProfileClick=()=>{
    navigate.push("/search","root","replace")
    console.log("Pushed Search button")
    window.location.reload()
    }

    const [search, setSearch] = useState("")
    
    const handleChange = (funct, ev : Event) => {
        const target = ev.target as HTMLIonSearchbarElement
        funct(target.value)
    }

    return (
        <>
        <meta name="mobile-web-app-capable" content="yes"></meta>
        
        <NavMenu/>
        <IonPage>
            <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                </IonButtons>
                <IonTitle>Search</IonTitle>
            </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {/* search page components */}
                {/* search bar */}
                <IonSearchbar showClearButton="focus" value={search}  onIonInput = {(ev) => handleChange(setSearch, ev) }> </IonSearchbar>
                <div>
                    {/* <IonTabs>
                        <IonTab tab = 'people'>
                            <div id = "peopleSearch">
                                <IonHeader>
                                    <IonToolbar>
                                        <IonTitle>
                                            People
                                        </IonTitle>
                                    </IonToolbar>
                                </IonHeader>
                                <IonContent>
                                    <div>
                                        people content
                                    </div>
                                </IonContent>
                            </div>
                        </IonTab>
                        <IonTab tab = 'gyms'>
                            <div id="gymSearch">
                                <IonHeader>
                                    <IonToolbar>
                                        <IonTitle>
                                            Gyms
                                        </IonTitle>
                                    </IonToolbar>
                                </IonHeader>
                                <IonContent>
                                    <div>
                                        gym content
                                    </div>
                                </IonContent>
                            </div>
                        </IonTab>
                        
                        <IonTabBar slot='top'>
                            <IonTabButton tab='people' >
                                <IonIcon icon={barbellOutline}/>
                                    People
                            </IonTabButton>
                            <IonTabButton tab='gyms'>
                                <IonIcon icon={barbellOutline}/>
                                Gyms
                            </IonTabButton>

                        </IonTabBar>
                    </IonTabs> */}

                    <IonSegment value="default">
                        <IonSegmentButton value="people" contentId="people">
                            <IonLabel>People</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="gyms" contentId="gyms">
                            <IonLabel>Gyms</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="spots" contentId="spots">
                            <IonLabel>Spots</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="community" contentId="community">
                            <IonLabel>Community</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    <IonSegmentView>
                        <IonSegmentContent id="people">
                            People Content. Posts cards in a list. Data = all users whos names contain [{search}]
                        </IonSegmentContent>
                        <IonSegmentContent id="gyms">
                            Gym Content. Posts cards in a list. Data = all gyms with names containing [{search}]
                        </IonSegmentContent>
                        <IonSegmentContent id="spots">
                            Spots Content. Data = all spots with names or info containing [{search}]
                        </IonSegmentContent>
                        <IonSegmentContent id="community">
                            Community Content. Data = all hashtags or whatever with info containing [{search}]
                        </IonSegmentContent>
                    </IonSegmentView>
                
                </div>
            </IonContent>
        </IonPage>
        </>
    );
}

export default Search

