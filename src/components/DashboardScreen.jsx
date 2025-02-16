import React, { useState, useEffect } from "react";
import NavBar from "./Navbar";
import TransactionsTable from "./Transactions";
import CreateTransaction from "./CreateTransaction";
import { useUserData } from "../Context/userData";
import { CURRENCIES } from "../helpers/countryCurrency";

const DashboardScreen = () => {
    const { transactions, exchangeRates } = useUserData();
    const [showModal, setShowModal] = useState(false);
    const [currBalance, setCurrBalance] = useState(0);
    const [currency, setCurrency] = useState("INR");
    const [convertedTransactions, setConvertedTransactions] = useState([]);
    const [defaultSpendingLimit, setDefaultSpendingLimit] = useState(0);
    const [spendingLimit, setSpendingLimit] = useState(0);
    const originalTransactions = transactions ? [...transactions] : [];
    const selectedCurrency = CURRENCIES.find(c => c.code === currency);
    const currencySymbol = selectedCurrency ? selectedCurrency.symbol : "";
    const currencyCode = selectedCurrency ? selectedCurrency.code : "";
    
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
        if(exchangeRates && currency!="INR") {setSpendingLimit((defaultSpendingLimit * rate).toFixed(2));}
    }, [currency, exchangeRates, transactions]);

    useEffect(() => {
        if (!transactions || transactions.length === 0) {
            setSpendingLimit(0);
            return;
        }
    
        const expensesByMonth = {};
    
        transactions.forEach(({ amount, date, increment }) => {
            if (!increment) { 
                const monthYear = date.slice(0, 7);
                expensesByMonth[monthYear] = (expensesByMonth[monthYear] || 0) + parseFloat(amount);
            }
        });
        const totalExpenses = Object.values(expensesByMonth).reduce((sum, expense) => sum + expense, 0);
        const numMonths = Object.keys(expensesByMonth).length;
        const averageSpending = numMonths > 0 ? totalExpenses / numMonths : 0;
        setDefaultSpendingLimit(averageSpending.toFixed(2));
        setSpendingLimit(averageSpending.toFixed(2));
    }, [transactions]);

    return (
        <div className="flex flex-col">
            <NavBar />
            <div className="justify-end flex m-4 mt-16">
                <button 
                    className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                    onClick={() => setShowModal(true)}
                >
                    Create Transaction
                </button>
            </div>
            <div className="justify-end flex m-4">
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg font-bold bg-white shadow-md"
                >
                    {CURRENCIES.map(({ country, code, symbol }) => (
                        <option key={code} value={code}>
                            {`${country} [${code}] ${symbol}`}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="m-4 text-lg font-bold text-red-500">
                <p>Spending Limit: {currencySymbol}{spendingLimit}</p>
            </div>

            <TransactionsTable transactions={convertedTransactions} symbol={currencySymbol} codeOfCurrency={currencyCode}/>
            {showModal && (
                <CreateTransaction
                    onClose={() => setShowModal(false)}
                    currBalance={currBalance}
                />
            )}
        </div>
    );
};

export default DashboardScreen;