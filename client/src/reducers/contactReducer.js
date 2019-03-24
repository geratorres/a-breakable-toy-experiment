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
        case "FETCH_CONTACTS":
            return Object.assign({}, state, {
                isFetching: true,
                contacts: [],
                pager: state.pager,
                isError: false
            });
        case "FETCHED_CONTACTS":
            return Object.assign({}, state, {
                ...action.data,
                isFetching: false,
                isError: false
            });
        case "RECEIVE_ERROR":
            return Object.assign({}, state, {
                isError: true,
                isFetching: false
            });
        default:
            return state;
    }
};

export default contactReducer;
