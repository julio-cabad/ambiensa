import React from 'react';
import {useLocalObservable} from 'mobx-react-lite';
import {StoreContext} from './Context';
import {DataStore} from './DataStore';
import {configure} from 'mobx';
import {OfflineStore} from './OfflineStore';

const StoresProvider = ({children}) => {

    const dataStore = useLocalObservable(() => new DataStore());
    const offlineStore = useLocalObservable(() => new OfflineStore());

    return (
        <StoreContext.Provider value={{dataStore, offlineStore}}>
            {children}
        </StoreContext.Provider>
    );
};

configure({enforceActions: 'always'});

export {StoresProvider};
