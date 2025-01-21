import { useState, useCallback } from "react";

interface MediaCardProps {
  imageUrl?: string | null;
  fallbackImage: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function MediaCard({
  imageUrl,
  fallbackImage,
  className = "",
  onLoad,
  onError,
}: MediaCardProps) {
  const [currentImage, setCurrentImage] = useState<string>(
    imageUrl || fallbackImage
  );
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = useCallback(() => {
    console.warn("Image load failed, falling back to default:", fallbackImage);
    setCurrentImage(fallbackImage);
    setIsLoading(false);
    onError?.();
  }, [fallbackImage, onError]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  return (
    <div
      className={`relative w-full h-48 lg:h-full overflow-hidden ${className}`}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
        </div>
      ) : null}
      <img
        src={currentImage}
        alt="Article thumbnail"
        className={`w-full h-full object-cover ${
          isLoading ? "invisible" : "visible"
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
}
