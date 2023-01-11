import {makeAutoObservable, runInAction} from 'mobx';
import {MAIN_URL} from '../utils/Const';
import axios from 'axios';
import {Filters, generateUUID, Order} from '../utils/HelpFunctions';
import {
    deleteChapterModels,
    deleteChapters,
    deleteConstructionStage,
    deleteConstructionStageChapter,
    deleteGetProjects,
    deleteInspectionPeriod,
    deleteLevelRandomCharge,
    deleteModels,
    deletePercentageChapter,
    deletePercentages, deleteProjectStages,
    deleteReviewStates,
    deleteRoles,
    deleteUserData,
    insertChapterModels,
    insertChapters,
    insertConstructionStage,
    insertConstructionStageChapter,
    insertDetailsWorkOrders,
    insertGetProjects, insertInspectionPeriod,
    insertLevelRandomCharge,
    insertModels,
    insertPercentageChapter,
    insertPercentages, insertProjectStages,
    insertReviewStates,
    insertRoles,
    insertUserData,
    insertWorkOrders,
    queryChapterModels,
    queryChapters,
    queryConstructionStage,
    queryConstructionStageChapter,
    queryDetailsWorkOrders,
    queryGetProjects, queryInspectionPeriod,
    queryLevelRandomCharge,
    queryModels,
    queryPercentageChapter,
    queryPercentages, queryProjectStages,
    queryReviewStates,
    queryRoles,
    queryUserData,
    queryWorkOrders,
} from '../database/Schemas';

class DataStore {
    userData = null;
    detailAdvanceRecord = null;
    rol = null;
    roles = null;
    percentages = null;
    percentageChapter = null;
    chapters = null;
    models = null;
    chapterModel = null;
    constructionStage = null;

    constructionStageChapter = null;
    reviewStates = null;
    levelRandomCharge = null;
    inspectionPeriod = null;
    getProjects = null;
    projectStages = null;
    loadImages = null;
    theme = true;
    housingEstates = null;
    workOrders = null;
    detailWorkOrders = null;
    detailWorkOrders_ = null;
    local = false;

    constructor() {
        makeAutoObservable(this);
    }

    /*USER DATA*/
    UserData = async (userData, local) => {

        if (local) {
            const userData_ = await queryUserData();
            runInAction(() => this.userData = userData_[0]);
        }

        if (!local) {
            const {idEmpresa, empresa, nombreUsuario, idRol} = userData;
            const insertUserData_ = [idEmpresa, empresa, nombreUsuario, idRol];
            await deleteUserData();
            await insertUserData(insertUserData_);
            const userData_ = await queryUserData();
            runInAction(() => this.userData = userData_[0]);
        }
    };

    /*ROLES*/
    Rol = async (data, local) => {

        const {idRol, idEmpresa} = data;
        if (local) {
            const result = await queryRoles();
            const filterRol = Filters(result, 'id', idRol);
            runInAction(() => {
                this.rol = filterRol[0];
                this.roles = result;
            });
        }

        if (!local) {
            await deleteRoles();
            const url = MAIN_URL + `/roles/${idEmpresa}`;
            const res = await axios.get(url);
            const result_ = res.data;
            result_.map(async items => {
                const {id, descripcion} = items;
                const insertRoles_ = [id, descripcion];
                await insertRoles(insertRoles_);
            });
            const result = await queryRoles();
            const filterRol = Filters(result, 'id', idRol);
            runInAction(() => {
                this.rol = filterRol[0];
                this.roles = result;
            });
        }
    };

    /*PERCENTAGES*/
    Percentages = async (data, local) => {

        if (local) {
            const result = await queryPercentages();
            runInAction(() => this.percentages = result);
        }
        if (!local) {
            await deletePercentages();
            const {idEmpresa} = data;
            const url = MAIN_URL + `/porcentajes/${idEmpresa}`;
            const res = await axios.get(url);
            const result_ = res.data;
            result_.map(async items => {
                const {id, descripcion, porcentaje} = items;
                const insertValues = [id, descripcion, porcentaje];
                await insertPercentages(insertValues);
            });

            const result = await queryPercentages();
            runInAction(() => this.percentages = result);
        }
    };

