function PHNode(data, parent, children) {
	this.data = data;
	this.parent = parent;
	this.children = children;
	
	this.uid = Math.floor(Math.random() * 1e10);
}


function PairingHeap(fn) {
	this.root = null;
	this.cmp_fn = fn;
}
PairingHeap.prototype = {
	_merge_node: function (other) {
		if (this.root) {
			this.root = this._merge_nodes(this.root, other);
		} else {
			this.root = other;
		}
	},
	_merge_node_list: function (children) {
		var merged = this._merge_first_pair(children);
		if (!children.length) {
			return merged;
		}

		var node_list = [merged];
		while (children.length) {
			var next_merged = this._merge_first_pair(children);
			node_list.push(next_merged);
		}

		return this._merge_node_list(node_list);
	},
	_merge_first_pair: function (children) {
		var first_child = children[0];
		first_child.parent = null;
		children.shift();
		if (!children.length) {
			return first_child;
		}

		var second_child = children[0];
		second_child.parent = null;
		children.shift();

		return this._merge_nodes(first_child, second_child);
	},
	_merge_nodes: function (node1, node2) {
		if (!this.cmp_fn(node1.data, node2.data)) {
			node1.children.unshift(node2);
			if (node2.parent) {
				for (var i = 0, _itm; _itm = node2.parent.children[i]; i ++) {
					if (_itm.uid == node2.uid) {
						node2.parent.children.splice(i, 1);
						break;
					}
				}
			}
			node2.parent = node1;
			return node1;
		} else {
			node2.children.unshift(node1);
			if (node1.parent) {
				for (var i = 0, _itm; _itm = node1.parent.children[i]; i ++) {
					if (_itm.uid == node1.uid) {
						node1.parent.children.splice(i, 1);
						break;
					}
				}
			}
			node1.parent = node2;
			return node2;
		}
	},
	
	empty: function () {
		return this.root == null;
	},
	top: function () {
		return this.root.data;
	},
	push: function (data) {
		var node = new PHNode(data, null, []);
		this._merge_node(node);
		return node;
	},
	pop: function () {
		this.erase(this.root);
	},
	update: function (node) {
		if (node.children.length) {
			node = this._merge_nodes(node, this._merge_node_list(node.children));
		}
		if (node != this.root) {
			this._merge_node(node);
		}
	},
	increase: function (node) {
		this.update(node);
	},
	decrease: function (node) {
		this.update(node);
	},
	erase: function (node) {
		if (node != this.root) {
			if (node.children.length) {
				this._merge_node(this._merge_node_list(node.children));
			}
		} else {
			if (node.children.length) {
				this.root = this._merge_node_list(node.children);
			} else {
				this.root = null;
			}
		}
	},
	clear: function () {
		this.root = null;
	}
};