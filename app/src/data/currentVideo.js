const key = "currentVideo";

const get = () => {
    return JSON.parse(localStorage.getItem(key));
};

export const getTime = (id) => {
    const current = get(id) ? get(id) : [];
    const result = current.find(v => {
        return v.id === id;
    });
    return result ? result.time : false;
};

export const set = (id, time) => {
    const current = get(id) ? get(id) : [];
    const result = current.find(v => {
        return v.id === id;
    });
    if (result) {
        result.time = time;
    } else {
        current.push({ id, time });

    }
    localStorage.setItem(key, JSON.stringify(current));
};