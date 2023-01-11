import React, {useCallback, useMemo, useState} from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import tw from 'twrnc';
import {observer} from 'mobx-react-lite';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {saveIcon_} from '../../../utils/Icons';
import {alerts, warning} from '../../../palette/Alerts';
import {UpdateArray} from '../../../utils/HelpFunctions';
import {
    deleteSaveWorkOrdersDetailId,
    insertSaveWorkOrders, querySaveWorkOrders,
    querySaveWorkOrdersDetailId,
} from '../../../database/Schemas';
import {values} from 'mobx';

function ProgressModal(props) {

    const {bottomSheetModalRef, head, text, chaptersValues, setChapterValues, saveWorkOrder_} = props;

    const [loading, setLoading] = useState(false);

    const snapPoints = useMemo(() => ['25%', '83%'], []);

    const handleSheetChanges = useCallback((index: number) => index === -1 && setChapterValues(null), []);

    const onHandleValue = async (items) => {
        const {id_capitulo, porcentaje} = items;
        const {id_detalle} = saveWorkOrder_[0];
        const updateValues = UpdateArray(saveWorkOrder_, 'chapterId', id_capitulo, 'percentage', porcentaje);
        setLoading(true);
        const querySaveWorkOrdersDetailId_ = await querySaveWorkOrdersDetailId([id_detalle]);

        if (querySaveWorkOrdersDetailId_.length === 0) {
            await deleteSaveWorkOrdersDetailId([id_detalle]);

            updateValues.map(async items => {
                const {
                    chapterId, codigo, uid, etapa, id, id_detalle, idproyecto, idurbanizacion, manzana, solar,
                    modelo, descripcion, percentage, tipoordentrabajo, urbanizacion,
                } = items;
                const data = [chapterId, codigo, uid, etapa, id, id_detalle, idproyecto, idurbanizacion, manzana, solar, modelo, descripcion, percentage, tipoordentrabajo, urbanizacion];
                await insertSaveWorkOrders(data);
                setLoading(false);
                bottomSheetModalRef.current?.dismiss();
                alerts('success', 'PORCENTAJES GUARDADOS', `Porcentajes guardados exitosamente!`, 2500);
            });


        } else {

            await deleteSaveWorkOrdersDetailId([id_detalle]);

            updateValues.map(async items => {
                const {
                    chapterId, codigo, uid, etapa, id, id_detalle, idproyecto, idurbanizacion, manzana, solar,
                    modelo, descripcion, percentage, tipoordentrabajo, urbanizacion,
                } = items;
                const data = [chapterId, codigo, uid, etapa, id, id_detalle, idproyecto, idurbanizacion, manzana, solar, modelo, descripcion, percentage, tipoordentrabajo, urbanizacion];
                console.log(data);
                await insertSaveWorkOrders(data);
                setLoading(false);
                bottomSheetModalRef.current?.dismiss();
                alerts('success', 'PORCENTAJES GUARDADOS', `Porcentajes guardados exitosamente!`, 2500);
            });
        }
        const q = await querySaveWorkOrdersDetailId([id_detalle]);
        console.log('querySaveWorkOrdersDetailId_');
        console.log(q);
    };


    return (
        <BottomSheetModal ref={bottomSheetModalRef} index={1} snapPoints={snapPoints} onChange={handleSheetChanges}>
            <View style={tw`p-3`}>
                <Text style={tw`text-xl text-gray-700 font-bold shrink`}>{head}</Text>
                <Text style={tw`text-slate-600 shrink text-xs`}>{text}</Text>


                {!chaptersValues ? warning('No se ha configurado este capítulo!') : null}

                <View style={tw`w-full mt-3`}>
                    {chaptersValues?.map((items, i) => {
                        const {descripcion, constructionStage} = items;
                        return (
                            <TouchableOpacity onPress={() => onHandleValue(items)} key={i}
                                              style={tw`w-full border-b border-slate-300 py-3 flex-row items-center justify-between`}>
                                <View>
                                    <Text
                                        style={tw`text-xs text-slate-700 font-semibold`}>{`PORCENTAJE : ${descripcion}`}</Text>
                                    <Text
                                        style={tw`text-xs text-orange-500`}>{`ESTADO : ${constructionStage ? constructionStage : ''}`}</Text>
                                </View>
                                {saveIcon_}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={tw`w-full items-center justify-between flex-row mt-2`}>
                    <View>
                        {loading ?
                            <View style={tw`w-full items-center flex-row`}>
                                <ActivityIndicator size="small" color="gray"/>
                                <Text style={tw`text-xs text-teal-600 ml-3`}>Guardando...</Text>
                            </View> : null}
                    </View>
                    <TouchableOpacity
                        style={tw`rounded bg-gray-50 ml-3 flex-row items-center p-2 px-4 border border-gray-200`}
                        onPress={() => bottomSheetModalRef.current?.dismiss()} disabled={loading}>
                        <Text style={tw`text-xs text-teal-900`}>Salir</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </BottomSheetModal>
    );
}

export default observer(ProgressModal);
