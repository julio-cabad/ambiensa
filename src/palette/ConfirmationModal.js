import React, {useCallback, useMemo} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import tw from 'twrnc';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {playIcon} from '../utils/Icons';
import {useNetInfo} from '@react-native-community/netinfo';

function ConfirmationModal(props) {

    const {bottomSheetModalRef, head, text, loading, onPress, textButton} = props;

    const snapPoints = useMemo(() => ['25%', '70%'], []);

    const netInfo = useNetInfo();
    const {type} = netInfo

    const handleSheetChanges = useCallback((index: number) => {
        //index === -1 && setRow(null);
    }, []);



    return (
        <BottomSheetModal ref={bottomSheetModalRef} index={1} snapPoints={snapPoints} onChange={handleSheetChanges}>
            <View style={tw`p-2`}>
                <Text style={tw`text-xl text-gray-700 font-bold shrink`}>{head}</Text>
                {text &&
                <View style={tw`p-2 mt-2 border border-yellow-800 rounded bg-yellow-100`}>
                    <Text style={tw`text-yellow-700 shrink mb-2`}>{text}</Text>
                </View>}

                {type !== 'wifi' &&

                <Text style={tw`text-red-500 text-xs shrink mt-1`}>{'No dispone de conexión a una red wi-fi!'}</Text>}

                <View style={tw`w-full justify-end flex-row mt-3`}>
                    <TouchableOpacity
                        style={tw`rounded bg-gray-50 ml-3 flex-row items-center p-2 px-4 border border-gray-100`}
                        disabled={loading}
                        onPress={() => bottomSheetModalRef.current?.dismiss()}>
                        <Text style={tw`text-xs text-teal-900`}>Salir</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={tw`rounded bg-teal-100 ml-3 flex-row items-center p-2 border border-teal-200`}
                        onPress={onPress} disabled={loading || type !== 'wifi'}>
                        {loading ? <ActivityIndicator size="small" color="gray"/> : playIcon}
                        <Text style={tw`text-xs text-teal-900 ml-2`}>{textButton}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheetModal>
    );
}

export default ConfirmationModal;
