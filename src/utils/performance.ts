// Utilidades de rendimiento

// Lazy loading de imágenes
export const lazyLoadImage = (src: string, placeholder?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

// Debounce para optimizar búsquedas
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle para eventos de scroll
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Comprimir imágenes antes de subir
export const compressImage = (file: File, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo aspect ratio
      const maxWidth = 1200;
      const maxHeight = 1200;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Preload de recursos críticos
export const preloadResource = (url: string, type: 'image' | 'script' | 'style'): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to preload: ${url}`));
    
    document.head.appendChild(link);
  });
};

// Medir rendimiento
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  const start = performance.now();
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.then(() => {
      const end = performance.now();
      console.log(`[PERFORMANCE] ${name}: ${end - start}ms`);
    });
  } else {
    const end = performance.now();
    console.log(`[PERFORMANCE] ${name}: ${end - start}ms`);
  }
};

// Cache en memoria con TTL
class MemoryCache {
  private cache = new Map<string, { value: any; expires: number }>();
  
  set(key: string, value: any, ttlMs: number = 300000): void {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttlMs
    });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  clear(): void {
    this.cache.clear();
  }
}

export const memoryCache = new MemoryCache();

// Optimizar WebP
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Convertir imagen a WebP si es compatible
export const convertToWebP = async (imageUrl: string): Promise<string> => {
  const isWebPSupported = await supportsWebP();
  
  if (!isWebPSupported) {
    return imageUrl;
  }
  
  // Si la URL ya es WebP, devolverla
  if (imageUrl.includes('.webp') || imageUrl.includes('format=webp')) {
    return imageUrl;
  }
  
  // Para URLs de Readdy AI, agregar parámetro de formato
  if (imageUrl.includes('readdy.ai/api/search-image')) {
    return imageUrl + '&format=webp';
  }
  
  return imageUrl;
};

// Intersection Observer para lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
};