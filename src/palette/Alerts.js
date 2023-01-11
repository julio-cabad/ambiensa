import React from 'react';
import Toast from 'react-native-toast-message';
import tw from 'twrnc';
import {Text, View} from 'react-native';
import {warnIcon} from '../utils/Icons';

function alerts(type, head, body, time) {
    Toast.show({
        type: type,//'success | error | info',
        position: 'bottom',
        text1: head,
        text2: body,
        visibilityTime: time ? time : 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
    });
}

function errorAlert(body) {
    Toast.show({
        type: 'error',//'success | error | info',
        position: 'bottom',
        text1: 'AVISO',
        text2: body,
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
    });
}

function generalError() {
    Toast.show({
        type: 'error',//'success | error | info',
        position: 'bottom',
        text1: 'Error',
        text2: 'A ocurrido un error intentelo otra vez.',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
    });
}

const warning = (body) => {
    return (
        <View style={tw`p-2 mt-2 border border-yellow-600 rounded bg-yellow-100 flex-row items-center`}>
            {warnIcon}
            <Text style={tw`ml-2 text-yellow-700 shrink text-xs`}>{body}</Text>
        </View>
    );
};


export {alerts, errorAlert, generalError, warning};
