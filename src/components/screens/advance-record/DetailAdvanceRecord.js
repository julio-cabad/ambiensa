import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {mainColor, mainColor_} from '../../../utils/Colors';
import {observer} from 'mobx-react-lite';
import {StoreContext} from '../../../stores/Context';
import Header from '../../../palette/Header';
import bgImage from '../../../../assets/img/bgImage.jpg';
import {Filters, Order, UpdateTwoFields} from '../../../utils/HelpFunctions';
import {runInAction} from 'mobx';
import {filePercentIcon} from '../../../utils/Icons';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import ProgressModal from './ProgressModal';

const screenWidth = Dimensions.get('window').width;


const description = 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.';

function DetailAdvanceRecord() {

    const {dataStore, offlineStore} = useContext(StoreContext);
    const {
        detailAdvanceRecord, chapterModel, chapters, models, percentageChapter, percentages, constructionStageChapter,
        constructionStage,
    } = dataStore;
    const {saveWorkOrder} = offlineStore;
    const {manzana, solar, modelo, tipoordentrabajo} = detailAdvanceRecord;

    const [switchIcon, setSwitchIcon] = useState(false);
    const [saveWorkOrder_, setSaveWorkOrder_] = useState(null);
    const [value, setValue] = useState(null);
    const [chapterModel_, setChapterModel_] = useState(null);
    const [percentageChapter_, setPercentageChapter_] = useState(null);
    const [chapters_, setChapter_] = useState(chapters);
    const [chaptersValues, setChapterValues] = useState(null);

    const bottomSheetModalRef = useRef(null);

    const filterModel = models ? Filters(models, 'descripcion', modelo) : [];
    const c = chapters && [...chapters];

    /*PERCENTAGE PER CHAPTER*/
    useEffect(() => {
        const PercentageChapter = () => {
            const dataArray = [];
            percentageChapter.forEach(pc => {
                const {id_porcentaje, id_capitulo} = pc;
                const filterPercentages = Filters(percentages, 'id', id_porcentaje);
                dataArray.push({
                    ...filterPercentages[0], id_capitulo, constructionStage: null, idConstructionStage: 0,
                });
            });

            const percentageChapterArr = [];
            chapters.forEach(items => {
                const {descripcion, id} = items;
                const filterPercentageChapter = Filters(dataArray, 'id_capitulo', id);
                if (filterPercentageChapter.length > 0) {
                    const newObj = {
                        descripcion, idChapter: id, percentageChapter: Order(filterPercentageChapter, 'id'),
                    };
                    percentageChapterArr.push(newObj);
                }
            });
            const orderPercentageChapter = Order(percentageChapterArr, 'descripcion');
            setPercentageChapter_(orderPercentageChapter);
        };

        constructionStageChapter && PercentageChapter();

    }, [constructionStageChapter]);

    /*CHAPTERS FOR MODELS*/
    useEffect(() => {
        const GetChaptersMode = async () => {

            runInAction(() => {
                c.forEach(item => item.check = false);
                setChapter_(c);
            });
        };

        (chapters && models) && GetChaptersMode();

    }, [models, chapters]);

    useEffect(() => {
        if (chapterModel) {
            const filterChapterModel = Filters(chapterModel, 'id_modelo', filterModel[0].id);
            const chapters = [...chapters_];

            chapters.forEach(items => {
                filterChapterModel.forEach(cm => items.id === cm.id_capitulo && runInAction(() => {
                    items.check = true;
                    items.percentage = cm.percentage;
                    items.chapterId = cm.id_capitulo
                }));
            });

            const filterChapter = Filters(chapters, 'check', true);

            const saveWorkOrder_ = [];
            filterChapter.map(items => saveWorkOrder_.push({...saveWorkOrder, ...items}));

            const totalChapter = filterChapter.length;
            let pt = 0;
            filterChapter.map(fc => pt = pt + fc.percentage);
            const percentage = (pt / totalChapter) * 100;
            setValue(percentage);
            setChapterModel_(filterChapter);
            setSaveWorkOrder_(saveWorkOrder_);
        }
    }, [detailAdvanceRecord, chapterModel]);

    const data = {
        labels: ['Porcentaje'], // optional
        data: [0.4],
    };

    /*const chartConfig = {
        backgroundGradientFrom: !theme ? mainColor : mainColor_,
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: !theme ? mainColor : mainColor_,
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => theme ? `rgba(249, 115, 22, ${opacity})` : `rgba(101, 163, 13, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
    };*/

    const navigation = useNavigation();

    const handlePresentModalPress = useCallback(() => bottomSheetModalRef.current?.present(), []);

    const onPressBack = () => navigation.navigate('DetailListAdvanceRecord');

    const onShowPercent = (item) => {
        const {id} = item;
        const constructionStage_ = Filters(constructionStageChapter, 'id_capitulo', id);
        const _percentageChapter_ = Filters(percentageChapter_, 'idChapter', id);

        if (constructionStage_.length === 0 && _percentageChapter_.length === 0) {
            handlePresentModalPress();
            return;
        }

        const percentageChapter = _percentageChapter_[0].percentageChapter;

        const constructionStageArr = [];
        constructionStage_.forEach(cs_ => {
            constructionStage.forEach(cs => cs_.id_etapaconstructiva === cs.id && constructionStageArr.push({
                ...cs, idPercentage: cs_.id_porcentaje, idConstructionStage: cs.id,
            }));
        });

        let percentageChapterArr = [];
        let pc = [...percentageChapter];
        constructionStageArr.forEach(items => {
            const {idPercentage, idConstructionStage, descripcion} = items;
            percentageChapterArr = UpdateTwoFields(pc, 'id', idPercentage, 'constructionStage', descripcion, 'idConstructionStage', idConstructionStage);
            pc = percentageChapterArr;
        });

        setChapterValues(percentageChapterArr);
        handlePresentModalPress();
    };


    return (
        <BottomSheetModalProvider>
            <View style={[tw`flex-1`]}>
                <ImageBackground source={bgImage} resizeMode="stretch" style={tw`w-full h-full`}>
                    <Header text={'DETALLE DE'} text_2={`${modelo?.toUpperCase()}`} back onPressBack={onPressBack}/>
                    <View style={[tw`flex-1 p-3 mt-1`, styles.containerStyle]}>
                        <View style={tw`mt-2`}>
                            <Text style={tw`text-teal-900 font-bold shrink`}>{modelo}</Text>
                            <Text style={tw`text-slate-600 text-xs shrink`}>{`Mz: ${manzana} - Solar: ${solar}`}</Text>
                            <Text
                                style={tw`text-orange-500 text-xs shrink`}>{`Tipo de trabajo: ${tipoordentrabajo}`}</Text>
                            <Text style={tw`text-orange-600 text-xs shrink font-semibold`}>
                                {`PORCENTAJE: ${!value ? '0%' : value}`}
                            </Text>
                        </View>

                        {chapterModel_?.map((items, i) => {
                            const {descripcion, percentage} = items;
                            return (
                                <TouchableOpacity onPress={() => onShowPercent(items)} key={i}
                                                  style={tw`w-full border-b border-slate-300 py-3 flex-row items-center justify-between`}>
                                    <View>
                                        <Text style={tw`text-xs text-slate-700 font-semibold`}>{`${descripcion}`}</Text>
                                        <Text style={tw`text-xs text-green-600`}>{`PORCENTAJE : ${percentage}%`}</Text>
                                    </View>

                                    {filePercentIcon}
                                </TouchableOpacity>
                            );
                        })}

                    </View>
                </ImageBackground>
            </View>
            <ProgressModal bottomSheetModalRef={bottomSheetModalRef} head={'REGISTO DE AVANCE'} value={value}
                           text={`${modelo?.toUpperCase()}   MZ : ${manzana} - SOLAR : ${solar}`}
                           setChapterValues={setChapterValues} chaptersValues={chaptersValues}
                           saveWorkOrder={saveWorkOrder} saveWorkOrder_={saveWorkOrder_}/>
        </BottomSheetModalProvider>
        /*<ScrollView style={[tw`flex-1`, {backgroundColor: !theme ? mainColor : mainColor_}]}>
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

        </ScrollView>*/
    );
}

export default observer(DetailAdvanceRecord);

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: 'rgba(0,0,0, 0.05)',
    },
});
