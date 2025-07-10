import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  apartment: string;
}

type MediaFilter = 'all' | 'image' | 'video';

const MediaGrid: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState<MediaFilter>('all');

  useEffect(() => {
    const loadMedia = async () => {
      try {
        // Fetch the list of apartments
        const apartments = ['Ap1', 'Ap2', 'Ap3', 'Ap4', 'Ap5', 'Ap6', 'Ap7', 'Ap8', 'Ap9'];
        const allMedia: MediaItem[] = [];

        for (const apt of apartments) {
          const response = await fetch(`/image/Apartments/${apt}`);
          const files = await response.text();
          const fileList = files.split('\n').filter(Boolean);

          fileList.forEach(file => {
            const extension = file.split('.').pop()?.toLowerCase();
            if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
              allMedia.push({
                type: 'image',
                url: `/image/Apartments/${apt}/${file}`,
                apartment: apt
              });
            } else if (extension === 'mp4' || extension === 'webm') {
              allMedia.push({
                type: 'video',
                url: `/image/Apartments/${apt}/${file}`,
                apartment: apt
              });
            }
          });
        }

        setMediaItems(allMedia);
      } catch (error) {
        console.error('Error loading media:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, []);

  const filteredMedia = mediaItems.filter(item => 
    filter === 'all' || item.type === filter
  );

  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b94a3b]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full transition-colors ${
            filter === 'all' ? 'bg-[#b94a3b] text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('image')}
          className={`px-4 py-2 rounded-full transition-colors ${
            filter === 'image' ? 'bg-[#b94a3b] text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Images
        </button>
        <button
          onClick={() => setFilter('video')}
          className={`px-4 py-2 rounded-full transition-colors ${
            filter === 'video' ? 'bg-[#b94a3b] text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Videos
        </button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredMedia.map((item, index) => (
            <motion.div
              key={item.url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => handleMediaClick(item)}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={`Media from ${item.apartment}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              {selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.url}
                  alt={`Media from ${selectedMedia.apartment}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  className="w-full h-full"
                  controls
                  autoPlay
                />
              )}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaGrid; 