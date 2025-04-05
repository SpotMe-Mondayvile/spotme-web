import { IonBreadcrumb, IonBreadcrumbs, IonButton, IonButtons, IonContent, IonHeader, IonList, IonItem, IonInput, IonIcon, IonLabel, IonMenuButton, IonPage, IonSearchbar, IonSegment, IonSegmentButton,IonSegmentContent, IonTabs, IonTab, IonTabBar, IonTitle, IonToolbar, useIonRouter, IonTabButton } from '@ionic/react';

import React from 'react';
import { IonSegmentView } from '@ionic/react';


import { searchSharp, barbellOutline } from 'ionicons/icons';
import ExploreContainer from '../../components/ExploreContainer';
import NavMenu from '../sidenav/NavMenu';
import apiClient from '../../utils/api-client'

const SearchWindow = () => {

    return(
        <>
            <IonSegment value="first">
            <IonSegmentButton value="first" contentId="first">
                <IonLabel>First</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="second" contentId="second">
                <IonLabel>Second</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="third" contentId="third">
                <IonLabel>Third</IonLabel>
            </IonSegmentButton>
            </IonSegment>
            <IonSegmentView>
                <IonSegmentContent id="first"> First </IonSegmentContent>
                <IonSegmentContent id="second">Second</IonSegmentContent>
                <IonSegmentContent id="third">Third</IonSegmentContent>
            </IonSegmentView>
        </>
    )
}

export default SearchWindow