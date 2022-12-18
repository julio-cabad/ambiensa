import React, {useContext} from 'react';
import {Dimensions, Modal, Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import {StoreContext} from '../../../stores/Context';
import {observer} from 'mobx-react-lite';
import {mainColor, mainColor_, smoothColor, smoothColor_} from '../../../utils/Colors';
import {closeIcon} from '../../../utils/Icons';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';


const windowWidth = Dimensions.get('window').width;
const progress = [5, 10, 15, 20, 40, 60, 80, 100];


function ProgressModal(props) {

    const {dataStore} = useContext(StoreContext);
    const {theme} = dataStore;

    const {setValue, setVisibleModal, visibleModal, setSwitchIcon} = props;


    const onHandleValue = (value) => {
        setValue(value);
        setSwitchIcon(false);
        setVisibleModal(false);
    };

    const percentIcon = <IconMCI name="label-percent-outline" size={24} color={!theme ? smoothColor : smoothColor_}/>;
    const labelColor = !theme ? 'text-blue-400' : 'text-slate-600';

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visibleModal}
            onRequestClose={() => {
                setVisibleModal(false);
                setSwitchIcon(false);
            }}
        >
            <View style={[tw`flex-1 items-center `, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
                <View style={[tw`rounded p-3`, {
                    width: windowWidth - 100, top: 20, backgroundColor: !theme ? mainColor : mainColor_,
                }]}>
                    <View style={tw`w-full items-center justify-between flex-row mb-2`}>
                        <Text style={[tw`font-bold`, {color: !theme ? smoothColor : smoothColor_}]}>Progreso</Text>
                        <TouchableOpacity onPress={() => {
                            setVisibleModal(false);
                            setSwitchIcon(false);
                        }}>
                            {closeIcon}
                        </TouchableOpacity>
                    </View>
                    {progress.map((items, i) => {
                        return (
                            <TouchableOpacity style={tw`flex-row p-2 items-center border-b border-gray-500`}
                                              key={i} onPress={() => onHandleValue(items)}>
                                <View style={tw`w-full flex-row items-center justify-between`}>
                                    <Text style={tw`${labelColor} text-base font-semibold`}>{`${items}%`}</Text>
                                    {percentIcon}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

            </View>
        </Modal>
    );
}

export default observer(ProgressModal);
