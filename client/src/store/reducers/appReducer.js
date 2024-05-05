import actionTypes from "../actions/actionTypes";
const initState = {
    msg: '',
    categories: [],
    prices: [],
    areas: [],
    provinces: [],
    openChat: false,
    userGroup: [],
    groupInfo: null,
}

const appReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_CATEGORIES:
            return {
                ...state,
                categories: action.categories || [],
                msg: action.msg || '',
            }
        case actionTypes.GET_PRICES:
            return {
                ...state,
                prices: action.prices || [],
                msg: action.msg || '',
            }
        case actionTypes.GET_AREAS:
            return {
                ...state,
                areas: action.areas || [],
                msg: action.msg || '',
            }
        case actionTypes.GET_PROVINCES:
            return {
                ...state,
                provinces: action.provinces || [],
                msg: action.msg || '',
            }
        case actionTypes.GET_PROVINCES:
        return {
            ...state,
            provinces: action.provinces || [],
            msg: action.msg || '',
        }
        case actionTypes.CHAT_SHOW:
            return {
                ...state,
                openChat: action.state
            };
        case actionTypes.USER_GROUP:
            return {
                ...state,
                userGroup: action.userGroup
            };
        case actionTypes.GROUP_INFO:
            return {
                ...state,
                groupInfo: action.groupInfo
            };
        default:
            return state
    }

}

export default appReducer