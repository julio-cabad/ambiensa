import SQLite from 'react-native-sqlite-storage';

//SQLite.enablePromise(false);
//SQLite.DEBUG(true);

const db_ = {name: 'ambiensa.db', location: 'default', createFromLocation: '~ambiensa.db'};

global.db = SQLite.openDatabase(db_, () => null, () => null);

const queryRows = (rows) => {
    const result = [];
    for (let i = 0; i < rows.length; i++) {
        let item = rows.item(i);
        result.push(item);
    }
    return result;
};

/*DATA BASE*/

const ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
    db.transaction((trans) => trans.executeSql(sql, params, (trans, results) => resolve(results),
        (error) => reject(error)),
    );
});

/*Create tables*/

export const CreateTable = async () => {
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS credentials (user VARCHAR(40), pwd VARCHAR(40))', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS userData (idEmpresa INTEGER  PRIMARY KEY NOT NULL, empresa VARCHAR(40), nombreUsuario VARCHAR(50), idRol INTEGER)', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS roles (id INTEGER  PRIMARY KEY NOT NULL, descripcion VARCHAR(40))', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS percentages (id INTEGER  PRIMARY KEY NOT NULL, descripcion VARCHAR(10), porcentaje REAL)', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS chapters  (id INTEGER  PRIMARY KEY NOT NULL, descripcion VARCHAR(70))', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS percentageChapter  (id_capitulo INTEGER, id_empresa INTEGER, id_porcentaje INTEGER)', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS models (id INTEGER  PRIMARY KEY NOT NULL, descripcion VARCHAR(70))', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS chapterModel  (id_empresa INTEGER, id_modelo INTEGER, id_capitulo INTEGER, percentage REAL)', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS constructionStage (id INTEGER  PRIMARY KEY NOT NULL, descripcion VARCHAR(40))', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS constructionStageChapter (id_capitulo INTEGER, id_empresa INTEGER, id_etapaconstructiva INTEGER, id_porcentaje INTEGER)', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS getProjects (id INTEGER  PRIMARY KEY NOT NULL, descripcion VARCHAR(40))', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS reviewStates (id_empresa INTEGER, id INTEGER, descripcion VARCHAR(40))', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS levelRandomCharge (id_empresa INTEGER, id_rol INTEGER, porcentaje INTEGER, id_estadorevision INTEGER)', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS inspectionPeriod  (id_empresa INTEGER, id_proyecto INTEGER, id_etapaproyecto INTEGER, periodo INTEGER)', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS projectStages (id INTEGER, descripcion VARCHAR(40))', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS workOrders (id INTEGER  PRIMARY KEY NOT NULL, uid VARCHAR(50), codigo VARCHAR(25), idproyecto INTEGER, proyecto VARCHAR(50), idurbanizacion INTEGER,  urbanizacion VARCHAR(40), etapa VARCHAR(20), fechaemision VARCHAR(40), tiempoejecucion VARCHAR(25))', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS detailWorkOrders (uid VARCHAR(50), id_detalle INTEGER, manzana INTEGER, solar INTEGER, modelo VARCHAR(25), descripcion VARCHAR(50), fechaespecificaciontecnica VARCHAR(40), tipoordentrabajo VARCHAR(40))', []);
    await ExecuteQuery('CREATE TABLE IF NOT EXISTS saveWorkOrders (chapterId INTEGER, codigo VARCHAR(50), uid VARCHAR(50), etapa VARCHAR(50), id INTEGER, id_detalle INTEGER, idproyecto INTEGER, idurbanizacion INTEGER,  manzana INTEGER, solar INTEGER, modelo VARCHAR(25), descripcion VARCHAR(50), percentage REAL, proyecto VARCHAR(50), tipoordentrabajo VARCHAR(50), urbanizacion VARCHAR(50))', []);
};

/*USER DATA*/
const QUERY_CREDENTIALS = 'SELECT * FROM credentials';
const INSERT_CREDENTIALS = 'INSERT INTO credentials (user, pwd) VALUES ( ?, ?)';
const DELETE_CREDENTIALS = 'DELETE FROM credentials';

export const queryCredentials = async () => {
    let selectQuery = await ExecuteQuery(QUERY_CREDENTIALS, []);
    return queryRows(selectQuery.rows);
};
export const insertCredentials = async data => await ExecuteQuery(INSERT_CREDENTIALS, data);
export const deleteCredentials = async () => await ExecuteQuery(DELETE_CREDENTIALS, []);

/*USER DATA*/
const QUERY_USER_DATA = 'SELECT * FROM userData';
const INSERT_USER_DATA = 'INSERT INTO userData (idEmpresa, empresa, nombreUsuario, idRol) VALUES ( ?, ?, ?, ?)';
const DELETE_USER_DATA = 'DELETE FROM userData';

