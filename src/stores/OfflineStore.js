import {makeAutoObservable, runInAction} from 'mobx';
import {MAIN_URL} from '../utils/Const';
import axios from 'axios'
import {Filters, generateUUID} from '../utils/HelpFunctions';
import {insertDetailsWorkOrders, insertWorkOrders, queryDetailsWorkOrders, queryWorkOrders} from '../database/Schemas';

class OfflineStore {
    saveWorkOrder = {};


    constructor() {
        makeAutoObservable(this);
    }

    /*USER DATA*/
    SaveWorkOrder = (values) => {
        this.saveWorkOrder = values;
    };


}

export {OfflineStore};
