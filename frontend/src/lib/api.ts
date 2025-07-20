import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Dictionary {
  id: string;
  title: string;
  description: string;
  genre: string;
  tags: string[];
  maxCharacters: number;
  characterCount: number;
  createdAt: string;
}

export interface Character {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  race?: string;
  occupation?: string;
  alignment?: string;
  physicalDescription?: string;
  personalityTraits?: string[];
  powers?: string;
  backstory?: string;
  createdAt: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'free' | 'pro' | 'ultra';
}

export const api = {
  registerUser: async (userData: { uid: string; email: string; displayName: string }) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  getDictionaries: async (): Promise<Dictionary[]> => {
    const response = await apiClient.get('/dictionaries');
    return response.data;
  },

  createDictionary: async (dictionary: Omit<Dictionary, 'id' | 'maxCharacters' | 'characterCount' | 'createdAt'>) => {
    const response = await apiClient.post('/dictionaries', dictionary);
    return response.data;
  },

  getCharacters: async (dictionaryId: string): Promise<Character[]> => {
    const response = await apiClient.get(`/characters/${dictionaryId}`);
    return response.data;
  },

  createCharacter: async (dictionaryId: string, character: Omit<Character, 'id' | 'createdAt'>) => {
    const response = await apiClient.post(`/characters/${dictionaryId}`, character);
    return response.data;
  },
};
