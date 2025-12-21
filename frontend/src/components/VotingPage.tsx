import React, { useState } from 'react';
import { ArrowLeft, Vote, CheckCircle, AlertCircle } from 'lucide-react';
import IndianFlagVotingLogo from './IndianFlagVotingLogo';

interface VotingPageProps {
  onVoteSubmit: () => void;
  onBack: () => void;
}

interface PoliticalParty {
  id: string;
  name: string;
  symbol: string;
  color: string;
  leader: string;
}

const politicalParties: PoliticalParty[] = [
  { 
    id: 'bjp', 
    name: 'Bharatiya Janata Party', 
    symbol: '🪷', 
    color: 'bg-orange-100 border-orange-300 hover:bg-orange-200',
    leader: 'Narendra Modi'
  },
  { 
    id: 'congress', 
    name: 'Indian National Congress', 
    symbol: '✋', 
    color: 'bg-blue-100 border-blue-300 hover:bg-blue-200',
    leader: 'Rahul Gandhi'
  },
  { 
    id: 'aap', 
    name: 'Aam Aadmi Party', 
    symbol: '🧹', 
    color: 'bg-cyan-100 border-cyan-300 hover:bg-cyan-200',
    leader: 'Arvind Kejriwal'
  },
  { 
    id: 'sp', 
    name: 'Samajwadi Party', 
    symbol: '🚲', 
    color: 'bg-red-100 border-red-300 hover:bg-red-200',
    leader: 'Akhilesh Yadav'
  },
  { 
    id: 'bsp', 
    name: 'Bahujan Samaj Party', 
    symbol: '🐘', 
    color: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
    leader: 'Mayawati'
  },
  { 
    id: 'tmc', 
    name: 'All India Trinamool Congress', 
    symbol: '🌸', 
    color: 'bg-teal-100 border-teal-300 hover:bg-teal-200',
    leader: 'Mamata Banerjee'
  },
  { 
    id: 'nota', 
    name: 'None of the Above', 
    symbol: '❌', 
    color: 'bg-gray-100 border-gray-300 hover:bg-gray-200',
    leader: 'NOTA'
  },
];

const VotingPage: React.FC<VotingPageProps> = ({ onVoteSubmit, onBack }) => {
  const [selectedParty, setSelectedParty] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePartySelect = (partyId: string) => {
    setSelectedParty(partyId);
  };

  const handleSubmitVote = () => {
    if (!selectedParty) return;
    setShowConfirmation(true);
  };

  const confirmVote = () => {
    setIsSubmitting(true);
    // Simulate vote submission
    setTimeout(() => {
      onVoteSubmit();
    }, 2000);
  };

  const selectedPartyData = politicalParties.find(party => party.id === selectedParty);

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 h-2 rounded-t-lg"></div>
          <div className="bg-white rounded-b-lg shadow-xl p-8">
            <div className="text-center">
              <div className="bg-amber-100 p-4 rounded-full inline-block mb-6">
                <IndianFlagVotingLogo size="md" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Your Vote</h2>
              
              {selectedPartyData && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="text-4xl mb-2">{selectedPartyData.symbol}</div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedPartyData.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Leader: {selectedPartyData.leader}</p>
                </div>
              )}

              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-700">
                      <strong>Important:</strong> Once submitted, your vote cannot be changed. 
                      Please review your selection carefully.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Go Back
                </button>
                <button
                  onClick={confirmVote}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Vote'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 h-2 rounded-t-lg"></div>
        <div className="bg-white rounded-b-lg shadow-xl p-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-green-600 p-3 rounded-full">
                <IndianFlagVotingLogo size="md" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">
              Cast Your Vote
            </h1>
            <p className="text-gray-600 text-center">
              Select your preferred candidate by clicking on their party symbol
            </p>
          </div>

          <div className="grid gap-4 mb-8">
            {politicalParties.map((party) => (
              <button
                key={party.id}
                onClick={() => handlePartySelect(party.id)}
                className={`w-full p-6 border-2 rounded-xl transition-all duration-300 ${
                  selectedParty === party.id
                    ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                    : party.color
                } hover:shadow-md hover:scale-102 transform`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{party.symbol}</div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800 text-lg">{party.name}</h3>
                      <p className="text-sm text-gray-600">Leader: {party.leader}</p>
                    </div>
                  </div>
                  {selectedParty === party.id && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="border-t pt-6">
            <button
              onClick={handleSubmitVote}
              disabled={!selectedParty}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
            >
              {selectedParty ? 'Submit Vote' : 'Select a Party to Continue'}
            </button>
            
            {selectedParty && (
              <p className="text-sm text-gray-500 text-center mt-3">
                Your vote is encrypted and anonymous
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;