import {
	GET_ALL_TRANSACTIONS_REQUEST,
	GET_ALL_TRANSACTIONS_SUCCESS,
	GET_ALL_TRANSACTIONS_FAILURE,
	UPDATE_TRANSACTION_REQUEST,
	UPDATE_TRANSACTION_SUCCESS,
	UPDATE_TRANSACTION_FAILURE,
	UPDATE_TRANSACTION_REQUEST_LYO,
	UPDATE_TRANSACTION_SUCCESS_LYO,
	UPDATE_TRANSACTION_FAILURE_LYO,
	GET_ALL_CHAINS_DETAILS,
	GET_ALL_CHAINS_SUCCESS,
	GET_ALL_CHAINS_FAILURE,
	UPDATE_CHAINS_SUCCESS,
	UPDATE_CHAINS_FAILURE,
	CREATE_CHAINS_SUCCESS,
	CREATE_CHAINS_FAILURE,
	REMOVE_CHAINS_SUCCESS,
	REMOVE_CHAINS_FAILURE,
	GET_BRIDGE_CONFIG_SUCCESS,
	GET_BRIDGE_CONFIG_FAILURE,
	GET_BRIDGE_CONFIG_REQUEST,
	UPDATE_CHAINS_SUCCESS_LYO,
	UPDATE_CHAINS_FAILURE_LYO,
	CREATE_CHAINS_SUCCESS_LYO,
	CREATE_CHAINS_FAILURE_LYO,
	REMOVE_CHAINS_SUCCESS_LYO,
	REMOVE_CHAINS_FAILURE_LYO,
	GET_BRIDGE_CONFIG_REQUEST_LYO,
	GET_BRIDGE_CONFIG_SUCCESS_LYO,
	GET_BRIDGE_CONFIG_FAILURE_LYO,
	REJECT_TRANSACTION_REQUEST,
	REJECT_TRANSACTION_SUCCESS,
	REJECT_TRANSACTION_FAILURE,
	REJECT_TRANSACTION_REQUEST_LYO,
	REJECT_TRANSACTION_SUCCESS_LYO,
	REJECT_TRANSACTION_FAILURE_LYO,

	GET_ALL_CHAINS_DETAILS_LYO,
	GET_ALL_CHAINS_SUCCESS_LYO,
	GET_ALL_CHAINS_FAILURE_LYO,

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

const initialState = {
	errors: {},
	response: {},
	responseTransactionApprove: {},
	transactionResponse: {},
	chainsResponse: {},
	loader: false,
	responseAdd: {},
	responseRemove: {},
	responseUpdate: {},
	responseAddLyo: {},
	responseRemoveLyo: {},
	responseUpdateLyo: {},
	responseConfig: {},
	responseConfigLyo: {},
	responseReject: {},
	responseRejectLyo: {},
	responseTransactionStats: {},
	responseVolumeInfo: {},
	responseGatewayBalances: {},
	responseAddTransaction: {}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_ALL_TRANSACTIONS_FAILURE:

			return {
				...state,
				errors: action.payload,
				loading: false,
			};

		case GET_ALL_TRANSACTIONS_SUCCESS:
		case GET_ALL_TRANSACTIONS_FAILURE:

			return {
				...state,
				transactionResponse: action.payload?.data,
				errors: {},
			};

		case UPDATE_TRANSACTION_REQUEST:
			return {
				...state,
				isLoading: true,
			};
		case UPDATE_TRANSACTION_SUCCESS:
			return {
				...state,
				isLoading: false,
				response: action.payload,
			};
		case UPDATE_TRANSACTION_FAILURE:

			return {
				...state,
				isLoading: false,
				response: action.payload,
				errors: action.payload,
			};
		case UPDATE_TRANSACTION_REQUEST_LYO:
			return {
				...state,
				isLoading: true,
			};
		case UPDATE_TRANSACTION_SUCCESS_LYO:
			return {
				...state,
				isLoading: false,
				responseTransactionApprove: action.payload,
			};
		case UPDATE_TRANSACTION_FAILURE_LYO:

			return {
				...state,
				isLoading: false,
				responseTransactionApprove: action.payload,
				errors: action.payload,
			};
		case GET_ALL_CHAINS_DETAILS:
			return {
				...state,
				chainsResponse: action.payload?.data,
				isLoading: true,
			};
		case GET_ALL_CHAINS_SUCCESS:
			return {
				...state,
				chainsResponse: action.payload?.data,
				isLoading: true,
			};
		case GET_ALL_CHAINS_FAILURE:
			return {
				...state,
				chainsResponse: action.payload?.data,
				errors: action.payload,
			};
		case CREATE_CHAINS_SUCCESS:
			return {
				...state,
				responseAdd: action.payload,
				errors: action.payload,
			};

		case GET_ALL_CHAINS_SUCCESS_LYO:
			return {
				...state,
				chainsResponse: action.payload?.data,
				isLoading: true,
			};
		case GET_ALL_CHAINS_FAILURE_LYO:
			return {
				...state,
				chainsResponse: action.payload?.data,
				errors: action.payload,
			};
		case CREATE_CHAINS_SUCCESS_LYO:
			return {
				...state,
				responseAdd: action.payload,
				errors: action.payload,
			};


		case CREATE_CHAINS_FAILURE:
			return {
				...state,
				responseAdd: action.payload,
				errors: action.payload,
			};
		case CREATE_CHAINS_SUCCESS_LYO:
			return {
				...state,
				responseAddLyo: action.payload,
				errors: action.payload,
			};
		case CREATE_CHAINS_FAILURE_LYO:
			return {
				...state,
				responseAddLyo: action.payload,
				errors: action.payload,
			};
		case REMOVE_CHAINS_SUCCESS:
			return {
				...state,
				responseRemove: action.payload,
				errors: action.payload,
			};
		case REMOVE_CHAINS_FAILURE:
			return {
				...state,
				responseRemove: action.payload,
				errors: action.payload,
			};
		case REMOVE_CHAINS_SUCCESS_LYO:
			return {
				...state,
				responseRemoveLyo: action.payload,
				errors: action.payload,
			};
		case REMOVE_CHAINS_FAILURE_LYO:
			return {
				...state,
				responseRemoveLyo: action.payload,
				errors: action.payload,
			};
		case UPDATE_CHAINS_SUCCESS:
			return {
				...state,
				responseUpdate: action.payload,
				errors: action.payload,
			};
		case UPDATE_CHAINS_FAILURE:
			return {
				...state,
				responseUpdate: action.payload,
				errors: action.payload,
			};
		case UPDATE_CHAINS_SUCCESS_LYO:
			return {
				...state,
				responseUpdateLyo: action.payload,
				errors: action.payload,
			};
		case UPDATE_CHAINS_FAILURE_LYO:
			return {
				...state,
				responseUpdateLyo: action.payload,
				errors: action.payload,
			};

		case GET_BRIDGE_CONFIG_REQUEST:
			return {
				...state,
				isLoading: true,
			};
		case GET_BRIDGE_CONFIG_SUCCESS:
			return {
				...state,
				isLoading: false,
				responseConfig: action.payload,
			};
		case GET_BRIDGE_CONFIG_FAILURE:

			return {
				...state,
				isLoading: false,
				responseConfig: action.payload,
				errors: action.payload,
			};

		case GET_BRIDGE_CONFIG_REQUEST_LYO:
			return {
				...state,
				isLoading: true,
			};
		case GET_BRIDGE_CONFIG_SUCCESS_LYO:
			return {
				...state,
				isLoading: false,
				responseConfigLyo: action.payload,
			};
		case GET_BRIDGE_CONFIG_FAILURE_LYO:

			return {
				...state,
				isLoading: false,
				responseConfigLyo: action.payload,
				errors: action.payload,
			};
		case REJECT_TRANSACTION_REQUEST:
			return {
				...state,
				isLoading: true,
			};
		case REJECT_TRANSACTION_SUCCESS:
			return {
				...state,
				isLoading: false,
				responseReject: action.payload,
			};
		case REJECT_TRANSACTION_FAILURE:

			return {
				...state,
				isLoading: false,
				responseReject: action.payload,
				errors: action.payload,
			};
		case REJECT_TRANSACTION_REQUEST_LYO:
			return {
				...state,
				isLoading: true,
			};
		case REJECT_TRANSACTION_SUCCESS_LYO:
			return {
				...state,
				isLoading: false,
				responseRejectLyo: action.payload,
			};
		case REJECT_TRANSACTION_FAILURE_LYO:

			return {
				...state,
				isLoading: false,
				responseRejectLyo: action.payload,
				errors: action.payload,
			};

		case GET_TRANSACTION_STATS_REQUEST:
			return {
				...state,
				isLoading: true,
			};

		case GET_TRANSACTION_STATS_SUCCESS:
			return {
				...state,
				isLoading: false,
				responseTransactionStats: action.payload,
			};

		case GET_TRANSACTION_STATS_FAILURE:
			return {
				...state,
				isLoading: false,
				responseTransactionStats: action.payload,
				errors: action.payload,
			};




		case VOLUME_INFO_REQUEST:
			return {
				...state,
				isLoading: true,
			};

		case VOLUME_INFO_SUCCESS:
			return {
				...state,
				isLoading: false,
				responseVolumeInfo: action.payload,
			};

		case VOLUME_INFO_FAILURE:
			return {
				...state,
				isLoading: false,
				responseVolumeInfo: action.payload,
				errors: action.payload,
			};

			case GET_GATEWAY_BALANCE_REQUEST:
				return {
					...state,
					isLoading: true,
				};
	
			case GET_GATEWAY_BALANCE_SUCCESS:
				return {
					...state,
					isLoading: false,
					responseGatewayBalances: action.payload,
				};
	
			case GET_GATEWAY_BALANCE_FAILURE:
				return {
					...state,
					isLoading: false,
					responseGatewayBalances: action.payload,
					errors: action.payload,
				};
				case CREATE_TRANSACTION_REQUEST:
					return {
						...state,
						isLoading: true,
					};
		
				case CREATE_TRANSACTION_SUCCESS:
					return {
						...state,
						isLoading: false,
						responseAddTransaction: action.payload,
					};
		
				case CREATE_TRANSACTION_FAILURE:
					return {
						...state,
						isLoading: false,
						responseAddTransaction: action.payload,
						errors: action.payload,
					};

		default:
			return state;
	}
};

export default reducer;
