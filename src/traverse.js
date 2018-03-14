export default function traverse(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }

  function traverseNode(node, parent) {
    visitor(node, parent);
    if (node.children && Array.isArray(node.children)) {
      traverseArray(node.children, node);
    }
  }

  traverseNode(ast, null);
}
