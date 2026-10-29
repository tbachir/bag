import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as AccordionComponents from 'fumadocs-ui/components/accordion';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import * as StepsComponents from 'fumadocs-ui/components/steps';
import * as FilesComponents from 'fumadocs-ui/components/files';
import * as TypeTableComponents from 'fumadocs-ui/components/type-table';
import type { MDXComponents } from 'mdx/types';

/** Explicit, audited library of Fumadocs authoring primitives.
 * Source Markdown remains escaped by the generator; these only render trusted authored MDX.
 */
export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...AccordionComponents,
    ...TabsComponents,
    ...StepsComponents,
    ...FilesComponents,
    ...TypeTableComponents,
    ...components,
  } satisfies MDXComponents;
}
export const useMDXComponents = getMDXComponents;
declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