    /*CHAPTERS*/
    Chapters = async (data, local) => {

        if (local) {

            const chapters_ = await queryChapters();
            const percentageChapter_ = await queryPercentageChapter();

            runInAction(() => {
                this.chapters = chapters_;
                this.percentageChapter = percentageChapter_;
            });
        }

        if (!local) {
            await deleteChapters();
            await deletePercentageChapter();

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

            resultArr.map(async items => {
                const {id, descripcion} = items;
                const insertValues = [id, descripcion];
                await insertChapters(insertValues);
            });

            percentageChapterArr.map(async items => {
                const {id_capitulo, id_empresa, id_porcentaje} = items;
                const insertValues = [id_capitulo, id_empresa, id_porcentaje];
                await insertPercentageChapter(insertValues);
            });

            const chapters_ = await queryChapters();
            const percentageChapter_ = await queryPercentageChapter();

            runInAction(() => {
                this.chapters = chapters_;
                this.percentageChapter = percentageChapter_;
            });

        }
    };

    /*MODELS*/
    Models = async (data, local) => {

        if (local) {
            const models_ = await queryModels();
            const chapterModel_ = await queryChapterModels();
            runInAction(() => {
                this.models = models_;
                this.chapterModel = chapterModel_;
            });
        }

        if (!local) {
            await deleteModels();
            await deleteChapterModels();

            const {idEmpresa} = data;
            const url = MAIN_URL + `/modelos/${idEmpresa}`;
            const res = await axios.get(url);
            const models = res.data;
            let chapterModelArr = [];
            for (const item of models) {
                const {id} = item;
                const url = MAIN_URL + `/capitulopormodelo/${idEmpresa}/${id}`;
                try {
                    const res = await axios.get(url);
                    chapterModelArr = [...chapterModelArr, ...res.data];
                } catch (e) {
                    ///console.log(e)
                }
            }

            models.map(async items => {
                const {id, descripcion} = items;
                const insertValues = [id, descripcion];
                await insertModels(insertValues);
            });

            chapterModelArr.map(async items => {
                const {id_empresa, id_modelo, id_capitulo} = items;
                const insertValues = [id_empresa, id_modelo, id_capitulo, 0];
                await insertChapterModels(insertValues);
            });

            const models_ = await queryModels();
            const chapterModel_ = await queryChapterModels();
            runInAction(() => {
                this.models = models_;
                this.chapterModel = chapterModel_;
            });
        }
    };

    /*CONSTRUCTION STAGE*/
    ConstructionStage = async (data, local) => {

        if (local) {
            const result = await queryConstructionStage();
            runInAction(() => this.constructionStage = result);
        }

        if (!local) {
            await deleteConstructionStage();
            const {idEmpresa} = data;
            const url = MAIN_URL + `/etapasconstructivas/${idEmpresa}`;
            const res = await axios.get(url);

            const result_ = res.data;
            result_.map(async items => {
                const {id, descripcion} = items;
                const insertValues = [id, descripcion];
                await insertConstructionStage(insertValues);
            });

            const result = await queryConstructionStage();
            runInAction(() => this.constructionStage = result);
        }
    };

