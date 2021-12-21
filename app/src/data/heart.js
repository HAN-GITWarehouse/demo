const key = "heart";

export const get = () => {
    return localStorage.getItem(key);
};

export const set = (data) => {
    return localStorage.setItem(key, data);
};

export const clear = () => {
    return localStorage.removeItem(key);
};