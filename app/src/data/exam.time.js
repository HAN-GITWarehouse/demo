const key = "exam-time";
const intervalIdKey = "exam-time-id";

export const get = () => {
    return localStorage.getItem(key);
};

export const set = (data) => {
    return localStorage.setItem(key, data);
};

export const clear = () => {
    return localStorage.removeItem(key);
};

export const stop = () => {
    let intervalId = 0;
    const val = localStorage.getItem(intervalIdKey);
    if (val != null && val.length > 0) {
        intervalId = parseInt(val);
        clearInterval(intervalId);
    }
};

export const update = (update, complete) => {
    stop();

    const intervalId = setInterval(() => {
        let t = get();
        if (t == null || t.length === 0) {
            t = 0;
        }

        if (t <= 0) {
            update(t);
            stop();
            complete();
            return;
        }

        t--;

        update(t);

        set(t);
    }, 1000);

    localStorage.setItem(intervalIdKey, intervalId);
};