import { useRef, useState, useEffect } from 'react';
import { Paintbrush, Eraser, Square, Circle, Minus, Trash2, Download, Undo } from 'lucide-react';

type Tool = 'brush' | 'eraser' | 'rectangle' | 'circle' | 'line';

const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#800000',
  '#000080', '#808080', '#C0C0C0', '#FFC0CB'
];

const BRUSH_SIZES = [2, 4, 8, 12, 20];

export function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fill with white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state
    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setHistory(prev => [...prev.slice(-20), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop();
    const lastState = newHistory[newHistory.length - 1];
    ctx.putImageData(lastState, 0, 0);
    setHistory(newHistory);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pos = getPos(e);
    setLastPos(pos);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPos = getPos(e);

    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'brush' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(currentPos.x, currentPos.y);
      ctx.stroke();
    }

    setLastPos(currentPos);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-secondary/50 border-b border-border">
        {/* File operations */}
        <button 
          onClick={clearCanvas}
          className="p-2 rounded hover:bg-secondary transition-colors"
          title="Clear canvas"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button 
          onClick={undo}
          className="p-2 rounded hover:bg-secondary transition-colors"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button 
          onClick={downloadCanvas}
          className="p-2 rounded hover:bg-secondary transition-colors"
          title="Save"
        >
          <Download className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Tools */}
        <button 
          onClick={() => setTool('brush')}
          className={`p-2 rounded transition-colors ${tool === 'brush' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
          title="Brush"
        >
          <Paintbrush className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setTool('eraser')}
          className={`p-2 rounded transition-colors ${tool === 'eraser' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
          title="Eraser"
        >
          <Eraser className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setTool('line')}
          className={`p-2 rounded transition-colors ${tool === 'line' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
          title="Line"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setTool('rectangle')}
          className={`p-2 rounded transition-colors ${tool === 'rectangle' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
          title="Rectangle"
        >
          <Square className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setTool('circle')}
          className={`p-2 rounded transition-colors ${tool === 'circle' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
          title="Circle"
        >
          <Circle className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Brush sizes */}
        <div className="flex items-center gap-1">
          {BRUSH_SIZES.map(size => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                brushSize === size ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
              }`}
              title={`Size: ${size}px`}
            >
              <div 
                className="rounded-full bg-current"
                style={{ width: Math.min(size, 16), height: Math.min(size, 16) }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex">
        {/* Color palette - left sidebar */}
        <div className="w-12 p-2 bg-secondary/30 border-r border-border flex flex-col gap-1">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-5 rounded border-2 transition-all ${
                color === c ? 'border-foreground scale-110' : 'border-border hover:scale-105'
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-secondary/20 p-4 overflow-auto">
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-white rounded shadow-lg cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="h-6 px-3 bg-secondary/50 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
        <span>Tool: {tool}</span>
        <span>Size: {brushSize}px</span>
        <span className="flex items-center gap-1">
          Color: 
          <span 
            className="w-4 h-3 rounded border border-border" 
            style={{ backgroundColor: color }}
          />
        </span>
      </div>
    </div>
  );
}
