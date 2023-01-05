import React from 'react';
import {createContext} from 'react';

const StoreContext = createContext({
    offlineStore: null,
    dataStore: null,
});

export {StoreContext};
