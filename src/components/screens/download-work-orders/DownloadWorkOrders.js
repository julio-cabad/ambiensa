import React, {useContext, useEffect, useState} from 'react';
import {Keyboard, Text, View} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {mainColor, mainColor_, smoothColor, textColor} from '../../../utils/Colors';
import FilterHeader from '../../../palette/FilterHeader';
import {FlashList} from '@shopify/flash-list';
import {downloadImg, workOrderImg} from '../../../utils/Icons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {Filters, UpdateArray} from '../../../utils/HelpFunctions';
import {FloatingAction} from 'react-native-floating-action';
import NoFound from '../../../palette/NoFound';
import {StoreContext} from '../../../stores/Context';
import {observer} from 'mobx-react-lite';

const data_ = [
    {project: 'Proyecto 1', urbanization: '1', constructionStage: 'Etapa1', OTCode: 401, selected: false},
    {project: 'Proyecto 2', urbanization: '2', constructionStage: 'Etapa2', OTCode: 402, selected: false},
    {project: 'Proyecto 2', urbanization: '3', constructionStage: 'Etapa3', OTCode: 403, selected: false},
    {project: 'Proyecto 5', urbanization: '4', constructionStage: 'Etapa4', OTCode: 404, selected: false},
];

const actions = [
    {
        text: 'Descargar', icon: downloadImg, name: 'bt_download', position: 1, color: 'white',
    },
];

function DownloadWorkOrders() {

    const {dataStore} = useContext(StoreContext);
    const {theme} = dataStore;

    const [filterValue, setFilterValue] = useState('');
    const [data, setData] = useState(data_);
    const [selectAll, setSelectAll] = useState(false);
    const [downloadBt, setDownloadBt] = useState(false);

    const listColor = !theme ? 'bg-gray-800' : 'bg-blue-50';
    const textColor_1 = !theme ? 'text-slate-100' : 'text-blue-900 font-semibold';
    const textColor_2 = !theme ? 'text-gray-400' : 'text-blue-400';
    const textColor_3 = !theme ? 'text-gray-300' : 'text-blue-600';

    useEffect(() => {
        const selected = Filters(data, 'selected', true);
        setDownloadBt(selected.length > 0);
    }, [data]);

    const navigation = useNavigation();

    const onPressBack = () => {
        navigation.navigate('Main');
    };

    const onFilter = (text) => {
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
    };


    const onFloatAction = (name) => {
    };

    const renderItem = ({item}) => {
        const {project, urbanization, constructionStage, OTCode, selected} = item;

        return (
            <View style={tw`w-full p-2 flex-row items-center justify-between ${listColor} rounded mt-3`}>
                <View style={tw`flex-row items-center`}>
                    {workOrderImg}
                    <View style={tw`ml-2`}>
                        {!selectAll &&
                        <BouncyCheckbox
                            size={25}
                            fillColor={!selected ? 'gray' : !theme ? smoothColor : 'tomato'}
                            iconStyle={{borderColor: !theme ? smoothColor : mainColor}}
                            isChecked={selected}
                            onPress={() => {
                                onHandleSelected(item);
                            }}
                        />}

                        {selectAll &&
                        <BouncyCheckbox
                            size={25}
                            fillColor={smoothColor}
                            iconStyle={{borderColor: smoothColor}}
                            isChecked={true}
                        />}
                    </View>

                    <View>
                        <Text style={tw`${textColor_1} text-base font-semibold`}>{`${project}`}</Text>
                        <Text style={tw`${textColor_2} text-xs `}>{`Urbanización : ${urbanization}`}</Text>
                        <Text style={tw`${textColor_3} text-xs `}>{`Etapa construcción : ${constructionStage}`}</Text>
                        <Text style={tw`${textColor_3} text-xs`}>{`Código O.T : ${OTCode}`}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={[tw`flex-1`, {backgroundColor: !theme ? mainColor : mainColor_}]}>
            <FilterHeader onPressBack={onPressBack} filterValue={filterValue} onFilter={onFilter}
                          setFilterValue={setFilterValue} setData={setData} data={data_}/>
            {data.length > 0 &&
            <View style={tw`p-3 flex-1`}>
                <Text
                    style={[tw`mb-1 font-bold`, {color: !theme ? smoothColor : textColor}]}>
                     {'DESCARGA DE ÓRDENES DE TRABAJO'}</Text>

                <View style={tw`w-full items-center flex-row mt-2`}>

                    <BouncyCheckbox
                        size={25}
                        fillColor={!selectAll ? 'gray' : !theme ? smoothColor : 'tomato'}
                        iconStyle={{borderColor: !theme ? smoothColor : mainColor}}
                        isChecked={selectAll}
                        onPress={() => onHandleSelectAll()}
                        disabled={data.length === 0}
                        style={{marginLeft: 57}}
                    />
                    <Text
                        style={[tw`mb-1 `,{color: !theme ? smoothColor : textColor}]}>{'Seleccionar todo'}</Text>

                </View>

                <FlashList
                    data={data}
                    renderItem={renderItem}
                    estimatedItemSize={200}
                />
            </View>}

            {data.length === 0 && <NoFound text_1={'No existen datos'}/>}

            {downloadBt &&
            <FloatingAction
                actions={actions}
                color={'#1f2937'}
                onPressItem={(name) => onFloatAction(name)}
            />}
        </View>
    );
}

export default observer(DownloadWorkOrders);
