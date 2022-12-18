import React, {useContext, useState} from 'react';
import {Keyboard, Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {mainColor, mainColor_, smoothColor, textColor} from '../../../utils/Colors';
import FilterHeader from '../../../palette/FilterHeader';
import NoFound from '../../../palette/NoFound';
import {FlashList} from '@shopify/flash-list';
import {advancedImg, arrowRIcon, workOrderImg} from '../../../utils/Icons';
import {StoreContext} from '../../../stores/Context';
import {observer} from 'mobx-react-lite';
import IconANT from 'react-native-vector-icons/AntDesign';

const data_ = [
    {project: 'Proyecto 1', batch: '1', mz: '11', OTCode: 401, chapter: 34, percentage: 0},
    {project: 'Proyecto 2', batch: '2', mz: '22', OTCode: 402, chapter: 66, percentage: 0},
    {project: 'Proyecto 2', batch: '3', mz: '33', OTCode: 403, chapter: 78, percentage: 0},
    {project: 'Proyecto 5', batch: '4', mz: '54', OTCode: 404, chapter: 90, percentage: 0},
];

function AdvanceRecord() {

    const {dataStore} = useContext(StoreContext);
    const {theme} = dataStore;

    const [filterValue, setFilterValue] = useState('');
    const [data, setData] = useState(data_);

    const navigation = useNavigation();

    const listColor = !theme ? 'bg-gray-800' : 'bg-blue-50';
    const textColor_1 = !theme ? 'text-slate-100' : 'text-blue-900 font-semibold';
    const textColor_2 = !theme ? 'text-gray-400' : 'text-blue-600';
    const textColor_3 = !theme ? 'text-gray-300' : 'text-blue-400';
    const textColor_4 = !theme ? 'text-lime-300' : 'text-orange-600 font-semibold';

    const onPressBack = () => {
        navigation.navigate('Main');
    };

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
        dataStore.DetailAdvanceRecord(item);
        navigation.navigate('DetailAdvanceRecord');
    };

    const renderItem = ({item}) => {
        const {project, batch, mz, OTCode, chapter, percentage} = item;

        return (
            <TouchableOpacity style={tw`w-full p-2 flex-row items-center justify-between ${listColor} rounded mt-3`}
                              onPress={() => DetailAdvanceRecord(item)}>
                <View style={tw`flex-row items-center`}>
                    {advancedImg}
                    <View style={tw`ml-3`}>
                        <Text style={tw`${textColor_1} text-base font-semibold`}>{`${project}`}</Text>
                        <Text
                            style={tw`${textColor_2} text-xs`}>{`Mz: ${mz}  Lote: ${batch}  Capitulo : ${chapter}`}</Text>
                        <Text style={tw`${textColor_3} text-xs`}>{`Código O.T : ${OTCode}`}</Text>
                        <Text style={tw`${textColor_4} text-xs`}>{`Porcentaje : ${percentage}%`}</Text>
                    </View>
                </View>
                <View>
                    {arrowRIcon}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[tw`flex-1`, {backgroundColor: !theme ? mainColor : mainColor_}]}>
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
        </View>
    );
}

export default observer(AdvanceRecord);
