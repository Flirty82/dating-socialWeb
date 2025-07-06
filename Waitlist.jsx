import { useState } from 'react';
import axios from 'axios';

export default function Waitlist() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('/api/waitlist', {email});
            setMessage("Thank you for joining our waitlist");
        setEmail("");
        } catch {
            setMessage("Oops, something went wrong!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br 
        from-pink-500 to-red-500 tet-white p-6">
            <h1 className="text-4x1 font-bold mb-4">Comming Soon!</h1>
            <p className="mb-6" text-1g
        </div>"
    )
}