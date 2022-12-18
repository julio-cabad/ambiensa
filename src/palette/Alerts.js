import React from 'react';
import Toast from 'react-native-toast-message';

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

export {alerts, errorAlert, generalError};
