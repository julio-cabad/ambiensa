import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {arrowRIcon_, settingsImg} from '../../../utils/Icons';


function SettingsButton(props) {

    const {text, text_2, path} = props;

    const navigation = useNavigation();

    const onNavigation = () => {
        navigation.navigate(path);
    };

    return (
        <TouchableOpacity onPress={onNavigation}
                          style={[tw`rounded-xl border border-gray-300 p-2 items-center justify-between`, styles.btStyle]}>
            <View style={tw`w-full`}>
                {settingsImg}
            </View>
            <Text style={tw`text-xs text-teal-800 font-bold`}>{text}</Text>
            {text_2 && <Text style={tw`text-xs text-teal-800 font-bold`}>{text_2}</Text>}
            <View style={tw`w-full items-end`}>
                {arrowRIcon_}
            </View>
        </TouchableOpacity>
    );
}

export default SettingsButton;

const styles = StyleSheet.create({
    btStyle: {
        backgroundColor: 'rgba(0,0,0, 0.05)',
        width: '49%',
        height: 117,
    },
    point: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#37D1F2',
        elevation: 5,
    },

});
