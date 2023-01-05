import React, {useContext} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import Header from '../../../palette/Header';
import bgImage from '../../../../assets/img/bgImage.jpg';
import {StoreContext} from '../../../stores/Context';
import {FlashList} from '@shopify/flash-list';
import {detailWorkOrdersImg} from '../../../utils/Icons';
function DetailWorkOrders() {

    const {dataStore} = useContext(StoreContext);
    const {detailWorkOrders_} = dataStore;

    const navigation = useNavigation();

    const onPressBack = () => {
        navigation.navigate('DownloadWorkOrders');
    };

    const renderItem = ({item}) => {
        const {manzana,  solar, modelo, tipoordentrabajo} = item;

        return(
            <View
                style={[tw`w-full p-2 flex-row items-center  border-b border-gray-400`, styles.containerStyle]}>

                {detailWorkOrdersImg}
                <View style={tw`ml-2`}>
                    <Text style={tw`text-teal-900 font-bold text-xs shrink`}>{modelo}</Text>
                    <Text style={tw`text-slate-600 text-xs shrink`}>{`Mz: ${manzana} - Solar: ${solar}`}</Text>
                    <Text style={tw`text-orange-500 text-xs shrink`}>{`Tipo de trabajo: ${tipoordentrabajo}`}</Text>
                </View>

            </View>
        )
    }

    return (
        <View style={[tw`flex-1`]}>
            <ImageBackground source={bgImage} resizeMode="stretch" style={tw`w-full h-full`}>
                <Header text={'DETALLE'} text_2={'ORDENES DE TRABAJO'} back onPressBack={onPressBack}/>
                <View style={tw`flex-1 p-3`}>
                    <FlashList
                        data={detailWorkOrders_}
                        renderItem={renderItem}
                        estimatedItemSize={200}
                    />
                </View>
            </ImageBackground>
        </View>
    );
}

export default observer(DetailWorkOrders);

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: 'rgba(0,0,0, 0.05)',
    },
});

