import { Pen, Eraser, Trash2, StickyNote as StickyNoteIcon } from 'lucide-react';

interface ToolbarProps {
  color: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  tool: 'pen' | 'eraser';
  onToolChange: (tool: 'pen' | 'eraser') => void;
  onClear: () => void;
  onAddNote: () => void;
}

const COLORS = [
  '#000000',
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
];

export function Toolbar({
  color,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  tool,
  onToolChange,
  onClear,
  onAddNote,
}: ToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-4">
      {/* Drawing Tools */}
      <div className="flex gap-2">
        <button
          onClick={() => onToolChange('pen')}
          className={`p-2 rounded-lg transition-colors ${
            tool === 'pen' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
          }`}
          title="Caneta"
        >
          <Pen className="w-5 h-5" />
        </button>
        <button
          onClick={() => onToolChange('eraser')}
          className={`p-2 rounded-lg transition-colors ${
            tool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
          }`}
          title="Borracha"
        >
          <Eraser className="w-5 h-5" />
        </button>
      </div>

      <div className="w-px h-8 bg-gray-200" />

      {/* Colors */}
      <div className="flex gap-2">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              color === c ? 'border-gray-400 scale-110' : 'border-gray-200'
            }`}
            style={{ backgroundColor: c }}
            title={`Cor: ${c}`}
          />
        ))}
      </div>

      <div className="w-px h-8 bg-gray-200" />

      {/* Brush Size */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Tamanho:</span>
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          className="w-24"
        />
        <span className="text-sm text-gray-600 w-8">{brushSize}</span>
      </div>

      <div className="w-px h-8 bg-gray-200" />

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onAddNote}
          className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
          title="Adicionar Nota"
        >
          <StickyNoteIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onClear}
          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
          title="Limpar Desenho"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
