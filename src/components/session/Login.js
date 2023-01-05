import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image, Keyboard, ImageBackground, StatusBar} from 'react-native';
import tw from 'twrnc';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {LOGIN_URL} from '../../utils/Const';
import {loginSchema} from '../../utils/YupSchemas';
import {Formik} from 'formik';
import {emailIcon, loginIcon, passwordIcon} from '../../utils/Icons';
import EditText from '../../palette/EditText';
import EditPwd from '../../palette/EditPwd';
import Button from '../../palette/Button';
import {useNavigation} from '@react-navigation/native';
import bgImage from '../../../assets/img/bgLogin.jpg';
import logoImg from '../../../assets/img/logoApp.png';
import axios from 'axios';
import {alerts, generalError} from '../../palette/Alerts';
import {StoreContext} from '../../stores/Context';
import {
    deleteCredentials,
    deleteUserData,
    insertCredentials,
    queryCredentials,
    queryUserData,
} from '../../database/Schemas';

//import NetInfo from '@react-native-community/netinfo';

function Login() {

    const {dataStore, offlineStore} = useContext(StoreContext);


    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const LoginUrl = async (credentials, local) => {

        await deleteCredentials();
        const {user, pass} = credentials;
        const insertCredentials_ = [user, pass];
        await insertCredentials(insertCredentials_);

        const res = await axios.post(LOGIN_URL, credentials);
        const data = res.data[0];
        if (data) {
            const {nombreUsuario} = data;
            dataStore.StatusLocal(local)
            await dataStore.UserData(data, local);
            alerts('success', 'BIENVENID@', `Bienvenid@ ${nombreUsuario}`, 2500);
            navigation.navigate('Main');
            await dataStore.Rol(data, local);
            await dataStore.Percentages(data, local);
            await dataStore.Chapters(data, local);
            await dataStore.Models(data, local);
            await dataStore.ConstructionStage(data, local);
            await dataStore.GetProjects(data, local)
            await dataStore.ReviewStates(data, local);
            await dataStore.LevelRandomCharge(data, local);
            await dataStore.InspectionPeriod(data, local);
            //await dataStore.LoadImages(data)
            /*
             await dataStore.GetProjects(data);*/
            //await dataStore.LoadImages(data);
            // await dataStore.HousingEstates(data);
            //await dataStore.WorkOrders(data, user);
        } else {
            alerts('error', 'AVISO', 'Usuario o contraseña incorrecta');
            setLoading(false);
        }

    };

    const LoginLocal = async (credentials, local) => {
        const {user, pass} = credentials;
        const queryCredentials_ = await queryCredentials();
        const {pwd} = queryCredentials_[0];
        if (queryCredentials_[0].user === user && pass === pwd) {
            const data = await queryUserData();
            const {nombreUsuario} = data[0];
            dataStore.StatusLocal(local)
            await dataStore.UserData(data[0], local);
            navigation.navigate('Main');
            alerts('success', 'BIENVENID@', `Bienvenid@ ${nombreUsuario}`, 2500);
            await dataStore.Rol(data[0], local);
            await dataStore.Percentages(data[0], local);
            await dataStore.Chapters(data[0], local);
            await dataStore.Models(data[0], local);
            await dataStore.ConstructionStage(data[0], local);
            await dataStore.GetProjects(data[0], local)
            await dataStore.ReviewStates(data[0], local);
            await dataStore.LevelRandomCharge(data[0], local);
            await dataStore.InspectionPeriod(data[0], local);
        } else {
            alerts('error', 'AVISO', 'Usuario o contraseña incorrecta');
            setLoading(false);
        }
    };


    const onSubmit = async (values) => {
        Keyboard.dismiss();
        const credentials = {user: values.email.trim(), pass: values.password.trim()};
        setLoading(true);

        try {
            await deleteUserData();
            const queryUserData_ = await queryUserData();
            const local = queryUserData_.length > 0;
            queryUserData_.length === 0 ? await LoginUrl(credentials, local) : await LoginLocal(credentials, local);
            setLoading(false);
        } catch (e) {
            generalError();
            setLoading(false);
        }
    };


    return (
        <View style={[tw`flex-1`]}>
            <StatusBar animated={true} backgroundColor={'#39D0F3'} barStyle={'dark-content'}/>
            <ImageBackground source={bgImage} resizeMode="stretch" style={tw`w-full h-full`}>

                <KeyboardAwareScrollView
                    automaticallyAdjustContentInsets={false}
                    keyboardShouldPersistTaps="always"
                    scrollEventThrottle={10}
                    extraHeight={20}
                    contentContainerStyle={{flexGrow: 1}}
                    resetScrollToCoords={{x: 0, y: 0}}
                >
                    <View style={[tw`h-auto pt-6 items-center justify-center px-6 w-full`]}>
                        <Image source={logoImg} style={styles.imageStyle}/>
                        <View style={tw`w-full items-center justify-center`}>
                            <Text style={[tw`text-3xl mt-6 font-bold text-white`]}>BIENVENIDO!</Text>
                        </View>
                    </View>

                    <View>
                        <Formik
                            validateOnMount={false}
                            validationSchema={loginSchema}
                            initialValues={{email: 'handrade', password: 'prueba123'}}
                            onSubmit={onSubmit}
                        >
                            {({
                                  handleChange,
                                  handleSubmit,
                                  values,
                                  errors,

                              }) => {
                                return (
                                    <>
                                        <View style={tw`mt-7 p-3`}>
                                            <Text style={[tw`text-base mb-3 font-bold text-gray-700`]}>Iniciar
                                                sesión.</Text>
                                            <EditText errors={errors} values={values} field={'email'}
                                                      handleChange={handleChange} label={'Correo electrónico'}
                                                      placeholder={'Correo electrónico'} icon={emailIcon}/>

                                            <EditPwd errors={errors}
                                                     values={values} field={'password'} handleChange={handleChange}
                                                     placeholder={'Contraseña'} icon={passwordIcon}/>


                                            <View style={tw`mt-3 w-full`}>
                                                <Button color={'#333'} textColor={'#fff'} text={'INICIAR SESION'}
                                                        onPress={handleSubmit}
                                                        rIcon={loginIcon} tmRight={10} loading={loading} width={'auto'}
                                                />
                                            </View>

                                        </View>
                                    </>
                                );
                            }}
                        </Formik>
                    </View>

                </KeyboardAwareScrollView>
            </ImageBackground>
        </View>
    );
}

export default Login;

const styles = StyleSheet.create({

    imageStyle: {
        resizeMode: 'stretch',
        width: 160,
        height: 150,
    },
});
