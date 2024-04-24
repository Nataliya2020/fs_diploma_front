function getToken() {
  return fetch(process.env.REACT_APP_CLIENT_URL + '/sanctum/csrf-cookie', {
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });
}

export default getToken;
