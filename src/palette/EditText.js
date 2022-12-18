import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import tw from 'twrnc';
import {colorInputText, editBg} from '../utils/Colors';

const EditText = (props) => {

    const {icon, label, editable, handleChange, field, placeholder, values, errors, keyPad} = props;

    const [autoCapitalize, setAutoCapitalize] = useState('none');

    useEffect(() => {
        if (field === 'email') {
            setAutoCapitalize('none');
        } else {
            setAutoCapitalize('sentences');
        }
    }, [values]);

    return (

        <View style={tw`flex-col w-full`}>
            <Text style={tw`text-xs text-gray-700 ml-2 font-semibold`}>{label}</Text>
            <View style={[tw`border border-teal-600`, styles.sectionStyle]}>
                <TextInput
                    style={{flex: 1, paddingHorizontal: 3, height: 45, fontSize: 18}}
                    placeholder={placeholder}
                    underlineColorAndroid="transparent"
                    color={colorInputText}
                    keyboardType={keyPad}
                    placeholderTextColor={'gray'}
                    textAlignVertical="top"
                    value={values[field]}
                    editable={editable}
                    onChangeText={handleChange(field)}
                    autoCapitalize={autoCapitalize}
                />
                <View style={styles.iconContainer}>
                    {icon}
                </View>
            </View>
            {!!errors[field] !== undefined &&
            <Text style={tw`ml-2 text-red-500 text-xs`}>{errors[field]}</Text>}
        </View>
    );
};

export default EditText;

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
