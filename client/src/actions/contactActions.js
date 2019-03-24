import store from "../store";
import { propertyToUrl } from 'query-string-params';
import axios from 'axios';

export const fetchContacts = () => {
    return {
        type: "FETCH_CONTACTS"
    };
};

export const receiveContacts = data => {
    const { contacts, pager } = data;
    return {
        type: "FETCHED_CONTACTS",
        data: { contacts, pager }
    };
};

export const contactDeleted = data => {
    return {
        type: "DELETED_CONTACT",
        data
    };
};


const toQueryString = (obj = {}) => {
    const queryStr = propertyToUrl(obj);
    return queryStr !== '' ? '?' + queryStr : '';
};

export const fetchContactsAction = ({ pager, filter }) => {

    store.dispatch(fetchContacts());

    return function (dispatch, getState) {
        return axios.get(`http://localhost:3005/api/contacts${toQueryString(pager)}`)
            .then(function (response) {
                dispatch(receiveContacts(response.data));
            }).catch(function (err) {
                console.log(err)
            });
    };
};

export const deleteContactAction = (id) => {
    store.dispatch(fetchContacts());

    if (!id) {
        return Promise.reject();
    }

    return function (dispatch, getState) {
        return axios.delete(`http://localhost:3005/api/contacts/${id}`)
            .then(function (response) {
                dispatch(contactDeleted(response.data));
            }).catch(function (err) {
                console.log(err)
            });
    };
};
