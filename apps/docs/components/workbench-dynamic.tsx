'use client';
import { useState } from 'react';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
export function WorkbenchDynamic() {
  const [platform,setPlatform]=useState<'pnpm'|'npm'>('pnpm');
  return <div className="space-y-3"><label className="flex items-center gap-2 text-sm">Package manager<select aria-label="Package manager" value={platform} onChange={event=>setPlatform(event.target.value as 'npm'|'pnpm')} className="rounded-md border border-fd-border bg-fd-card p-2"><option value="pnpm">pnpm</option><option value="npm">npm</option></select></label><DynamicCodeBlock lang="bash" code={platform==='pnpm'?'pnpm add fumadocs-ui':'npm install fumadocs-ui'}/></div>;
}
