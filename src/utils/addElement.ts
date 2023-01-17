export const addElement = (
  tagName: string,
  id: string,
  parentID: string,
  textContent?: string
) => {
  const $parent = document.getElementById(parentID) as HTMLElement;
  const $child = document.createElement(tagName);
  $child.setAttribute('id', id);
  if (textContent) {
    $child.appendChild(document.createTextNode(textContent));
  }
  $parent.appendChild($child);

  return $child;
};