export const queryUserData = async () => {
    let selectQuery = await ExecuteQuery(QUERY_USER_DATA, []);
    return queryRows(selectQuery.rows);
};
export const insertUserData = async data => await ExecuteQuery(INSERT_USER_DATA, data);
export const deleteUserData = async () => await ExecuteQuery(DELETE_USER_DATA, []);


/*ROLES*/
const QUERY_ROLES = 'SELECT * FROM roles';
const INSERT_ROLES = 'INSERT INTO roles (id, descripcion) VALUES ( ?, ?)';
const DELETE_ROLES = 'DELETE FROM roles';

export const queryRoles = async () => {
    let selectQuery = await ExecuteQuery(QUERY_ROLES, []);
    return queryRows(selectQuery.rows);
};
export const insertRoles = async data => await ExecuteQuery(INSERT_ROLES, data);
export const deleteRoles = async () => await ExecuteQuery(DELETE_ROLES, []);

/*PERCENTAGES*/

const QUERY_PERCENTAGES = 'SELECT * FROM percentages';
const INSERT_PERCENTAGES = 'INSERT INTO percentages (id, descripcion, porcentaje) VALUES ( ?, ?, ?)';
const DELETE_PERCENTAGES = 'DELETE FROM percentages';

export const queryPercentages = async () => {
    let selectQuery = await ExecuteQuery(QUERY_PERCENTAGES, []);
    return queryRows(selectQuery.rows);
};
export const insertPercentages = async data => await ExecuteQuery(INSERT_PERCENTAGES, data);
export const deletePercentages = async () => await ExecuteQuery(DELETE_PERCENTAGES, []);


/*CHAPTERS*/

const QUERY_CHAPTERS = 'SELECT * FROM chapters';
const INSERT_CHAPTERS = 'INSERT INTO chapters (id, descripcion) VALUES ( ?, ?)';
const DELETE_CHAPTERS = 'DELETE FROM chapters';

export const queryChapters = async () => {
    let selectQuery = await ExecuteQuery(QUERY_CHAPTERS, []);
    return queryRows(selectQuery.rows);
};
export const insertChapters = async data => await ExecuteQuery(INSERT_CHAPTERS, data);
export const deleteChapters = async () => await ExecuteQuery(DELETE_CHAPTERS, []);


/*PERCENTAGE CHAPTERS*/

const QUERY_PERCENTAGE_CHAPTERS = 'SELECT * FROM percentageChapter';
const INSERT_PERCENTAGE_CHAPTERS = 'INSERT INTO percentageChapter (id_capitulo, id_empresa, id_porcentaje) VALUES ( ?, ?, ?)';
const DELETE_PERCENTAGE_CHAPTERS = 'DELETE FROM percentageChapter';

export const queryPercentageChapter = async () => {
    let selectQuery = await ExecuteQuery(QUERY_PERCENTAGE_CHAPTERS, []);
    return queryRows(selectQuery.rows);
};
export const insertPercentageChapter = async data => await ExecuteQuery(INSERT_PERCENTAGE_CHAPTERS, data);
export const deletePercentageChapter = async () => await ExecuteQuery(DELETE_PERCENTAGE_CHAPTERS, []);

/*MODELS*/

const QUERY_MODELS = 'SELECT * FROM models';
const INSERT_MODELS = 'INSERT INTO models (id, descripcion) VALUES ( ?, ?)';
const DELETE_MODELS = 'DELETE FROM models';

export const queryModels = async () => {
    let selectQuery = await ExecuteQuery(QUERY_MODELS, []);
    return queryRows(selectQuery.rows);
};
export const insertModels = async data => await ExecuteQuery(INSERT_MODELS, data);
export const deleteModels = async () => await ExecuteQuery(DELETE_MODELS, []);


/*MODELS CHAPTER*/

const QUERY_CHAPTER_MODELS = 'SELECT * FROM chapterModel';
const INSERT_CHAPTER_MODELS = 'INSERT INTO chapterModel (id_empresa, id_modelo, id_capitulo, percentage) VALUES ( ?, ?, ?, ?)';
const UPDATE_CHAPTER_MODELS = 'UPDATE chapterModel SET finished = ? WHERE id = ?';
const DELETE_CHAPTER_MODELS = 'DELETE FROM chapterModel';

export const queryChapterModels = async () => {
    let selectQuery = await ExecuteQuery(QUERY_CHAPTER_MODELS, []);
    return queryRows(selectQuery.rows);
};
export const insertChapterModels = async data => await ExecuteQuery(INSERT_CHAPTER_MODELS, data);
export const updateChapterModels = async data => await ExecuteQuery(UPDATE_CHAPTER_MODELS, data);
export const deleteChapterModels = async () => await ExecuteQuery(DELETE_CHAPTER_MODELS, []);


