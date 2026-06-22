"use client"
import Image from 'next/image';
import './login.css'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // dummy JWT cookies
        const dummyToken = "mock-jwt-token-iss-dashboard";
        Cookies.set("auth_token", dummyToken, { expires: 1 }); // 1 day

        router.push("/dashboard");
    }

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-heading">
            <img src="/saturn.png"/> <h1 className="login-header">ISS Telemetry Live</h1></div>
            <input
                className="form-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                className="form-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button className="login-button" type="submit">Login</button>
        </form>
    );
}