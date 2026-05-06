import React, { useEffect, useRef, useState } from 'react';
import { AppFile } from '../lib/fileSystem';

interface LivePreviewProps {
  files: AppFile[];
  activeFileConfig?: { id: string, name: string };
}

export default function LivePreview({ files }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [debouncedFiles, setDebouncedFiles] = useState<AppFile[]>(files);

  // Debounce the preview update to avoid continuous re-rendering while typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFiles(files);
    }, 800);
    return () => clearTimeout(handler);
  }, [files]);

  useEffect(() => {
    if (!iframeRef.current) return;

    // Find main components
    const htmlFile = debouncedFiles.find(f => f.name.endsWith('.html'))?.content || '<h1>No index.html found.</h1><p>Create an HTML file to see the preview.</p>';
    const cssFiles = debouncedFiles.filter(f => f.name.endsWith('.css'));
    const jsFiles = debouncedFiles.filter(f => f.name.endsWith('.js'));

    // Inject console capturing script
    const consoleProxyScript = `
      <script>
        (function(){
          const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
          };

          function sendLog(type, args) {
            window.parent.postMessage({
              type: 'nanzz-console',
              logType: type,
              content: Array.from(args).map(arg => 
                typeof arg === 'object' ? JSON.parse(JSON.stringify(arg)) : String(arg)
              )
            }, '*');
          }

          console.log = function() { originalConsole.log.apply(console, arguments); sendLog('log', arguments); };
          console.error = function() { originalConsole.error.apply(console, arguments); sendLog('error', arguments); };
          console.warn = function() { originalConsole.warn.apply(console, arguments); sendLog('warn', arguments); };
          console.info = function() { originalConsole.info.apply(console, arguments); sendLog('info', arguments); };
          
          window.onerror = function(msg, url, lineNo, columnNo, error) {
            sendLog('error', [msg + ' at line ' + lineNo]);
            return false;
          };
        })();
      </script>
    `;

    // Process HTML to inject relative scripts and styles
    // A more advanced engine would parse the DOM, here we do simple simulation
    let processedHtml = htmlFile;
    
    // Simplistic style injection (avoids parsing complex structures for a purely frontend app)
    const combinedCss = cssFiles.map(f => f.content).join('\n');
    let injectedStyles = `<style>${combinedCss}</style>`;
    
    const combinedJs = jsFiles.map(f => f.content).join('\n;\n');
    let injectedScripts = `<script>${combinedJs}</script>`;

    let finalDocument = htmlFile;

    // Inject styles before </head> or at the top
    if (finalDocument.includes('</head>')) {
      finalDocument = finalDocument.replace('</head>', `${consoleProxyScript}\n${injectedStyles}\n</head>`);
    } else {
      finalDocument = `${consoleProxyScript}\n${injectedStyles}\n` + finalDocument;
    }

    // Inject scripts before </body> or at the bottom
    if (finalDocument.includes('</body>')) {
      finalDocument = finalDocument.replace('</body>', `${injectedScripts}\n</body>`);
    } else {
      finalDocument += `\n${injectedScripts}`;
    }

    const blob = new Blob([finalDocument], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    iframeRef.current.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [debouncedFiles]);

  return (
    <div className="w-full h-full bg-white relative">
      <iframe
        ref={iframeRef}
        title="Live Preview"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        className="w-full h-full border-none"
      />
    </div>
  );
}
