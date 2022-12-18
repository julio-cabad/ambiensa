import React from 'react';
import {TouchableOpacity, View, Text, ActivityIndicator} from 'react-native';
import tw from 'twrnc';
import {buttonBg} from '../utils/Colors';

const Button = (props) => {

    const {icon, text, width, onPress, loading, right, size, rIcon, tmRight, top} = props;


    return (
        <TouchableOpacity
            style={[tw`items-center justify-center rounded-3xl`,
                {height: 40, width, right, marginTop: top, backgroundColor: loading ? '#b5bdc9' : buttonBg}]}
            disabled={loading} onPress={onPress}
        >
            <View style={tw`items-center flex-row px-3`}>
                {loading ? <ActivityIndicator size="small" color="#fff"/> : icon}
                <Text style={{color: 'white', marginLeft: 7, fontSize: size, marginRight: tmRight}}>{text}</Text>
                {!loading ? rIcon : null}
            </View>
        </TouchableOpacity>
    );
};

export default Button;
