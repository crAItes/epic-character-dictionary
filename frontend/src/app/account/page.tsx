'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, Users, Zap, ArrowLeft } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';

interface PlanInfo {
  name: string;
  maxCharacters: number;
  price: string;
  features: string[];
  current: boolean;
}

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [characterUsage, setCharacterUsage] = useState({ used: 0, total: 20 });

  const plans: PlanInfo[] = [
    {
      name: 'Free',
      maxCharacters: 20,
      price: '$0/month',
      features: [
        'Up to 20 characters',
        'Basic character fields',
        'Simple organization',
        'Export to text'
      ],
      current: currentPlan === 'free'
    },
    {
      name: 'Creator Pro',
      maxCharacters: 50,
      price: '$9.99/month',
      features: [
        'Up to 50 characters',
        'Advanced character fields',
        'Custom tags and categories',
        'Export to multiple formats',
        'Character relationship mapping',
        'Priority support'
      ],
      current: currentPlan === 'pro'
    },
    {
      name: 'Studio Ultra',
      maxCharacters: 300,
      price: '$19.99/month',
      features: [
        'Up to 300 characters',
        'All Creator Pro features',
        'Team collaboration',
        'Advanced analytics',
        'API access',
        'Custom integrations',
        'Dedicated support'
      ],
      current: currentPlan === 'ultra'
    }
  ];

  useEffect(() => {
    setCurrentPlan('free');
    setCharacterUsage({ used: 5, total: 20 });
  }, []);

  const handleUpgrade = (planName: string) => {
    console.log(`Upgrading to ${planName} plan`);
    alert(`Upgrade to ${planName} plan would be handled by Stripe integration`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getCurrentPlan = () => {
    return plans.find(plan => plan.current) || plans[0];
  };

  const usagePercentage = (characterUsage.used / characterUsage.total) * 100;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your subscription and account preferences
          </p>
        </div>

        {/* User Info */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Account Information
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
              <p className="text-gray-900 dark:text-white">{user?.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Display Name:</span>
              <p className="text-gray-900 dark:text-white">{user?.displayName || 'Not set'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since:</span>
              <p className="text-gray-900 dark:text-white">
                {user?.metadata?.creationTime ? 
                  new Date(user.metadata.creationTime).toLocaleDateString() : 
                  'Unknown'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Current Plan & Usage */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Current Plan
          </h2>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg mr-3">
                {currentPlan === 'free' && <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
                {currentPlan === 'pro' && <Crown className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
                {currentPlan === 'ultra' && <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getCurrentPlan().name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {getCurrentPlan().price}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Character Usage</span>
              <span>{characterUsage.used} / {characterUsage.total}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>
            {usagePercentage > 80 && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                You're approaching your character limit. Consider upgrading your plan.
              </p>
            )}
          </div>
        </div>

        {/* Available Plans */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Available Plans
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-lg p-6 ${
                  plan.current
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Up to {plan.maxCharacters} characters
                  </p>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {plan.current ? (
                  <button
                    disabled
                    className="w-full py-2 px-4 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.name)}
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  >
                    Upgrade to {plan.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Account Actions
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
