import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Person {
    id: number;
    name: string;
    score: number;
    country?: string;
}

const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

const Leaderboard: React.FC = () => {
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState<Person[]>([]); 
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userCountry, setUserCountry] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/leaderboard`
            );
            
            if (Array.isArray(response.data)) {
              setLeaderboard(response.data);
            } else {
              setError('Invalid leaderboard data format');
              setLeaderboard([]);
            }
            
          } catch (err) {
            console.error(err);
            setError('Failed to fetch leaderboard');
            setLeaderboard([]); 
          } finally {
            setLoading(false);
          }
        };
    

        fetchLeaderboard();
    }, []);

    useEffect(() => {
        const fetchUserCountry = async () => {
            try {
                const response = await axios.get('https://ip-api.com/json');
                if (response.data.status === 'success') {
                    setUserCountry(response.data.countryCode);
                }
            } catch (err) {
                console.error('Failed to fetch country:', err);
            }
        };

        fetchUserCountry();
    }, []);

    if (loading) {
        return (
          <div className="text-center p-8">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 rounded-full border-t-transparent"></div>
            <p className="mt-4 text-white">Checking Santa's list...</p>
          </div>
        );
      }

    if (error) {
        return <div>{error}</div>;
    }
    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-600';
        if (score >= 30) return 'text-yellow-600'; 
        return 'text-red-600';
    };

    const getScoreMessage = (score: number) => {
        if (score >= 70) return 'Nice!';
        if (score >= 30) return 'Could Be Better';
        return 'Naughty!';
    };

    const handleBackClick = () => {
        console.log("handleBackClick v5");
        navigate('/', { replace: true, state: { from: '/leaderboard' } }); //doesnt work
        //window.location.href = '/'; //works
        //navigate(-1); //doesnt work
    };

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6">
            <button
                onClick={() => handleBackClick()}
                className="mb-4 px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                ← Back to Home
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-red-700 mb-6 sm:mb-8">
                Santa's Naughty or Nice List
            </h1>
            {userCountry && (
                <p className="text-center text-gray-600 mb-4">
                    Your location: {getCountryFlag(userCountry)}
                </p>
            )}
            <div className="space-y-4">
                {leaderboard?.map(person => (
                    <div 
                        key={person.id}
                        className="p-3 sm:p-4 bg-white rounded-lg shadow-md border-2 border-red-200"
                    >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg sm:text-xl font-semibold truncate">{person.name}</h3>
                                    {person.country && (
                                        <span className="text-xl flex-shrink-0" title={person.country}>
                                            {getCountryFlag(person.country)}
                                        </span>
                                    )}
                                </div>
                                <p className={`font-medium ${getScoreColor(person.score)}`}>
                                    {getScoreMessage(person.score)}
                                </p>
                            </div>
                            <div className="w-full sm:w-24">
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div 
                                        className={`h-4 rounded-full ${person.score >= 70 ? 'bg-green-500' : person.score >= 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${person.score}%` }}
                                    ></div>
                                </div>
                                <p className="text-gray-600 mt-1 text-right">Spirit Score: {person.score}%</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;