import React from 'react';
import { Code, Database, Shield, GitBranch } from 'lucide-react';

const ApiDocs = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            API Documentation
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-300 sm:mt-4">
            Access real-time environmental monitoring data through our REST API
          </p>
        </div>

        <div className="mt-12 bg-gray-800 rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="border-b border-gray-700 pb-5">
            <h2 className="text-lg font-medium text-white">Authentication</h2>
            <p className="mt-2 text-sm text-gray-300">
              All API requests require an API key to be included in the header.
            </p>
            <div className="mt-4 bg-gray-700 rounded-md p-4">
              <pre className="text-sm text-gray-300">
                {`Authorization: Bearer YOUR_API_KEY`}
              </pre>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-white">Endpoints</h3>
            
            {/* Events Endpoint */}
            <div className="mt-6 border-b border-gray-700 pb-5">
              <div className="flex items-center">
                <Code className="h-5 w-5 text-green-500" />
                <h4 className="ml-2 text-base font-medium text-white">Get Latest Events</h4>
              </div>
              <p className="mt-2 text-sm text-gray-300">
                Retrieve the most recent pollution events.
              </p>
              <div className="mt-4 bg-gray-700 rounded-md p-4">
                <p className="text-sm font-medium text-white">GET /api/v1/events/latest</p>
                <pre className="mt-2 text-sm text-gray-300">
{`{
  "events": [
    {
      "id": "123",
      "type": "oil_spill",
      "timestamp": "2024-03-15T10:30:00Z",
      "location": {
        "lat": 40.7128,
        "lng": -74.0060
      },
      "severity": "high",
      "details": {
        "size": 2.5,
        "confidence": 0.95
      }
    }
  ]
}`}
                </pre>
              </div>
            </div>

            {/* Historical Data Endpoint */}
            <div className="mt-6 border-b border-gray-700 pb-5">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-green-500" />
                <h4 className="ml-2 text-base font-medium text-white">Historical Data</h4>
              </div>
              <p className="mt-2 text-sm text-gray-300">
                Query historical pollution events with filters.
              </p>
              <div className="mt-4 bg-gray-700 rounded-md p-4">
                <p className="text-sm font-medium text-white">GET /api/v1/events/history</p>
                <p className="mt-2 text-sm text-gray-300">Query Parameters:</p>
                <ul className="mt-2 text-sm text-gray-300 list-disc list-inside">
                  <li>start_date (ISO 8601)</li>
                  <li>end_date (ISO 8601)</li>
                  <li>type (oil_spill | air_quality)</li>
                  <li>severity (low | medium | high)</li>
                </ul>
              </div>
            </div>

            {/* Blockchain Verification */}
            <div className="mt-6">
              <div className="flex items-center">
                <GitBranch className="h-5 w-5 text-green-500" />
                <h4 className="ml-2 text-base font-medium text-white">Blockchain Verification</h4>
              </div>
              <p className="mt-2 text-sm text-gray-300">
                Verify event authenticity on the blockchain.
              </p>
              <div className="mt-4 bg-gray-700 rounded-md p-4">
                <p className="text-sm font-medium text-white">GET /api/v1/events/{'{event_id}'}/verify</p>
                <pre className="mt-2 text-sm text-gray-300">
{`{
  "verified": true,
  "blockchainHash": "0x123...abc",
  "timestamp": "2024-03-15T10:30:00Z"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limits Section */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-green-400" />
            <h2 className="ml-2 text-lg font-medium text-white">Rate Limits</h2>
          </div>
          <p className="mt-2 text-sm text-gray-300">
            API requests are limited to ensure fair usage:
          </p>
          <ul className="mt-4 text-sm text-gray-300 list-disc list-inside">
            <li>Free tier: 1000 requests per day</li>
            <li>Professional tier: 10,000 requests per day</li>
            <li>Enterprise tier: Custom limits available</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;