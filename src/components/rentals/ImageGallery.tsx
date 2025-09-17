import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, LayoutGrid, X, Maximize2 } from "lucide-react";

type ImageGalleryProps = {
  images: string[];
  alt: string;
};

const fallbackSrc = "/placeholder.svg";

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const validImages = (images && images.length > 0 ? images : [fallbackSrc]).filter(Boolean);
  const [selected, setSelected] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'gallery' | 'grid'>('gallery');
  const mainRef = React.useRef<HTMLImageElement | null>(null);

  const showPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelected((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };
  
  const showNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelected((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  React.useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (!open) return;
      if (ev.key === "ArrowLeft") showPrev();
      if (ev.key === "ArrowRight") showNext();
      if (ev.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, validImages.length]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget as HTMLImageElement;
    if (target.src !== window.location.origin + fallbackSrc) {
      target.src = fallbackSrc;
    }
  };

  const openGallery = () => {
    setOpen(true);
    setViewMode('gallery');
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Booking Platform Style Image Layout */}
      <div className="grid grid-cols-4 gap-3 h-[420px]">
        {/* Main large image - takes 2x2 grid with proper aspect ratio */}
        <div className="col-span-2 row-span-2">
          <button
            onClick={openGallery}
            className="relative w-full h-full rounded-xl overflow-hidden bg-gray-100 hover:brightness-95 transition-all duration-300 group shadow-sm"
            aria-label="Open photo gallery"
          >
            <img
              ref={mainRef}
              src={validImages[0]}
              alt={`${alt} main view`}
              loading="eager"
              decoding="async"
              onError={handleError}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/5 group-hover:to-black/10 transition-all duration-300"></div>
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
              <Maximize2 className="h-4 w-4 text-gray-700" />
            </div>
          </button>
        </div>

        {/* Small images on the right - consistent aspect ratios */}
        {validImages.slice(1, 5).map((src, idx) => (
          <div key={idx + 1} className="relative aspect-[4/3]">
            <button
              onClick={() => {
                setSelected(idx + 1);
                openGallery();
              }}
              className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100 hover:brightness-95 transition-all duration-300 group shadow-sm"
              aria-label={`Open image ${idx + 2}`}
            >
              <img
                src={src}
                alt={`${alt} ${idx + 2}`}
                loading="lazy"
                decoding="async"
                onError={handleError}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
              {idx === 3 && validImages.length > 5 && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center text-white font-medium rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold">+{validImages.length - 5}</div>
                    <div className="text-xs opacity-90">more photos</div>
                  </div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* View All Photos Button */}
      <div className="flex justify-center">
        <Button
          onClick={openGallery}
          variant="outline"
          className="gap-2 hover:bg-gray-50 transition-colors"
        >
          <LayoutGrid className="h-4 w-4" />
          View all {validImages.length} photos
        </Button>
      </div>

      {/* Enhanced Gallery Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-screen-2xl w-[95vw] p-0 bg-white h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'gallery' ? 'grid' : 'gallery')}
                className="gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                {viewMode === 'gallery' ? 'Grid View' : 'Gallery View'}
              </Button>
              <span className="text-sm text-gray-600">
                {selected + 1} of {validImages.length}
              </span>
            </div>
            {/* Removed top close button */}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {viewMode === 'gallery' ? (
              /* Gallery View - Large image with thumbnails */
              <div className="h-full flex flex-col">
                {/* Enhanced Main image area with better aspect ratio handling */}
                <div className="flex-1 relative bg-white flex items-center justify-center p-6">
                  <div className="relative max-h-full max-w-full flex items-center justify-center">
                    <img
                      key={`gallery-${selected}`}
                      src={validImages[selected]}
                      alt={`${alt} ${selected + 1}`}
                      onError={handleError}
                      className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                      style={{ 
                        maxHeight: 'calc(100vh - 300px)',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                  
                  {/* Navigation arrows */}
                  {validImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-100/90 hover:bg-gray-200/90 text-gray-700 border-0 shadow-md"
                        onClick={showPrev}
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-100/90 hover:bg-gray-200/90 text-gray-700 border-0 shadow-md"
                        onClick={showNext}
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Enhanced Thumbnail strip with consistent sizing */}
                <div className="bg-white border-t p-4">
                  <div className="flex gap-3 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'thin' }}>
                    {validImages.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelected(idx)}
                        className={`relative flex-shrink-0 w-24 h-18 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          selected === idx 
                            ? 'border-[#b94a3b] shadow-lg ring-2 ring-[#b94a3b]/20 scale-105' 
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                        style={{ aspectRatio: '4/3' }}
                        aria-label={`Select image ${idx + 1}`}
                      >
                        <img
                          src={src}
                          alt={`${alt} thumbnail ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          onError={handleError}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        {selected === idx && (
                          <div className="absolute inset-0 bg-[#b94a3b]/10 flex items-center justify-center">
                            <div className="w-3 h-3 bg-[#b94a3b] rounded-full shadow-sm"></div>
                          </div>
                        )}
                        {selected !== idx && (
                          <div className="absolute inset-0 hover:bg-black/5 transition-colors duration-200"></div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Bottom Close Button */}
                  <div className="flex justify-center">
                    <DialogClose asChild>
                      <Button variant="outline" className="gap-2 px-6">
                        <X className="h-4 w-4" />
                        Close Gallery
                      </Button>
                    </DialogClose>
                  </div>
                </div>
              </div>
            ) : (
              /* Enhanced Grid View with consistent proportions */
              <div className="h-full overflow-auto p-6">
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mb-8">
                  {validImages.map((src, idx) => (
                    <button
                      key={`grid-${idx}`}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#b94a3b] transition-all duration-300 hover:shadow-xl group bg-gray-50"
                      onClick={() => {
                        setSelected(idx);
                        setViewMode('gallery');
                      }}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={src}
                        alt={`${alt} ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        onError={handleError}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/5 group-hover:to-black/10 transition-all duration-300"></div>
                      
                      {/* Image number indicator */}
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {idx + 1}
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg">
                          <Maximize2 className="h-5 w-5 text-gray-700" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Bottom Close Button for Grid View */}
                <div className="flex justify-center pb-6">
                  <DialogClose asChild>
                    <Button variant="outline" className="gap-2 px-6">
                      <X className="h-4 w-4" />
                      Close Gallery
                    </Button>
                  </DialogClose>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;


