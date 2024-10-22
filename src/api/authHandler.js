import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;
export default async function authFetchHandler({ endPoint, method = "GET", data }) {
  const url = `${BASE_URL}/${endPoint}`;
  //console.log("authHandler",data);
  let allCookies = document.cookie;
  console.log(allCookies);

// Function to get a specific cookie by name
function getCookie(name) {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring((name + '=').length);
        }
    }
    return null;
}

// Usage
  let token = getCookie("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const options = {
    withCredentials: true,
    method,
    data,
    headers,
  };

  try {
    const response = await axios(url, options);
    return response;
  } catch (error) {
    console.log(error);
  }
}
