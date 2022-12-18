import React from 'react';
import {View, Text} from 'react-native';
import tw from 'twrnc';
import LottieView from 'lottie-react-native';
import {format} from 'date-fns';
import {es} from 'date-fns/esm/locale';

function NoFound(props) {

    const {text_1, text_2} = props;

    const date = format(new Date(), 'MMMM', {locale: es});

    return (
        <View style={tw`flex-1 p-3`}>
            <View style={tw`flex-1 items-center justify-center`}>
                <View style={[tw`w-full items-center justify-center`, {height: 500}]}>
                    <LottieView source={require('../../assets/not-found.json')} autoPlay loop/>
                    <Text style={tw`font-semibold text-red-500`}>{text_1}</Text>
                </View>
            </View>
        </View>
    );

}

export default NoFound;
