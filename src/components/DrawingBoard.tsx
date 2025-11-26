import { useRef, useState, useEffect } from 'react';
import { Toolbar } from './Toolbar';
import { StickyNote } from './StickyNote';
import { StickyNotesList } from './StickyNotesList';

export interface Note {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
  author: string;
}

export interface DrawingPoint {
  x: number;
  y: number;
  color: string;
  size: number;
}

export function DrawingBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Bem-vindo! 👋\nClique para editar',
      x: 100,
      y: 100,
      color: '#fef08a',
      author: 'Sistema'
    }
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: 'Nova nota...',
      x: Math.random() * (window.innerWidth - 250) + 50,
      y: Math.random() * (window.innerHeight - 250) + 50,
      color: ['#fef08a', '#bfdbfe', '#fecaca', '#bbf7d0', '#e9d5ff'][Math.floor(Math.random() * 5)],
      author: 'Você'
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id: string, content: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const moveNote = (id: string, x: number, y: number) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, x, y } : note
    ));
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Toolbar
        color={color}
        onColorChange={setColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        tool={tool}
        onToolChange={setTool}
        onClear={clearCanvas}
        onAddNote={addNote}
      />

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="absolute inset-0 cursor-crosshair"
      />

      {notes.map(note => (
        <StickyNote
          key={note.id}
          note={note}
          onUpdate={updateNote}
          onDelete={deleteNote}
          onMove={moveNote}
        />
      ))}

      <StickyNotesList notes={notes} />
    </div>
  );
}
