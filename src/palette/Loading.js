import React from 'react';
import {View, Text} from 'react-native';
import tw from 'twrnc';
import LottieView from 'lottie-react-native';

function Loading() {

    return (
        <View style={tw`flex-1 items-center justify-center`}>
            <View style={[tw`w-full items-center justify-center`, {height: 300}]}>
                <LottieView source={require('../../assets/loading.json')} autoPlay loop/>
                <Text style={tw`text-slate-500 mt-15`}>Cargando...</Text>
            </View>
        </View>
    );

}

export default Loading;
