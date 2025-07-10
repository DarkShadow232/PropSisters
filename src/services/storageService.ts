import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

// Upload a single image
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Upload multiple images
export const uploadMultipleImages = async (
  files: File[], 
  basePath: string
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) => {
      const uniqueName = `${Date.now()}_${index}_${file.name}`;
      const path = `${basePath}/${uniqueName}`;
      return uploadImage(file, path);
    });
    
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

// Delete an image
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const decodedUrl = decodeURIComponent(imageUrl);
    const startIndex = decodedUrl.indexOf('/o/') + 3;
    const endIndex = decodedUrl.indexOf('?');
    const filePath = decodedUrl.substring(startIndex, endIndex);
    
    const imageRef = ref(storage, filePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Upload property images
export const uploadPropertyImages = async (
  propertyId: string, 
  files: File[]
): Promise<string[]> => {
  const basePath = `properties/${propertyId}`;
  return uploadMultipleImages(files, basePath);
};

// Upload design request images
export const uploadDesignRequestImages = async (
  requestId: string, 
  files: File[]
): Promise<string[]> => {
  const basePath = `design-requests/${requestId}`;
  return uploadMultipleImages(files, basePath);
};

// Upload user profile image
export const uploadUserProfileImage = async (
  userId: string, 
  file: File
): Promise<string> => {
  const path = `users/${userId}/profile_${Date.now()}.${file.name.split('.').pop()}`;
  return uploadImage(file, path);
};

// Get all images in a folder
export const getImagesInFolder = async (folderPath: string): Promise<string[]> => {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);
    
    const urlPromises = result.items.map(itemRef => getDownloadURL(itemRef));
    const urls = await Promise.all(urlPromises);
    
    return urls;
  } catch (error) {
    console.error('Error getting images from folder:', error);
    throw error;
  }
}; 