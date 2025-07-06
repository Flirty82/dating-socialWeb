import { useState } from 'react';
import axios from 'axios';

export default function Search() {
    const [results, setResults] = useState('[]');
    const [filters, setFilters] = useState({
        lookingFor: 'any',
        location: '',
        ageMin: 18,
        ageMax: 99,
    });

    const handleChange = (e) => {
        setFilters({...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        const payload = {
            lookingFor: filters.lookingFor,
            age: { min: Number(filters.ageMin), max: Number(filters.ageMax) },
            location: filters.location,
        };

        const res = await axios.post('/api/search', payload);
        setResults(res.data);
    };

    return (
        <div className="p-4 max-w-3x1 mx-auto">
            <h2 className="text-xl font-bold mb-4">Search for Matches...</h2>

            <div className="grid grid-cols-1 gap-4 mb-4">
                <select name="lookingFor" onChange={handleChange} className="p-2">Search</select>
            </div>

            <div>
                {results.map(user => (
                    <div key={user._id} className="border p-4 mb-3 rounded">
                        <p><strong>{user.username}</strong> - {user.age} - {user.location}</p>
                        <p>{user.bio}</p>
                }
            </div>
    )
}