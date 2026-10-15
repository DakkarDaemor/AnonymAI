import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Markdown from '../Markdown';

const render = (md: string) => renderToStaticMarkup(<Markdown>{md}</Markdown>);

describe('Markdown', () => {
  it('rende le tabelle GFM', () => {
    expect(render('| a | b |\n|---|---|\n| 1 | 2 |')).toContain('<table>');
  });

  it('apre i link in una nuova scheda senza opener', () => {
    expect(render('[x](https://example.com)')).toContain('target="_blank" rel="noopener noreferrer"');
  });

  it("non interpreta l'HTML grezzo del modello", () => {
    const html = render('<img src=x onerror="alert(1)"> **ok**');
    expect(html).not.toContain('<img');
    expect(html).toContain('<strong>ok</strong>');
  });
});
