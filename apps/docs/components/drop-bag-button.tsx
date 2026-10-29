'use client';
import { useDropBag } from '@/components/use-drop-bag';
import { Check, Plus } from 'lucide-react';
export function DropBagButton({sourcePath}:{sourcePath:string}) {
  const {selected,toggle}=useDropBag();
  const active=selected.includes(sourcePath);
  return <button type="button" aria-pressed={active} onClick={()=>toggle(sourcePath)}
    className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring ${active?'border-fd-primary bg-fd-accent text-fd-primary':'border-fd-border bg-fd-card hover:border-fd-primary/50'}`}>
    {active?<Check aria-hidden="true" className="size-4"/>:<Plus aria-hidden="true" className="size-4"/>}
    {active?'In Drop Bag':'Add to Drop Bag'}
  </button>;
}
