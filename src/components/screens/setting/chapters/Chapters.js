import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import bgImage from '../../../../../assets/img/bgImage.jpg';
import Header from '../../../../palette/Header';
import {StoreContext} from '../../../../stores/Context';
import {FlashList} from '@shopify/flash-list';
import {editIcon, percentIcon, saveBottomModalIcon, savedIcon, settingsImg_} from '../../../../utils/Icons';
import {FilterDelete, Filters, Order, UpdateArray} from '../../../../utils/HelpFunctions';
import IconButton from '../../../../palette/IconButton';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Loading from '../../../../palette/Loading';
import NoData from '../../../../palette/NoData';
import {MAIN_URL} from '../../../../utils/Const';
import axios from 'axios';
import {alerts, generalError} from '../../../../palette/Alerts';

function Chapters() {

    const {dataStore} = useContext(StoreContext);
    const {chapters, percentages, percentageChapter, userData} = dataStore;
    const {idEmpresa} = userData;

    const [loading, setLoading] = useState(false);
    const [row, setRow] = useState(null);
    const [percentagesSelect, setPercentagesSelect] = useState(null);
    const [percentageChapter_, setPercentageChapter_] = useState([]);
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '83%'], []);

    const SelectReset = () => {
       // const percentages_ = [...percentages];
        percentages.forEach(items => {
            items.check = false;
        });
        setPercentagesSelect(percentages);
    };

    useEffect(() => {
        percentages && SelectReset();
        percentageChapter && setPercentageChapter_(percentageChapter);
    }, [percentages, percentageChapter]);

    const navigation = useNavigation();

    const onPressBack = () => {
        navigation.navigate('Settings');
    };

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        index === -1 && SelectReset();
    }, []);

    const onEdit = (item) => {
        setRow(item);
        const filterPercentageChapter = Filters(percentageChapter, 'id_capitulo', item?.id);
        setPercentageChapter_(filterPercentageChapter);
        const percentages_ = [...percentagesSelect];
        percentages_.forEach(items => {
            const {id} = items;
            filterPercentageChapter.forEach(pc => {
                const {id_porcentaje} = pc;
                if (id === id_porcentaje) {
                    console.log(id_porcentaje);
                    items.check = true;
                }
            });
        });

        setPercentagesSelect(percentages_);
        handlePresentModalPress();

    };

    const onSave = async () => {

        setLoading(true);
        const url = MAIN_URL + '/porcentajeporcapitulo';

        const percentageArr = [];
        percentageChapter_.forEach(items => {
            percentageArr.push(items.id_porcentaje);
        });

        const data = {empresa: idEmpresa, capitulo: row?.id, porcentajes: percentageArr};
        try {
            await axios.post(url, data);
            await dataStore.Chapters(userData);
            bottomSheetModalRef.current?.dismiss();
            alerts('success', 'PORCENTAJES GUARDADOS', `Porcentajes guardados exitosamente!`, 2500);
            setLoading(false);
            SelectReset();
        } catch (e) {
            bottomSheetModalRef.current?.dismiss();
            generalError();
            setLoading(false);
        }
    };

    const onSelect = (item) => {
        const {id, check} = item;
        const updatePercentagesValues = UpdateArray(percentagesSelect, 'id', id, 'check', !check);
        setPercentagesSelect(updatePercentagesValues);
        const newObj = {id_empresa: idEmpresa, id_capitulo: row?.id, id_porcentaje: id};
        const arr = [...percentageChapter_];
        !check && arr.push(newObj);
        !check && setPercentageChapter_(arr);
        const updatePercentageChapter = check && FilterDelete(percentageChapter_, 'id_porcentaje', id);
        check && setPercentageChapter_(updatePercentageChapter);
    };

    const renderItem = ({item}) => {

        const {descripcion, id} = item;
        const filterPercentageChapter = Filters(percentageChapter, 'id_capitulo', id);
        const orderPercentageChapter = Order(filterPercentageChapter, 'id_porcentaje');
        let percentages_ = '';
        orderPercentageChapter?.forEach(item => {
            const {id_porcentaje} = item;
            const filterPercentages = Filters(percentages, 'id', id_porcentaje);
            const {descripcion} = filterPercentages[0];
            percentages_ = percentages_ + '-' + descripcion;
        });


        return (
            <View
                style={[tw`w-full p-2 flex-row items-center justify-between border-b border-gray-400`, styles.containerStyle]}>
                <View style={[tw`flex-row items-center`, {width: '85%'}]}>
                    {settingsImg_}
                    <View style={tw`ml-2`}>
                        <Text style={tw`text-teal-900 font-bold text-xs shrink`}>{descripcion}</Text>
                        <Text style={tw`text-orange-500 text-xs shrink`}>{percentages_.slice(1)}</Text>
                    </View>
                </View>

                <View style={[tw`flex-row justify-end`, {width: '15%'}]}>
                    <IconButton icon={editIcon} onPress={() => onEdit(item)}/>
                </View>
            </View>
        );
    };

    return (
        <BottomSheetModalProvider>
            <View style={[tw`flex-1`]}>
                <ImageBackground source={bgImage} resizeMode="stretch" style={tw`w-full h-full`}>
                    <Header text={'CAPÍTULOS'} back onPressBack={onPressBack}/>
                    {(chapters?.length > 0 && percentageChapter?.length > 0 && percentages?.length > 0) &&
                    <View style={tw`flex-1 p-3`}>
                        <FlashList
                            data={chapters}
                            renderItem={renderItem}
                            estimatedItemSize={200}
                        />
                    </View>}
                    {(!chapters || !percentageChapter || !percentages) && <Loading/>}
                    {chapters?.length === 0 && <NoData/>}
                </ImageBackground>
            </View>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
            >
                <View style={tw`flex-1 p-2`}>
                    <Text style={tw`text-xl text-gray-700 font-bold shrink`}>{row?.descripcion}</Text>
                    <Text style={tw`text-gray-500 shrink mb-2`}>SELECCIONAR PORCENTAJE</Text>


                    {percentagesSelect?.map((items, i) => {
                        const {descripcion, id, check} = items;
                        const bg = check ? 'bg-teal-50' : 'bg-white';

                        return (
                            <TouchableOpacity style={tw`flex-row p-2 items-center border-b border-gray-300 ${bg} mt-1`}
                                              key={id} disabled={loading} onPress={() => onSelect(items)}>
                                <View style={tw`w-full flex-row items-center justify-between`}>
                                    <Text style={tw`text-xs text-slate-700 font-semibold`}>{`${descripcion}`}</Text>
                                    {percentIcon}
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    <View style={tw`w-full justify-end flex-row mt-3 px-1`}>
                        <TouchableOpacity
                            style={tw`rounded bg-gray-50 ml-3 flex-row items-center p-2`} disabled={loading}
                            onPress={() => bottomSheetModalRef.current?.dismiss()}>
                            <Text style={tw`text-xs text-teal-900`}>Salir</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={tw`rounded bg-teal-100 ml-3 flex-row items-center p-2`}
                            onPress={onSave}>
                            {loading ? <ActivityIndicator size="small" color="#fff"/> : saveBottomModalIcon}
                            <Text style={tw`text-xs text-teal-900 ml-2`}>Guardar</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
}

export default observer(Chapters);

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: 'rgba(0,0,0, 0.05)',
    },
});
