import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import Login from '../session/Login';
import Home from '../home/Home';
import {Easing, StyleSheet} from 'react-native';
import DownloadWorkOrders from '../screens/download-work-orders/DownloadWorkOrders';
import AdvanceRecord from '../screens/advance-record/AdvanceRecord';
import DetailAdvanceRecord from '../screens/advance-record/DetailAdvanceRecord';
import ProgressControl from '../screens/progress-control/ProgressControl';
import Main from '../screens/main/Main';
import Settings from '../screens/setting/Settings';
import Chapters from '../screens/setting/chapters/Chapters';
import ChaptersModel from '../screens/setting/chapters-model/ChaptersModel';
import EquivalencePercentageChapter
    from '../screens/setting/equivalence-percentage-chapter/EquivalencePercentageChapter';
import ReviewStates from '../screens/setting/review-states/ReviewStates';
import LevelRandomCharge from '../screens/setting/level-random-charge/LevelRandomCharge';

const Stack = createStackNavigator();

const options = {headerShown: false, gestureEnabled: false};

const config = {
    animation: 'timing',
    config: {
        duration: 300,
        easing: Easing.linear,
        mass: 9,
    },
};

const closeConfig = {
    animation: 'timing',
    config: {
        duration: 300,
        easing: Easing.linear,
        mass: 9,
    },
};

function NavigationApp() {

    return (
        <>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login"
                                 transitionerStyle={{backgroundColor: 'black'}}
                                 screenOptions={{
                                     gestureEnabled: true,
                                     gestureDirection: 'horizontal',
                                     cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                                     transitionSpec: {
                                         open: config,
                                         close: closeConfig,
                                     },
                                     headerMode: 'float',
                                 }}
                                 animation={'fade'}>
                    <Stack.Screen name="Login" component={Login} options={options}/>
                    <Stack.Screen name="Main" component={Main} options={options}/>
                    <Stack.Screen name="Settings" component={Settings} options={options}/>
                    <Stack.Screen name="Chapters" component={Chapters} options={options}/>
                    <Stack.Screen name="ChaptersModel" component={ChaptersModel} options={options}/>
                    <Stack.Screen name="EquivalencePercentageChapter" component={EquivalencePercentageChapter} options={options}/>
                    <Stack.Screen name="ReviewStates" component={ReviewStates} options={options}/>
                    <Stack.Screen name="LevelRandomCharge" component={LevelRandomCharge} options={options}/>
                    <Stack.Screen name="Home" component={Home} options={options}/>
                    <Stack.Screen name="DownloadWorkOrders" component={DownloadWorkOrders} options={options}/>
                    <Stack.Screen name="AdvanceRecord" component={AdvanceRecord} options={options}/>
                    <Stack.Screen name="DetailAdvanceRecord" component={DetailAdvanceRecord} options={options}/>
                    <Stack.Screen name="ProgressControl" component={ProgressControl} options={options}/>
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}

export default NavigationApp;