/*CONSTRUCTION STAGE*/

const QUERY_CONSTRUCTION_STAGE = 'SELECT * FROM constructionStage ';
const INSERT_CONSTRUCTION_STAGE = 'INSERT INTO constructionStage (id, descripcion) VALUES ( ?, ?)';
const DELETE_CONSTRUCTION_STAGE = 'DELETE FROM constructionStage';

export const queryConstructionStage = async () => {
    let selectQuery = await ExecuteQuery(QUERY_CONSTRUCTION_STAGE, []);
    return queryRows(selectQuery.rows);
};
export const insertConstructionStage = async data => await ExecuteQuery(INSERT_CONSTRUCTION_STAGE, data);
export const deleteConstructionStage = async () => await ExecuteQuery(DELETE_CONSTRUCTION_STAGE, []);

/*CONSTRUCTION STAGE CHAPTER*/

const QUERY_CONSTRUCTION_STAGE_CHAPTER = 'SELECT * FROM constructionStageChapter ';
const INSERT_CONSTRUCTION_STAGE_CHAPTER = 'INSERT INTO constructionStageChapter (id_capitulo , id_empresa, id_etapaconstructiva, id_porcentaje) VALUES ( ?, ?, ?, ?)';
const DELETE_CONSTRUCTION_STAGE_CHAPTER = 'DELETE FROM constructionStageChapter';

export const queryConstructionStageChapter = async () => {
    let selectQuery = await ExecuteQuery(QUERY_CONSTRUCTION_STAGE_CHAPTER, []);
    return queryRows(selectQuery.rows);
};
export const insertConstructionStageChapter = async data => await ExecuteQuery(INSERT_CONSTRUCTION_STAGE_CHAPTER, data);
export const deleteConstructionStageChapter = async () => await ExecuteQuery(DELETE_CONSTRUCTION_STAGE_CHAPTER, []);

/*PROJECTS*/

const QUERY_GET_PROJECTS = 'SELECT * FROM getProjects ';
const INSERT_GET_PROJECTS = 'INSERT INTO getProjects (id, descripcion) VALUES ( ?, ?)';
const DELETE_GET_PROJECTS = 'DELETE FROM getProjects';

export const queryGetProjects = async () => {
    let selectQuery = await ExecuteQuery(QUERY_GET_PROJECTS, []);
    return queryRows(selectQuery.rows);
};
export const insertGetProjects = async data => await ExecuteQuery(INSERT_GET_PROJECTS, data);
export const deleteGetProjects = async () => await ExecuteQuery(DELETE_GET_PROJECTS, []);

/*REVIEW STATES*/

const QUERY_REVIEW_STATES = 'SELECT * FROM reviewStates ';
const INSERT_REVIEW_STATES = 'INSERT INTO reviewStates (id_empresa, id, descripcion) VALUES (?, ?, ?)';
const DELETE_REVIEW_STATES = 'DELETE FROM reviewStates';

export const queryReviewStates = async () => {
    let selectQuery = await ExecuteQuery(QUERY_REVIEW_STATES, []);
    return queryRows(selectQuery.rows);
};
export const insertReviewStates = async data => await ExecuteQuery(INSERT_REVIEW_STATES, data);
export const deleteReviewStates = async () => await ExecuteQuery(DELETE_REVIEW_STATES, []);

/*LEVEL RANDOM CHARGE*/

const QUERY_LEVEL_RANDOM_CHARGE = 'SELECT * FROM levelRandomCharge';
const INSERT_LEVEL_RANDOM_CHARGE = 'INSERT INTO levelRandomCharge (id_empresa, id_rol, porcentaje, id_estadorevision) VALUES (?, ?, ?, ?)';
const DELETE_LEVEL_RANDOM_CHARGE = 'DELETE FROM levelRandomCharge';

export const queryLevelRandomCharge = async () => {
    let selectQuery = await ExecuteQuery(QUERY_LEVEL_RANDOM_CHARGE, []);
    return queryRows(selectQuery.rows);
};
export const insertLevelRandomCharge = async data => await ExecuteQuery(INSERT_LEVEL_RANDOM_CHARGE, data);
export const deleteLevelRandomCharge = async () => await ExecuteQuery(DELETE_LEVEL_RANDOM_CHARGE, []);


/*INSPECTION PERIOD*/

const QUERY_INSPECTION_PERIOD = 'SELECT * FROM inspectionPeriod';
const INSERT_INSPECTION_PERIOD = 'INSERT INTO inspectionPeriod (id_empresa, id_proyecto, id_etapaproyecto, periodo) VALUES (?, ?, ?, ?)';
const DELETE_INSPECTION_PERIOD = 'DELETE FROM inspectionPeriod';

