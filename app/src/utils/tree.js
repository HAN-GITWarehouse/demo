export default class Tree {
  constructor() {
  }

  findRealNode(root, node) {
    console.log('findRealNode ssssssssssssssssssssssssssssssssss')
    if (root.id === node.data.id && root.parent_id === node.data.parent_id) {
      return root;
    }

    // console.log('utils tree current root: ', root)
    if (
      !root.child ||
      !Array.isArray(root.child) ||
      root.child.length === 0
    ) {
      return null;
    }

    for (const v of root.child) {
      const result = this.findRealNode(v, node);
      if (result != null) {
        return result;
      }
    }

    return null;
  }

  find(id, root) {
    // console.log('utils tree find function, id, root, root.id: ', id, root, root == null ? null : root.id)
    if (root.id === id) {
      // console.log('utils tree find return, id, root: ', id, root)
      return root;
    }

    // console.log('utils tree current root: ', root)
    if (
      !root.child ||
      !Array.isArray(root.child) ||
      root.child.length === 0
    ) {
      return null;
    }

    for (const v of root.child) {
      const result = this.find(id, v);
      if (result != null) {
        return result;
      }
    }

    return null;
  }

  build(rootId, root) {
    if (!this._pages) {
      this._pages = new Map();
    }

    const data = {
      id: rootId,
      type: root.type,
      data: root
    };

    if (
      !root.child ||
      !Array.isArray(root.child) ||
      root.child.length === 0
    ) {
      this._pages.set(rootId, data);
      return data;
    }

    data.child = [];
    root.child.forEach((node, idx) => {
      const childId = `${rootId}:${node.id}`;
      const child = this.build(childId, node);
      child.parent_id = rootId;
      child.index = idx;
      data.child.push(child);
    });

    this._pages.set(rootId, data);
    return data;
  }

  maps(node) {
    const maps = new Map();
    const format = (node) => {
      const data = node;

      if (Array.isArray(node.child)) {
        const child = [];

        const length = node.child.length;
        node.child.forEach((v, idx) => {
          v.index = idx;
          v.prev_id = idx > 0 ? node.child[idx - 1].id : null;
          v.next_id = idx < (length - 1) ? node.child[idx + 1].id : null;
          format(v);
          child.push({ id: v.id, parent_id: v.parent_id, index: idx, prev_id: v.prev_id, next_id: v.next_id });
        });
        data.child = child
      }

      maps.set(data.id, data);

      return maps;
    }

    return format(node)
  }

  get pages() {
    return this._pages;
  }
}
