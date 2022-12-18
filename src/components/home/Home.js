import React from 'react';
import {View} from 'react-native';
import tw from 'twrnc';
import SideBar from './SideBar';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Main from '../screens/main/Main';

const Drawer = createDrawerNavigator();

function Home() {

    return (
        <View style={tw`flex-1`}>
            <Drawer.Navigator initialRouteName="Main" drawerStyle={{width: '70%', borderRightWidth: 0}}
                              hideStatusBar={true} screenOptions={{swipeEnabled: false, drawerType: 'front'}}
                              drawerContent={props => <SideBar {...props}/>}>

                <Drawer.Screen name="Main" component={Main} options={{headerShown: false}}/>
            </Drawer.Navigator>
        </View>
    );
}

export default Home;
