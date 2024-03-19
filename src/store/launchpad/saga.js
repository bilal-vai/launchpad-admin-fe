import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	CREATE_LAUNCHPAD_REQUEST,
	CREATE_LAUNCHPAD_SUCCESS,
	CREATE_LAUNCHPAD_FAILURE,
	UPDATE_LAUNCHPAD_SUCCESS,
	UPDATE_LAUNCHPAD_REQUEST,
	UPDATE_LAUNCHPAD_FAILURE,
	REMOVE_LAUNCHPAD_FAILURE,
	REMOVE_LAUNCHPAD_SUCCESS,
	REMOVE_LAUNCHPAD_REQUEST,
	TOGGLE_LAUNCHPAD_SUCCESS,
	TOGGLE_LAUNCHPAD_REQUEST,
	TOGGLE_LAUNCHPAD_FAILURE,
	GET_LAUNCHPAD_OPTION_REQUEST,
	GET_LAUNCHPAD_OPTION_SUCCESS,
	GET_LAUNCHPAD_OPTION_FAILURE,
} from "./actionTypes";

import {
	create,
	update,
	remove,
	toggle,
	getLaunchpadOptions,
} from "./services";

function* getLaunchpadListOption({ payload }) {
	try {
		const response = yield call(getLaunchpadOptions);
		if (response.status === 200) {
			yield put({
				type: GET_LAUNCHPAD_OPTION_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: GET_LAUNCHPAD_OPTION_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: GET_LAUNCHPAD_OPTION_FAILURE,
			payload: response.data,
		});
	}
}

function* createLaunchpadOption({ payload: { data } }) {
	try {
		const response = yield call(create, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_LAUNCHPAD_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_LAUNCHPAD_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_LAUNCHPAD_FAILURE,
			payload: response.data,
		});
	}
}

function* updateLaunchpadOption({ payload: { data } }) {
	try {
		const response = yield call(update, data, data._id);
		if (response.status === 200) {
			yield put({
				type: UPDATE_LAUNCHPAD_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_LAUNCHPAD_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_LAUNCHPAD_FAILURE,
			payload: response.data,
		});
	}
}

function* toggleLaunchpadOption({ payload: { id } }) {
	try {
		const response = yield call(toggle, id);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_LAUNCHPAD_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_LAUNCHPAD_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_LAUNCHPAD_FAILURE,
			payload: response.data,
		});
	}
}

function* removeLaunchpadOption({ payload: { id } }) {
	try {
		const response = yield call(remove, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_LAUNCHPAD_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_LAUNCHPAD_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_LAUNCHPAD_FAILURE,
			payload: response.data,
		});
	}
}

function* saga() {
	yield takeEvery(GET_LAUNCHPAD_OPTION_REQUEST, getLaunchpadListOption);
	yield takeEvery(CREATE_LAUNCHPAD_REQUEST, createLaunchpadOption);
	yield takeEvery(UPDATE_LAUNCHPAD_REQUEST, updateLaunchpadOption);
	yield takeEvery(REMOVE_LAUNCHPAD_REQUEST, removeLaunchpadOption);
	yield takeEvery(TOGGLE_LAUNCHPAD_REQUEST, toggleLaunchpadOption);
}

export default saga;
