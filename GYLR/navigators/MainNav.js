import {createStackNavigator} from 'react-navigation';
import SplashPage from '../screens/SplashPage'

const MainNav = createStackNavigator({
  Home: { screen: SplashPage }
});

export default MainNav;
