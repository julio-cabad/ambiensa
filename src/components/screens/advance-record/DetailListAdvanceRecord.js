import React, {useContext, useEffect, useState} from 'react';
import {ImageBackground, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import {StoreContext} from '../../../stores/Context';
import Header from '../../../palette/Header';
import bgImage from '../../../../assets/img/bgImage.jpg';
import {arrowRIcon, detailWorkOrdersImg} from '../../../utils/Icons';
import {FlashList} from '@shopify/flash-list';

function DetailListAdvanceRecord() {

    const {dataStore, offlineStore} = useContext(StoreContext);
    const {detailWorkOrders_} = dataStore;
    const {saveWorkOrder} = offlineStore;

    /* const [chapterModel_, setChapterModel] = useState(chapterModel);
     const [chapters_, setChapter_] = useState(chapters);

     const c = chapters && [...chapters];

     useEffect(() => {
         const GetChaptersMode = async () => {
             setChapterModel(chapterModel);

             runInAction(() => {
                 c.forEach(item => item.check = false);
                 setChapter_(c);
             });
         };

         (chapters && models) && GetChaptersMode();

     }, [models, chapters]);

     useEffect(() => {
         /!*if (chapterModel_) {
             const filterChapterModel = Filters(chapterModel_, 'id_modelo', row?.id);
             const chapters = [...chapters_];

             console.log(filterChapterModel);

         }*!/
     }, [chapterModel_]);*/

    const navigation = useNavigation();

    const onPressBack = () => navigation.navigate('AdvanceRecord');

    const DetailAdvanceRecord = (item) => {
        const {id_detalle, manzana, solar, modelo, tipoordentrabajo} = item;
        dataStore.DetailAdvanceRecord(item);
        offlineStore.SaveWorkOrder({...saveWorkOrder, id_detalle, manzana, solar, modelo, tipoordentrabajo});
        navigation.navigate('DetailAdvanceRecord');
    };


    const renderItem = ({item}) => {

        const {manzana, solar, modelo, tipoordentrabajo} = item;

        return (
            <TouchableOpacity onPress={() => DetailAdvanceRecord(item)}
                              style={[tw`w-full p-2 flex-row items-center justify-between border-b border-gray-400`, styles.containerStyle]}>
                <View style={[tw`flex-row items-center`, {width: '85%'}]}>

                    {detailWorkOrdersImg}
                    <View style={tw`ml-2`}>
                        <Text style={tw`text-teal-900 font-bold text-xs shrink`}>{modelo}</Text>
                        <Text style={tw`text-slate-600 text-xs shrink`}>{`Mz: ${manzana} - Solar: ${solar}`}</Text>
                        <Text style={tw`text-orange-500 text-xs shrink`}>{`Tipo de trabajo: ${tipoordentrabajo}`}</Text>
                        <Text style={tw`text-orange-600 text-xs shrink font-semibold`}>{`PORCENTAJE: 0%`}</Text>
                    </View>
                </View>
                <View style={[tw`flex-row justify-end`, {width: '15%'}]}>
                    {arrowRIcon}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[tw`flex-1`]}>
            <ImageBackground source={bgImage} resizeMode="stretch" style={tw`w-full h-full`}>
                <Header text={'LISTA DE REGISTRO'} text_2={'DE AVANCE'} back onPressBack={onPressBack}/>
                <View style={tw`flex-1 p-3`}>
                    <FlashList
                        data={detailWorkOrders_}
                        renderItem={renderItem}
                        estimatedItemSize={200}
                    />
                </View>
            </ImageBackground>
        </View>
    );
}

export default observer(DetailListAdvanceRecord);

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: 'rgba(0,0,0, 0.05)',
    },
});
