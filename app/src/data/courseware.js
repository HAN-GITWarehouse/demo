
const key = "courseware-data";

export const set = (data) => {
    data.page.type = 0;
    localStorage.setItem(key, JSON.stringify(data));
};

export const get = () => {
    const dataString = localStorage.getItem(key);
    if (dataString === null) {
        return null;
    }

    return JSON.parse(dataString);
};
