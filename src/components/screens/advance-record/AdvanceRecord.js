import React, {useContext, useState} from 'react';
import {ImageBackground, Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {arrowRIcon, workOrderImg} from '../../../utils/Icons';
import {StoreContext} from '../../../stores/Context';
import {observer} from 'mobx-react-lite';
import bgImage from '../../../../assets/img/bgImage.jpg';
import Header from '../../../palette/Header';
import NoData from '../../../palette/NoData';
import {Filters} from '../../../utils/HelpFunctions';


function AdvanceRecord() {

    const {dataStore} = useContext(StoreContext);
    const {workOrders, detailWorkOrders} = dataStore;


    const [filterValue, setFilterValue] = useState('');
    const [data, setData] = useState('');

    const navigation = useNavigation();

    const onPressBack = () => navigation.navigate('Main');

    const onFilter = (text) => {
        setFilterValue(text);
        let search = new RegExp(text, 'i');

        if (text !== '') {
            const filteredOTCode = data_.filter(e => e.OTCode.toString().match(search));
            setFilterValue(text);
            const filtered = [...filteredOTCode];
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

    const DetailAdvanceRecord = (item) => {
        const {uid} = item;
        console.log(uid)
        const detailsWorkOrders_ = Filters(detailWorkOrders, 'uid', uid);
        dataStore.DetailWorkOrders(detailsWorkOrders_);
        navigation.navigate('DetailListAdvanceRecord');
    };

    const renderItem = ({item}) => {
        const {proyecto, urbanizacion, etapa, tiempoejecucion, codigo} = item;

        return (
            <TouchableOpacity onPress={() => DetailAdvanceRecord(item)}
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

        <View style={[tw`flex-1`]}>
            <ImageBackground source={bgImage} resizeMode="stretch" style={tw`w-full h-full`}>
                <Header text={'REGISTRO'} text_2={'DE AVANCE'} back onPressBack={onPressBack}/>
                {workOrders?.length > 0 &&
                <View style={tw`flex-1 p-3`}>
                    <FlashList
                        data={workOrders}
                        renderItem={renderItem}
                        estimatedItemSize={200}
                    />

                </View>}
                {(!workOrders || workOrders?.length === 0) && <NoData/>}
            </ImageBackground>
        </View>

        /*<View style={[tw`flex-1`, {backgroundColor: !theme ? mainColor : mainColor_}]}>
            <FilterHeader onPressBack={onPressBack} filterValue={filterValue} onFilter={onFilter}
                          setFilterValue={setFilterValue} setData={setData} data={data_}/>
            {data.length > 0 &&
            <View style={tw`p-3 flex-1`}>
                <Text
                    style={[tw`mb-1 font-semibold`, {color: !theme ? smoothColor : textColor}]}>{'REGISTRO DE AVANCE'}</Text>
                <FlashList
                    data={data}
                    renderItem={renderItem}
                    estimatedItemSize={200}
                />
            </View>}

            {data.length === 0 && <NoFound text_1={'No existen datos.'}/>}
        </View>*/
    );
}

export default observer(AdvanceRecord);

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: 'rgba(0,0,0, 0.05)',
    },
});