    /*CONSTRUCTION STAGE CHAPTER*/
    ConstructionStageChapter = async (chapters, percentageChapter, percentages, local, idEmpresa) => {

        if (local) {
            const result = await queryConstructionStageChapter();
            runInAction(() => this.constructionStageChapter = result);
        }

        if (!local) {

            await deleteConstructionStageChapter();
            const dataArray = [];
            percentageChapter.forEach(pc => {
                const {id_porcentaje, id_capitulo} = pc;
                const filterPercentages = Filters(percentages, 'id', id_porcentaje);
                const newObj = {
                    ...filterPercentages[0], id_capitulo, open: false, constructionStage: null,
                    idConstructionStage: 0,
                };
                dataArray.push(newObj);
            });

            const percentageChapterArr = [];
            chapters.forEach(items => {
                const {descripcion, id} = items;
                const filterPercentageChapter = Filters(dataArray, 'id_capitulo', id);
                if (filterPercentageChapter.length > 0) {
                    const newObj = {descripcion, percentageChapter: Order(filterPercentageChapter, 'id')};
                    percentageChapterArr.push(newObj);
                }
            });

            const orderPercentageChapter = Order(percentageChapterArr, 'descripcion');

            const constructionStageArr = [];
            const percentageChapterArr_ = [];
            orderPercentageChapter.forEach(items => {
                const uid = generateUUID();
                const {percentageChapter, descripcion} = items;
                //constructionStageArr.push({descripcion, uid});
                percentageChapter.map(pc => percentageChapterArr_.push({...pc, uid}));
            });


            const idChapters = [];
            percentageChapterArr_.map(items => idChapters.push(items.id_capitulo));
            const ids = new Set(idChapters);
            let idChapters_ = [...ids];

            let constructionStage_ = [];

            for (const idChapter of idChapters_) {
                const url = MAIN_URL + `/etapaconstructivaporcapitulo/${idEmpresa}/${idChapter}`;
                const res = await axios.get(url);
                constructionStage_ = [...res.data, ...constructionStage_];
            }


            constructionStage_.map(async items => {
                const {id_capitulo, id_empresa, id_etapaconstructiva, id_porcentaje} = items;
                const insertValues = [id_capitulo, id_empresa, id_etapaconstructiva, id_porcentaje];
                await insertConstructionStageChapter(insertValues);
            });

            const result = await queryConstructionStageChapter();
            runInAction(() => this.constructionStageChapter = result);
        }
    };

    /*REVIEW STATES*/
    ReviewStates = async (data, local) => {

        if (local) {
            const result = await queryReviewStates();
            runInAction(() => this.reviewStates = result);
        }

        if (!local) {
            await deleteReviewStates();
            const {idEmpresa} = data;
            const url = MAIN_URL + `/estadorevision/${idEmpresa}`;
            const res = await axios.get(url);
            const result_ = res.data;
            result_.map(async items => {
                const {id_empresa, id, descripcion} = items;
                const insertValues = [id_empresa, id, descripcion];
                await insertReviewStates(insertValues);
            });

            const result = await queryReviewStates();
            runInAction(() => this.reviewStates = result);
        }
    };

    /*LEVEL RANDOM CHARGE*/
    LevelRandomCharge = async (data, local) => {

        if (local) {
            const result = await queryLevelRandomCharge();
            runInAction(() => this.levelRandomCharge = result);
        }

        if (!local) {
            await deleteLevelRandomCharge();
            const {idEmpresa} = data;
            const url = MAIN_URL + `/nivelcargaaleatoria/${idEmpresa}`;
            const res = await axios.get(url);
            const result_ = res.data;
            result_.map(async items => {
                const {id_empresa, id_rol, porcentaje, id_estadorevision} = items;
                const insertValues = [id_empresa, id_rol, porcentaje, id_estadorevision];
                await insertLevelRandomCharge(insertValues);
            });

            const result = await queryLevelRandomCharge();
            runInAction(() => this.levelRandomCharge = result);
        }
    };

    /*INSPECTION PERIOD*/

    /*Inspection period*/
    InspectionPeriod = async (data, local) => {

        if (local) {
            const result = await queryInspectionPeriod();
            runInAction(() => this.inspectionPeriod = result);
        }

        if (!local) {
            await deleteInspectionPeriod();
            const {idEmpresa} = data;
            const url = MAIN_URL + `/periodoFiscalizacion/${idEmpresa}`;
            const res = await axios.get(url);
            const result_ = res.data;
            result_.map(async items => {
                const {id_empresa, id_proyecto, id_etapaproyecto, periodo} = items;
                const insertValues = [id_empresa, id_proyecto, id_etapaproyecto, periodo];
                await insertInspectionPeriod(insertValues);
            });

            const result = await queryInspectionPeriod();
            runInAction(() => this.inspectionPeriod = result);
        }
    };

