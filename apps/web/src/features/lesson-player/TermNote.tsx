import { useEffect, useId, useRef, useState } from 'react';
import type { Lesson } from '@sdl/content-schema';
type Term = Lesson['terms'][number];

export function TermNote({ term, children }: { term: Term; children: string }) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const note = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pinned = useRef(false);
  const suppressFocus = useRef(false);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  function close() {
    clearTimeout(timer.current);
    pinned.current = false;
    note.current?.hidePopover();
  }
  function open() {
    clearTimeout(timer.current);
    const box = trigger.current?.getBoundingClientRect();
    const panel = note.current;
    if (!box || !panel) return;
    panel.showPopover();
    const width = Math.min(320, window.innerWidth - 24);
    const height = panel.getBoundingClientRect().height;
    panel.style.left = `${Math.min(Math.max(12, box.left), window.innerWidth - width - 12)}px`;
    panel.style.top = `${Math.max(12, Math.min(box.bottom + 8, window.innerHeight - height - 12))}px`;
  }
  function leave() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (
        !pinned.current &&
        document.activeElement !== trigger.current &&
        !note.current?.contains(document.activeElement)
      )
        close();
    }, 120);
  }
  useEffect(() => {
    if (!expanded) return;
    const dismiss = () => close();
    const reposition = () => {
      const box = trigger.current?.getBoundingClientRect();
      if (!box || box.bottom < 0 || box.top > window.innerHeight) close();
      else open();
    };
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', dismiss);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', dismiss);
    };
  }, [expanded]);
  if (!('showPopover' in HTMLElement.prototype)) return children;
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="term-trigger"
        aria-label={`Giải thích: ${children}`}
        aria-haspopup="dialog"
        aria-expanded={expanded}
        aria-controls={id}
        onFocus={() => {
          if (suppressFocus.current) suppressFocus.current = false;
          else if (trigger.current?.matches(':focus-visible')) open();
        }}
        onBlur={(e) => {
          if (!note.current?.contains(e.relatedTarget as Node | null)) close();
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') open();
        }}
        onPointerLeave={leave}
        onClick={() => {
          if (pinned.current) close();
          else {
            open();
            pinned.current = true;
          }
        }}
      >
        {children}
      </button>
      <span
        id={id}
        ref={note}
        popover="auto"
        role="dialog"
        aria-label={`Giải thích: ${term.name}`}
        className="term-note"
        onToggle={(e) => {
          const visible = e.newState === 'open';
          setExpanded(visible);
          if (!visible) pinned.current = false;
        }}
        onPointerEnter={() => clearTimeout(timer.current)}
        onPointerLeave={leave}
        onBlur={(e) => {
          if (
            !e.currentTarget.contains(e.relatedTarget as Node | null) &&
            e.relatedTarget !== trigger.current
          )
            close();
        }}
      >
        <strong>
          {term.name} <span>({term.english})</span>
        </strong>
        <span className="term-definition">{term.meaning}</span>
        <button
          className="term-close"
          type="button"
          onClick={() => {
            close();
            suppressFocus.current = true;
            trigger.current?.focus();
          }}
          aria-label={`Đóng giải thích ${term.name}`}
        >
          Đóng
        </button>
      </span>
    </>
  );
}

/** Matches whole terms in plain prose; never injects HTML or changes answer buttons. */
export function AnnotatedText({ text, terms }: { text: string; terms: Term[] }) {
  const aliases = terms
    .flatMap((term) => [term.name, term.english].map((word) => ({ term, word })))
    .filter((a) => a.word.length > 1)
    .sort((a, b) => b.word.length - a.word.length);
  const escaped = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!aliases.length) return text;
  const pattern = new RegExp(
    `(?<![\\p{L}\\p{N}_])(${aliases.map((a) => escaped(a.word)).join('|')})(?![\\p{L}\\p{N}_])`,
    'giu',
  );
  const nodes = [];
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index;
    nodes.push(text.slice(cursor, start));
    const alias = aliases.find(
      (a) => a.word.toLocaleLowerCase('vi') === match[0].toLocaleLowerCase('vi'),
    )!;
    nodes.push(
      <TermNote key={start} term={alias.term}>
        {match[0]}
      </TermNote>,
    );
    cursor = start + match[0].length;
  }
  nodes.push(text.slice(cursor));
  return nodes;
}
