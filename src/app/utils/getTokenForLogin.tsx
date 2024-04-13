function getTokenForLogin() {
  const cookie = document.cookie.split('; ').reduce((acc: {
    [key: string]: any
  }, item) => {
    const [name, value] = item.split('=')
    acc[name] = value
    return acc
  }, {})
  const xsrf = cookie['XSRF-TOKEN'];
  return decodeURIComponent(xsrf);
}

export default getTokenForLogin;
