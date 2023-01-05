import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import {StoreContext} from '../../../../stores/Context';
import bgImage from '../../../../../assets/img/bgImage.jpg';
import Header from '../../../../palette/Header';
import {FlashList} from '@shopify/flash-list';
import {editIcon, modelsImg, paperclipIcon, saveBottomModalIcon} from '../../../../utils/Icons';
import {MAIN_URL} from '../../../../utils/Const';
import axios from 'axios';
import {alerts, generalError} from '../../../../palette/Alerts';
import IconButton from '../../../../palette/IconButton';
import Loading from '../../../../palette/Loading';
import NoData from '../../../../palette/NoData';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {ScrollView} from 'react-native-gesture-handler';
import {runInAction} from 'mobx';
import {Filters, UpdateArray} from '../../../../utils/HelpFunctions';

function ChaptersModel() {

    const {dataStore} = useContext(StoreContext);
    const {chapters, models, userData, chapterModel} = dataStore;
    const {idEmpresa} = userData;

    const [loading, setLoading] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [row, setRow] = useState(null);
    const [chapterModel_, setChapterModel] = useState(chapterModel);
    const [chapters_, setChapter_] = useState(chapters);
    const [chaptersArr, setChapterArr] = useState([]);
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '83%'], []);

    const c = chapters && [...chapters];

    useEffect(() => {
        const GetChaptersMode = async () => {
            setChapterModel(chapterModel);

            runInAction(() => {
                c.forEach(item => {
                    item.check = false;
                });
                setChapter_(c);
            });
        };

        (chapters && models) && GetChaptersMode();

    }, [models, chapters, trigger]);

    useEffect(() => {
        if (chapterModel_ && row) {
            const filterChapterModel = Filters(chapterModel_, 'id_modelo', row?.id);
            const chapters = [...chapters_];

            chapters.forEach(items => {
                const {id} = items;
                filterChapterModel.forEach(cm => {
                    const {id_capitulo} = cm;
                    if (id === id_capitulo) {
                        runInAction(() => {
                            items.check = true;
                        });
                    }
                });
            });
            setChapter_(chapters);
        }
    }, [chapterModel_, row]);

    const navigation = useNavigation();

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        index === -1 && setRow(null);
    }, []);

    const onPressBack = () => navigation.navigate('Settings');


    const onEdit = (item) => {
        setRow(item);
        handlePresentModalPress();
    };

    const onSelect = (item) => {
        const {id, check} = item;
        const updateChapters = UpdateArray(chapters_, 'id', id, 'check', !check);
        const filterChapters = Filters(updateChapters, 'check', true);
        const chaptersArr = [];
        filterChapters.map(items => chaptersArr.push(items.id));
        setChapter_(updateChapters);
        setChapterArr(chaptersArr);

    };

    const onSave = async () => {

        setLoading(true);
        const url = MAIN_URL + '/capitulopormodelo';

        const data = {empresa: idEmpresa, modelo: row?.id, capitulos: chaptersArr};

        try {
            await axios.post(url, data);
            await dataStore.Models(userData, false);
            setTrigger(!trigger);
            setTimeout(() => {
                bottomSheetModalRef.current?.dismiss();
                alerts('success', 'CAPÍTULOS GUARDADOS', `Capítulos guardados exitosamente!`, 2500);
                setLoading(false);
            }, 1000);
        } catch (e) {
            bottomSheetModalRef.current?.dismiss();
            generalError();
            setLoading(false);
        }
    };

    const renderItem = ({item}) => {

        const {descripcion, id} = item;
        const numberChapters = Filters(chapterModel_, 'id_modelo', id);


        return (
            <View
                style={[tw`w-full p-2 flex-row items-center justify-between border-b border-gray-400`, styles.containerStyle]}>
                <View style={[tw`flex-row items-center`, {width: '85%'}]}>
                    {modelsImg}
                    <View style={tw`ml-2`}>
                        <Text style={tw`text-teal-900 font-bold`}>{descripcion}</Text>
                        {/*<Text style={tw`shrink text-xs text-orange-500`}>{`Numero de capitulos : ${numberChapters.length}`}</Text>*/}
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
                        <Header text={'CAPÍTULOS POR'} text_2={'MODELO'} back onPressBack={onPressBack}/>
                        {(chapters?.length > 0 && models?.length > 0 && chapterModel_) &&
                        <View style={tw`flex-1 p-3`}>
                            <FlashList
                                data={models}
                                renderItem={renderItem}
                                estimatedItemSize={200}
                            />
                        </View>}

                        {(!chapters || !models || !chapterModel_) && <Loading/>}
                        {chapters?.length === 0 && <NoData/>}
                    </ImageBackground>
                </View>
            </View>

            <BottomSheetModal ref={bottomSheetModalRef} index={1} snapPoints={snapPoints} onChange={handleSheetChanges}>
                <View style={tw`p-2`}>
                    <Text style={tw`text-xl text-gray-700 font-bold shrink`}>{row?.descripcion}</Text>
                    <Text style={tw`text-gray-500 shrink mb-2`}>SELECCIONAR CAPÍTULO</Text>
                </View>

                <ScrollView style={tw`flex-1 p-2`}>
                    {chapters_?.map((items) => {

                        const {descripcion, id, check} = items;
                        const bg = check ? 'bg-teal-50' : 'bg-white';

                        return (
                            <TouchableOpacity style={tw`flex-row p-2 items-center border-b border-gray-300 mt-1 ${bg}`}
                                              key={id} disabled={loading} onPress={() => onSelect(items)}>
                                <View style={tw`w-full flex-row items-center justify-between`}>
                                    <Text style={tw`text-xs text-slate-700 font-semibold`}>{`${descripcion}`}</Text>
                                    {paperclipIcon}
                                </View>
                            </TouchableOpacity>
                        );
                    })}

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

                </ScrollView>

            </BottomSheetModal>

        </BottomSheetModalProvider>
    );
}


export default observer(ChaptersModel);

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: 'rgba(0,0,0, 0.05)',
    },
});
