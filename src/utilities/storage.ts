// Utility for handling large data storage using IndexedDB
class StorageManager {
  private isIndexedDBSupported(): boolean {
    return 'indexedDB' in window && window.indexedDB !== null;
  }
  private dbName = 'DariaColorsDB';
  private version = 1;
  private storeName = 'imageData';

  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  // Convert File to base64 data URL
  private async fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  // Store uploaded image locally without backend upload
  async storeLocalImage(file: File): Promise<void> {
    if (!this.isIndexedDBSupported()) {
      console.warn('IndexedDB not supported, falling back to localStorage only');
      try {
        const dataURL = await this.fileToDataURL(file);
        const manualData = { backgroundRemovedImage: dataURL };
        localStorage.setItem('manualData', JSON.stringify(manualData));
      } catch (error) {
        throw new Error('Storage quota exceeded. Please try using a smaller image or clear browser data.');
      }
      return;
    }

    try {
      // Convert file to data URL
      const dataURL = await this.fileToDataURL(file);
      
      // Store image in IndexedDB
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      await new Promise((resolve, reject) => {
        const request = store.put(dataURL, 'backgroundRemovedImage');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      // Store minimal data in localStorage
      const manualData = { imageStored: true };
      localStorage.setItem('manualData', JSON.stringify(manualData));
      
    } catch (error) {
      console.error('Error storing local image:', error);
      throw error;
    }
  }

  async storeManualData(data: any): Promise<void> {
    if (!this.isIndexedDBSupported()) {
      console.warn('IndexedDB not supported, falling back to localStorage only');
      try {
        localStorage.setItem('manualData', JSON.stringify(data));
      } catch (error) {
        throw new Error('Storage quota exceeded. Please try using a smaller image or clear browser data.');
      }
      return;
    }

    try {
      // Separate image data from other data
      const { backgroundRemovedImage, ...otherData } = data;
      
      // Store image in IndexedDB
      if (backgroundRemovedImage) {
        const db = await this.getDB();
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        await new Promise((resolve, reject) => {
          const request = store.put(backgroundRemovedImage, 'backgroundRemovedImage');
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      }
      
      // Store other data in localStorage
      localStorage.setItem('manualData', JSON.stringify(otherData));
      
    } catch (error) {
      console.error('Error storing manual data:', error);
      throw error;
    }
  }

  async getManualData(): Promise<any> {
    if (!this.isIndexedDBSupported()) {
      // Fallback to localStorage only
      try {
        const storedData = localStorage.getItem('manualData');
        return storedData ? JSON.parse(storedData) : null;
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
        localStorage.removeItem('manualData');
        return null;
      }
    }

    try {
      // Get other data from localStorage
      const storedData = localStorage.getItem('manualData');
      if (!storedData) return null;
      
      const parsedData = JSON.parse(storedData);
      
      // Get image from IndexedDB
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      const backgroundRemovedImage = await new Promise((resolve, reject) => {
        const request = store.get('backgroundRemovedImage');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      return {
        ...parsedData,
        backgroundRemovedImage: backgroundRemovedImage || '/results-women.png'
      };
      
    } catch (error) {
      console.error('Error retrieving manual data:', error);
      return null;
    }
  }

  async clearManualData(): Promise<void> {
    try {
      // Clear localStorage
      localStorage.removeItem('manualData');
      
      // Clear IndexedDB
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      await new Promise((resolve, reject) => {
        const request = store.delete('backgroundRemovedImage');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error clearing manual data:', error);
    }
  }
}

export const storageManager = new StorageManager();
