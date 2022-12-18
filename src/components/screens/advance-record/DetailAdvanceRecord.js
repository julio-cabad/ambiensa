import React, {useContext, useState} from 'react';
import {Dimensions, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {mainColor, mainColor_, smoothColor, smoothColor_, textColor} from '../../../utils/Colors';
import {observer} from 'mobx-react-lite';
import {StoreContext} from '../../../stores/Context';
import Header from '../../../palette/Header';
import {ProgressChart} from 'react-native-chart-kit';
import IconANT from 'react-native-vector-icons/AntDesign';
import IconFAW from 'react-native-vector-icons/FontAwesome';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import IconSLI from 'react-native-vector-icons/SimpleLineIcons';
import CBList from '../../../palette/CBList';
import IconButton from '../../../palette/IconButton';
import ProgressModal from './ProgressModal';

const screenWidth = Dimensions.get('window').width;


const description = 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.';

function DetailAdvanceRecord() {

    const {dataStore} = useContext(StoreContext);
    const {detailAdvanceRecord, theme} = dataStore;
    const {project, batch, mz, OTCode, chapter, percentage} = detailAdvanceRecord;

    const [switchIcon, setSwitchIcon] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [value, setValue] = useState(null);

    const data = {
        labels: ['Porcentaje'], // optional
        data: [0.4],
    };

    const chartConfig = {
        backgroundGradientFrom: !theme ? mainColor : mainColor_,
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: !theme ? mainColor : mainColor_,
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => theme ? `rgba(249, 115, 22, ${opacity})` : `rgba(101, 163, 13, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
    };

    const textColor_2 = !theme ? 'text-gray-400' : 'text-blue-600';
    const textColor_4 = !theme ? 'text-lime-300' : 'text-orange-600 font-semibold';
    const textBt = !theme ? 'text-slate-200' : 'text-slate-600';
    const deleteIcon = <IconANT name="delete" size={20} color={theme ? 'red' : 'white'}/>;
    const sendIcon = <IconFAW name="send-o" size={20} color={theme ? '#2085d8' : 'white'}/>;
    const savedIcon_2 = <IconMCI name="content-save-all-outline" size={20} color={theme ? '#2e571d' : 'white'}/>;
    const refreshIcon = <IconSLI name="refresh" size={28} color={!theme ? smoothColor : '#003d55'}/>;

    const navigation = useNavigation();

    const onPressBack = () => {
        navigation.navigate('AdvanceRecord');
    };

    return (
        <ScrollView style={[tw`flex-1`, {backgroundColor: !theme ? mainColor : mainColor_}]}>
            <Header back onPressBack={onPressBack}/>
            <View style={tw`p-3 flex-1`}>
                <Text
                    style={[tw`mb-1 font-bold`, {color: !theme ? smoothColor : textColor}]}>{'DETALLE REGISTRO DE AVANCE'}</Text>

                <Text
                    style={[tw`text-base font-semibold mt-3`, {color: !theme ? smoothColor : textColor}]}>{`${project}`}</Text>
                <Text
                    style={tw`${textColor_2} text-xs`}>{`Mz: ${mz}  Lote: ${batch}  Capitulo : ${chapter}`}</Text>
                <Text style={tw`${textColor_2} text-xs`}>{`Código O.T : ${OTCode}`}</Text>
                <Text style={tw`text-lime-600 font-semibold text-xs`}>{`Capítulo presupuestado : 12%`}</Text>
                <Text style={tw`text-lime-600 text-xs font-semibold`}>{`Valorizado del capítulo : 20%`}</Text>
                <Text
                    style={[tw`font-semibold text-xs`, {color: !theme ? smoothColor : 'green'}]}>{'Saldo capítulo 8%'}</Text>

                <View style={tw`w-full items-center justify-center h-auto`}>
                    <ProgressChart
                        data={data}
                        width={screenWidth}
                        height={220}
                        strokeWidth={12}
                        radius={70}
                        chartConfig={chartConfig}
                        hideLegend
                    />
                    <Text style={tw`${textColor_4} text-xs`}>{`Porcentaje : ${percentage}%`}</Text>
                </View>

                <View style={tw`w-full mt-3 w-full items-end justify-end flex-row `}>
                    <View style={{width: '85%'}}>
                        <CBList label={'Progreso'} switchIcon={switchIcon} setSwitchIcon={setSwitchIcon}
                                setVisibleModal={setVisibleModal} value={value} setValue={setValue}/>
                    </View>
                    <View style={[tw`items-end`, {width: '15%', height: 45}]}>
                        <IconButton icon={refreshIcon}/>
                    </View>
                </View>

                <Text style={tw`${textColor_4} font-semibold text-xs mt-2`}>{`Descripción.`}</Text>
                <Text style={tw`text-gray-600  shrink text-xs`}>{description}</Text>
                <View style={tw`items-center w-full justify-between mt-5 flex-row`}>
                    <TouchableOpacity style={tw`flex-row items-center p-2 border border-green-300 rounded`}>
                        {savedIcon_2}
                        <Text style={tw`${textBt} ml-2`}>GUARDAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={tw`items-center p-2 border border-blue-300 rounded flex-row`}>
                        {sendIcon}
                        <Text style={tw`${textBt} ml-2`}>ENVIAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={tw`items-center p-2 border border-red-300 rounded flex-row`}>
                        {deleteIcon}
                        <Text style={tw`${textBt} ml-2`}>ELIMINAR</Text>
                    </TouchableOpacity>

                </View>
            </View>

            <ProgressModal setVisibleModal={setVisibleModal} visibleModal={visibleModal} setValue={setValue}
                           setSwitchIcon={setSwitchIcon}/>

        </ScrollView>
    );
}

export default observer(DetailAdvanceRecord);
