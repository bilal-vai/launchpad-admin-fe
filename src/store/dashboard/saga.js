import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	TOTAL_PIX_TRANSACTION_REQUEST,
	TOTAL_PIX_TRANSACTION_FAILURE,
	TOTAL_PIX_TRANSACTION_SUCCESS,
	TOTAL_PIX_CLIENT_REQUEST,
	TOTAL_PIX_CLIENT_FAILURE,
	TOTAL_PIX_CLIENT_SUCCESS,
} from "./actionTypes";

import { totalTransaction, totalClient } from "./services";

function* totalPIXTransaction({ payload }) {
	try {
		const response = yield call(totalTransaction, payload);
		if (response.status === 200) {
			yield put({
				type: TOTAL_PIX_TRANSACTION_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOTAL_PIX_TRANSACTION_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: TOTAL_PIX_TRANSACTION_FAILURE,
			payload: {},
		});
	}
}

function* totalPIXClient({ payload }) {
	try {
		const response = yield call(totalClient, payload);
		if (response.status === 200) {
			yield put({
				type: TOTAL_PIX_CLIENT_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOTAL_PIX_CLIENT_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: TOTAL_PIX_CLIENT_FAILURE,
			payload: {},
		});
	}
}

function* saga() {
	yield takeEvery(TOTAL_PIX_TRANSACTION_REQUEST, totalPIXTransaction);
	yield takeEvery(TOTAL_PIX_CLIENT_REQUEST, totalPIXClient);
}

export default saga;
