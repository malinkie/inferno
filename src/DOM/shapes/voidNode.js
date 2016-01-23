import { updateDOMDynamicAttributes, clearListeners, handleHooks } from '../addAttributes';
import addShapeAttributes from '../addShapeAttributes';

export default function createVoidNode(templateNode, dynamicAttrs, staticNode) {
	const dynamicAttrKeys = dynamicAttrs && Object.keys(dynamicAttrs);
	const domNodeMap = {};
	const node = {
		overrideItem: null,
		create(item, treeLifecycle) {
			const domNode = templateNode.cloneNode(true);

			if (staticNode) {
				return domNode;
			}

			if (dynamicAttrs) {
				addShapeAttributes(domNode, item, dynamicAttrs, node, treeLifecycle);
			}
			domNodeMap[item.id] = domNode;
			return domNode;
		},
		update(lastItem, nextItem) {
			if ( !staticNode) {
				const domNode = domNodeMap[lastItem.id];
				if (dynamicAttrs) {
					if (dynamicAttrs.onWillUpdate) {
						handleHooks(nextItem, dynamicAttrs, domNode, 'onWillUpdate');
					}
					updateDOMDynamicAttributes(lastItem, nextItem, domNode, dynamicAttrs, dynamicAttrKeys);
					if (dynamicAttrs.onDidUpdate) {
						handleHooks(nextItem, dynamicAttrs, domNode, 'onDidUpdate');
					}
				}
			}
		},
		remove(item) {
			if (!staticNode) {
				const domNode = domNodeMap[item.id];

				if (dynamicAttrs) {
					if (dynamicAttrs.onWillDetach) {
						handleHooks(item, dynamicAttrs, domNode, 'onWillDetach');
					}
					clearListeners(item, domNode, dynamicAttrs);
				}
			}
		},
		hydrate() {}
	};

	return node;
}
