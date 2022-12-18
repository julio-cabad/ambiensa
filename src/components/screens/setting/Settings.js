import React, {useContext} from 'react';
import {ImageBackground, ScrollView, StyleSheet,  View} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import {StoreContext} from '../../../stores/Context';
import bgImage from '../../../../assets/img/bgImage.jpg';
import Header from '../../../palette/Header';
import SettingsButton from './SettingsButton';

const chapters = 'Chapters';
const chaptersModel = 'ChaptersModel';
const equivalencePercentageChapter = 'EquivalencePercentageChapter';
const reviewStates = 'ReviewStates';
const levelRandomCharge = 'LevelRandomCharge';
const loadImages = 'LoadImages';
const inspectionPeriod = 'InspectionPeriod';

function Settings() {

    const {dataStore} = useContext(StoreContext);

    const navigation = useNavigation();

    const onPressBack = () => {
        navigation.navigate('Main');
    };


    return (
        <View style={[tw`flex-1`]}>
            <ImageBackground source={bgImage} resizeMode="stretch" style={tw`w-full h-full`}>
                <Header text={'CONFIGURACIONES'} back onPressBack={onPressBack}/>
                <ScrollView style={tw`flex-1 p-3`}>
                    <View style={tw`w-full items-center flex-row justify-between`}>
                        <SettingsButton text={'CAPÍTULOS'} path={chapters}/>
                        <SettingsButton text={'CAPÍTULOS POR'} text_2={'MODELO'} path={chaptersModel}/>
                    </View>

                    <View style={tw`w-full items-center flex-row justify-between mt-3`}>
                        <SettingsButton text={'EQUIVALENCIA DEL'} text_2={'PORCENTAJE POR CAPITULO'}
                                        path={equivalencePercentageChapter }/>
                        <SettingsButton text={'ESTADOS DE REVISIÓN'} path={reviewStates}/>
                    </View>

                    <View style={tw`w-full items-center flex-row justify-between mt-3`}>
                        <SettingsButton text={'NIVEL DE CARGA'} text_2={'ALEATORIA'} path={levelRandomCharge}/>
                        <SettingsButton text={'CARGA DE IMAGENES'} path={loadImages}/>
                    </View>

                    <View style={tw`w-full items-center flex-row justify-between mt-3`}>
                        <SettingsButton text={'PERIODO DE'} text_2={'FISCALIZACIÓN'} path={inspectionPeriod}/>
                    </View>

                </ScrollView>
            </ImageBackground>
        </View>
    );
}

export default observer(Settings);


const styles = StyleSheet.create({
    btStyle: {
        backgroundColor: 'rgba(0,0,0, 0.05)',
        width: '49%',
        height: 120,
    },
    point: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#37D1F2',
        elevation: 5,
    },

});
