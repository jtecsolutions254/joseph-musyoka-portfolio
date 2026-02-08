import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Maximize, Download, Share2, Trash2, Info } from 'lucide-react';

const sampleImages = [
  {
    id: 1,
    name: 'Project Screenshot 1',
    description: 'Student Management System Dashboard',
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 2,
    name: 'Project Screenshot 2',
    description: 'E-Commerce Product Listing',
    color: 'from-green-500 to-teal-600',
  },
  {
    id: 3,
    name: 'Project Screenshot 3',
    description: 'Weather App Interface',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 4,
    name: 'Portfolio Design',
    description: 'Windows 11 Inspired UI',
    color: 'from-primary to-primary/60',
  },
];

export function MediaViewerApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const currentImage = sampleImages[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + sampleImages.length) % sampleImages.length);
    setZoom(100);
    setRotation(0);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % sampleImages.length);
    setZoom(100);
    setRotation(0);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="h-full flex flex-col -m-6 bg-black/95">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-black/80 border-b border-white/10">
        <div className="flex items-center gap-1">
          <button 
            onClick={handleZoomOut}
            className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-white/60 w-16 text-center">{zoom}%</span>
          <button 
            onClick={handleZoomIn}
            className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button 
            onClick={handleRotate}
            className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button 
            className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        <div className="text-sm text-white/80">
          {currentImage.name}
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded transition-colors ${showInfo ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}
            title="Info"
          >
            <Info className="w-4 h-4" />
          </button>
          <button 
            className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button 
            className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Previous button */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white/80 hover:text-white transition-all hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Image placeholder */}
        <div 
          className={`bg-gradient-to-br ${currentImage.color} rounded-lg shadow-2xl flex items-center justify-center transition-all duration-300`}
          style={{
            width: `${3.5 * zoom}px`,
            height: `${2.5 * zoom}px`,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div className="text-center text-white p-8">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold">{currentImage.name}</h3>
            <p className="text-sm opacity-80 mt-2">{currentImage.description}</p>
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={goToNext}
          className="absolute right-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white/80 hover:text-white transition-all hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Info panel */}
        {showInfo && (
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-black/80 border-l border-white/10 p-4 text-white">
            <h3 className="font-semibold mb-4">File information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-white/60">Name:</span>
                <p>{currentImage.name}</p>
              </div>
              <div>
                <span className="text-white/60">Description:</span>
                <p>{currentImage.description}</p>
              </div>
              <div>
                <span className="text-white/60">Type:</span>
                <p>JPEG Image</p>
              </div>
              <div>
                <span className="text-white/60">Dimensions:</span>
                <p>1920 x 1080</p>
              </div>
              <div>
                <span className="text-white/60">Size:</span>
                <p>2.4 MB</p>
              </div>
              <div>
                <span className="text-white/60">Date taken:</span>
                <p>December 15, 2024</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="h-20 bg-black/80 border-t border-white/10 flex items-center justify-center gap-2 px-4">
        {sampleImages.map((img, index) => (
          <button
            key={img.id}
            onClick={() => {
              setCurrentIndex(index);
              setZoom(100);
              setRotation(0);
            }}
            className={`w-16 h-12 rounded-lg bg-gradient-to-br ${img.color} transition-all ${
              index === currentIndex 
                ? 'ring-2 ring-white scale-110' 
                : 'opacity-60 hover:opacity-100'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
