import axios from "axios";
import { apiUrl } from "../../config";

export const totalTransaction = (data) =>
	axios
		.get(`${apiUrl}/admin/dashboard/total-pix-transaction`, {
			params: data,
		})
		.then((response) => response)
		.catch((err) => err.response);

export const totalClient = (data) =>
	axios
		.get(`${apiUrl}/admin/dashboard/get-total-pix-client`, {
			params: data,
		})
		.then((response) => response)
		.catch((err) => err.response);
