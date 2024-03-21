import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	GET_ALL_TRANSACTIONS_SUCCESS,
	GET_ALL_TRANSACTIONS_FAILURE,
	GET_ALL_TRANSACTIONS_REQUEST,
	UPDATE_TRANSACTION_REQUEST,
	UPDATE_TRANSACTION_SUCCESS,
	UPDATE_TRANSACTION_FAILURE,
	UPDATE_TRANSACTION_REQUEST_LYO,
	UPDATE_TRANSACTION_SUCCESS_LYO,
	UPDATE_TRANSACTION_FAILURE_LYO,
	GET_ALL_CHAINS_DETAILS,
	GET_ALL_CHAINS_SUCCESS,
	GET_ALL_CHAINS_FAILURE,

	GET_ALL_CHAINS_DETAILS_LYO,
	GET_ALL_CHAINS_SUCCESS_LYO,
	GET_ALL_CHAINS_FAILURE_LYO,



	CREATE_CHAINS_REQUEST,
	CREATE_CHAINS_SUCCESS,
	CREATE_CHAINS_FAILURE,

	UPDATE_CHAINS_REQUEST,
	UPDATE_CHAINS_SUCCESS,
	UPDATE_CHAINS_FAILURE,

	REMOVE_CHAINS_REQUEST,
	REMOVE_CHAINS_SUCCESS,
	REMOVE_CHAINS_FAILURE,

	CREATE_CHAINS_REQUEST_LYO,
	CREATE_CHAINS_SUCCESS_LYO,
	CREATE_CHAINS_FAILURE_LYO,

	UPDATE_CHAINS_REQUEST_LYO,
	UPDATE_CHAINS_SUCCESS_LYO,
	UPDATE_CHAINS_FAILURE_LYO,

	REMOVE_CHAINS_REQUEST_LYO,
	REMOVE_CHAINS_SUCCESS_LYO,
	REMOVE_CHAINS_FAILURE_LYO,

	GET_BRIDGE_CONFIG_REQUEST,
	GET_BRIDGE_CONFIG_SUCCESS,
	GET_BRIDGE_CONFIG_FAILURE,

	GET_BRIDGE_CONFIG_REQUEST_LYO,
	GET_BRIDGE_CONFIG_SUCCESS_LYO,
	GET_BRIDGE_CONFIG_FAILURE_LYO,

	REJECT_TRANSACTION_REQUEST,
	REJECT_TRANSACTION_SUCCESS,
	REJECT_TRANSACTION_FAILURE,

	
	REJECT_TRANSACTION_REQUEST_LYO,
	REJECT_TRANSACTION_SUCCESS_LYO,
	REJECT_TRANSACTION_FAILURE_LYO,

	GET_TRANSACTION_STATS_REQUEST, 
	GET_TRANSACTION_STATS_SUCCESS,
	GET_TRANSACTION_STATS_FAILURE, 

	VOLUME_INFO_REQUEST, 
	VOLUME_INFO_SUCCESS, 
   VOLUME_INFO_FAILURE, 

   GET_GATEWAY_BALANCE_REQUEST,
   GET_GATEWAY_BALANCE_SUCCESS,
   GET_GATEWAY_BALANCE_FAILURE,

   CREATE_TRANSACTION_REQUEST,
   CREATE_TRANSACTION_SUCCESS,
   CREATE_TRANSACTION_FAILURE

} from "./actionTypes";

import { approve, getAllTransactions, getAllChains, createChain, updateChain, removeChain, approveTransactionLyo, createChainLyo, updateChainLyo, removeChainLyo, getBridgeConfig, getBridgeConfigLyo, rejectTransaction, rejectTransactionLyo, getAllChainsLyo, getTransactionStats, getVolumeInfo, getGatewayBalances , createBridgeTransactionService} from "./services";

function* getAllTransactionsList({ payload }) {

	try {
		let response = yield call(getAllTransactions, payload);

		// console.log("🚀 ~ file: saga.js:14 ~ function*getAllTransactionsList ~ response:", response)


		if (response.status === 200) {
			yield put({
				type: GET_ALL_TRANSACTIONS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: GET_ALL_TRANSACTIONS_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: GET_ALL_TRANSACTIONS_FAILURE,
			payload: response.data,
		});
	}
}

function* approveTransaction({ payload: { data } }) {
	try {

		const response = yield call(approve, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_TRANSACTION_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_TRANSACTION_FAILURE,
				payload: response,
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_TRANSACTION_FAILURE,
			payload: { msg: err },
		});
	}
}

