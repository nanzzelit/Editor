import React, { useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { php } from '@codemirror/lang-php';
import { markdown } from '@codemirror/lang-markdown';
import { githubDark, githubLight } from '@uiw/codemirror-themes-all';

interface EditorProps {
  content: string;
  language: string;
  theme: 'dark' | 'light';
  onChange: (value: string) => void;
}

export default function Editor({ content, language, theme, onChange }: EditorProps) {
  
  const getLanguageExtension = (lang: string) => {
    switch (lang) {
      case 'html': return html();
      case 'css': return css();
      case 'javascript': return javascript();
      case 'python': return python();
      case 'php': return php();
      case 'markdown': return markdown();
      default: return markdown();
    }
  };

  const cmTheme = theme === 'dark' ? githubDark : githubLight;

  return (
    <div className="w-full h-full text-base overflow-hidden bg-[#1e1e1e] relative code-editor-container">
      <CodeMirror
        value={content}
        height="100%"
        width="100%"
        theme={githubDark}
        extensions={[getLanguageExtension(language)]}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          tabSize: 2,
        }}
        className="h-full w-full absolute inset-0"
      />
      <style dangerouslySetInnerHTML={{__html: `
        .code-editor-container .cm-theme-light, 
        .code-editor-container .cm-theme-dark,
        .code-editor-container .cm-editor {
          height: 100%;
          background-color: #1e1e1e !important;
          color: #cccccc !important;
        }
        .code-editor-container .cm-scroller {
          font-family: var(--font-mono);
          font-size: 14px;
        }
        .code-editor-container .cm-gutters {
          background-color: #1e1e1e !important;
          border-right: 1px solid #333 !important;
          color: #858585 !important;
        }
        .code-editor-container .cm-activeLine, .code-editor-container .cm-activeLineGutter {
          background-color: #2a2d2e !important;
        }
      `}} />
    </div>
  );
}
