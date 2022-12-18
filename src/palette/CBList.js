import React, {useContext} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import tw from 'twrnc';

;
import {observer} from 'mobx-react-lite';
import {StoreContext} from '../stores/Context';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import {colorInputText, smoothColor, smoothColor_, textSideColor_} from '../utils/Colors';

function CBList(props) {

    const {dataStore} = useContext(StoreContext);
    const {theme} = dataStore;

    const {label, switchIcon, setSwitchIcon, placeholder, value, setVisibleModal, setValue} = props;

    const arrowUpIcon = <IconMI name="keyboard-arrow-up" size={28} color={!theme ? smoothColor : smoothColor_}/>;
    const arrowDownIcon = <IconMI name="keyboard-arrow-down" size={28} color={!theme ? smoothColor : smoothColor_}/>;

    const labelColor = !theme ? 'text-blue-600' : 'text-slate-600';
    const inputColor = !theme ? 'bg-gray-600' : 'bg-blue-50';

    console.log(switchIcon)

    return (
        <View style={tw`flex-col w-full`}>
            <Text style={tw`text-xs ${labelColor} ml-2 font-semibold`}>{label}</Text>
            <View style={[tw`${inputColor}`, styles.sectionStyle]}>

                <TextInput
                    style={{flex: 1, paddingHorizontal: 3, height: 40, fontSize: 18}}
                    placeholder={placeholder}
                    keyboardType={'number-pad'}
                    underlineColorAndroid="transparent"
                    color={!theme ? colorInputText : textSideColor_}
                    placeholderTextColor={'gray'}
                    textAlignVertical="top"
                    value={value && value.toString()}
                    editable={!(value===null)}
                    onChangeText={text => setValue(text)}
                />

                <View style={styles.iconContainer}>
                    {switchIcon ?
                        <TouchableOpacity onPress={() => {
                            setSwitchIcon(!switchIcon);
                            setVisibleModal(false);
                        }}>
                            {arrowUpIcon}
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => {
                            setSwitchIcon(!switchIcon);
                            setVisibleModal(true);
                        }}>
                            {arrowDownIcon}
                        </TouchableOpacity>}
                </View>
            </View>
        </View>
    );
}

export default observer(CBList);


const styles = StyleSheet.create({
    iconContainer: {
        width: '10%',
        height: '100%',
        marginTop: 20,
    },
    inputContainer: {
        width: '90%',
        flexDirection: 'column',
    },

    sectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        borderRadius: 7,
        width: '100%',
    },
});
