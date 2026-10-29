// Optional item config belongs to the canonical BAG folder, never to generated site content.
const allowed = new Set(['type','tags','technologies','useCases','contexts','recommendation','template','navigation']);
const safeList = (value, key) => {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 30 || value.some(v => typeof v !== 'string' || v.length > 80)) throw new Error('Invalid '+key+' metadata');
  return [...new Set(value.map(v => v.trim()).filter(Boolean))];
};
export function normalizeItemMetadata(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Item metadata must be an object');
  for (const key of Object.keys(value)) if (!allowed.has(key)) throw new Error('Unsupported item metadata field: '+key);
  const type = value.type;
  if (type !== undefined && (typeof type !== 'string' || !/^[a-z][a-z0-9-]{0,39}$/.test(type))) throw new Error('Invalid item type');
  const recommendation = value.recommendation;
  if (recommendation !== undefined && !['mandatory','recommended','optional','experimental'].includes(recommendation)) throw new Error('Invalid recommendation');
  const template = value.template;
  if (template !== undefined && !['skill','boilerplate','library','resource','loadout'].includes(template)) throw new Error('Invalid template');
  const navigation = value.navigation ?? {};
  if (!navigation || typeof navigation !== 'object' || Array.isArray(navigation)) throw new Error('Invalid navigation');
  for (const key of Object.keys(navigation)) if (!['title','description','icon','defaultOpen','collapsible','pages'].includes(key)) throw new Error('Unsupported navigation field: '+key);
  for (const key of ['title','description','icon']) if (navigation[key] !== undefined && (typeof navigation[key] !== 'string' || navigation[key].length > 160)) throw new Error('Invalid navigation '+key);
  for (const key of ['defaultOpen','collapsible']) if (navigation[key] !== undefined && typeof navigation[key] !== 'boolean') throw new Error('Invalid navigation '+key);
  if (navigation.pages !== undefined && (!Array.isArray(navigation.pages) || navigation.pages.some(v => typeof v !== 'string' || !/^[a-zA-Z0-9_.-]+$/.test(v)))) throw new Error('Invalid navigation pages');
  return { ...(type ? {type} : {}), tags:safeList(value.tags,'tags'), technologies:safeList(value.technologies,'technologies'), useCases:safeList(value.useCases,'useCases'), contexts:safeList(value.contexts,'contexts'), ...(recommendation ? {recommendation} : {}), ...(template ? {template} : {}), navigation };
}
export function folderNavigation(metadata, names, preferred = []) {
  const nav = metadata?.navigation ?? {};
  const desired = nav.pages ?? preferred;
  const ordered = [...new Set([...desired.filter(name => names.includes(name)), ...names.filter(name => !desired.includes(name))])];
  return { ...nav, pages: ordered };
}
