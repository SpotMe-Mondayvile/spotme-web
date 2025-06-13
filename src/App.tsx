import { Redirect, Route } from 'react-router-dom';
import { useState,useEffect } from 'react';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  useIonRouter
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Home from './pages/home/Home';
import Home2 from './pages/home/Home2';
import Friends from './pages/friends/Friends';
import Login from './pages/login/Login';
import SignUp from './pages/login/SignUp';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Search from './pages/search/Search';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { jwtDecode } from 'jwt-decode';
import SideNav from './components/menu/SideNav';
import setAuthToken from './utils/setAuthToken';
import Profile from './pages/profile/UserProfile';
import NavMenu from './pages/sidenav/NavMenu';


setupIonicReact();


const App: React.FC = () => {
  const [user,setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useIonRouter()
  console.log(user)



  useEffect(()=>{
    try{
    const jwt:string = localStorage.getItem('token');
    console.log(jwt)
    const jwtUser = jwtDecode(jwt)
    setUser(jwt)
    setAuthToken(jwt)
    console.log(jwtUser)
    }catch(e){
      console.log("No token available: " + e)
    }
    },[])

  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
  //   () => localStorage.getItem('logged_user') !== null
  // );

  // useEffect(() => {
  //   localStorage.setItem('logged_user', JSON.stringify(isLoggedIn));
  // }, [isLoggedIn]);

return (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/Login">
            <Login/>
          </Route>
          <Route exact path="/SignUp">
            <SignUp />
          </Route>
          <Route exact path="/Home">
            <Home/>
          </Route>
          <Route exact path="/Home2">
            <Home2/>
          </Route>
          <Route exact path="/Friends">
            <Friends />
          </Route>
          <Route exact path="/tab2">
            <Tab2 />
          </Route>
          <Route path="/profile">
            <Profile/>
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/search">
            <Search/>
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href={user===null? "/Login":"/Home2"}>
            <IonIcon aria-hidden="true" icon={triangle} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="Routines" href={user===null? "/Login":"/tab2"}>
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Routines </IonLabel>
          </IonTabButton>
          <IonTabButton tab="Create" href={user===null? "/Login":"/tab2"}>
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Create Spot</IonLabel>
          </IonTabButton>
          <IonTabButton tab="Search" href={user===null? "/Login":"/search"}>
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Search</IonLabel>
          </IonTabButton>
          <IonTabButton tab="friends" href={user===null? "/Login":"/Friends"}>
            <IonIcon aria-hidden="true" icon={triangle} />
            <IonLabel>Friends</IonLabel>
          </IonTabButton>
        </IonTabBar>
        
      </IonTabs>
    </IonReactRouter>
  </IonApp>
 )
};

export default App;
