import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, Switch} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {initLogo} from '../../utils/Const';
import {StoreContext} from '../../stores/Context';
import {observer} from 'mobx-react-lite';
import {smoothColor, textSideColor_} from '../../utils/Colors';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';

function Sidebar() {

    const {dataStore} = useContext(StoreContext);
    const {theme} = dataStore;

    const toggleSwitch = () => dataStore.Theme(!theme);

    const navigation = useNavigation();

    const Logout = () => {

        navigation.navigate('Login');
    };

    const themeIcon = <IconMCI name="theme-light-dark" size={30} color={!theme ? smoothColor : '#003d55'}/>;
    const logoutIcon = <IconMCI name="logout-variant" size={30} color={!theme ? smoothColor : '#003d55'}/>;
    const viewColor = !theme ? 'bg-gray-800' : 'bg-gray-200';

    return (
        <View style={[tw`flex-1 ${viewColor}`]}>
            <View style={tw`flex-1 p-3 flex-col justify-between`}>
                <View>
                    <View style={tw`h-24 items-center justify-center`}>
                        <Image source={{uri: initLogo}} style={[tw`w-full h-24`, styles.imageStyle]}/>
                    </View>

                    <View style={tw`p-2 flex-row items-center justify-between border-b border-cyan-900 mt-3`}>
                        <View style={tw`flex-row items-center`}>
                            {themeIcon}
                            <Text
                                style={[tw`text-base mt-1 font-semibold ml-3`, {color: !theme ? smoothColor : textSideColor_}]}>
                                {'TEMA'}
                            </Text>
                        </View>
                        <Switch
                            trackColor={{false: '#767577', true: '#37D1F2'}}
                            thumbColor={theme ? '#120F72' : smoothColor}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={theme}
                            style={{width: 100}}
                        />
                    </View>

                    <TouchableOpacity style={tw`p-2 flex-row items-center border-b border-cyan-900 mt-3`}
                                      onPress={Logout}
                    >
                        {logoutIcon}
                        <Text
                            style={[tw`text-base mt-1 font-semibold ml-3`, {color: !theme ? smoothColor : textSideColor_}]}>
                            {'SALIR'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default observer(Sidebar);

const styles = StyleSheet.create({

    imageStyle: {
        resizeMode: 'stretch',
    },
});
