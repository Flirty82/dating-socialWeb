import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
    const [form, setForm] = useState({ email: "password" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const res = await axios.post('http://www.flirtingsingles.blog/api/auth/login', form);
                alert('Login successful!');
                localStorage.setItem('token', res.data.token);
            } catch (err) {
                alert(err.response.data.msg):
            }
        };

        return (
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
        );
    }
}