function* approveLyoTransaction({ payload: { data } }) {
	try {

		const response = yield call(approveTransactionLyo, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_TRANSACTION_SUCCESS_LYO,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_TRANSACTION_FAILURE_LYO,
				payload: response,
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_TRANSACTION_FAILURE_LYO,
			payload: { msg: err },
		});
	}
}

function* getAllChainsList() {
	try {
		let response = yield call(getAllChains);

		if (response.status === 200) {
			yield put({
				type: GET_ALL_CHAINS_SUCCESS,
				payload: response.data,

			});

		} else {
			yield put({
				type: GET_ALL_CHAINS_FAILURE,
				payload: response.data,

			});
		}

	} catch (err) {
		yield put({
			type: GET_ALL_CHAINS_FAILURE,
			payload: response.data,

		});
	}
}

function* getAllChainsListLyo() {
	try {
		let response = yield call(getAllChainsLyo);

		if (response.status === 200) {
			yield put({
				type: GET_ALL_CHAINS_SUCCESS_LYO,
				payload: response.data,

			});

		} else {
			yield put({
				type: GET_ALL_CHAINS_FAILURE_LYO,
				payload: response.data,

			});
		}

	} catch (err) {
		yield put({
			type: GET_ALL_CHAINS_FAILURE_LYO,
			payload: response.data,

		});
	}
}

function* getBridgeConfigs() {
	try {
		let response = yield call(getBridgeConfig);

		if (response.status === 200) {
			yield put({
				type: GET_BRIDGE_CONFIG_SUCCESS,
				payload: response,

			});

		} else {
			yield put({
				type: GET_BRIDGE_CONFIG_FAILURE,
				payload: response,

			});
		}

	} catch (err) {
		yield put({
			type: GET_BRIDGE_CONFIG_FAILURE,
			payload: { err },

		});
	}
}

function* getBridgeConfigsLyo() {
	try {
		let response = yield call(getBridgeConfigLyo);

		if (response.status === 200) {
			yield put({
				type: GET_BRIDGE_CONFIG_SUCCESS_LYO,
				payload: response,

			});

		} else {
			yield put({
				type: GET_BRIDGE_CONFIG_FAILURE_LYO,
				payload: response,

			});
		}

	} catch (err) {
		yield put({
			type: GET_BRIDGE_CONFIG_FAILURE_LYO,
			payload: { msg: err },

		});
	}
}

function* createChains({ payload: { data } }) {
	try {
		const response = yield call(createChain, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_CHAINS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_CHAINS_FAILURE,
				payload: response,
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_CHAINS_FAILURE,
			payload: { msg: err },
		});
	}
}



function* updateChains({ payload: { data } }) {
	try {
		const response = yield call(updateChain, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_CHAINS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_CHAINS_FAILURE,
				payload: response,
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_CHAINS_FAILURE,
			payload: { msg: err },
		});
	}
}


function* removeChains({ payload: { id } }) {
	console.log("🚀 ~ file: saga.js:209 ~ function*removeChains ~ err:")
	try {
		const response = yield call(removeChain, id);
		console.log("🚀 ~ file: saga.js:198 ~ function*removeChains ~ response:", response)
		if (response.status === 200) {
			yield put({
				type: REMOVE_CHAINS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_CHAINS_FAILURE,
				payload: response,
			});
		}
	} catch (err) {
		console.log("🚀 ~ file: saga.js:209 ~ function*removeChains ~ err:", err)
		yield put({
			type: REMOVE_CHAINS_FAILURE,
			payload: { msg: err },
		});
	}
}

function* createChainsLyo({ payload: { data } }) {
	try {
		const response = yield call(createChainLyo, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_CHAINS_SUCCESS_LYO,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_CHAINS_FAILURE_LYO,
				payload: response,
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_CHAINS_FAILURE_LYO,
			payload: { msg: err },
		});
	}
}



function* updateChainsLyo({ payload: { data } }) {
	try {
		const response = yield call(updateChainLyo, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_CHAINS_SUCCESS_LYO,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_CHAINS_FAILURE_LYO,
				payload: response,
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_CHAINS_FAILURE_LYO,
			payload: { msg: err },
		});
	}
}


function* removeChainsLyo({ payload: { id } }) {
	try {
		const response = yield call(removeChainLyo, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_CHAINS_SUCCESS_LYO,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_CHAINS_FAILURE_LYO,
				payload: response,
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_CHAINS_FAILURE_LYO,
			payload: { msg: err },
		});
	}
}

