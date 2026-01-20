
import React, { useMemo, useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

interface MarkdownContentProps {
  content: string;
  onCopyCode: (code: string) => void; // Callback to handle copying individual code blocks
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, onCopyCode }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const renderedHtml = useMemo(() => {
    if (!content) return '';
    
    const renderer = new marked.Renderer();
    renderer.code = (code, language) => {
      let highlighted;
      const validLang = language && hljs.getLanguage(language) ? language : 'plaintext';
      
      try {
        highlighted = hljs.highlight(code, { language: validLang }).value;
      } catch (e) {
        highlighted = code; // Fallback to plain code if highlighting fails
      }

      const displayLang = validLang.toUpperCase();
      
      // The button below will trigger a custom event or callback to copy the code
      // We embed the raw code as a data attribute or rely on textContent for copying
      return `
        <div class="code-block-container relative group/code my-8 border border-[#262626] rounded-2xl overflow-hidden bg-[#050505] shadow-2xl">
          <div class="flex items-center justify-between px-5 py-3 bg-[#111] border-b border-[#262626]">
            <div class="flex items-center gap-3">
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <span class="text-[10px] font-bold tracking-[0.1em] text-gray-500 ml-2">${displayLang}</span>
            </div>
            <button 
              class="copy-code-btn flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-white transition-all bg-[#1a1a1a] border border-[#333] px-3 py-1.5 rounded-lg active:scale-95"
              data-code="${encodeURIComponent(code)}"
            >
              <i class="fa-regular fa-copy"></i>
              <span>COPY</span>
            </button>
          </div>
          <div class="code-scroll-area p-6 overflow-auto custom-scrollbar max-h-[600px] bg-[#050505] pointer-events-auto">
            <pre class="!m-0 !p-0 !bg-transparent"><code class="hljs language-${validLang} !bg-transparent text-[13px] sm:text-[14px] font-mono leading-[1.6] text-blue-100">${highlighted}</code></pre>
          </div>
        </div>
      `;
    };

    marked.setOptions({ breaks: true, gfm: true, renderer });
    const html = marked.parse(content) as string;
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['div', 'span', 'pre', 'code', 'p', 'br', 'b', 'i', 'em', 'strong', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'button', 'a'],
      ALLOWED_ATTR: ['class', 'href', 'target', 'id', 'data-code'] // Allow data-code for copy button
    });
  }, [content]);

  // Handle click events for dynamically added copy buttons
  useEffect(() => {
    if (!contentRef.current) return;

    const handleInternalCopyClick = async (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest('.copy-code-btn');
      if (!btn) return;

      const codeToCopy = decodeURIComponent(btn.getAttribute('data-code') || '');
      if (codeToCopy) {
        try {
          await navigator.clipboard.writeText(codeToCopy);
          const span = btn.querySelector('span');
          const icon = btn.querySelector('i');
          if (span && icon) {
            span.innerText = 'COPIED!';
            icon.className = 'fa-solid fa-check text-green-400';
            btn.classList.add('border-green-400/30', 'bg-green-400/5', 'text-green-400');
            
            setTimeout(() => {
              span.innerText = 'COPY';
              icon.className = 'fa-regular fa-copy';
              btn.classList.remove('border-green-400/30', 'bg-green-400/5', 'text-green-400');
            }, 2000);
          }
        } catch (err) {
          console.error('Copy failed:', err);
        }
      }
    };

    const currentRef = contentRef.current;
    currentRef.addEventListener('click', handleInternalCopyClick);
    return () => {
      currentRef.removeEventListener('click', handleInternalCopyClick);
    };
  }, [renderedHtml, onCopyCode]); // Re-run effect if HTML changes

  return (
    <div 
      ref={contentRef}
      className="markdown-content animate-in fade-in slide-in-from-bottom-3 duration-700" 
      dangerouslySetInnerHTML={{ __html: renderedHtml }} 
    />
  );
};

export default MarkdownContent;
