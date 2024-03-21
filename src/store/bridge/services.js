import axios from "axios";
import { apiBridgeUrlLFI, apiBridgeUrlLYO } from "../../config";
const qs = require("qs");

export const getAllTransactions = (status) =>
	axios
		.get(`${apiBridgeUrlLFI}/transactions?&isCompleted=` + status, {
			headers: {
				'x-api-key': process.env.REACT_APP_X_API_KEY
			}

		})

		.then((response) => response)
		.catch((err) => err);

export const approve = (id) => {
	var data = qs.stringify({
		_id: id,
	});
	var config = {
		method: "POST",
		url: `${apiBridgeUrlLFI}/transactions/approve`,
		headers: {
			'x-api-key': process.env.REACT_APP_X_API_KEY
		},
		data: data,
	};
	return axios(config).then((response) => response)
		.catch((err) => err);

}

export const approveTransactionLyo = (id) => {
	var data = qs.stringify({
		_id: id,
	});
	var config = {
		method: "POST",
		url: `${apiBridgeUrlLYO}/transactions/approve`,
		headers: {
			'x-api-key': process.env.REACT_APP_X_API_KEY
		},
		data: data,
	};
	return axios(config).then((response) => response)
		.catch((err) => err);

}


export const getAllChains = () =>
	axios
		.get(`${apiBridgeUrlLFI}/chains`, {
			headers: {
				'x-api-key': process.env.REACT_APP_X_API_KEY
			}
		})

		.then((response) => response)
		.catch((err) => err);


export const getAllChainsLyo = () =>
	axios
		.get(`${apiBridgeUrlLYO}/chains`, {
			headers: {
				'x-api-key': process.env.REACT_APP_X_API_KEY
			}
		})

		.then((response) => response)
		.catch((err) => err);

export const createChain = (data) =>

	axios
		.post(`${apiBridgeUrlLFI}/chains`, data, {
			headers: {
				'x-api-key': process.env.REACT_APP_X_API_KEY
			},
		})
		.then((response) => response)
		.catch((err) => err);

export const updateChain = (data) =>
	axios
		.patch(`${apiBridgeUrlLFI}/chains/${data._id}`, data)
		.then((response) => response)
		.catch((err) => err);


export const removeChain = (id) =>
	axios
		.delete(`${apiBridgeUrlLFI}/chains/${id}`)
		.then((response) => response)
		.catch((err) => err);



export const createChainLyo = (data) =>

	axios
		.post(`${apiBridgeUrlLYO}/chains`, data, {
			headers: {
				'x-api-key': process.env.REACT_APP_X_API_KEY
			},
		})
		.then((response) => response)
		.catch((err) => err);

export const updateChainLyo = (data) =>
	axios
		.patch(`${apiBridgeUrlLYO}/chains/${data._id}`, data)
		.then((response) => response)
		.catch((err) => err);


export const removeChainLyo = (id) =>
	axios
		.delete(`${apiBridgeUrlLYO}/chains/${id}`)
		.then((response) => response)
		.catch((err) => err);

export const getBridgeConfig = () =>
	axios
		.get(`${apiBridgeUrlLFI}/dashboard/bridge-config`)
		.then((response) => response)
		.catch((err) => err);

export const getBridgeConfigLyo = () =>
	axios
		.get(`${apiBridgeUrlLYO}/dashboard/bridge-config`)
		.then((response) => response)
		.catch((err) => err);

export const rejectTransaction = (id, rejectedReason) => {
	var data = qs.stringify({
		_id: id,
		rejectedReason: rejectedReason
	});


	var config = {
		method: "POST",
		url: `${apiBridgeUrlLFI}/transactions/reject`,
		headers: {
			'x-api-key': process.env.REACT_APP_X_API_KEY
		},
		data: data,
	};
	return axios(config).then((response) => response)
		.catch((err) => err);

}

export const rejectTransactionLyo = (id) => {
	var data = qs.stringify({
		_id: id,
	});
	var config = {
		method: "POST",
		url: `${apiBridgeUrlLYO}/transactions/reject`,
		headers: {
			'x-api-key': process.env.REACT_APP_X_API_KEY
		},
		data: data,
	};
	return axios(config).then((response) => response)
		.catch((err) => err);

}

export const getTransactionStats = () =>
	axios
		.get(`${apiBridgeUrlLFI}/dashboard/transaction-stats`)
		.then((response) => response)
		.catch((err) => err);


export const getVolumeInfo = () =>
	axios
		.get(`${apiBridgeUrlLFI}/dashboard/volume-info`)
		.then((response) => response)
		.catch((err) => err);

export const getGatewayBalances = () =>
	axios
		.get(`${apiBridgeUrlLFI}/dashboard/gateway-balances`)
		.then((response) => response)
		.catch((err) => err);


export const createBridgeTransactionService = (data) =>

	axios
		.post(`${apiBridgeUrlLFI}/transactions`, data, {
			headers: {
				'x-api-key': process.env.REACT_APP_X_API_KEY
			},
		})
		.then((response) => response)
		.catch((err) => err);