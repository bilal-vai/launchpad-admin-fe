const environment = process.env.ENVIRONMENT;
let apiUri = "https://api-staging.lfi.io";
let wsLink = "ws://localhost:8090";
let apiUriBridgeLFI = process.env.REACT_APP_API_BRIDGE_URL_LFI;
let apiUriBridgeLYO = process.env.REACT_APP_API_BRIDGE_URL_LYO;
if (environment === "production") {
	apiUri = process.env.API_URL;
	wsLink = "ws://localhost:8090";
	apiUriBridgeLFI = process.env.REACT_APP_API_BRIDGE_URL_LFI;
	apiUriBridgeLYO = process.env.REACT_APP_API_BRIDGE_URL_LYO;
}
if (environment === "development") {
}
apiUri = "https://api-staging.lfi.io";
wsLink = "ws://localhost:8090";
apiUriBridgeLFI = process.env.REACT_APP_API_BRIDGE_URL_LFI;
// apiUri = "https://api-staging.lfi.io";
// wsLink = "wss://socket-staging.lfi.io";
export const apiUrl = apiUri;
export const wsUrl = wsLink;
export const apiBridgeUrlLFI = apiUriBridgeLFI;
export const apiBridgeUrlLYO = apiUriBridgeLYO;

