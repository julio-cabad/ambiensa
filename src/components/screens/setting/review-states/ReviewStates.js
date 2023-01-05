import React, {useCallback, useContext, useMemo, useRef, useState} from 'react';
import {
    ActivityIndicator, ImageBackground, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import {StoreContext} from '../../../../stores/Context';
import Header from '../../../../palette/Header';
import bgImage from '../../../../../assets/img/bgImage.jpg';
import {FlashList} from '@shopify/flash-list';
import Loading from '../../../../palette/Loading';
import NoData from '../../../../palette/NoData';
import {
    addImg, deleteIcon_, deleteModalIcon, editIcon, refreshModalIcon, reviewStatesImg, saveBottomModalIcon,
} from '../../../../utils/Icons';
import IconButton from '../../../../palette/IconButton';
import {FloatingAction} from 'react-native-floating-action';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {MAIN_URL} from '../../../../utils/Const';
import axios from 'axios';
import {alerts, generalError} from '../../../../palette/Alerts';

const actions = [
    {
        text: 'Agregar estado', icon: addImg, name: 'bt_add', position: 1, color: 'white',
    },
];

function ReviewStates() {

    const {dataStore} = useContext(StoreContext);
    const {reviewStates, userData} = dataStore;
    const {idEmpresa} = userData;

    const [loading, setLoading] = useState(false);
    const [row, setRow] = useState(null);
    const [addValue, setAddValue] = useState('');
    const [editValue, setEditValue] = useState('');
    const [idCrud, setIdCrud] = useState({id: null, description: null});
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '83%'], []);

    const navigation = useNavigation();

    const onPressBack = () => {
        navigation.navigate('Settings');
    };

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        index === -1 && setRow(null);
    }, []);

    const onAdd = () => {
        setIdCrud({...idCrud, id: 'add', description: 'AGREGAR ESTADO'});
        handlePresentModalPress();
    };

    const onSave = async () => {

        Keyboard.dismiss();

        const url = MAIN_URL + '/estadorevision';
        const data = {empresa: idEmpresa, descripcion: addValue};
        setLoading(true);

        try {
            await axios.post(url, data);
            await dataStore.ReviewStates(userData, false);
            setTimeout(() => {
                bottomSheetModalRef.current?.dismiss();
                alerts('success', 'ESTADO GUARDADOS', `Estado guardado exitosamente!`, 2500);
                setLoading(false);
            }, 1000);
        } catch (e) {
            setAddValue('');
            bottomSheetModalRef.current?.dismiss();
            generalError();
            setLoading(false);
        }
    };

    const onEdit = (item) => {
        setIdCrud({...idCrud, id: 'edit', description: 'EDITAR ESTADO'});
        setRow(item);
        setEditValue(item.descripcion);
        handlePresentModalPress();
    };

    const onEditSave = async () => {
        Keyboard.dismiss();

        const url = MAIN_URL + `/estadorevision/${row?.id}`;
        const data = {empresa: idEmpresa, descripcion: editValue};
        setLoading(true);

        try {
            await axios.put(url, data);
            await dataStore.ReviewStates(userData, false);
            setTimeout(() => {
                bottomSheetModalRef.current?.dismiss();
                alerts('success', 'ESTADO ACUALIZADO', `Estado actualizado exitosamente!`, 2500);
                setLoading(false);
            }, 1000);
        } catch (e) {
            bottomSheetModalRef.current?.dismiss();
            generalError();
            setLoading(false);
        }
    };

    const onDelete = (item) => {
        setIdCrud({...idCrud, id: 'delete', description: 'ELIMINAR ESTADO'});
        setRow(item);
        handlePresentModalPress();
    };

    const onDelete_ = async (item) => {
        Keyboard.dismiss();

        const url = MAIN_URL + `/estadorevision/${idEmpresa}/${row?.id}`;
        setLoading(true);

        try {
            await axios.delete(url);
            await dataStore.ReviewStates(userData, false);
            setTimeout(() => {
                bottomSheetModalRef.current?.dismiss();
                alerts('success', 'ESTADO ELIMINADO', `Estado eliminado exitosamente!`, 2500);
                setLoading(false);
            }, 1000);
        } catch (e) {
            bottomSheetModalRef.current?.dismiss();
            generalError();
            setLoading(false);
        }
    };

    const renderItem = ({item}) => {
        const {descripcion} = item;

        return (
            <View
                style={[tw`w-full p-2 flex-row items-center justify-between border-b border-gray-400`, styles.containerStyle]}>
                <View style={[tw`flex-row items-center`]}>
                    {reviewStatesImg}
                    <View style={tw`ml-2`}>
                        <Text style={tw`text-teal-900 font-bold text-xs shrink`}>{descripcion}</Text>
                    </View>
                </View>
                <View style={[tw`flex-row justify-end`]}>
                    <IconButton icon={editIcon} onPress={() => onEdit(item)}/>
                    <IconButton icon={deleteIcon_} onPress={() => onDelete(item)}/>
                </View>
            </View>
        );
    };

    return (
        <BottomSheetModalProvider>
            <View style={[tw`flex-1`]}>
                <ImageBackground source={bgImage} resizeMode="stretch" style={tw`w-full h-full`}>
                    <Header text={'ESTADOS DE REVISIÓN'} back onPressBack={onPressBack}/>
                    <View style={tw`flex-1 `}>
                        {(reviewStates?.length > 0) &&
                        <View style={tw`flex-1 p-3`}>
                            <FlashList
                                data={reviewStates}
                                renderItem={renderItem}
                                estimatedItemSize={200}
                            />
                        </View>}
                        {(!reviewStates) && <Loading/>}
                        {reviewStates?.length === 0 && <NoData/>}
                    </View>
                </ImageBackground>

                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                >

                    <View style={tw`p-2`}>
                        <Text style={tw`text-xl text-gray-700 font-bold shrink`}>{idCrud?.description}</Text>
                        {idCrud.id === 'delete' &&
                        <Text
                            style={tw`text-xs text-red-500 shrink`}>{'Esta seguro que desea eliminar eeste estado. ??'}</Text>}

                        {idCrud.id === 'add' &&
                        <TextInput style={tw`w-full border border-teal-600 rounded h-10 mt-3 px-2`}
                                   placeholderTextColor={'gray'} placeholder={'Nuevo estado'}
                                   onChangeText={setAddValue} value={addValue} color={'#333'}
                                   autoCapitalize={'characters'}
                        />}

                        {idCrud.id === 'edit' &&
                        <TextInput style={tw`w-full border border-teal-600 rounded h-10 mt-3 px-2`}
                                   placeholderTextColor={'gray'} placeholder={'Editar estado'}
                                   onChangeText={setEditValue} value={editValue} color={'#333'}
                                   autoCapitalize={'characters'}
                        />}

                        {idCrud.id === 'delete' &&
                        <View style={tw`p-2 border-b border-slate-200 w-full mt-3`}>
                            <Text style={tw`text text-gray-500 shrink`}>{row?.descripcion}</Text>
                        </View>}


                        <View style={tw`w-full justify-end flex-row mt-3 px-2  mb-8`}>
                            <TouchableOpacity
                                style={tw`rounded bg-gray-50 ml-3 flex-row items-center p-2`} disabled={loading}
                                onPress={() => bottomSheetModalRef.current?.dismiss()}>
                                <Text style={tw`text-xs text-teal-900`}>Salir</Text>
                            </TouchableOpacity>

                            {idCrud.id === 'add' &&
                            <TouchableOpacity
                                style={tw`rounded bg-teal-100 ml-3 flex-row items-center p-2`}
                                onPress={onSave}>
                                {loading ? <ActivityIndicator size="small" color="gray"/> : saveBottomModalIcon}
                                <Text style={tw`text-xs text-teal-900 ml-2`}>Guardar</Text>
                            </TouchableOpacity>}


                            {idCrud.id === 'edit' &&
                            <TouchableOpacity
                                style={tw`rounded bg-teal-100 ml-3 flex-row items-center p-2`}
                                onPress={onEditSave}>
                                {loading ? <ActivityIndicator size="small" color="gray"/> : refreshModalIcon}
                                <Text style={tw`text-xs text-teal-900 ml-2`}>Guardar cambios</Text>
                            </TouchableOpacity>}


                            {idCrud.id === 'delete' &&
                            <TouchableOpacity
                                style={tw`rounded bg-teal-100 ml-3 flex-row items-center p-2`}
                                onPress={onDelete_}>
                                {loading ? <ActivityIndicator size="small" color="gray"/> : deleteModalIcon}
                                <Text style={tw`text-xs text-teal-900 ml-2`}>Eliminar</Text>
                            </TouchableOpacity>}
                        </View>
                    </View>
                </BottomSheetModal>


                <FloatingAction
                    actions={actions}
                    color={'#FEDA25'}
                    onPressItem={(name) => onAdd(name)}
                />
            </View>
        </BottomSheetModalProvider>
    );
}

export default observer(ReviewStates);

const styles = StyleSheet.create(
    {
        containerStyle: {
            backgroundColor: 'rgba(0,0,0, 0.05)',
        },
    },
);