export const queryInspectionPeriod = async () => {
    let selectQuery = await ExecuteQuery(QUERY_INSPECTION_PERIOD, []);
    return queryRows(selectQuery.rows);
};
export const insertInspectionPeriod = async data => await ExecuteQuery(INSERT_INSPECTION_PERIOD, data);
export const deleteInspectionPeriod = async () => await ExecuteQuery(DELETE_INSPECTION_PERIOD, []);


/*PROJECT STAGES*/

const QUERY_PROJECT_STAGES = 'SELECT * FROM projectStages';
const INSERT_PROJECT_STAGES = 'INSERT INTO projectStages (id, descripcion) VALUES (?, ?)';
const DELETE_PROJECT_STAGES = 'DELETE FROM projectStages';

export const queryProjectStages = async () => {
    let selectQuery = await ExecuteQuery(QUERY_PROJECT_STAGES, []);
    return queryRows(selectQuery.rows);
};
export const insertProjectStages = async data => await ExecuteQuery(INSERT_PROJECT_STAGES, data);
export const deleteProjectStages = async () => await ExecuteQuery(DELETE_PROJECT_STAGES, []);

/***************************************************END SETTINGS************************************************************/


/**************************************************DOWNLOAD WORK ORDERS************************************************************/

/*DOWNLOAD WORK ORDERS*/

const QUERY_WORK_ORDERS = 'SELECT * FROM workOrders';
const QUERY_DETAILS_WORK_ORDERS = 'SELECT * FROM detailWorkOrders';
const DELETE_WORK_ORDERS = 'DELETE FROM workOrders';
const DELETE_DETAILS_WORK_ORDERS = 'DELETE FROM detailWorkOrders';
const INSERT_WORK_ORDERS = 'INSERT INTO workOrders (id, uid, codigo, idproyecto, proyecto, urbanizacion, etapa, fechaemision, tiempoejecucion) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)';
const INSERT_DETAILS_WORK_ORDERS = 'INSERT INTO detailWorkOrders (uid , id_detalle , manzana,  solar, modelo, descripcion, fechaespecificaciontecnica, tipoordentrabajo) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)';

export const queryWorkOrders = async () => {
    let selectQuery = await ExecuteQuery(QUERY_WORK_ORDERS, []);
    let rows = selectQuery.rows;
    return queryRows(rows);
};

export const queryDetailsWorkOrders = async () => {
    let selectQuery = await ExecuteQuery(QUERY_DETAILS_WORK_ORDERS, []);
    return queryRows(selectQuery.rows);
};

export const deleteWorkOrders = async () => await ExecuteQuery(DELETE_WORK_ORDERS, []);
export const deleteDetailsWorkOrders = async () => await ExecuteQuery(DELETE_DETAILS_WORK_ORDERS, []);

export const insertWorkOrders = async data => await ExecuteQuery(INSERT_WORK_ORDERS, data);
export const insertDetailsWorkOrders = async data => await ExecuteQuery(INSERT_DETAILS_WORK_ORDERS, data);

/************************************************** END DOWNLOAD WORK ORDERS************************************************************/

/**************************************************SAVE OFFLINE WORK ORDERS************************************************************/

const QUERY_SAVE_WORK_ORDERS = 'SELECT * FROM saveWorkOrders';
const QUERY_SAVE_WORK_ORDERS_DETAIL_ID = 'SELECT * FROM saveWorkOrders WHERE  id_detalle = ?';
const DELETE_SAVE_WORK_ORDERS = 'DELETE FROM saveWorkOrders';
const DELETE_SAVE_WORK_ORDERS_DETAIL_ID = 'DELETE FROM saveWorkOrders WHERE id_detalle = ?';
const INSERT_SAVE_WORK_ORDERS = 'INSERT INTO saveWorkOrders (chapterId, codigo, uid, etapa, id, id_detalle, idproyecto, idurbanizacion,  manzana, solar, modelo, descripcion, percentage, tipoordentrabajo, urbanizacion) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

export const querySaveWorkOrders = async () => {
    let selectQuery = await ExecuteQuery(QUERY_SAVE_WORK_ORDERS, []);
    return queryRows(selectQuery.rows);
};
export const querySaveWorkOrdersDetailId = async query => {
    let selectQuery = await ExecuteQuery(QUERY_SAVE_WORK_ORDERS_DETAIL_ID, query);
    return queryRows(selectQuery.rows);
};
export const insertSaveWorkOrders = async data => await ExecuteQuery(INSERT_SAVE_WORK_ORDERS, data);
export const deleteSaveWorkOrders = async () => await ExecuteQuery(DELETE_SAVE_WORK_ORDERS, []);
export const deleteSaveWorkOrdersDetailId = async query  => await ExecuteQuery(DELETE_SAVE_WORK_ORDERS_DETAIL_ID, query);

/**************************************************END SAVE OFFLINE WORK ORDERS************************************************************/
