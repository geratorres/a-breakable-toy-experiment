import store from "../store";
import { propertyToUrl } from 'query-string-params';
import axios from 'axios';
import { CONTACTS } from './actionTypes'
import { notification } from 'antd';

const fetchContactsAction = () => {
    return {
        type: CONTACTS.FETCH_CONTACTS
    };
};

const receiveContactsAction = data => {
    const { contacts, pager } = data;
    return {
        type: CONTACTS.FETCHED_CONTACTS,
        data: { contacts, pager }
    };
};

const contactDeletedAction = data => {
    return {
        type: CONTACTS.DELETED_CONTACT,
        data
    };
};

const contactCeatedAction = data => {
    return {
        type: CONTACTS.CREATED_CONTACT,
        data
    };
};

const contactUpdatedAction = data => {
    return {
        type: CONTACTS.UPDATED_CONTACT,
        data
    };
};

export const fetchContacts = ({ pager, filter }) => {

    store.dispatch(fetchContactsAction());

    return function (dispatch, getState) {
        //TODO: Add urls management
        return axios.get(`http://localhost:3005/api/contacts${toQueryString(pager)}`)
            .then(function (response) {
                dispatch(receiveContactsAction(response.data));
            }).catch(handleError);
    };
};

export const deleteContact = (id) => {

    if (!id) {
        return Promise.reject();
    }

    return function (dispatch, getState) {
        return axios.delete(`http://localhost:3005/api/contacts/${id}`)
            .then(function (response) {
                dispatch(contactDeletedAction(response.data));
            }).catch(handleError);
    };
};

export const createContact = (contact) => {
    return function (dispatch, getState) {
        return axios.post('http://localhost:3005/api/contacts', { contact })
            .then(function (response) {
                dispatch(contactCeatedAction(response.data));
            }).catch(handleError);
    };
};

export const updateContact = ({ id, contact }) => {
    return function (dispatch, getState) {
        return axios.put(`http://localhost:3005/api/contacts/${id}`, { contact })
            .then(function (response) {
                dispatch(contactUpdatedAction(response.data));
            }).catch(handleError);
    };
};

const toQueryString = (obj = {}) => {
    const queryStr = propertyToUrl(obj);
    return queryStr !== '' ? '?' + queryStr : '';
};

const handleError = function (error) {
    let description = '';
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        description = error.response.data.error;
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        description = error.message;
    } else {
        // Something happened in setting up the request that triggered an Error       
        description = error.message;
    }

    notification.error({
        message: "Error",
        description
    });

    console.log(error.config);
}
