import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

// L'HTML grezzo nel testo non viene interpretato (default di react-markdown): il contenuto arriva dal modello.
const components: Components = {
  a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-sm prose-slate max-w-none prose-pre:overflow-x-auto prose-table:block prose-table:overflow-x-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
