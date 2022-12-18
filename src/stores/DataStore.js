import {makeAutoObservable, runInAction} from 'mobx';
import {MAIN_URL} from '../utils/Const';
import axios from 'axios';
import {Filters} from '../utils/HelpFunctions';

class DataStore {
    userData = null;
    detailAdvanceRecord = null;
    rol = null;
    roles = null;
    percentages = null;
    percentageChapter = null;
    chapters = null;
    models = null;
    constructionStage = null;
    reviewStates = null;
    levelRandomCharge = null;
    theme = true;

    constructor() {
        makeAutoObservable(this);
    }

    /*USER DATA*/
    UserData = (userData) => {
        this.userData = userData;
    };

    /*ROLES*/
    Rol = async (data) => {
        const {idRol, idEmpresa} = data;
        const url = MAIN_URL + `/roles/${idEmpresa}`;
        const res = await axios.get(url);
        const result = res.data;
        const filterRol = Filters(result, 'id', idRol);
        runInAction(() => {
            this.rol = filterRol[0];
            this.roles = res.data;
        });
    };


    /*PERCENTAGES*/
    Percentages = async (data) => {
        const {idEmpresa} = data;
        const url = MAIN_URL + `/porcentajes/${idEmpresa}`;
        const res = await axios.get(url);
        runInAction(() => {
            this.percentages = res.data;
        });
    };

    /*CHAPTERS*/
    Chapters = async (data) => {
        const {idEmpresa} = data;
        const url = MAIN_URL + `/capitulos/${idEmpresa}`;
        const res = await axios.get(url);
        const resultArr = res.data;
        let percentageChapterArr = [];
        for (const item of resultArr) {
            const {id} = item;
            const url = MAIN_URL + `/porcentajeporcapitulo/${idEmpresa}/${id}`;
            try {
                const res = await axios.get(url);
                percentageChapterArr = [...percentageChapterArr, ...res.data];
            } catch (e) {
                ///console.log(e);
            }
        }

        runInAction(() => {
            this.chapters = res.data;
            this.percentageChapter = percentageChapterArr;
        });
    };

    /*MODELSs*/
    Models = async (data) => {
        const {idEmpresa} = data;
        const url = MAIN_URL + `/modelos/${idEmpresa}`;
        const res = await axios.get(url);
        runInAction(() => {
            this.models = res.data;
        });

    };

    /*CONSTRUCTION STAGE*/
    ConstructionStage = async (data) => {
        const {idEmpresa} = data;
        const url = MAIN_URL + `/etapasconstructivas/${idEmpresa}`;
        const res = await axios.get(url);
        runInAction(() => {
            this.constructionStage = res.data;
        });
    };

    /*REVIEW STATES*/
    ReviewStates = async (data) => {
        const {idEmpresa} = data;
        const url = MAIN_URL + `/estadorevision/${idEmpresa}`;
        const res = await axios.get(url);
        runInAction(() => {
            this.reviewStates = res.data;
        });
    };

    /*LEVEL RANDOM CHARGE*/
    LevelRandomCharge = async (data) => {
        const {idEmpresa} = data;
        const url = MAIN_URL + `/nivelcargaaleatoria/${idEmpresa}`;
        const res = await axios.get(url);
        runInAction(() => {
            this.levelRandomCharge = res.data;
        });
    };


    DetailAdvanceRecord = (detail) => {
        this.detailAdvanceRecord = detail;
    };

    /*THEME*/
    Theme = (theme) => {
        this.theme = theme;
    };

}

export {DataStore};
