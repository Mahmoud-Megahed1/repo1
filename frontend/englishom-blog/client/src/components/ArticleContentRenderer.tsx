import parse, { Element } from "html-react-parser";
import { parseYoutubeUrl } from "@/components/RichTextEditor";

interface ArticleContentRendererProps {
  content: string;
  className?: string;
}

export default function ArticleContentRenderer({ content, className = "" }: ArticleContentRendererProps) {
  if (!content) return null;

  return (
    <div className={`prose dark:prose-invert max-w-none article-content ${className}`}>
      {parse(content, {
        replace: (domNode) => {
          if (domNode instanceof Element && domNode.tagName === "iframe") {
            const rawSrc = domNode.attribs?.src || "";
            const embedSrc = parseYoutubeUrl(rawSrc) || rawSrc;
            return (
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg my-6 bg-black">
                <iframe
                  {...domNode.attribs}
                  src={embedSrc}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          }

          if (domNode instanceof Element && domNode.tagName === "video") {
            return (
              <video
                {...domNode.attribs}
                controls
                className="w-full aspect-video rounded-xl shadow-lg my-6"
              />
            );
          }
        },
      })}
    </div>
  );
}
