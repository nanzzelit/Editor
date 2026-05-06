import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DownloadCloud, Save, Moon, Sun, Book, BookOpen, Layers, MonitorPlay, Maximize, FileCode } from 'lucide-react';
import { AppFile, loadFiles, saveFiles, getLanguageFromName, downloadProjectAsZip } from './lib/fileSystem';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import LivePreview from './components/LivePreview';
import ConsoleOutput from './components/ConsoleOutput';
import Guidebook from './components/Guidebook';

export default function App() {
  const [files, setFiles] = useState<AppFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Layout state for mobile/desktop flexibility
  // 'split' = Editor + Preview side-by-side (Desktop default)
  // 'editor' = Only Editor visible
  // 'preview' = Only Preview visible
  const [layoutMode, setLayoutMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  // Initialization
  useEffect(() => {
    const loadedFiles = loadFiles();
    setFiles(loadedFiles);
    if (loadedFiles.length > 0) {
      setActiveFileId(loadedFiles[0].id);
    }
    
    // Check local storage for theme
    const savedTheme = localStorage.getItem('nanzzeditor_theme');
    if (savedTheme === 'light') setTheme('light');
    else setTheme('dark');

    // Auto-adjust layout on resize
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLayoutMode('editor');
        setIsSidebarOpen(false);
      } else {
        setLayoutMode('split');
        setIsSidebarOpen(true);
      }
    };
    
    // Set initial
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync theme to document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('nanzzeditor_theme', theme);
  }, [theme]);

  const activeFile = useMemo(() => files.find(f => f.id === activeFileId), [files, activeFileId]);

  const handleEditorChange = useCallback((value: string) => {
    if (!activeFileId) return;
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: value } : f));
  }, [activeFileId]);

  const saveCurrentState = useCallback(() => {
    saveFiles(files);
    // Visual feedback could be added here
  }, [files]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCurrentState();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveCurrentState]);

  // File Handlers
  const createFile = (name: string) => {
    const newFile: AppFile = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      content: '',
      language: getLanguageFromName(name)
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  const uploadFile = (file: AppFile) => {
    const mappedFile = { ...file, language: getLanguageFromName(file.name) };
    setFiles(prev => [...prev, mappedFile]);
    setActiveFileId(mappedFile.id);
  };

  const renameFile = (id: string, newName: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, name: newName, language: getLanguageFromName(newName) };
      }
      return f;
    }));
  };

  const deleteFile = (id: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      if (activeFileId === id && updated.length > 0) {
        setActiveFileId(updated[0].id);
      } else if (updated.length === 0) {
        setActiveFileId(null);
      }
      return updated;
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#1e1e1e] text-[#cccccc] font-sans">
      {/* Top Navbar */}
      <header className="h-12 bg-[#2d2d2d] flex items-center justify-between px-4 border-b border-[#111] shadow-md z-10 shrink-0 relative">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-1.5 hover:bg-[#3e3e3e] rounded-md text-[#cccccc]"
          >
            <Layers className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white shrink-0">
            N
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">NanzzEditor</h1>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest hidden sm:block">Code Anywhere, Learn Everywhere</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Layout Toggles */}
          <div className="flex md:hidden bg-[#1e1e1e] p-1 border border-[#333] rounded-md mr-1">
            <button 
              onClick={() => setLayoutMode('editor')}
              className={`p-1 text-sm ${layoutMode === 'editor' ? 'bg-[#37373d] text-white rounded' : 'text-gray-500'}`}
            >
              <FileCode className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setLayoutMode('preview')}
              className={`p-1 text-sm ${layoutMode === 'preview' ? 'bg-[#37373d] text-white rounded' : 'text-gray-500'}`}
            >
              <MonitorPlay className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={saveCurrentState}
            className="p-1.5 hover:bg-[#3e3e3e] rounded-md text-[#cccccc] hidden sm:block"
            title="Save Project (Ctrl+S)"
          >
            <Save className="w-5 h-5" />
          </button>

          <button 
            onClick={() => downloadProjectAsZip(files)}
            className="p-1.5 hover:bg-[#3e3e3e] rounded-md text-[#cccccc]"
            title="Export to ZIP"
          >
            <DownloadCloud className="w-5 h-5" />
          </button>

          <div className="w-[1px] h-6 bg-[#444] mx-1 hidden sm:block"></div>

          <button 
            onClick={toggleFullscreen}
            className="hidden sm:flex p-1.5 hover:bg-[#3e3e3e] rounded-md text-[#cccccc]"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-5 h-5 border-[1.5px] p-0.5 rounded-sm border-current bg-transparent" />
          </button>

          <button 
            onClick={() => setIsGuidebookOpen(true)}
            className="p-1.5 bg-blue-600/20 text-blue-400 rounded-md hover:bg-blue-600/30 transition-colors ml-1"
            title="Panduan"
          >
            <BookOpen className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-56 border-r' : 'w-0 border-0'} flex-shrink-0 transition-all duration-300 overflow-hidden bg-[#252526] border-[#111] absolute md:relative z-20 h-full shadow-xl md:shadow-none`}>
          <Sidebar 
            files={files}
            activeFileId={activeFileId}
            onFileSelect={(id) => {
              setActiveFileId(id);
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            onFileCreate={createFile}
            onFileRename={renameFile}
            onFileDelete={deleteFile}
            onFileUpload={uploadFile}
          />
        </div>

        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-10"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          
          <div className="flex-1 flex overflow-hidden min-w-0">
            {/* Editor Panel */}
            <div className={`flex-col border-r border-[#111] min-w-0 ${
              layoutMode === 'split' ? 'w-1/2 flex' : 
              layoutMode === 'editor' ? 'w-full flex' : 'hidden'
            }`}>
              {activeFile ? (
                <>
                  <div className="h-9 bg-[#252526] flex items-center border-b border-[#111] shrink-0 overflow-x-auto">
                    <div className="px-4 h-full flex items-center bg-[#1e1e1e] border-r border-[#111] text-xs text-white">
                      {activeFile.name} <span className="ml-2 opacity-50 cursor-pointer">×</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden relative">
                     <Editor 
                      content={activeFile.content}
                      language={activeFile.language}
                      theme={theme}
                      onChange={handleEditorChange}
                     />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[#858585] bg-[#1e1e1e]">
                  <FileCode className="w-16 h-16 mb-4 opacity-20" />
                  <p>Pilih atau buat file untuk mulai coding</p>
                </div>
              )}
            </div>

            {/* Preview Panel (Desktop Split) */}
            <div className={`flex-col min-w-0 bg-white relative ${
              layoutMode === 'split' ? 'w-1/2 flex' : 
              layoutMode === 'preview' ? 'w-full flex' : 'hidden'
            }`}>
              <div className="flex-1 overflow-hidden relative checkerboard-bg">
                <LivePreview files={files} activeFileConfig={activeFile ? { id: activeFile.id, name: activeFile.name } : undefined} />
              </div>
            </div>
          </div>

          {/* Bottom Console Panel */}
          <div className={`shrink-0 border-t border-[#333] bg-[#1e1e1e] flex flex-col transition-all duration-300 ${isConsoleOpen ? 'h-40' : 'h-8'} overflow-hidden`}>
            <ConsoleOutput isOpen={isConsoleOpen} onToggle={() => setIsConsoleOpen(!isConsoleOpen)} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-6 bg-[#007acc] text-white flex items-center px-3 justify-between text-[10px] shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center">
            <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 10-2 0v1a1 1 0 102 0zM13.657 15.657l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 101.414 1.414zM16 12a1 1 0 11-2 0 1 1 0 012 0z"/></svg> 
            Main
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>{activeFile?.language.toUpperCase() || 'TEXT'}</span>
          <span>Prettier: ✓</span>
        </div>
      </footer>

      {/* Guidebook Modal */}
      {isGuidebookOpen && (
        <Guidebook onClose={() => setIsGuidebookOpen(false)} />
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .checkerboard-bg {
          background-image: 
            linear-gradient(45deg, rgba(100,100,100,0.05) 25%, transparent 25%), 
            linear-gradient(-45deg, rgba(100,100,100,0.05) 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, rgba(100,100,100,0.05) 75%), 
            linear-gradient(-45deg, transparent 75%, rgba(100,100,100,0.05) 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}} />
    </div>
  );
}
