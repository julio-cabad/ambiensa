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
import {StoreContext} from '../../../../stores/Context';
import Header from '../../../../palette/Header';
import bgImage from '../../../../../assets/img/bgImage.jpg';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {editIcon, periodImg, saveBottomModalIcon} from '../../../../utils/Icons';
import IconButton from '../../../../palette/IconButton';
import {FlashList} from '@shopify/flash-list';
import Loading from '../../../../palette/Loading';
import NoData from '../../../../palette/NoData';
import {MAIN_URL} from '../../../../utils/Const';
import {alerts, generalError} from '../../../../palette/Alerts';
import axios from 'axios';

function InspectionPeriod() {

    const {dataStore} = useContext(StoreContext);
    const {userData, projectStages, getProjects, inspectionPeriod} = dataStore;
    const {idEmpresa} = userData;

    const [loading, setLoading] = useState(false);
    const [row, setRow] = useState(null);
    const [inspectionPeriod_, setInspectionPeriod] = useState(null);
    const [addValue, setAddValue] = useState('');
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '83%'], []);

    useEffect(() => {

        const GetData = () => {

            const mapData = [];
            const inspectionPeriod_ = [];

            getProjects.forEach(items => {
                const {id} = items;
                projectStages.forEach(ps => {
                    if (id === ps.id) {
                        mapData.push({...ps, OTDescription: items.descripcion, codOT: id});
                    }
                });
            });

            console.log(mapData, '-----')

            inspectionPeriod.forEach(items => {
                const {id_proyecto, id_etapaproyecto, periodo} = items;
                mapData.forEach(md => {
                    const {codOT, id} = md;
                    if (codOT === id_proyecto && id_etapaproyecto === id) {
                        inspectionPeriod_.push({...md, id_proyecto, id_etapaproyecto, periodo});
                    }
                });
            });

            function getUniqueListBy(arr, key) {
                return [...new Map(arr.map(item => [item[key], item])).values()]
            }

            const _inspectionPeriod_ = getUniqueListBy(inspectionPeriod_, 'id')

            setInspectionPeriod(_inspectionPeriod_);
        };

        (projectStages && getProjects && inspectionPeriod) && GetData();

    }, [projectStages, getProjects, inspectionPeriod]);

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
        const {periodo} = item;
        setAddValue(periodo.toString());
        handlePresentModalPress();
    };

    const onSave = async () => {

        if (addValue === '') {
            alerts('error', 'AVISO', 'Ingrese el número de días', 2000);
            return;
        }

        const {id_proyecto, id_etapaproyecto} = row;
        Keyboard.dismiss();
        const url = MAIN_URL + '/periodoFiscalizacion';
        const periodosFiscalizacion = [{etapa: id_etapaproyecto, proyecto: id_proyecto, periodo: parseInt(addValue)}];
        const data = {empresa: idEmpresa, periodosFiscalizacion};

        setLoading(true);

        try {
            await axios.post(url, data);
            await dataStore.InspectionPeriod(userData, false);
            setTimeout(() => {
                bottomSheetModalRef.current?.dismiss();
                alerts('success', 'PERIODO ACTUALIZADO', `Periodo actualizado exitosamente!`, 2500);
                setLoading(false);
            }, 1000);
        } catch (e) {
            setAddValue('');
            bottomSheetModalRef.current?.dismiss();
            generalError();
            setLoading(false);
        }
    };

    const renderItem = ({item}) => {

        const {OTDescription, codOT, descripcion, periodo} = item;

        return (
            <View
                style={[tw`w-full p-2 flex-row items-center justify-between border-b border-gray-400`, styles.containerStyle]}>
                <View style={[tw`flex-row items-center`]}>
                    {periodImg}
                    <View style={tw`ml-2`}>
                        <Text style={tw`text-teal-900 font-bold text-xs shrink`}>{OTDescription}</Text>
                        <Text
                            style={tw`text-orange-500 text-xs shrink`}>{`cod. OT : ${codOT}  -  Etapa : ${descripcion}`}</Text>
                        <Text style={tw`text-gray-500 text-xs shrink`}>{`Días : ${periodo}`}</Text>
                    </View>
                </View>
                <View style={[tw`flex-row justify-end`]}>
                    <IconButton icon={editIcon} onPress={() => onEdit(item)}/>
                </View>
            </View>
        );
    };

    return (
        <BottomSheetModalProvider>
            <View style={[tw`flex-1`]}>
                <ImageBackground source={bgImage} resizeMode="stretch" style={tw`w-full h-full`}>
                    <Header text={'PERIODO DE'} text_2={'FISCALIZACIÓN'} back onPressBack={onPressBack}/>
                    <View style={tw`flex-1 `}>
                        {(inspectionPeriod_?.length > 0) &&
                        <View style={tw`flex-1 p-3`}>
                            <FlashList
                                data={inspectionPeriod_}
                                renderItem={renderItem}
                                estimatedItemSize={200}
                            />
                        </View>}
                        {(!inspectionPeriod) && <Loading/>}
                        {inspectionPeriod_?.length === 0 && <NoData/>}
                    </View>
                </ImageBackground>
            </View>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
            >

                <View style={tw`p-2`}>
                    <View style={tw`p-2`}>
                        <Text style={tw`text-xl text-gray-700 font-bold shrink`}>{row?.OTDescription}</Text>
                        <Text
                            style={tw`text-gray-500 shrink`}>{` cod. OT : ${row?.codOT}  -  Etapa : ${row?.descripcion}`}</Text>

                        <TextInput style={tw`w-full border border-teal-600 rounded h-10 mt-3 px-2`}
                                   placeholderTextColor={'gray'} placeholder={'Días'}
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
                                <Text style={tw`text-xs text-teal-900 ml-2`}>Guardar</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </BottomSheetModal>

        </BottomSheetModalProvider>
    );
}

export default observer(InspectionPeriod);

const styles = StyleSheet.create({
        containerStyle: {
            backgroundColor: 'rgba(0,0,0, 0.05)',
        },
    },
);
