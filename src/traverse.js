export default function traverse(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    })
  }

  function traverseNode(node, parent) {
    visitor(node, parent);
    traverseArray(node.children, node);
  }

  traverseNode(ast, null);
}
