/*filtrar un array de objetos por campo*/

function Filters(dataArray, field, parameter) {
    return dataArray.filter(item => item[field] === parameter);
}

/*Filtra por dos parametros iguales*/
function FilterTwo(dataArray, field_1, field_2, parameter_1, parameter_2) {
    const filter = dataArray.filter(item => item[field_1] === parameter_1);
    return filter.filter(item => item[field_2] === parameter_2);
}

/*Filtra y devulve los elementos diferentes*/
function FilterDelete(dataArray, field, parameter) {
    return dataArray.filter(item => item[field] !== parameter);
}

/*Filter array by key*/
function FilterByKey(dataArray, keyItem) {
    let result = null;
    let pos = null;
    dataArray.forEach((item, i) => {
        if (Object.keys(item)[0] === keyItem) {
            result = item;
            pos = i;
        }
    });
    return {result: result, pos: pos};
}

/*Actualizar un array de objetos por un campo*/
function UpdateArray(dataArray, field, param, key, value) {
    const elementsIndex = dataArray.findIndex(element => element[field] === param);
    let newArray = [...dataArray];
    newArray[elementsIndex] = {
        ...newArray[elementsIndex], [key]: value,
    };
    return newArray;
}


/*Actualizar un array y 2 campos de un objeto*/
function UpdateTwoFields(dataArray, field, param, key_1, value_1, key_2, value_2) {
    const elementsIndex = dataArray.findIndex(element => element[field] === param);
    let newArray = [...dataArray];
    newArray[elementsIndex] = {...newArray[elementsIndex], [key_1]: value_1, [key_2]: value_2};
    return newArray;
}


/*Actualizar un array y 3 campos de un objeto*/
function UpdateThreeFields(dataArray, field, param, key_1, value_1, key_2, value_2, key_3, value_3) {
    const elementsIndex = dataArray.findIndex(element => element[field] === param);
    let newArray = [...dataArray];
    newArray[elementsIndex] = {
        ...newArray[elementsIndex], [key_1]: value_1, [key_2]: value_2, [key_3]: value_3,
    };
    return newArray;
}

/*Ordenar*/
function Order(dataArray, field) {
    return dataArray.sort((a, b) => (a[field] > b[field]) ? 1 : -1);
}

/*Generar ids*/
function generateUUID() {
    let d = new Date().getTime();
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r && 0x3 | 0x8)).toString(16);
    });
}

function MakePwd(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/*Repetidos*/
function duplicateArrayObjects(array, field) {
    let uniqueValues = new Set((array.map(v => v[field])));
    return uniqueValues.size < array.length;
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/*Short by two params*/

function ShortTwoParam(dataArray, field_1, field_2) {
    return dataArray.sort((a, b) => {
        if (a[field_1] === b[field_1]) {
            return a[field_2] < b[field_2] ? -1 : 1;
        } else {
            return a[field_1] < b[field_1] ? -1 : 1;
        }
    });
}


export {
    Filters, FilterDelete, FilterByKey, UpdateArray, Order, generateUUID, MakePwd, UpdateThreeFields,
    FilterTwo, duplicateArrayObjects, capitalizeFirstLetter, ShortTwoParam, UpdateTwoFields
};
