const baseURL = {
  api: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost',
  auth: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost',
  sso: process.env.NODE_ENV === 'production' ? 'https://sso.humanrisk.cn' : 'http://localhost',
}

export default baseURL