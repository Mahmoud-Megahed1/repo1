import parse from "html-react-parser";

interface ArticleContentRendererProps {
  content: string;
  className?: string;
}

export default function ArticleContentRenderer({ content, className = "" }: ArticleContentRendererProps) {
  if (!content) return null;

  return (
    <div className={`prose dark:prose-invert max-w-none article-content ${className}`}>
      {parse(content)}
    </div>
  );
}
