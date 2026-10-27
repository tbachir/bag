import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkStringify from 'remark-stringify';
import { parse as parseYaml } from 'yaml';

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkFrontmatter)
  .use(remarkStringify, { fences: true, bullet: '-', listItemIndent: 'one' });
export function parseMarkdown(text) {
  const tree = processor.parse(text);
  const frontmatter = tree.children[0]?.type === 'yaml' ? parseYaml(tree.children.shift().value) ?? {} : {};
  return { tree, frontmatter };
}
export function visit(tree, callback) {
  callback(tree);
  for (const child of tree.children ?? []) visit(child, callback);
}
export function plainText(node) {
  return node.value ?? node.children?.map(plainText).join('') ?? '';
}
export function serialize(tree) { return processor.stringify(tree); }
export function rewriteMarkdown(text, resolve, escapeHtml = false) {
  const { tree } = parseMarkdown(text);
  visit(tree, (node) => {
    if (['link', 'image', 'definition'].includes(node.type)) node.url = resolve(node.url, node.type);
    if (escapeHtml && node.type === 'html') node.type = 'text';
  });
  return serialize(tree);
}
export function publicMarkdown(text, basePath) {
  return rewriteMarkdown(text, (url) => url.startsWith('/') && !url.startsWith('//') ? `${basePath}${url}` : url);
}
