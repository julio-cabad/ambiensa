import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {StoreContext} from '../../../../stores/Context';
import {observer} from 'mobx-react-lite';
import bgImage from '../../../../../assets/img/bgImage.jpg';
import Header from '../../../../palette/Header';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {Filters, Order, UpdateThreeFields, UpdateTwoFields} from '../../../../utils/HelpFunctions';
import {FlashList} from '@shopify/flash-list';
import Loading from '../../../../palette/Loading';
import NoData from '../../../../palette/NoData';
import {
    arrowDownIcon,
    arrowUpIcon,
    chapterImg,
    checkcircleoIcon,
    editIcon,
    saveBottomModalIcon,
} from '../../../../utils/Icons';
import IconButton from '../../../../palette/IconButton';
import {ScrollView} from 'react-native-gesture-handler';
import {MAIN_URL} from '../../../../utils/Const';
import axios from 'axios';
import {alerts, generalError} from '../../../../palette/Alerts';

function EquivalencePercentageChapter() {

    const {dataStore} = useContext(StoreContext);
    const {chapters, percentages, percentageChapter, userData, constructionStage} = dataStore;
    const {idEmpresa} = userData;

    const [loading, setLoading] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [constructionStageLoading, setConstructionStageLoading] = useState(false);
    const [percentageChapter_, setPercentageChapter_] = useState(null);
    const [row, setRow] = useState(null);
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '83%'], []);

    useEffect(() => {

        const GetData = () => {
            const dataArray = [];
            percentageChapter.forEach(pc => {
                const {id_porcentaje, id_capitulo} = pc;
                const filterPercentages = Filters(percentages, 'id', id_porcentaje);
                const newObj = {
                    ...filterPercentages[0], id_capitulo, open: false, constructionStage: null,
                    idConstructionStage: 0,
                };
                dataArray.push(newObj);
            });

            const percentageChapterArr = [];
            chapters.forEach(items => {
                const {descripcion, id} = items;
                const filterPercentageChapter = Filters(dataArray, 'id_capitulo', id);
                if (filterPercentageChapter.length > 0) {
                    const newObj = {descripcion, percentageChapter: Order(filterPercentageChapter, 'id')};
                    percentageChapterArr.push(newObj);
                }
            });
            const orderPercentageChapter = Order(percentageChapterArr, 'descripcion');
            setPercentageChapter_(orderPercentageChapter);
        };

        (chapters && percentageChapter && percentages) && GetData();

    }, [chapters, percentageChapter, percentages]);

    const onPressBack = () => {
        navigation.navigate('Settings');
    };

    const navigation = useNavigation();

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        index === -1 && setRow(null);
    }, []);

    const onEdit = async (item) => {
        const {percentageChapter} = item;
        const idChapter = percentageChapter[0].id_capitulo;
        handlePresentModalPress();


        const url = MAIN_URL + `/etapaconstructivaporcapitulo/${idEmpresa}/${idChapter}`;

        let status = true;
        setConstructionStageLoading(true);

        try {
            const res = await axios.get(url);
            const constructionStage_ = res.data;

            const constructionStageArr = [];
            constructionStage_.forEach(items => {
                const {id_etapaconstructiva, id_porcentaje} = items;
                constructionStage.forEach(cs => {
                    if (id_etapaconstructiva === cs.id) {
                        constructionStageArr.push({...cs, idPercentage: id_porcentaje, idConstructionStage: cs.id});
                    }
                });
            });

            console.log('======================**======================');
            console.log(percentageChapter)
            console.log(constructionStageArr);

            let percentageChapterArr = [];
            let pc = [...percentageChapter];
            constructionStageArr.forEach(items => {
                const {idPercentage, idConstructionStage, descripcion} = items;
                percentageChapterArr = UpdateTwoFields(pc, 'id', idPercentage, 'constructionStage', descripcion, 'idConstructionStage', idConstructionStage);
                pc = percentageChapterArr;
            });

            console.log(percentageChapterArr, '-****----*******-')

            const updateRow = {...item};
            percentageChapterArr.forEach(pc => pc.open = false);
            updateRow.percentageChapter = percentageChapterArr;
            setRow(updateRow);
            setConstructionStageLoading(false);
        } catch (e) {
            status = false;
        }

        if (!status) {
            const updateRow = {...item};
            percentageChapter.forEach(pc => pc.open = false);
            updateRow.percentageChapter = percentageChapter;
            setRow(updateRow);
            setConstructionStageLoading(false);
        }
    };

    const OpenConstructionStage = (row, id) => {
        const {percentageChapter} = row;
        const updateRow = {...row};
        percentageChapter.forEach(pc => pc.open = pc.id === id);
        updateRow.percentageChapter = percentageChapter;
        setRow(updateRow);
    };

    const onSelect = (item, row, id) => {

        const {descripcion} = item;
        const {percentageChapter} = row;
        const updateRow = {...row};
        updateRow.percentageChapter = UpdateThreeFields(percentageChapter, 'id', id, 'idConstructionStage', item.id, 'constructionStage', descripcion, 'open', false);
        setRow(updateRow);
    };

    const onSave = async () => {
        const {percentageChapter} = row;
        const capitulo = percentageChapter[0].id_capitulo;
        const etapasConstructivasPorPorcentajes = [];
        percentageChapter.forEach(items => {
            const {constructionStage, id, idConstructionStage} = items;
            if (constructionStage) {
                const newObj = {porcentaje: id, etapaConstructiva: idConstructionStage};
                etapasConstructivasPorPorcentajes.push(newObj);
            }
        });

        setLoading(true);

        const url = MAIN_URL + '/etapaconstructivaporcapitulo';

        const data = {empresa: idEmpresa, capitulo, etapasConstructivasPorPorcentajes};

        try {
            await axios.post(url, data);
            await dataStore.ConstructionStageChapter(chapters, percentageChapter, percentages, false, idEmpresa);
            setTrigger(!trigger);
            setTimeout(() => {
                bottomSheetModalRef.current?.dismiss();
                alerts('success', 'EQUIVALENCIAS GUARDADOS', `Equivalencias guardadas exitosamente!`, 2500);
                setLoading(false);
            }, 1000);
        } catch (e) {
            bottomSheetModalRef.current?.dismiss();
            generalError();
            setLoading(false);
        }

    };

    const renderItem = ({item}) => {
        const {percentageChapter, descripcion} = item;
        let percentages_ = '';
        percentageChapter.forEach(pc => {
            percentages_ = percentages_ + '-' + pc.descripcion;
        });
        return (
            <View
                style={[tw`w-full p-2 flex-row items-center justify-between border-b border-gray-400`, styles.containerStyle]}>
                <View style={[tw`flex-row items-center`, {width: '85%'}]}>
                    {chapterImg}
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
                <View style={[tw`flex-1 bg-red-50`]}>
                    <ImageBackground source={bgImage} resizeMode="stretch" style={tw`w-full h-full`}>
                        <Header text={'EQ. DEL PORCENTAJE'} text_2={'POR CAPITULO'} back onPressBack={onPressBack}/>
                        {(percentageChapter_ && constructionStage) &&
                        <View style={tw`flex-1 p-3`}>
                            <FlashList
                                data={percentageChapter_}
                                renderItem={renderItem}
                                estimatedItemSize={200}
                            />
                        </View>}
                        {(!percentageChapter_ && !constructionStage) && <Loading/>}
                        {chapters?.length === 0 && <NoData/>}
                    </ImageBackground>
                </View>

                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                >
                    {!constructionStageLoading &&
                    <View style={tw`p-2`}>
                        <Text style={tw`text-xl text-gray-700 font-bold shrink`}>{row?.descripcion}</Text>
                        <Text style={tw`text-gray-500 shrink`}>SELECCIONAR EQUIVALENCIA</Text>
                    </View>
                    }

                    {constructionStageLoading &&
                    <View style={tw`flex-1 items-center justify-center`}>
                        <ActivityIndicator size="small" color="gray"/>
                        <Text style={tw`text-gray-500 shrink mt-2`}>Cargando...</Text>
                    </View>
                    }

                    {!constructionStageLoading &&
                    <ScrollView style={tw`flex-1 p-2`}>
                        {row?.percentageChapter?.map((items, i) => {
                            const {descripcion, id, open} = items;
                            return (
                                <View style={tw`p-2`} key={i}>
                                    <View
                                        style={tw`flex-row flex-row items-center justify-between border-b border-gray-300 mt-1`}>
                                        <View>
                                            <Text
                                                style={tw`text-xs text-slate-700 font-semibold`}>{`${descripcion}`}</Text>
                                            {items.constructionStage &&
                                            <Text
                                                style={tw`text-xs text-orange-400`}>{`${items.constructionStage}`}</Text>}
                                        </View>
                                        <IconButton
                                            icon={open ? arrowDownIcon : arrowUpIcon}
                                            onPress={() => OpenConstructionStage(row, id)}/>
                                    </View>

                                    {open &&
                                    <View style={tw`bg-gray-100 mt-2 mb-2`}>
                                        {constructionStage?.map(items => {
                                            return (
                                                <TouchableOpacity
                                                    style={tw`flex-row p-2 items-center border-b border-gray-200`}
                                                    key={items.id} onPress={() => onSelect(items, row, id)}>
                                                    <View style={tw`w-full flex-row items-center justify-between mt-2`}>
                                                        <Text
                                                            style={tw`text-xs text-slate-700 font-semibold`}>{`${items?.descripcion}`}</Text>
                                                        {checkcircleoIcon}
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>}
                                </View>
                            );

                        })}


                        {!constructionStageLoading &&
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
                        }
                    </ScrollView>}

                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
    );
}

export default observer(EquivalencePercentageChapter);

const styles = StyleSheet.create(
    {
        containerStyle: {
            backgroundColor: 'rgba(0,0,0, 0.05)',
        }
        ,
    },
);
