import {createStackNavigator} from 'react-navigation';
import SchedulePage from '../screens/SchedulePage'

const ScheduleNav = createStackNavigator({
  Schedule: { screen: SchedulePage }
});

export default ScheduleNav;
