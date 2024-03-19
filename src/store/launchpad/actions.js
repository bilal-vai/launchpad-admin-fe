import {
	ERRORS,
	CLEAR_RESPONSE,
	CREATE_LAUNCHPAD_REQUEST,
	UPDATE_LAUNCHPAD_REQUEST,
	REMOVE_LAUNCHPAD_REQUEST,
	TOGGLE_LAUNCHPAD_REQUEST,
	GET_LAUNCHPAD_OPTION_REQUEST,
	GET_LAUNCHPAD_OPTION_SUCCESS,
	GET_LAUNCHPAD_OPTION_FAILURE,
} from "./actionTypes";

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};

export const getLaunchpadOptions = () => {
	return {
		type: GET_LAUNCHPAD_OPTION_REQUEST,
		payload: {},
	};
};

export const create = (data) => {
	return {
		type: CREATE_LAUNCHPAD_REQUEST,
		payload: { data },
	};
};

export const update = (data) => {
	return {
		type: UPDATE_LAUNCHPAD_REQUEST,
		payload: { data },
	};
};

export const toggle = (id) => {
	return {
		type: TOGGLE_LAUNCHPAD_REQUEST,
		payload: { id },
	};
};

export const remove = (id) => {
	return {
		type: REMOVE_LAUNCHPAD_REQUEST,
		payload: { id },
	};
};
