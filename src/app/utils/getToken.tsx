function getToken() {
  return fetch('http://localhost:8000/sanctum/csrf-cookie', {
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });
}

export default getToken;
