import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
    ActivityIndicator,
    ImageBackground,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import Header from '../../../../palette/Header';
import {StoreContext} from '../../../../stores/Context';
import bgImage from '../../../../../assets/img/bgImage.jpg';
import {FlashList} from '@shopify/flash-list';
import Loading from '../../../../palette/Loading';
import NoData from '../../../../palette/NoData';
import {deleteIcon_, editIcon, reviewStatesImg, saveBottomModalIcon, uploadRandomImg} from '../../../../utils/Icons';
import IconButton from '../../../../palette/IconButton';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import axios from 'axios';
import {alerts, generalError} from '../../../../palette/Alerts';
import {MAIN_URL} from '../../../../utils/Const';

function LevelRandomCharge() {

    const {dataStore} = useContext(StoreContext);
    const {userData, roles, levelRandomCharge, reviewStates} = dataStore;
    const {idEmpresa} = userData;

    const [loading, setLoading] = useState(false);
    const [row, setRow] = useState(null);
    const [levelRandomCharge_, setLevelRandomCharge_] = useState(null);
    const [addValue, setAddValue] = useState('');
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '83%'], []);


    useEffect(() => {
        const GetData = () => {

            const levelRandomChargeArr = [];
            const levelRandomChargeArr_ = [];

            levelRandomCharge.forEach(items => {
                const {id_rol} = items;
                roles.forEach(r => {
                    const {id, descripcion} = r;
                    if (id === id_rol) {
                        levelRandomChargeArr.push({...items, rol: descripcion});
                    }
                });
            });

            levelRandomChargeArr.forEach(items => {
                const {id_estadorevision} = items;
                reviewStates.forEach(r => {
                    const {id, descripcion} = r;
                    if (id === id_estadorevision) {
                        levelRandomChargeArr_.push({...items, reviewState: descripcion});
                    }
                });
            });
            setLevelRandomCharge_(levelRandomChargeArr_);
        };

        (levelRandomCharge && roles) && GetData();

    }, [levelRandomCharge]);

    const navigation = useNavigation();

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        index === -1 && setRow(null);
    }, []);

    const onPressBack = () => {
        navigation.navigate('Settings');
    };

    const onEdit = (item) => {
        setRow(item);
        const {porcentaje} = item;
        const percentage = porcentaje !== '' ? parseFloat(porcentaje) * 100 : 0;
        setAddValue(percentage.toString());
        handlePresentModalPress();
    };

    const renderItem = ({item}) => {
        const {rol, reviewState} = item;

        return (
            <View
                style={[tw`w-full p-2 flex-row items-center justify-between border-b border-gray-400`, styles.containerStyle]}>
                <View style={[tw`flex-row items-center`]}>
                    {uploadRandomImg}
                    <View style={tw`ml-2`}>
                        <Text style={tw`text-teal-900 font-bold text-xs shrink`}>{rol}</Text>
                        <Text style={tw`text-orange-500 text-xs shrink`}>{reviewState}</Text>
                    </View>
                </View>
                <View style={[tw`flex-row justify-end`]}>
                    <IconButton icon={editIcon} onPress={() => onEdit(item)}/>
                </View>
            </View>
        );

    };

    const onSave = async () => {

        const {id_rol, id_estadorevision} = row;
        Keyboard.dismiss();

        const url = MAIN_URL + '/nivelcargaaleatoria';
        const porcentaje = parseFloat(addValue) / 100;
        const nivelesCarga = [{rol: id_rol, estadorevision: id_estadorevision, porcentaje}];
        const data = {empresa: idEmpresa, nivelesCarga};

        setLoading(true);

        try {
            await axios.post(url, data);
            await dataStore.LevelRandomCharge(userData);
            setTimeout(() => {
                bottomSheetModalRef.current?.dismiss();
                alerts('success', 'NIVELES ACTUALIZADOS', `Niveles actualizados exitosamente!`, 2500);
                setLoading(false);
            }, 1000);
        } catch (e) {
            console.log(e);
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
                    <Header text={'NIVEL DE CARGA'} text_2={'ALEATORIA'} back onPressBack={onPressBack}/>
                    <View style={tw`flex-1 `}>
                        {(levelRandomCharge_?.length > 0) &&
                        <View style={tw`flex-1 p-3`}>
                            <FlashList
                                data={levelRandomCharge_}
                                renderItem={renderItem}
                                estimatedItemSize={200}
                            />
                        </View>}
                        {(!levelRandomCharge_) && <Loading/>}
                        {levelRandomCharge_?.length === 0 && <NoData/>}
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
                            <Text style={tw`text-xl text-gray-700 font-bold shrink`}>{row?.rol}</Text>
                            <Text style={tw`text-gray-500 shrink`}>{row?.reviewState}</Text>

                            <TextInput style={tw`w-full border border-teal-600 rounded h-10 mt-3 px-2`}
                                       placeholderTextColor={'gray'} placeholder={'Editar porcentaje'}
                                       onChangeText={setAddValue} value={addValue} color={'#333'}
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
                                    <Text style={tw`text-xs text-teal-900 ml-2`}>Guardar porcentaje</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
    );
}

export default observer(LevelRandomCharge);

const styles = StyleSheet.create({
        containerStyle: {
            backgroundColor: 'rgba(0,0,0, 0.05)',
        },
    },
);
