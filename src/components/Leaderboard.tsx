import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Person {
    id: number;
    name: string;
    score: number;
}

const Leaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<Person[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://localhost:3000/leaderboard');
                console.log("fetchLeaderboard");
                console.log(response.data);
                setLeaderboard(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch leaderboard');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
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

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-4xl font-bold text-center text-red-700 mb-8">Santa's Naughty or Nice List</h1>
            <div className="space-y-4">
                {leaderboard.map(person => (
                    <div 
                        key={person.id}
                        className="p-4 bg-white rounded-lg shadow-md border-2 border-red-200"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold">{person.name}</h3>
                                <p className={`font-medium ${getScoreColor(person.score)}`}>
                                    {getScoreMessage(person.score)}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="w-32 bg-gray-200 rounded-full h-4">
                                    <div 
                                        className={`h-4 rounded-full ${person.score >= 70 ? 'bg-green-500' : person.score >= 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${person.score}%` }}
                                    ></div>
                                </div>
                                <p className="text-gray-600 mt-1">Spirit Score: {person.score}%</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;