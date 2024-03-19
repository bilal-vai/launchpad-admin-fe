import {
	ERRORS,
	CLEAR_RESPONSE,
	TOTAL_PIX_TRANSACTION_FAILURE,
	TOTAL_PIX_TRANSACTION_SUCCESS,
	TOTAL_PIX_TRANSACTION_REQUEST,
	TOTAL_PIX_CLIENT_REQUEST,
	TOTAL_PIX_CLIENT_FAILURE,
	TOTAL_PIX_CLIENT_SUCCESS,
} from "./actionTypes";

const initialState = {
	errors: {},
	response: {},
	loader: false,
	pixTranscations: {
		details: {},
		isLoading: false,
	},
	pixClients: {
		details: {},
		isLoading: false,
	},
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

		case TOTAL_PIX_TRANSACTION_SUCCESS:
		case TOTAL_PIX_TRANSACTION_FAILURE:
			return {
				...state,
				pixTranscations: {
					...state.pixTranscations,
					details: action.payload,
					isLoading: false,
				},
			};
		case TOTAL_PIX_TRANSACTION_REQUEST:
			return {
				...state,
				pixTranscations: {
					...state.pixTranscations,
					isLoading: true,
				},
			};
		case TOTAL_PIX_CLIENT_SUCCESS:
		case TOTAL_PIX_CLIENT_FAILURE:
			return {
				...state,
				pixClients: {
					...state.pixClients,
					details: action.payload,
					isLoading: false,
				},
			};

		case TOTAL_PIX_CLIENT_REQUEST:
			return {
				...state,
				pixClients: {
					...state.pixClients,
					isLoading: true,
				},
			};

		default:
			return state;
	}
};

export default reducer;
