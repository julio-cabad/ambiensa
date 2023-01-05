import React, {useContext} from 'react';
import {Keyboard, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import IconFAW5 from 'react-native-vector-icons/FontAwesome5';
import {colorInputText, mainColor, smoothColor, smoothColor_, textSideColor_} from '../utils/Colors';
import IconButton from './IconButton';
import {avatarImg, closeIcon} from '../utils/Icons';
import {StoreContext} from '../stores/Context';
import {observer} from 'mobx-react-lite';


function FilterHeader(props) {

    const {dataStore} = useContext(StoreContext);


    const {onPressBack, onFilter, filterValue, setFilterValue, setData, data } = props;

    const onPress =()=>{
        Keyboard.dismiss()
        setFilterValue('')
        setData(data)
    }

    const arrowBackIcon = <IconFAW5 name="arrow-left" size={28} color={'gray'}/>;


    return (
        <View style={[tw`w-full flex-row  items-center justify-around  h-16 px-2`]}>
            <View style={[tw`border border-teal-400`, styles.sectionStyle]}>
                <TextInput
                    style={{flex: 1, paddingHorizontal: 3, height: 40, fontSize: 18}}
                    placeholder={'Buscar...'}
                    underlineColorAndroid="transparent"
                    color={'#333'}
                    placeholderTextColor={'gray'}
                    textAlignVertical="top"
                    value={filterValue}
                    onChangeText={text => onFilter(text)}
                />

                    <TouchableOpacity style={[tw`items-center justify-center`]} onPress={onPress}>
                        {closeIcon}
                    </TouchableOpacity>

            </View>
        </View>
    );
}

export default observer(FilterHeader);

const styles = StyleSheet.create({
    iconContainer: {
        width: '10%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    },
    inputContainer: {
        width: '90%',
        flexDirection: 'column',
    },

    sectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: editBg,
        paddingHorizontal: 5,
        borderRadius: 7,
        width: '100%',
    },
});
