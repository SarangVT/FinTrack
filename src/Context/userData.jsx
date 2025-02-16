import React, { createContext, useContext, useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import api from "../helpers/api";
import axios from "axios";
import { CURRENCIES } from "../helpers/countryCurrency";

export const UserContext = createContext();

export const UserContextProvider = ({children}) => {
    const [userName, setUserName] = useState(null);
    const [email, setEmail] = useState(null);
    const [currBalance, setCurrBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [exchangeRates, setExchangeRates] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        try {
            const decoded = jwtDecode(token);
            setUserName(decoded.username);
        } catch (error) {
            console.error("Invalid token:", error);
            return;
        }
    }, []);
    useEffect(()=> {
        fetchTransactions();
    },[userName]);

    const fetchTransactions = async () => {
        try {
          const response = await api.get("/account");
          let data = response.data.transactions;
          data = data.reverse();
          setCurrBalance(data[0]?.currentbalance);
          setTransactions(data);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
    };

    // const API_KEY = "";
    const API_KEY = "7851464a4815e3ccae800ae51c400e73";
    const BASE_URL = "https://api.currencylayer.com/live";

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await axios.get(BASE_URL, {
                    params: {
                        access_key: API_KEY,
                        currencies: CURRENCIES.map(c => c.code).join(","),
                        source: "INR",
                        format: 1
                    }
                });
                if (response.data.success) {
                    setExchangeRates(response.data.quotes);
                } else {
                    console.error("Error fetching exchange rates:", response.data.error);
                }
            } catch (error) {
                console.error("API fetch error:", error);
            }
        };
        
        if(userName) {fetchExchangeRates();}
    }, [userName]);

    return (
        <UserContext.Provider value={{userName, setUserName, email, setEmail, currBalance, setCurrBalance, transactions, setTransactions, exchangeRates, setExchangeRates}}>
            {children}
        </UserContext.Provider>
    );
}

export const useUserData = () => {
    const {userName, setUserName, email, setEmail, setCurrBalance, currBalance, transactions, setTransactions, exchangeRates, setExchangeRates} = useContext(UserContext);
    return {userName, setUserName, email, setEmail, setCurrBalance, currBalance, transactions, setTransactions, exchangeRates, setExchangeRates};
}