import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface AppFile {
  id: string;
  name: string;
  content: string;
  language: string;
}

const DEFAULT_FILES: AppFile[] = [
  {
    id: '1',
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello NanzzEditor</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Hello World! 👋</h1>
        <p>Welcome to <strong>NanzzEditor</strong>.<br/> "Code Anywhere, Learn Everywhere".</p>
        <button id="btnClick">Click Me</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`
  },
  {
    id: '2',
    name: 'style.css',
    language: 'css',
    content: `body {
    font-family: system-ui, -apple-system, sans-serif;
    background-color: #f3f4f6;
    color: #111827;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}
.container {
    background: white;
    padding: 2rem 3rem;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    text-align: center;
    border-top: 4px solid #4f46e5;
}
h1 { margin-top: 0; color: #4f46e5; }
button {
    background: #4f46e5;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 1rem;
    transition: background 0.2s;
}
button:hover {
    background: #4338ca;
}`
  },
  {
    id: '3',
    name: 'script.js',
    language: 'javascript',
    content: `const btn = document.getElementById('btnClick');
let count = 0;

btn.addEventListener('click', () => {
    count++;
    btn.textContent = \`Clicked \${count} times\`;
    console.log('Button was clicked!', count);
});

console.log('Hello from NanzzEditor preview!');`
  }
];

export const loadFiles = (): AppFile[] => {
  const stored = localStorage.getItem('nanzzeditor_files');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored files");
    }
  }
  return DEFAULT_FILES;
};

export const saveFiles = (files: AppFile[]) => {
  localStorage.setItem('nanzzeditor_files', JSON.stringify(files));
};

export const getLanguageFromName = (name: string): string => {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'html': return 'html';
    case 'css': return 'css';
    case 'js': return 'javascript';
    case 'jsx': return 'javascript';
    case 'ts': return 'javascript'; // using JS parser for TS simplicity here
    case 'py': return 'python';
    case 'php': return 'php';
    case 'md': return 'markdown';
    default: return 'markdown';
  }
};

export const downloadProjectAsZip = async (files: AppFile[]) => {
  const zip = new JSZip();
  files.forEach(file => {
    zip.file(file.name, file.content);
  });
  
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'nanzzeditor-project.zip');
};
