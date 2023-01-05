import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
    ActivityIndicator, ImageBackground, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import {StoreContext} from '../../../../stores/Context';
import Header from '../../../../palette/Header';
import bgImage from '../../../../../assets/img/bgImage.jpg';
import {editIcon, saveBottomModalIcon, uploadImg} from '../../../../utils/Icons';
import IconButton from '../../../../palette/IconButton';
import Loading from '../../../../palette/Loading';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import axios from 'axios';
import {alerts, generalError} from '../../../../palette/Alerts';
import {MAIN_URL} from '../../../../utils/Const';

function LoadImages() {

    const {dataStore} = useContext(StoreContext);
    const {loadImages, userData} = dataStore;
    const {idEmpresa} = userData;

    const [loading, setLoading] = useState(false);
    const [addValue, setAddValue] = useState('');
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '83%'], []);

    useEffect(() => {
        loadImages && setAddValue(loadImages[0].cargaimagenes);
    }, [loadImages]);

    const navigation = useNavigation();

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        index === -1 && setAddValue('');
    }, []);

    const onPressBack = () => {
        navigation.navigate('Settings');
    };

    const onEdit = () => {
        handlePresentModalPress();
    };

    const onSave = async () => {

        Keyboard.dismiss();

        const url = MAIN_URL + '/parametro';
        const data = {empresa: idEmpresa, totalImagenes: parseInt(addValue)};

        setLoading(true);

        try {
            await axios.post(url, data);
            await dataStore.LoadImages(userData);
            setTimeout(() => {
                bottomSheetModalRef.current?.dismiss();
                alerts('success', 'NÚMERO ACTUALIZADO', `Número de carga de imagenes actualizada exitosamente!`, 2500);
                setLoading(false);
            }, 1000);
        } catch (e) {
            setAddValue('');
            bottomSheetModalRef.current?.dismiss();
            generalError();
            setLoading(false);
        }
    };

    return (
        <BottomSheetModalProvider>
            <View style={[tw`flex-1`]}>
                <ImageBackground source={bgImage} resizeMode="stretch" style={tw`w-full h-full`}>
                    <Header text={'CARGA DE IMAGENES'} back onPressBack={onPressBack}/>
                    <View style={tw`flex-1 `}>
                        {loadImages &&
                        <View style={tw`flex-1 p-3`}>
                            <View
                                style={[tw`w-full p-2 flex-row items-center justify-between border-b border-gray-400`, styles.containerStyle]}>
                                <View style={[tw`flex-row items-center`]}>
                                    {uploadImg}
                                    <View style={tw`ml-2`}>
                                        <Text
                                            style={tw`text-teal-900 font-bold text-xs shrink`}>{`Número de imagenes: ${loadImages[0].cargaimagenes}`}</Text>
                                    </View>
                                </View>
                                <View style={[tw`flex-row justify-end`]}>
                                    <IconButton icon={editIcon} onPress={() => onEdit()}/>
                                </View>
                            </View>
                        </View>}
                        {!loadImages && <Loading/>}
                    </View>
                </ImageBackground>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                >


                    <View style={tw`p-2`}>
                        <View style={tw`p-2`}>
                            <Text style={tw`text-xl text-gray-700 font-bold shrink`}>Núm. maximo de imágenes</Text>
                            <TextInput style={tw`w-full border border-teal-600 rounded h-10 mt-3 px-2`}
                                       placeholderTextColor={'gray'} placeholder={'Valor'}
                                       onChangeText={setAddValue} value={addValue.toString()} color={'#333'}
                                       autoCapitalize={'characters'} keyboardType={'number-pad'}
                            />

                            <View style={tw`w-full justify-end flex-row mt-3 px-2  mb-8`}>
                                <TouchableOpacity
                                    style={tw`rounded bg-gray-50 ml-3 flex-row items-center p-2`} disabled={loading}
                                    onPress={() => bottomSheetModalRef.current?.dismiss()}>
                                    <Text style={tw`text-xs text-teal-900`}>Salir</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={tw`rounded bg-teal-100 ml-3 flex-row items-center p-2`}
                                    onPress={onSave}>
                                    {loading ? <ActivityIndicator size="small" color="gray"/> : saveBottomModalIcon}
                                    <Text style={tw`text-xs text-teal-900 ml-2`}>Guardar</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
    );
}

export default observer(LoadImages);

const styles = StyleSheet.create(
    {
        containerStyle: {
            backgroundColor: 'rgba(0,0,0, 0.05)',
        },
    },
);