    /*Get projects*/
    GetProjects = async (data, local) => {
        if (local) {
            const result = await queryPercentages();
            runInAction(() => this.getProjects = result);
        }

        if (!local) {
            await deleteGetProjects();
            const {idEmpresa} = data;
            const url = MAIN_URL + `/proyecto/${idEmpresa}`;
            const res = await axios.get(url);
            const result_ = res.data;
            result_.map(async items => {
                const {id, descripcion} = items;
                const insertValues = [id, descripcion];
                await insertGetProjects(insertValues);
            });

            const result = await queryGetProjects();
            runInAction(() => this.getProjects = result);
        }
    };

    /*Projects Stages*/
    ProjectStages = async (data, getProjects, local) => {


        if (local) {
            const result = await queryProjectStages();
            runInAction(() => this.projectStages = result);
        }

        if (!local) {
            await deleteProjectStages();
            const {idEmpresa} = data;

            let projectStages = [];
            for (const item of getProjects) {
                const url = MAIN_URL + `/etapaproyecto/${idEmpresa}/${item.id}`;
                try {
                    const res = await axios.get(url);
                    projectStages = [...projectStages, ...res.data];
                } catch (e) {
                    //console.log(e)
                }
            }

            projectStages.map(async items => {
                const {id, descripcion} = items;
                const insertValues = [id, descripcion];
                await insertProjectStages(insertValues);
            });

            const result = await queryProjectStages();
            runInAction(() => this.projectStages = result);

        }
    };

    DetailAdvanceRecord = (detail) => {
        this.detailAdvanceRecord = detail;
    };

    /*LOAD IMAGES*/
    LoadImages = async (data) => {
        const {idEmpresa} = data;
        const url = MAIN_URL + `/parametro/${idEmpresa}`;
        const res = await axios.get(url);
        runInAction(() => {
            this.loadImages = res.data;
        });
    };

    /*DOWNLOAD WORK ORDERS */

    /*Housing estates*/
    HousingEstates = async (data) => {
        const {idEmpresa} = data;
        const url = MAIN_URL + `/urbanizacion/${idEmpresa}`;
        const res = await axios.get(url);
        runInAction(() => {
            this.housingEstates = res.data;
        });
    };

    /*Work orders*/

    WorkOrders = async (data, user) => {
        const {idEmpresa} = data;
        const url = MAIN_URL + `/ordenestrabajo/${idEmpresa}/${user}`;
        const res = await axios.get(url);
        const workOrders = res.data;
        const workOrdersArr = [];
        const detailsArr = [];

        workOrders.forEach(items => {
            const {
                detalles, id, codigo, idproyecto, proyecto, urbanizacion, etapa, fechaemision, tiempoejecucion,
            } = items;
            const uid = generateUUID();
            workOrdersArr.push({
                uid, id, codigo, idproyecto, proyecto, urbanizacion, etapa, fechaemision, tiempoejecucion,
            });
            detalles.map(details => detailsArr.push({...details, uid}));
        });

        workOrdersArr.map(async items => {
            const {
                id, uid, codigo, idproyecto, proyecto, urbanizacion, etapa, fechaemision, tiempoejecucion,
            } = items;

            const dataInsert = [id, uid, codigo, idproyecto, proyecto, urbanizacion, etapa, fechaemision, tiempoejecucion];
            await insertWorkOrders(dataInsert);

        });

        detailsArr.map(async items => {
            const {
                uid, id_detalle, manzana, solar, modelo, descripcion, fechaespecificaciontecnica, tipoordentrabajo,
            } = items;

            const dataInsert = [uid, id_detalle, manzana, solar, modelo, descripcion, fechaespecificaciontecnica, tipoordentrabajo];
            await insertDetailsWorkOrders(dataInsert);

        });

        const workOrders_ = await queryWorkOrders();
        const detailWorkOrders_ = await queryDetailsWorkOrders();


        runInAction(() => {
            this.workOrders = workOrders_;
            this.detailWorkOrders = detailWorkOrders_;
        });
    };

    WokOrdersDb = (workOrders, detailWorkOrders) => {
        this.workOrders = workOrders;
        this.detailWorkOrders = detailWorkOrders;
    };

    /*Detail work orders*/
    DetailWorkOrders = (detail) => {
        this.detailWorkOrders_ = detail;
    };

    /*STATUS LOCAL*/
    StatusLocal = (local) => {
        this.local = local;
    };
}

export {DataStore};
