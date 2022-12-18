import React from 'react';
import * as Yup from 'yup';

/*LOGIN*/
export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .required('El usuario es requerido'),
        //.required('Ingrese el correo electrónico'),
        //.email('Correo electrónico invalido'),
    password: Yup.string()
        .required('La contraseña es requerida'),
});

