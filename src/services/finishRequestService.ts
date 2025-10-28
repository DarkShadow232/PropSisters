// Finish Request Service
// Handles finish request operations with the backend API

export interface FinishRequestData {
  requestType: string;
  propertyType: string;
  budget: string;
  timeline: string;
  description: string;
  location: string;
  contactPhone: string;
  attachments?: File[];
}

export interface FinishRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  requestType: string;
  propertyType: string;
  budget: string;
  timeline: string;
  description: string;
  location: string;
  contactPhone: string;
  attachments: Array<{
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
  }>;
  status: 'pending' | 'reviewed' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  notes: Array<{
    note: string;
    addedBy: string;
    addedAt: string;
  }>;
  estimatedCost?: number;
  actualCost?: number;
  startDate?: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
}

class FinishRequestService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'https://api.propsiss.com/api';
    console.log('🔗 FinishRequestService: Initializing with base URL:', this.baseUrl);
  }

  /**
   * Create a new finish request
   */
  async createFinishRequest(requestData: FinishRequestData): Promise<{ success: boolean; requestId?: string; error?: string }> {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('requestType', requestData.requestType);
      formData.append('propertyType', requestData.propertyType);
      formData.append('budget', requestData.budget);
      formData.append('timeline', requestData.timeline);
      formData.append('description', requestData.description);
      formData.append('location', requestData.location);
      formData.append('contactPhone', requestData.contactPhone);
      
      // Add files if any
      if (requestData.attachments && requestData.attachments.length > 0) {
        requestData.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      const response = await fetch(`${this.baseUrl}/finish-requests/create`, {
        method: 'POST',
        body: formData,
        credentials: 'include' // Include cookies for session authentication
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create finish request');
      }

      const data = await response.json();
      return {
        success: true,
        requestId: data.requestId
      };

    } catch (error: any) {
      console.error('Error creating finish request:', error);
      return {
        success: false,
        error: error.message || 'Failed to create finish request'
      };
    }
  }

  /**
   * Get finish requests for the current user
   */
  async getUserFinishRequests(userId: string): Promise<{ success: boolean; requests?: FinishRequest[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/finish-requests/user/${userId}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch finish requests');
      }

      const data = await response.json();
      return {
        success: true,
        requests: data.requests
      };

    } catch (error: any) {
      console.error('Error fetching user finish requests:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch finish requests'
      };
    }
  }

  /**
   * Get a specific finish request
   */
  async getFinishRequest(requestId: string): Promise<{ success: boolean; request?: FinishRequest; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/finish-requests/${requestId}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch finish request');
      }

      const data = await response.json();
      return {
        success: true,
        request: data.request
      };

    } catch (error: any) {
      console.error('Error fetching finish request:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch finish request'
      };
    }
  }
}

// Create and export a singleton instance
const finishRequestService = new FinishRequestService();
export default finishRequestService;
