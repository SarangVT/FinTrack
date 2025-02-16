import React, { useState, useEffect } from "react";
import NavBar from "./Navbar";
import TransactionsTable from "./Transactions";
import CreateTransaction from "./CreateTransaction";
import { useUserData } from "../Context/userData";
import { CURRENCIES } from "../helpers/countryCurrency";

const DashboardScreen = () => {
    const { transactions, exchangeRates } = useUserData();
    console.log(transactions);
    const [showModal, setShowModal] = useState(false);
    const [currBalance, setCurrBalance] = useState(0);
    const [currency, setCurrency] = useState("INR");
    const [convertedTransactions, setConvertedTransactions] = useState([]);
    const [spendingLimit, setSpendingLimit] = useState(0);

    const originalTransactions = transactions ? [...transactions] : [];
    const selectedCurrency = CURRENCIES.find(c => c.code === currency);
    const currencySymbol = selectedCurrency ? selectedCurrency.symbol : "";
    const currencyCode = selectedCurrency ? selectedCurrency.code : "";
    // Convert transactions based on selected currency.
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

    // Calculate the moving average spending limit based on monthly expenses.
    // Only include transactions where increment is false (i.e. debits/expenses).
    useEffect(() => {
        if (!transactions || transactions.length === 0) {
            setSpendingLimit(0);
            return;
        }

        const expensesByMonth = {};

        transactions.forEach(({ amount, date, increment }) => {
            if (!increment) { // Only consider debit transactions (expenses)
                // Since 'date' is already an ISO string, directly slice it.
                const monthYear = date.slice(0, 7);
                expensesByMonth[monthYear] = (expensesByMonth[monthYear] || 0) + parseFloat(amount);
            }
        });
        

        // To compute a cumulative moving average, first sort the months chronologically.
        const sortedMonths = Object.keys(expensesByMonth).sort();
        let cumulativeSum = 0;
        let cumulativeCount = 0;
        let movingAverage = 0;
        sortedMonths.forEach((month) => {
            cumulativeSum += expensesByMonth[month];
            cumulativeCount++;
            // For each month, the moving average is the average expense from the first month up to this month.
            movingAverage = cumulativeSum / cumulativeCount;
        });

        // Convert the spending limit to the selected currency if necessary.
        if (exchangeRates && currency !== "INR") {
            const rate = exchangeRates[`INR${currency}`];
            setSpendingLimit((movingAverage * rate).toFixed(2));
        } else {
            setSpendingLimit(movingAverage.toFixed(2));
        }
    }, [transactions, exchangeRates, currency]);

    return (
        <div className="flex flex-col">
            <NavBar />
            <div className="justify-end flex m-4">
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
            
            {/* Display the spending limit */}
            <div className="m-4 text-lg font-semibold text-gray-700">
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