import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface CreateOrderData {
  userId?: string;
  guestEmail?: string;
  guestPhone?: string;
  purchaseType: 'ONE_TIME' | 'SUBSCRIPTION';
  subscriptionType?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  subscriptionId?: string;
  items: Array<{
    productId: string;
    quantity: number;
    priceCents: number;
    subscriptionType?: string;        // Item-level: individual item subscription
    requestedDeliveryDate?: Date;     // Item-level: individual item delivery date
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    phone?: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    phone?: string;
  };
  deliveryType: 'STANDARD' | 'EXPRESS' | 'NEXT_DAY' | 'PICKUP';
  deliveryNotes?: string;
  requestedDeliveryDate?: Date;       // Order-level: default/primary delivery date
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  purchaseType: string;
  subscriptionType?: string;        // Order-level subscription type
  totalCents: number;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  createdAt: string;
  deliveryType?: string;
  requestedDeliveryDate?: string;   // Order-level delivery date
  shippingFirstName?: string;
  shippingLastName?: string;
  shippingStreet1?: string;
  shippingStreet2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZipCode?: string;
  shippingCountry?: string;
  shippingPhone?: string;
  billingFirstName?: string;
  billingLastName?: string;
  billingStreet1?: string;
  billingStreet2?: string;
  billingCity?: string;
  billingState?: string;
  billingZipCode?: string;
  billingCountry?: string;
  billingPhone?: string;
  user?: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    priceCents: number;
    subscriptionType?: string;        // Item-level subscription type
    requestedDeliveryDate?: string;   // Item-level delivery date
    product: {
      id: string;
      name: string;
      imageUrl: string | null;
      priceCents: number;
    };
  }>;
  payments?: Array<{
    id: string;
  }>;
}

class OrderService {
  /**
   * Create authorization headers from JWT token
   * @param token - Optional JWT access token for authenticated requests
   */
  private getAuthHeader = (token?: string) => {
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {}; // Guest checkout - no auth header
  };

  /**
   * Reusable error handler wrapper for API requests
   */
  private async handleRequest<T>(
    requestFn: () => Promise<any>,
    errorMessage: string
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      console.error(errorMessage, error);
      throw error;
    }
  }

  async createOrder(orderData: CreateOrderData, token?: string): Promise<Order> {
    return this.handleRequest<Order>(
      async () => {
        const headers = this.getAuthHeader(token);
        const response = await axios.post(`${API_URL}/orders`, orderData, { headers });
        return response.data.data;
      },
      'Error creating order:'
    );
  }

  async getOrder(orderId: string, token?: string): Promise<Order> {
    return this.handleRequest<Order>(
      async () => {
        const headers = this.getAuthHeader(token);
        const response = await axios.get(`${API_URL}/orders/${orderId}`, { headers });
        return response.data.data;
      },
      'Error fetching order:'
    );
  }

  async confirmOrder(
    orderId: string,
    paymentIntentId: string,
    token?: string
  ): Promise<Order> {
    return this.handleRequest<Order>(
      async () => {
        const headers = this.getAuthHeader(token);
        const response = await axios.post(
          `${API_URL}/orders/${orderId}/confirm`,
          { paymentIntentId },
          { headers }
        );
        return response.data.data;
      },
      'Error confirming order:'
    );
  }

  /**
   * Get paginated order history for authenticated user
   * @param token - JWT access token (required for this endpoint)
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   */
  async getUserOrders(token: string, page: number = 1, limit: number = 10): Promise<OrdersResponse> {
    return this.handleRequest<OrdersResponse>(
      async () => {
        const headers = this.getAuthHeader(token);
        const response = await axios.get(`${API_URL}/orders/user`, {
          params: { page, limit },
          headers,
        });
        return response.data;
      },
      'Error fetching user orders:'
    );
  }
}

export default new OrderService();