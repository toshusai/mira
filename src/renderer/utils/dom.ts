/**
 * find tag by name from parent of node.
 * @param el target elemetn
 * @param name the tagName UPPER CASE
 * @returns boolean
 */
export function findTagInParent(el: HTMLElement, name: string): boolean {
  if (!el.parentElement) return false;
  if (el.tagName == name) {
    return true;
  }
  return findTagInParent(el.parentElement, name);
}
