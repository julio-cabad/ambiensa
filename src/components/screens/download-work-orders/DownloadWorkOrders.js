import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {arrowRIcon, downloadImg, workOrderImg} from '../../../utils/Icons';
import {Filters} from '../../../utils/HelpFunctions';
import {FloatingAction} from 'react-native-floating-action';
import {StoreContext} from '../../../stores/Context';
import {observer} from 'mobx-react-lite';
import bgImage from '../../../../assets/img/bgImage.jpg';
import Header from '../../../palette/Header';
import Loading from '../../../palette/Loading';
import NoData from '../../../palette/NoData';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import ConfirmationModal from '../../../palette/ConfirmationModal';
import {
    deleteDetailsWorkOrders, deleteWorkOrders, queryDetailsWorkOrders, queryWorkOrders,
} from '../../../database/Schemas';
import {alerts, generalError} from '../../../palette/Alerts';

const actions = [
    {
        text: 'Descargar Ord. de Trabajo', icon: downloadImg, name: 'bt_download', position: 1, color: 'white',
    },
];

function DownloadWorkOrders() {

    const {dataStore} = useContext(StoreContext);
    const {workOrders, detailWorkOrders, userData, netInfo} = dataStore;

    const [loading, setLoading] = useState(false);
    const bottomSheetModalRef = useRef(null);

    useEffect(() => {
        const WorkOrder = async () => {
            setLoading(true);
            const workOrders_ = await queryWorkOrders();
            const detailWorkOrders_ = await queryDetailsWorkOrders();
            dataStore.WokOrdersDb(workOrders_, detailWorkOrders_);
            setLoading(false);
        };
        WorkOrder().catch(() => null);
    }, []);

    const navigation = useNavigation();

    const onPressBack = () => {
        navigation.navigate('Main');
    };

    /*const onFilter = (text) => {
        setFilterValue(text);
        let search = new RegExp(text, 'i');

        if (text !== '') {
            const filteredProject = data_.filter(e => e.project.match(search));
            const filteredUrbanization = data_.filter(e => e.urbanization.toString().match(search));
            const filteredConstructionStage = data_.filter(e => e.constructionStage.toString().match(search));
            const filteredOTCode = data_.filter(e => e.OTCode.toString().match(search));
            setFilterValue(text);
            const filtered = [...filteredProject, ...filteredUrbanization, ...filteredConstructionStage, ...filteredOTCode];
            const uniqueData = [...filtered.reduce((map, obj) => map.set(obj.OTCode, obj), new Map()).values()];
            uniqueData.length === 0 && Keyboard.dismiss();
            setData(uniqueData);
        }
        if (text === '') {
            setData(data_);
            setFilterValue('');
            Keyboard.dismiss();
        }

    };

    const onHandleSelectAll = () => {
        setSelectAll(!selectAll);
        const data_ = [...data];
        data_.map(item => item.selected = !selectAll);
        setData(data_);
    };

    const onHandleSelected = (item) => {
        const {OTCode, selected} = item;
        const updateData = UpdateArray(data, 'OTCode', OTCode, 'selected', !selected);
        setData(updateData);
    };*/

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const onDownLoadWorkOrder = async () => {

        setLoading(true);

        try {
            await deleteWorkOrders();
            await deleteDetailsWorkOrders();
            const user = 'jabad';
            await dataStore.WorkOrders(userData, user);
            bottomSheetModalRef.current?.dismiss();
            alerts('success', 'ORDENES DESCARGADAS', `Ordenes descargadas exitosamente!`, 2500);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            generalError();
        }
    };

    const onDetail = (item) => {
        const {uid} = item;
        const detailsWorkOrders_ = Filters(detailWorkOrders, 'uid', uid);
        dataStore.DetailWorkOrders(detailsWorkOrders_);
        navigation.navigate('DetailWorkOrders');
    };

    const renderItem = ({item}) => {
        const {proyecto, urbanizacion, etapa, tiempoejecucion, codigo} = item;

        return (
            <TouchableOpacity onPress={() => onDetail(item)}
                              style={[tw`w-full p-2 flex-row items-center justify-between border-b border-gray-400`, styles.containerStyle]}>
                <View style={[tw`flex-row items-center`, {width: '85%'}]}>
                    {workOrderImg}
                    <View style={tw`ml-2`}>
                        <Text style={tw`text-teal-900 font-bold text-xs shrink`}>{proyecto}</Text>
                        <Text style={tw`text-slate-500 text-xs shrink`}>{codigo}</Text>
                        <Text
                            style={tw`text-slate-600 text-xs shrink`}>{`Urb. ${urbanizacion} - Etapa. ${etapa}`}</Text>
                        <Text style={tw`text-orange-400 text-xs shrink`}>{`T. ejec. ${tiempoejecucion}`}</Text>
                    </View>
                </View>
                <View style={[tw`flex-row justify-end`, {width: '15%'}]}>
                    {arrowRIcon}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <BottomSheetModalProvider>
            <View style={[tw`flex-1`]}>
                <ImageBackground source={bgImage} resizeMode="stretch" style={tw`w-full h-full`}>
                    <Header text={'ORDENES DE TRABAJO'} back onPressBack={onPressBack}/>
                    {workOrders?.length > 0 &&
                    <View style={tw`flex-1 p-3`}>
                        <FlashList
                            data={workOrders}
                            renderItem={renderItem}
                            estimatedItemSize={200}
                        />

                    </View>}
                    {(!workOrders && loading) && <Loading/>}
                    {workOrders?.length === 0 && <NoData/>}
                </ImageBackground>

                <FloatingAction
                    actions={actions}
                    color={'#007b8e'}
                    onPressItem={() => handlePresentModalPress()}
                />
            </View>

            <ConfirmationModal bottomSheetModalRef={bottomSheetModalRef} head={'DESCARGAR ORDENES DE TRABAJO'}
                               text={'Esta seguro que desea descargar las ordenes de trabajo?'}
                               loading={loading} onPress={onDownLoadWorkOrder} textButton={'Descargar'}
            />

        </BottomSheetModalProvider>
    );
}

export default observer(DownloadWorkOrders);

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: 'rgba(0,0,0, 0.05)',
    },
});
