import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./Navbar";
import { useUserData } from "../Context/userData";
import IncomeExpenseGraph from "./IncomeExpenseGraph";
import BalanceGraph from "./CurrentBalanceGraph";
import ExpensePieChart from "./ExpensePieChart";
import IncomePieChart from "./IncomePieChart";
import { CURRENCIES } from "../helpers/countryCurrency";
import IncomeExpenseTypical from "../helpers/IncomeExpenseTypical.jpeg";

const HomeScreen = () => {
    const { transactions, exchangeRates, userName} = useUserData();
    const [currency, setCurrency] = useState("INR");
    const [convertedTransactions, setConvertedTransactions] = useState([]);
    const originalTransactions = transactions ? [...transactions] : [];
    const selectedCurrency = CURRENCIES.find(c => c.code === currency);
    const currencySymbol = selectedCurrency ? selectedCurrency.symbol : "";

    useEffect(() => {
        if (!exchangeRates || currency === "INR") {
            setConvertedTransactions(originalTransactions);
            return;
        }
        const rate = exchangeRates[`INR${currency}`];
        const updatedTransactions = originalTransactions.map((t) => ({
            ...t,
            amount: (t.amount * rate).toFixed(2),
            currentbalance: (t.currentbalance * rate).toFixed(2),
        }));
        setConvertedTransactions(updatedTransactions);
    }, [currency, exchangeRates, transactions]);

    if (!userName) {
        return (
            <div className="flex flex-col justify-center">
                <div className="bg-cover bg-center h-screen w-full"
                    style={{ backgroundImage: `url(${IncomeExpenseTypical})` }} >
                    <NavBar />
                    <p className="text-4xl font-bold text-white mt-16 text-center z-10">
                        The Smartest Finance Tracker
                    </p>
                    <p className="text-4xl font-bold text-white mt-10 text-center transform transition duration-1000 ease-in-out hover:scale-105 animate-pulse z-10">
                        FinTrack
                    </p>
                    <div className="">
                        <div className=""></div>
                        <div className=""></div>
                    </div>
                    </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center bg-gray-100">
            <div className="w-screen"><NavBar /></div>
            <p className="text-4xl font-bold text-blue-600 mt-16 text-center transform transition duration-1000 ease-in-out hover:scale-105 animate-pulse">
                The Smartest Finance Tracker</p>
            <div className="mt-6 flex justify-end w-full max-w-7xl">
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg font-bold bg-white shadow-md"
                >
                    {CURRENCIES.map(({ country, code, symbol }) => (
                        <option key={code} value={code} selected={code === "INR"}>{`${country} [${code}] ${symbol}`}</option>
                    ))}
                </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl mt-8">
                <div className="bg-white rounded-2xl shadow-md">
                    <IncomePieChart data={convertedTransactions} symbol={currencySymbol} />
                </div>
                <div className="bg-white rounded-2xl shadow-md">
                    <ExpensePieChart data={convertedTransactions} symbol={currencySymbol} />
                </div>
            </div>
            
            <div className="w-full max-w-7xl mt-8 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <IncomeExpenseGraph data={convertedTransactions} symbol={currencySymbol} />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <BalanceGraph data={convertedTransactions} symbol={currencySymbol} />
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;