function* reject({ payload: { id,rejectedReason } }) {
	try {
		
		const response = yield call(rejectTransaction, id, rejectedReason);
		if (response.status === 200) {
			yield put({
				type: REJECT_TRANSACTION_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REJECT_TRANSACTION_FAILURE,
				payload: response,
			});
		}
	} catch (err) {
		yield put({
			type: REJECT_TRANSACTION_FAILURE,
			payload: { msg: err },
		});
	}
}

function* rejectLyoTransaction({ payload: { data } }) {
	try {

		const response = yield call(rejectTransactionLyo, data);
		if (response.status === 200) {
			yield put({
				type: REJECT_TRANSACTION_SUCCESS_LYO,
				payload: response.data,
			});
		} else {
			yield put({
				type: REJECT_TRANSACTION_FAILURE_LYO,
				payload: response,
			});
		}
	} catch (err) {
		yield put({
			type: REJECT_TRANSACTION_FAILURE_LYO,
			payload: { msg: err },
		});
	}
}

function* getTransactionsStats() {
	try {
		let response = yield call(getTransactionStats);

		if (response.status === 200) {
			yield put({
				type:  GET_TRANSACTION_STATS_SUCCESS,
				payload: response,

			});

		} else {
			yield put({
				type: GET_TRANSACTION_STATS_FAILURE,
				payload: response,

			});
		}

	} catch (err) {  
		yield put({
			type: GET_TRANSACTION_STATS_FAILURE,
			payload: { msg: err },

		});
	}
}

function* getVolumesInfo() {
	try {	  
	
		let response = yield call(getVolumeInfo);

		if (response.status === 200) {
			yield put({
				type:  VOLUME_INFO_SUCCESS,
				payload: response,

			});

		} else {
			yield put({
				type: 	VOLUME_INFO_FAILURE, 
				payload: response,

			});
		}

	} catch (err) {
		yield put({
			type: 	VOLUME_INFO_FAILURE, 
			payload: { msg: err },

		}); 
	}
}

function* getGatewayBalance() {
	try {	  
	
		let response = yield call(getGatewayBalances);

		if (response.status === 200) {
			yield put({
				type:  GET_GATEWAY_BALANCE_SUCCESS,
				payload: response,

			});

		} else {
			yield put({
				type: 	GET_GATEWAY_BALANCE_FAILURE, 
				payload: response,

			});
		}

	} catch (err) {
		yield put({
			type: 	GET_GATEWAY_BALANCE_FAILURE, 
			payload: { msg: err },

		});
	}
}

function* createBridgeTransaction({ payload: { data } }) {
	try {

		const response = yield call(createBridgeTransactionService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_TRANSACTION_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_TRANSACTION_FAILURE,
				payload: response,
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_TRANSACTION_FAILURE,
			payload: { msg: err },
		});
	}
}


function* saga() {
	yield takeEvery(GET_ALL_TRANSACTIONS_REQUEST, getAllTransactionsList);
	yield takeEvery(UPDATE_TRANSACTION_REQUEST, approveTransaction);
	yield takeEvery(GET_ALL_CHAINS_DETAILS, getAllChainsList);
	yield takeEvery(CREATE_CHAINS_REQUEST, createChains);
	yield takeEvery(UPDATE_CHAINS_REQUEST, updateChains);
	yield takeEvery(REMOVE_CHAINS_REQUEST, removeChains);
	yield takeEvery(CREATE_CHAINS_REQUEST_LYO, createChainsLyo);
	yield takeEvery(UPDATE_CHAINS_REQUEST_LYO, updateChainsLyo);
	yield takeEvery(REMOVE_CHAINS_REQUEST_LYO, removeChainsLyo);
	yield takeEvery(UPDATE_TRANSACTION_REQUEST_LYO, approveLyoTransaction);
	yield takeEvery(GET_BRIDGE_CONFIG_REQUEST, getBridgeConfigs);
	yield takeEvery(GET_BRIDGE_CONFIG_REQUEST_LYO, getBridgeConfigsLyo);
	yield takeEvery(REJECT_TRANSACTION_REQUEST, reject);
	yield takeEvery(REJECT_TRANSACTION_REQUEST_LYO, rejectLyoTransaction);
	yield takeEvery(GET_ALL_CHAINS_DETAILS_LYO, getAllChainsListLyo);
	yield takeEvery(GET_TRANSACTION_STATS_REQUEST, getTransactionsStats);
	yield takeEvery(VOLUME_INFO_REQUEST, getVolumesInfo);
	yield takeEvery(GET_GATEWAY_BALANCE_REQUEST, getGatewayBalance);
	yield takeEvery(CREATE_TRANSACTION_REQUEST, createBridgeTransaction);
}

export default saga;
