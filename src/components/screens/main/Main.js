import React, {useContext, useEffect} from 'react';
import {Text, TouchableOpacity, View, StatusBar, ImageBackground, StyleSheet, Dimensions} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {textColor} from '../../../utils/Colors';
import Header from '../../../palette/Header';
import {StoreContext} from '../../../stores/Context';
import {observer} from 'mobx-react-lite';
import bgImage from '../../../../assets/img/bgImage.jpg';
import {
    calendarIcon, downloadIcon, imageIcon, logoutImg, registerIcon, settingsIcon,
} from '../../../utils/Icons';
import {FloatingAction} from 'react-native-floating-action';
import {Filters, generateUUID, Order} from '../../../utils/HelpFunctions';
import {MAIN_URL} from '../../../utils/Const';
import axios from 'axios';
import {queryDetailsWorkOrders, queryWorkOrders} from '../../../database/Schemas';

const windowWidth = Dimensions.get('window').width;
const colorBt = '#120F72';
const viewColor = '#37D1F2';

const actions = [
    {
        text: 'Salir', icon: logoutImg, name: 'bt_logout', position: 1, color: 'white',
    },
];

function Main() {

    const {dataStore} = useContext(StoreContext);
    const {userData, getProjects, percentageChapter, chapters, percentages, local} = dataStore;
    const {idEmpresa} = userData;

    const navigation = useNavigation();

    useEffect(() => {
        const ProjectStages = async () => await dataStore.ProjectStages(userData, getProjects, local);
        getProjects && ProjectStages();
    }, [getProjects]);

    useEffect(() => {
        const ConstructionStageChapter = async () => {
            await dataStore.ConstructionStageChapter(chapters, percentageChapter, percentages, local, idEmpresa);
        };

        (chapters && percentageChapter && percentages) && ConstructionStageChapter();

    }, [chapters, percentageChapter, percentages]);

    const Settings = async () => {
        navigation.navigate('Settings');
    };

    const DownloadWorkOrders = () => {
        navigation.navigate('DownloadWorkOrders');
    };

    const AdvanceRecord = async () => {
        navigation.navigate('AdvanceRecord');
        const workOrders_ = await queryWorkOrders();
        const detailWorkOrders_ = await queryDetailsWorkOrders();
        dataStore.WokOrdersDb(workOrders_, detailWorkOrders_);
    };

    const ProgressControl = () => {
        navigation.navigate('ProgressControl');
    };

    const Logout = () => {
        navigation.navigate('Login');
    };


    return (
        <View style={[tw`flex-1`]}>


            <StatusBar animated={true} backgroundColor={'#120F72'}
                       barStyle={'light-content'}/>

            <View style={tw`flex-1`}>
                <ImageBackground source={bgImage} resizeMode="stretch" style={styles.img}>
                    <Header text={'HOME'}/>

                    <View style={tw`flex-1 p-4 items-center mt-10 `}>

                        <View style={[tw`w-full items-center justify-center`]}>
                            <TouchableOpacity
                                style={[tw`flex-col items-center border border-gray-200 justify-between rounded-xl h-32 w-36`, {backgroundColor: colorBt}]}
                                onPress={DownloadWorkOrders}
                            >
                                <View style={tw`w-auto items-center p-2 justify-center h-22`}>
                                    {downloadIcon}
                                </View>
                                <View
                                    style={[tw`w-auto items-center justify-center rounded-xl p-2 h-10 w-37`, {backgroundColor: viewColor}]}>
                                    <Text
                                        style={[tw`mt-1 font-bold text-xs`, {color: textColor}]}>{'DESCARGA DE'}</Text>
                                    <Text
                                        style={[tw`font-bold text-xs`, {color: textColor}]}>{'ÓRDENES DE TRABAJO'}</Text>
                                </View>

                            </TouchableOpacity>
                        </View>

                        <View style={[tw`flex-row  w-full justify-between items-center mt-5`]}>

                            <TouchableOpacity
                                style={[tw`flex-col items-center border border-gray-200 justify-between rounded-xl h-32 w-36`, {backgroundColor: colorBt}]}
                                onPress={AdvanceRecord}
                            >
                                <View style={tw`w-auto items-center p-2 justify-center h-22`}>
                                    {registerIcon}
                                </View>
                                <View
                                    style={[tw`w-auto items-center justify-center rounded-xl p-2 h-10 w-37`, {backgroundColor: viewColor}]}>
                                    <Text
                                        style={[tw`font-bold text-xs`, {color: textColor}]}>{'REGISTRO DE AVANCE'}</Text>
                                </View>

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[tw`flex-col items-center border border-gray-200 justify-between rounded-xl h-32 w-36`, {backgroundColor: colorBt}]}
                                onPress={ProgressControl}
                            >
                                <View style={tw`w-auto items-center justify-center h-22`}>
                                    {calendarIcon}
                                </View>
                                <View
                                    style={[tw`w-auto items-center justify-center rounded-xl p-2 h-10 w-37`, {backgroundColor: viewColor}]}>
                                    <Text
                                        style={[tw`font-bold text-xs`, {color: textColor}]}>{'GESTION Y CONTROL'}</Text><Text
                                    style={[tw`font-bold text-xs`, {color: textColor}]}>{'DE AVANCES'}</Text>
                                </View>

                            </TouchableOpacity>


                        </View>

                        <View style={tw`w-full flex-row items-center justify-between mt-5`}>
                            <TouchableOpacity
                                style={[tw`flex-col items-center border border-gray-200 justify-between rounded-xl  h-32 w-36`, {backgroundColor: colorBt}]}
                                onPress={() => null}
                            >
                                <View style={tw`w-auto items-center p-2 justify-center h-22`}>
                                    {imageIcon}
                                </View>
                                <View
                                    style={[tw`w-auto items-center justify-center rounded-xl p-2 h-10 w-37`, {backgroundColor: viewColor}]}>
                                    <Text
                                        style={[tw`font-bold text-xs`, {color: textColor}]}>{'DESCARGA Y CAPTURA'}</Text>

                                    <Text
                                        style={[tw`font-bold text-xs`, {color: textColor}]}>{'DE IMAGENES'}</Text>

                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[tw`flex-col items-center border border-gray-200 justify-between rounded-xl  h-32 w-36`, {backgroundColor: colorBt}]}
                                onPress={Settings}
                            >
                                <View style={tw`w-auto items-center p-2 justify-center h-22`}>
                                    {settingsIcon}
                                </View>
                                <View
                                    style={[tw`w-auto items-center justify-center rounded-xl p-2 h-10 w-37`, {backgroundColor: viewColor}]}>
                                    <Text
                                        style={[tw`font-bold text-xs`, {color: textColor}]}>{'CONFIGURACIONES'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ImageBackground>
            </View>

            <FloatingAction
                actions={actions}
                color={'#FEDA25'}
                onPressItem={(name) => Logout(name)}
            />
        </View>
    );
}

export default observer(Main);

const styles = StyleSheet.create({
    img: {
        height: '100%',
        width: windowWidth,
    },
});

