import React, {useContext, useState} from 'react';
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

function Login() {

    const {dataStore} = useContext(StoreContext);

    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const onSubmit = async (values) => {
        Keyboard.dismiss();
        const credentials = {user: values.email.trim(), pass: values.password.trim()};
        setLoading(true);
        try {
            const res = await axios.post(LOGIN_URL, credentials);
            const data = res.data[0];
            if (data) {
                const {nombreUsuario} = data;
                dataStore.UserData(data);
                alerts('success', 'BIENVENID@', `Bienvenid@ ${nombreUsuario}`, 2500);
                navigation.navigate('Main');
                await dataStore.Rol(data);
                await dataStore.Chapters(data);
                await dataStore.Percentages(data);
                await dataStore.ConstructionStage(data);
                await dataStore.ReviewStates(data);
                await dataStore.LevelRandomCharge(data);
            } else {
                alerts('error', 'AVISO', 'Usuario o contraseña incorrecta');
                setLoading(false);
            }
            setLoading(false);
        } catch (e) {

            console.log(e);
            generalError();
            setLoading(false);
        }

        //setLoading(true);
        //navigation.navigate('Main');
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
