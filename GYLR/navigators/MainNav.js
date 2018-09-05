import {createStackNavigator} from 'react-navigation';
import SplashPage from '../screens/SplashPage'
import TabNav from './TabNav.js'

const MainNav = createStackNavigator({
  Home: { screen: SplashPage },
  TabNav: { screen: TabNav,
    navigationOptions: {
        headerStyle: {
          backgroundColor: '#fcb248'
        },
        titleStyle:{
          color:'white'
        }
      }
    }
});

export default MainNav;
