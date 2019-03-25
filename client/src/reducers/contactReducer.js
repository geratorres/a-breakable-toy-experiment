import { CONTACTS } from '../actions/actionTypes';

const initialState = {
    contacts: [],
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
        case CONTACTS.FETCH_CONTACTS:
            return Object.assign({}, state, {
                isFetching: false,
                isError: false
            });
        case CONTACTS.FETCHED_CONTACTS:
            return Object.assign({}, state, {
                ...action.data,
                isFetching: false,
                isError: false
            });
        case CONTACTS.DELETED_CONTACT:
            return Object.assign({}, state, {
                contacts: state.contacts.filter(cnt => cnt._id !== action.data.contact._id),
                isFetching: false,
                isError: false
            });
        case CONTACTS.CREATED_CONTACT:
            return Object.assign({}, state, {
                //TODO: Handle pagination to avoid posible 11 contacts in onepage, maybe not, Paginations from antd could handle that
                //But Redux store cloud have 11 contacts when should there are 10
                contacts: [...state.contacts, action.data.contact],
                isFetching: false,
                isError: false
            });
        case CONTACTS.UPDATED_CONTACT:
            return Object.assign({}, state, {
                contacts: state.contacts.map((contact) => {
                    return contact._id !== action.data.contact._id ? contact : action.data.contact
                }),
                isFetching: false,
                isError: false
            });
        default:
            return state;
    }
};

export default contactReducer;
