import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../Context/userData";
import api from "../helpers/api";
import StockMarketTypical from "../helpers/StockMarketTypical.png";

const LoginScreen = () => {
    const { setUserName } = useUserData();
    const navigate = useNavigate();
    const [alert, setAlert] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, [alert]);

    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/login", userData);
            localStorage.setItem("authToken", response.data.token);
            setUserName(response.data.user.name);
            navigate('/dashboard');
        } catch (error) {
            setAlert(true);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen px-4 bg-cover bg-center h-screen w-full"
            style={{ backgroundImage: `url(${StockMarketTypical})` }} 
        >
            <div className="mt-5 mb-20 text-3xl md:text-4xl font-extrabold text-center text-white font-serif filter brightness-200">
                Time to Become Financially Independent
            </div>
            <div className="mt-5 mb-20 text-3xl md:text-4xl font-extrabold text-center text-white font-serif filter brightness-200">
                Login
            </div>

            {alert && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-center w-full max-w-sm">
                    <strong className="font-bold">Incorrect Credentials</strong>
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleChange}
                        placeholder="Enter Your Email"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-violet-400"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={userData.password}
                        onChange={handleChange}
                        placeholder="Enter a Strong Password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-violet-400"
                    />
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button type="button" className="bg-red-500 text-white py-2 px-6 rounded-lg" onClick={() => setUserData({ email: "", password: "" })}>Reset</button>
                    <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded-lg">Login</button>
                </div>
            </form>
        </div>
    );
};

export default LoginScreen;