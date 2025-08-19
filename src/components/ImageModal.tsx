import React from 'react';

interface ImageModalProps {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={onClose}>
      <div className="relative max-w-3xl w-full p-4" onClick={e => e.stopPropagation()}>
        <button
          className="absolute top-2 right-2 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full px-2 hover:bg-opacity-80 transition"
          onClick={onClose}
          aria-label="Fechar imagem ampliada"
        >
          &times;
        </button>
        <img src={src} alt={alt} className="w-full h-auto max-h-[80vh] rounded-lg shadow-2xl object-contain bg-white" />
      </div>
    </div>
  );
};

export default ImageModal;
