import {
	ERRORS,
	CLEAR_RESPONSE,
	TOTAL_PIX_TRANSACTION_REQUEST,
	TOTAL_PIX_TRANSACTION_FAILURE,
	TOTAL_PIX_TRANSACTION_SUCCESS,
	TOTAL_PIX_CLIENT_REQUEST,
	TOTAL_PIX_CLIENT_FAILURE,
	TOTAL_PIX_CLIENT_SUCCESS,
} from "./actionTypes";

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};

export const totalTransaction = (data) => {
	return {
		type: TOTAL_PIX_TRANSACTION_REQUEST,
		payload: data,
	};
};
export const totalClient = (data) => {
	return {
		type: TOTAL_PIX_CLIENT_REQUEST,
		payload: data,
	};
};
