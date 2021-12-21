import * as coursewareStorage from "../data/courseware";
import Tree from "../utils/tree";

let pages = null;

export const get = () => {
    const courseware = coursewareStorage.get();

    if (!courseware) {
        return;
    }

    const home = courseware.page.child[0];


    const tree = new Tree();
    tree.build(home.id, home);

    // console.log("callback get home: ", tree.pages);

    pages = tree.pages;

    return pages;
};
