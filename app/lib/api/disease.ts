import axios from 'axios';

export interface DiseaseResponse {
  disease_name: string;
  confidence: number;
  symptoms?: string[];
  treatment?: string;
}

/**
 * Sends an image to the backend for disease prediction
 * @param imageFile - The image file to analyze
 * @returns Promise containing disease prediction data
 */
export const predictDisease = async (imageFile: File): Promise<DiseaseResponse> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await axios.post<DiseaseResponse>('/api/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 413) {
        throw new Error('Image file is too large. Maximum size is 10MB.');
      }
      if (error.response?.status === 503) {
        throw new Error('ML service is temporarily unavailable. Please try again later.');
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
    }

    throw new Error('Failed to analyze image. Please try again.');
  }
};
