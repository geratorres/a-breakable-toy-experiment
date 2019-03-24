import { CONTACT } from '../actions/actionTypes';

const initialState = {
    contacts: [
        { firstName: "Gera" },
        { firstName: "Gerardo" }
    ],
    pager: {
        current: 1,
        pageSize: 10,
        total: 0
    },
    isFetching: false,
    isError: false
};

const contactReducer = (state = initialState, action) => {
    switch (action.type) {
        case CONTACT.FETCHED_CONTACTS:
            return Object.assign({}, state, {
                ...action.data,
                isFetching: false,
                isError: false
            });
        case CONTACT.DELETED_CONTACT:
            return Object.assign({}, state, {
                contacts: state.contacts.filter(cnt => cnt._id !== action.data.deletedContact._id),
                isFetching: false,
                isError: false
            });
        default:
            return state;
    }
};

export default contactReducer;
