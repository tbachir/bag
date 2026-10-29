'use client';
import {useState} from 'react';
import {Check, Copy} from 'lucide-react';
export function CopyablePrompt({title,text}:{title:string;text:string}) {
  const [copied,setCopied]=useState(false);
  async function copy() {try {await navigator.clipboard.writeText(text);setCopied(true);} catch {setCopied(false);}}
  return <div className="rounded-xl border border-fd-border bg-fd-background p-3.5"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-semibold">{title}</h4><button type="button" onClick={copy} aria-label={`Copy ${title} prompt`} className="inline-flex items-center gap-1 rounded-md border border-fd-border px-2.5 py-1.5 text-xs hover:bg-fd-accent">{copied?<Check className="size-3.5"/>:<Copy className="size-3.5"/>}{copied?'Copied':'Copy'}</button></div><p className="mt-2 whitespace-pre-line text-xs leading-5 text-fd-muted-foreground">{text}</p></div>;
}
