import React, { useState } from 'react';
import { FileCode, FileImage, FileTerminal, FileText, Plus, Trash2, Edit2, Upload } from 'lucide-react';
import { AppFile } from '../lib/fileSystem';

interface SidebarProps {
  files: AppFile[];
  activeFileId: string | null;
  onFileSelect: (id: string) => void;
  onFileCreate: (name: string) => void;
  onFileDelete: (id: string) => void;
  onFileRename: (id: string, newName: string) => void;
  onFileUpload: (file: AppFile) => void;
}

export default function Sidebar({ files, activeFileId, onFileSelect, onFileCreate, onFileDelete, onFileRename, onFileUpload }: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim()) {
      onFileCreate(newFileName.trim());
      setNewFileName('');
      setIsCreating(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (editName.trim()) {
      onFileRename(id, editName.trim());
      setEditingId(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const fileInfo = fileList[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onFileUpload({
        id: Math.random().toString(36).substring(2, 9),
        name: fileInfo.name,
        content: content,
        language: '' // will be assigned in parent
      });
    };
    reader.readAsText(fileInfo);
  };

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'html') return <FileCode className="text-orange-500 w-4 h-4" />;
    if (ext === 'css') return <FileCode className="text-blue-500 w-4 h-4" />;
    if (ext === 'js' || ext === 'jsx' || ext === 'ts') return <FileTerminal className="text-yellow-500 w-4 h-4" />;
    if (ext === 'json') return <FileText className="text-green-500 w-4 h-4" />;
    if (ext === 'svg' || ext === 'png') return <FileImage className="text-purple-500 w-4 h-4" />;
    return <FileText className="text-gray-500 w-4 h-4" />;
  };

  return (
    <div className="w-full h-full bg-[#252526] flex flex-col border-r border-[#111] select-none">
      <div className="p-3 text-[11px] font-bold text-[#858585] uppercase tracking-wider flex justify-between items-center border-b border-[#111]">
        <span>Explorer</span>
        <div className="flex gap-1">
          <button 
            onClick={() => setIsCreating(true)}
            className="p-1 hover:bg-[#3e3e3e] rounded text-[#cccccc] transition-colors"
            title="New File"
          >
            <Plus className="w-4 h-4" />
          </button>
          <label 
            className="p-1 hover:bg-[#3e3e3e] rounded text-[#cccccc] transition-colors cursor-pointer inline-block"
            title="Upload/Import Local File"
          >
            <Upload className="w-4 h-4" />
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isCreating && (
          <form onSubmit={handleCreateSubmit} className="mb-2 px-1">
            <input
              autoFocus
              type="text"
              className="w-full bg-[#1e1e1e] border border-[#007acc] rounded px-2 py-1 text-sm outline-none text-[#cccccc]"
              placeholder="e.g., app.js"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onBlur={() => setIsCreating(false)}
            />
          </form>
        )}

        <ul className="space-y-0.5">
          {files.map(f => (
            <li key={f.id} className="group relative">
              {editingId === f.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, f.id)} className="px-1">
                  <input
                    autoFocus
                    type="text"
                    className="w-full bg-[#1e1e1e] border border-[#007acc] rounded px-2 py-1 text-sm outline-none text-[#cccccc]"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={(e) => handleEditSubmit(e, f.id)}
                  />
                </form>
              ) : (
                <div 
                  className={`flex items-center gap-2 p-1 px-2 text-sm rounded cursor-pointer transition-colors ${
                    activeFileId === f.id 
                      ? 'bg-[#37373d] text-white' 
                      : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                  }`}
                  onClick={() => onFileSelect(f.id)}
                >
                  <span className="flex-shrink-0">{getFileIcon(f.name)}</span>
                  <span className="truncate flex-1">{f.name}</span>
                  
                  <div className="hidden group-hover:flex items-center bg-[#2a2d2e] rounded absolute right-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditName(f.name); setEditingId(f.id); }}
                      className="p-1 hover:text-white transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onFileDelete(f.id); }}
                      className="p-1 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 bg-[#1e1e1e] m-2 rounded-lg border border-[#333] text-[10px] text-[#cccccc]">
        <div className="text-blue-400 mb-1 font-bold">TIPS HARI INI</div>
        Gunakan Ctrl+S untuk menyimpan progress secara instan.
      </div>
    </div>
  );
}
