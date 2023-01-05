import React, {useContext} from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import tw from 'twrnc';
import {observer} from 'mobx-react-lite';
import {avatarImg, logoAppImg} from '../utils/Icons';
import {initLogo} from '../utils/Const';
import IconFAW5 from 'react-native-vector-icons/FontAwesome5';
import IconButton from './IconButton';
import {StoreContext} from '../stores/Context';

const width = Dimensions.get('window').width;

function Header(props) {

    const {dataStore} = useContext(StoreContext);
    const {userData} = dataStore;

    const {text, text_2, onPressBack, back} = props;

    const arrowBackIcon = <IconFAW5 name="arrow-left" size={28} color={'white'}/>;

    return (

        <View style={[tw`items-center w-full`, {height: 120}]}>
            <View style={[tw`items-center w-full justify-center`, {height: 70}]}>
                {!back ? <Image source={{uri: initLogo}} style={[tw`w-full`, styles.imageStyle]}/> :
                    <View style={tw`items-center w-full flex-row justify-between px-1`}>
                        <IconButton icon={arrowBackIcon} onPress={onPressBack}/>
                        <Image source={{uri: initLogo}} style={[tw`w-full`, styles.imageStyle]}/>
                        <View/>
                    </View>}
                <Text style={[tw`font-semibold text-white text-base`]}>{userData?.nombreUsuario}</Text>
            </View>
            <View
                style={[tw`items-center w-full flex-row items-center justify-around relative`, {height: 50}]}>

                <View
                    style={[tw`absolute`, {
                        width: 50, height: 50, borderRadius: 25, top: -25, left: (width / 2) - 120,
                    }]}>
                    {logoAppImg}
                </View>

                <View style={tw`w-auto items-center`}>
                    <Text style={[tw`font-bold text-white`, {color: 'black'}]}>{text}</Text>
                    {text_2 && <Text style={[tw`font-bold text-white`, {color: 'black'}]}>{text_2}</Text>}

                </View>
                <View style={[tw`absolute`, {
                    width: 50, height: 50, borderRadius: 25, top: -25, right: (width / 2) - 120,
                }]}>
                    {avatarImg}
                </View>
            </View>
        </View>
    );
}

export default observer(Header);

const styles = StyleSheet.create({
    curvedViewStyle: {
        width: '100%',
        borderBottomRightRadius: width / 2,
        borderBottomLeftRadius: width / 2,
        transform: [{scaleX: 6}],
        height: 150,
    },

    curvedViewStyle_: {
        width: '100%',
        borderTopRightRadius: width / 2,
        borderTopLeftRadius: width / 2,
        height: 150,
    },

    imageStyle: {
        resizeMode: 'stretch',
        height: 50,
        width: 175,
    },
});
