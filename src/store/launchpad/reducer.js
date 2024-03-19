import {
	ERRORS,
	CLEAR_RESPONSE,
	CREATE_LAUNCHPAD_SUCCESS,
	CREATE_LAUNCHPAD_FAILURE,
	UPDATE_LAUNCHPAD_SUCCESS,
	UPDATE_LAUNCHPAD_FAILURE,
	REMOVE_LAUNCHPAD_FAILURE,
	REMOVE_LAUNCHPAD_SUCCESS,
	TOGGLE_LAUNCHPAD_SUCCESS,
	TOGGLE_LAUNCHPAD_FAILURE,
	GET_LAUNCHPAD_OPTION_REQUEST,
	GET_LAUNCHPAD_OPTION_SUCCESS,
	GET_LAUNCHPAD_OPTION_FAILURE,
} from "./actionTypes";

const initialState = {
	errors: {},
	response: {},
	loader: false,
	launchpadOptions: [],
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case ERRORS:
			return {
				...state,
				errors: action.payload,
				loading: false,
			};
		case CLEAR_RESPONSE:
			return {
				...state,
				errors: {},
				response: {},
			};
		case CREATE_LAUNCHPAD_SUCCESS:
		case CREATE_LAUNCHPAD_FAILURE:
		case UPDATE_LAUNCHPAD_SUCCESS:
		case UPDATE_LAUNCHPAD_FAILURE:
		case REMOVE_LAUNCHPAD_FAILURE:
		case REMOVE_LAUNCHPAD_SUCCESS:
		case TOGGLE_LAUNCHPAD_SUCCESS:
		case TOGGLE_LAUNCHPAD_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: {},
			};
		case GET_LAUNCHPAD_OPTION_SUCCESS:
			return {
				...state,
				launchpadOptions: action.payload?.data,
			};
		case GET_LAUNCHPAD_OPTION_FAILURE:
			return {
				...state,
				launchpadOptions: [],
			};
		default:
			return state;
	}
};

export default reducer;
