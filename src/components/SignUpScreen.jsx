import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../helpers/api";
import StockMarketTypical from "../helpers/StockMarketTypical.png";

const SignUpScreen = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [alert, setAlert] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, [alert]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userData.email || !userData.name || !userData.password) {
            setAlert(true);
        } else {
            try {
                await api.post(`/auth/signup`, userData);
                navigate('/login');
            } catch (error) {
                setAlert(true);
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen px-4 bg-cover bg-center h-screen w-full"
        style={{ backgroundImage: `url(${StockMarketTypical})` }} >
            <div className="mt-10 text-3xl md:text-4xl font-extrabold text-center text-white mb-6 font-serif filter brightness-200">
                Register to FinTrack Now!!!
            </div>

            {alert && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-center w-full max-w-sm">
                    <strong className="font-bold">Complete All Credentials, Don't Use Used Email and Username!</strong>
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Name</label>
                    <input required onChange={handleChange} name="name" value={userData.firstName} type="text" placeholder="Enter Your Name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-violet-400" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Email</label>
                    <input required onChange={handleChange} name="email" value={userData.email} type="text" placeholder="Enter Your Email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-violet-400" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Password</label>
                    <input required onChange={handleChange} name="password" value={userData.password} type="password" placeholder="Enter a Strong Password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-violet-400" />
                </div>
                <div className="flex justify-between items-center mt-6">
                    <button type="button" className="bg-red-500 text-white py-2 px-6 rounded-lg" onClick={() => setUserData({ firstName: "", email: "", password: "" })}>Reset</button>
                    <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded-lg">Register</button>
                </div>
            </form>
        </div>
    );
};

export default SignUpScreen;
