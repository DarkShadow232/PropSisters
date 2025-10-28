import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.propsiss.com/api';

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
  };
}

class ContactService {
  private axiosInstance;

  constructor() {
    console.log('🔗 ContactService: Initializing with base URL:', API_BASE_URL);
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Submit a contact form message
   */
  async submitContact(data: ContactData): Promise<ContactResponse> {
    try {
      const response = await this.axiosInstance.post('/contacts', data);
      return response.data as ContactResponse;
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      throw new Error(error.response?.data?.message || 'Failed to send message. Please try again.');
    }
  }
}

export const contactService = new ContactService();
export default contactService;
