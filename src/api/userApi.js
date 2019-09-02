import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.REACT_APP_API_URL + "/user/";

export function getUser() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}
