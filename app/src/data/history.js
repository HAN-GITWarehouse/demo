const key = "history";

export const set = (data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const get = () => {
    if (localStorage.getItem(key) === null) {
        return [];
    }
    return JSON.parse(localStorage.getItem(key));
};
