import {	
	GET_ALL_TRANSACTIONS_REQUEST,
	UPDATE_TRANSACTION_REQUEST,
	UPDATE_TRANSACTION_REQUEST_LYO,
	GET_ALL_CHAINS_DETAILS,
	GET_ALL_CHAINS_DETAILS_LYO,
	UPDATE_CHAINS_REQUEST,
	CREATE_CHAINS_REQUEST,
	REMOVE_CHAINS_REQUEST,
	UPDATE_CHAINS_REQUEST_LYO,
	CREATE_CHAINS_REQUEST_LYO,
	REMOVE_CHAINS_REQUEST_LYO,
	GET_BRIDGE_CONFIG_REQUEST,
	GET_BRIDGE_CONFIG_REQUEST_LYO,
	REJECT_TRANSACTION_REQUEST_LYO,
	REJECT_TRANSACTION_REQUEST,

	GET_TRANSACTION_STATS_REQUEST,
	
	VOLUME_INFO_REQUEST,
	GET_GATEWAY_BALANCE_REQUEST,
	CREATE_TRANSACTION_REQUEST
} from "./actionTypes";


export const getAllTransactions = (payload) => {
	return {
		type: GET_ALL_TRANSACTIONS_REQUEST,
		payload,
	};
};

export const update = (data) => {	
	return {
		type: UPDATE_TRANSACTION_REQUEST,
		payload: { data },
	};
};

export const updateTransactionLyo = (data) => {	
	return {
		type: UPDATE_TRANSACTION_REQUEST_LYO,
		payload: { data },
	};
};

export const getAllChains = (payload) => {
	return {
		type: GET_ALL_CHAINS_DETAILS,
		payload,
	};
};

export const getAllChainsLyo = (payload) => {
	return {
		type: GET_ALL_CHAINS_DETAILS_LYO,
		payload,
	};
};

export const createChain = (data) => {
	return {
		type: CREATE_CHAINS_REQUEST,
		payload: { data },
	};
}

export const updateChain = (data) => {
	return {
		type: UPDATE_CHAINS_REQUEST,
		payload: { data },
	};
};

export const removeChain = (id) => {
	return {
		type: REMOVE_CHAINS_REQUEST,
		payload: { id },
	};
};

export const createChainLyo = (data) => {
	return {
		type: CREATE_CHAINS_REQUEST_LYO,
		payload: { data },
	};
}

export const updateChainLyo = (data) => {
	return {
		type: UPDATE_CHAINS_REQUEST_LYO,
		payload: { data },
	};
};

export const removeChainLyo = (id) => {
	return {
		type: REMOVE_CHAINS_REQUEST_LYO,
		payload: { id },
	};
};

export const getBridgeConfig = (data) => {
	return {
		type: GET_BRIDGE_CONFIG_REQUEST,
		payload: { data },
	};
};

export const getBridgeConfigLyo = (data) => {
	return {
		type: GET_BRIDGE_CONFIG_REQUEST_LYO,
		payload: { data },
	};
};

export const rejectTransaction = (data1,data2) => {	

	let payload = {
		id: data1,
		rejectedReason:data2 
	}



	return {
		type: REJECT_TRANSACTION_REQUEST,
		payload:  {		
			id: data1,
			rejectedReason:data2 
		} ,
		// payload: { data },
	};
};

export const rejectTransactionLyo = (data) => {	
	return {
		type: REJECT_TRANSACTION_REQUEST_LYO,
		payload: { data },
	};
};

export const getTransactionStats = (data) => {
	return {
		type: GET_TRANSACTION_STATS_REQUEST,
		payload: { data },
	};
};

export const getVolumeInfo = (data) => {
	return {
		type: VOLUME_INFO_REQUEST,
		payload: { data },
	};
};

export const getGatewayBalances= (data) => {
	return {
		type: GET_GATEWAY_BALANCE_REQUEST,
		payload: { data },
	};
};

export const createBridgeTransaction = (data) => {	
	return {
		type: CREATE_TRANSACTION_REQUEST,
		payload: { data },
	};
};