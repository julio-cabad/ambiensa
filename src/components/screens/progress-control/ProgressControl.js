import React, {useContext, useState} from 'react';
import {Text, View} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {mainColor, mainColor_, smoothColor, textColor} from '../../../utils/Colors';
import {StoreContext} from '../../../stores/Context';
import {observer} from 'mobx-react-lite';
import FilterHeader from '../../../palette/FilterHeader';
import NoFound from '../../../palette/NoFound';

const data_ = [
    {project: 'Proyecto 1', urbanization: '1', constructionStage: 'Etapa1', OTCode: 401, selected: false},
    {project: 'Proyecto 2', urbanization: '2', constructionStage: 'Etapa2', OTCode: 402, selected: false},
    {project: 'Proyecto 2', urbanization: '3', constructionStage: 'Etapa3', OTCode: 403, selected: false},
    {project: 'Proyecto 5', urbanization: '4', constructionStage: 'Etapa4', OTCode: 404, selected: false},
];

function ProgressControl() {

    const {dataStore} = useContext(StoreContext);
    const {theme} = dataStore;

    const [filterValue, setFilterValue] = useState('');
    const [data, setData] = useState(data_);

    const navigation = useNavigation();

    const onPressBack = () => {
        navigation.navigate('Main');
    };

    const onFilter = (text) => {
    };


    return (
        <View style={[tw`flex-1`, {backgroundColor: !theme ? mainColor : mainColor_}]}>
            <FilterHeader onPressBack={onPressBack} filterValue={filterValue} onFilter={onFilter}
                          setFilterValue={setFilterValue} setData={setData} data={data_}/>

            {data.length > 0 &&
            <View style={tw`p-3 flex-1`}>
                <Text style={[tw`mb-1 font-bold`, {color: !theme ? smoothColor : textColor}]}>
                    {'GESTION Y CONTROL DE AVANCES'}</Text>

            </View>}

            {data.length === 0 && <NoFound text_1={'No existen datos'}/>}

        </View>
    );
}

export default observer(ProgressControl);
