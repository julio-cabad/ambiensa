/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import type {Node} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {mainColor} from './src/utils/Colors';
import {StatusBar} from 'react-native';
import NavigationApp from './src/components/routes/NavigationApp';
import {StoresProvider} from './src/stores/Provider';
import Toast from 'react-native-toast-message';
import {CreateTable} from './src/database/Schemas';

const App: () => Node = () => {


    useEffect(() => {
        const createTables = async () => await CreateTable();
        createTables().catch(() => null);
    }, []);

    return (
        <StoresProvider>
            <SafeAreaView style={{flex: 1, backgroundColor: mainColor}}>
                <StatusBar animated={true} backgroundColor={mainColor} barStyle="light-content"/>
                <NavigationApp/>
                <Toast/>
            </SafeAreaView>
        </StoresProvider>
    );
};


export default App;
