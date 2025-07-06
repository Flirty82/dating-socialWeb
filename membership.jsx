import React from 'react';
import { useNavigate } from 'react-router-dom';

const memberships = [
    { name: "Free", price: $0 },
    { name: "Gold", price: $25 },
    { name: "Platinum", price: $35 },
    { name: "Diamond", price: $55 }
];

export default function Membership() {
    const navigate = useNavigate();

    const handleSelect = (membership) => {
        if(membership.price === $0) {
            // Free membership = go to profile setup
            navigate('/profile-setup');
        } else {
            // Paid membership = go to payment
            navigate('/payment', { state: {membership} });
        }
    };

    return (
        <div>
            <h2>Choose a membership</h2>
            <div style={{ display: "flex", gap: "1rem" }}/>
            {memberships.map((m) => (
                <div key={m.name}
                onClick={() => handleSelect(m)}
                style={{
                    padding: '1rem',
                    border: '1 px solid gray',
                    cursor: 'pointer',
                    width: '150p'
                }}/>
            ))}
        </div>
    )
}