const environment = process.env.ENVIRONMENT;
let apiUri = "http://localhost:5000";
if (environment === "production") {
	apiUri = process.env.API_URL;
}
if (environment === "development") {
}
apiUri = "http://localhost:5000";
export const apiUrl = apiUri;
