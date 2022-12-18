import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import {hidePwdIcon, showPwdIcon} from '../utils/Icons';
import {colorInputText, editBg} from '../utils/Colors';

function EditPwd(props) {

    const {editable, handleChange, field, placeholder, values, errors} = props;

    const [showPwd, setShowPwd] = useState(true);

    return (
        <View style={tw`flex-col w-full`}>
            <Text style={tw`text-xs text-gray-700 ml-2 font-semibold`}>{'Contraseña'}</Text>
            <View style={[tw`border border-teal-600`, styles.sectionStyle]}>
                <TextInput
                    style={{flex: 1, paddingHorizontal: 3, height: 45, fontSize: 18}}
                    placeholder={placeholder}
                    underlineColorAndroid="transparent"
                    color={colorInputText}
                    placeholderTextColor={'gray'}
                    textAlignVertical="top"
                    value={values[field]}
                    editable={editable}
                    onChangeText={handleChange(field)}
                    autoCapitalize={'sentences'}
                    secureTextEntry={showPwd}
                />
                <View style={styles.iconContainer}>
                    {showPwd ?
                        <TouchableOpacity onPress={() => setShowPwd(!showPwd)}>
                            {hidePwdIcon}
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => setShowPwd(!showPwd)}>
                            {showPwdIcon}
                        </TouchableOpacity>}
                </View>
            </View>
            {!!errors[field] !== undefined &&
            <Text style={tw`ml-2 text-red-500 text-xs`}>{errors[field]}</Text>}
        </View>
    );
}

export default EditPwd;

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
        backgroundColor: editBg,
        paddingHorizontal: 5,
        borderRadius: 7,
        width: '100%',
    },
});
