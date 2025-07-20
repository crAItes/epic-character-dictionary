'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, Character, Dictionary } from '@/lib/api';
import { Plus, Search, Filter, ArrowLeft, Users, Edit, Trash2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter, useParams } from 'next/navigation';

export default function DictionaryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const dictionaryId = params.id as string;
  
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    if (dictionaryId) {
      fetchDictionaryData();
    }
  }, [dictionaryId]);

  const fetchDictionaryData = async () => {
    try {
      const [dictionariesData, charactersData] = await Promise.all([
        api.getDictionaries(),
        api.getCharacters(dictionaryId)
      ]);
      
      const currentDictionary = dictionariesData.find(d => d.id === dictionaryId);
      setDictionary(currentDictionary || null);
      setCharacters(charactersData);
    } catch (error) {
      console.error('Error fetching dictionary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.race?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.occupation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterTag || 
                         character.personalityTraits?.some(trait => 
                           trait.toLowerCase().includes(filterTag.toLowerCase())
                         ) ||
                         character.race?.toLowerCase().includes(filterTag.toLowerCase()) ||
                         character.occupation?.toLowerCase().includes(filterTag.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  const getAllTags = () => {
    const tags = new Set<string>();
    characters.forEach(character => {
      if (character.race) tags.add(character.race);
      if (character.occupation) tags.add(character.occupation);
      character.personalityTraits?.forEach(trait => tags.add(trait));
    });
    return Array.from(tags).sort();
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!dictionary) {
    return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Dictionary not found
            </h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-indigo-600 hover:text-indigo-500"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {dictionary.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {dictionary.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {dictionary.genre}
                </span>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{dictionary.characterCount}/{dictionary.maxCharacters} characters</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search characters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Tags</option>
              {getAllTags().map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => router.push(`/character/new?dictionaryId=${dictionaryId}`)}
            disabled={dictionary.characterCount >= dictionary.maxCharacters}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Character
          </button>
        </div>

        {filteredCharacters.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || filterTag ? 'No characters found' : 'No characters yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filterTag 
                ? 'Try adjusting your search or filter'
                : 'Get started by creating your first character'
              }
            </p>
            {!searchTerm && !filterTag && dictionary.characterCount < dictionary.maxCharacters && (
              <button
                onClick={() => router.push(`/character/new?dictionaryId=${dictionaryId}`)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Character
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharacters.map((character) => (
              <div
                key={character.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {character.name}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/character/${character.id}?dictionaryId=${dictionaryId}`)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {character.age && (
                      <p><span className="font-medium">Age:</span> {character.age}</p>
                    )}
                    {character.race && (
                      <p><span className="font-medium">Race:</span> {character.race}</p>
                    )}
                    {character.occupation && (
                      <p><span className="font-medium">Occupation:</span> {character.occupation}</p>
                    )}
                    {character.alignment && (
                      <p><span className="font-medium">Alignment:</span> {character.alignment}</p>
                    )}
                  </div>
                  
                  {character.physicalDescription && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {character.physicalDescription}
                    </p>
                  )}
                  
                  {character.personalityTraits && character.personalityTraits.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {character.personalityTraits.slice(0, 3).map((trait, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {trait}
                        </span>
                      ))}
                      {character.personalityTraits.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          +{character.personalityTraits.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
