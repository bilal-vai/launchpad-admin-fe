import axios from "axios";
import { apiUrl } from "../../config";

export const create = (data) =>
	axios
		.post(`${apiUrl}/admin/launchpad/create`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const getLaunchpadOptions = () =>
	axios
		.get(`${apiUrl}/admin/launchpad-option`)
		.then((response) => response)
		.catch((err) => err.response);

export const update = (data, _id) =>
	axios
		.put(`${apiUrl}/admin/launchpad/update/${_id}`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const toggle = (id) =>
	axios
		.patch(`${apiUrl}/admin/launchpad/toggle-status/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const remove = (id) =>
	axios
		.delete(`${apiUrl}/admin/launchpad/delete/${id}`)
		.then((response) => response)
		.catch((err) => err.response);
