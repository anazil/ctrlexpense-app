import AuthService from './authService';
import config from '../config.js';

const API_BASE_URL = config.API_BASE_URL;

class TransactionService {
  async getTransactions(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.amount_min) params.append('amount_min', filters.amount_min);
      if (filters.amount_max) params.append('amount_max', filters.amount_max);
      
      const queryString = params.toString();
      const url = queryString ? `/transactions/?${queryString}` : '/transactions/';
      
      const response = await AuthService.apiCall(url);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch transactions');
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async createTransaction(transactionData) {
    try {
      const response = await AuthService.apiCall('/transactions/', {
        method: 'POST',
        body: JSON.stringify(transactionData),
      });
      
      if (response.ok) {
        return { success: true, data: await response.json() };
      } else {
        const error = await response.json();
        return { success: false, error: error.message || 'Failed to create transaction' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async getCategories() {
    try {
      const response = await AuthService.apiCall('/categories/');
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
}

export default new TransactionService();