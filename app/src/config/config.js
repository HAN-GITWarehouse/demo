import baseURL from "../api/base.url"

const env_path = {
  development: "dev",
  production: "pro",
  test: "test",
}

export const HOME_ID = "35906dbb-eb12-43b4-b3e5-8cda49e98cf4"
export const CATALOG_ID = "5e1e2425-0606-4e99-9238-414bfa9c1794"
export const SSO_URL = `${
  process.env.NODE_ENV === "development" ? baseURL.auth : location.origin
}/sso/${env_path[process.env.NODE_ENV]}`
