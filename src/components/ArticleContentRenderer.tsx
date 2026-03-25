import React from 'react';

export interface ArticleContentRendererProps {
  content: string;
  className?: string;
  headingClassName?: string;
  paragraphClassName?: string;
  listClassName?: string;
}

export const ArticleContentRenderer: React.FC<ArticleContentRendererProps> = ({
  content,
  className = '',
  headingClassName = '',
  paragraphClassName = '',
  listClassName = '',
}) => {
  const parseContent = (text: string): React.ReactNode[] => {
    if (!text) return [];
    
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    
    let currentList: string[] = [];
    let inList = false;
    
    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className={`space-y-2 mb-4 ${listClassName}`}>
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-gray-500 dark:text-gray-400 mt-1.5 flex-shrink-0">•</span>
                <span className="flex-1">{item.trim()}</span>
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        flushList();
        inList = false;
        return;
      }
      
      // Check for headings (lines that end with : or are short and bold)
      if (trimmedLine.endsWith(':') || trimmedLine.length < 60) {
        flushList();
        inList = false;
        
        // Determine heading level based on context
        const isMainHeading = trimmedLine.endsWith(':') && !trimmedLine.includes('।');
        const headingText = trimmedLine.endsWith(':')
          ? trimmedLine.slice(0, -1)
          : trimmedLine;
        
        if (isMainHeading) {
          elements.push(
            <h2
              key={`heading-${index}`}
              className={`font-bold text-gray-900 dark:text-gray-100 mb-4 mt-6 first:mt-0 text-2xl md:text-3xl ${headingClassName}`}
            >
              {headingText}
            </h2>
          );
        } else {
          elements.push(
            <h3
              key={`heading-${index}`}
              className={`font-bold text-gray-900 dark:text-gray-100 mb-4 mt-6 first:mt-0 text-xl md:text-2xl ${headingClassName}`}
            >
              {headingText}
            </h3>
          );
        }
        return;
      }
      
      // Check for list items (lines starting with •, -, *, or numbers)
      if (trimmedLine.match(/^[•\-*]\s/) || trimmedLine.match(/^\d+\.\s/)) {
        if (!inList) {
          flushList();
          inList = true;
        }
        currentList.push(trimmedLine.replace(/^[•\-*]\s/, '').replace(/^\d+\.\s/, ''));
        return;
      }
      
      // Regular paragraph
      flushList();
      inList = false;
      
      // Check if this looks like a subheading (short line without punctuation)
      if (trimmedLine.length < 100 && !trimmedLine.match(/[।.!?]$/)) {
        elements.push(
          <h4 
            key={`subheading-${index}`}
            className={`font-semibold text-gray-800 dark:text-gray-200 mb-3 mt-4 text-lg ${headingClassName}`}
          >
            {trimmedLine}
          </h4>
        );
      } else {
        elements.push(
          <p 
            key={`para-${index}`}
            className={`leading-relaxed mb-4 text-gray-700 dark:text-gray-300 ${paragraphClassName}`}
          >
            {trimmedLine}
          </p>
        );
      }
    });
    
    flushList(); // Flush any remaining list items
    
    return elements;
  };

  const contentElements = parseContent(content);
  
  if (contentElements.length === 0) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl p-6">
        <p className="text-blue-800 dark:text-blue-200">
          यस समाचारको पूर्ण विवरण उपलब्ध छैन। थप विवरणका लागि मूल स्रोत हेर्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      <div className="space-y-6">
        {contentElements}
      </div>
    </div>
  );
};