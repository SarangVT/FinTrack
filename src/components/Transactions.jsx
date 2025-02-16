import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./Table";
import { FaFilter, FaList } from "react-icons/fa";
import { convertToCSV, handleExportCSV, handleExportPDF, transformDataForExport } from "../helpers/ExportFunctionality.js";

const TransactionsTable = ({ transactions, symbol, codeOfCurrency }) => {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortOption, setSortOption] = useState("date");
  const [exportFormat, setExportFormat] = useState("csv");

  useEffect(() => {
    setFilteredTransactions(transactions.slice(0, 10));
  }, [transactions]);

  const filterTransactions = () => {
    if (!startDate || !endDate) {
      setFilteredTransactions(transactions.slice(0, 10));
      return;
    }

    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setHours(0, 0, 0, 0);
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);

    const filtered = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate >= adjustedStartDate && txnDate <= adjustedEndDate;
    });

    setFilteredTransactions(filtered);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleShowAll = () => {
    setFilteredTransactions(transactions);
    setSortOption("date");
  };

  const sortedTransactions = useMemo(() => {
    let sorted = [...filteredTransactions];

    if (sortOption === "amount") {
      sorted.sort((a, b) => b.amount - a.amount);
    }
    else if (sortOption === "description") {
      const frequencyMap = {};
      transactions.forEach((txn) => {
        frequencyMap[txn.description] = (frequencyMap[txn.description] || 0) + 1;
      });
      sorted.sort((a, b) => frequencyMap[b.description] - frequencyMap[a.description]);
    }
    else {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return sorted;
  }, [filteredTransactions, sortOption, transactions]);

  const handleExport = () => {
    if (exportFormat === "csv") {
      handleExportCSV(sortedTransactions, codeOfCurrency);
    } else if (exportFormat === "pdf") {
      handleExportPDF(sortedTransactions, codeOfCurrency);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          maxDate={new Date()}
          placeholderText="Start Date"
          className="border p-2 rounded"
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          maxDate={new Date()}
          placeholderText="End Date"
          className="border p-2 rounded"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
        <button onClick={filterTransactions}
          className="flex items-center gap-2 bg-blue-400 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"> 
          <FaFilter /> Filter </button>

        <button onClick={handleShowAll} className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all group">
           <FaList className="text-blue-600 group-hover:text-white transition-all text-bold" /> All Transactions </button>

        <select value={sortOption} onChange={handleSortChange} className="border p-2 rounded font-bold">
          <option value="date">Sort by Date [Descending]</option>
          <option value="amount">Sort by Amount [Highest First]</option>
          <option value="description">Sort by Most Repeated Description</option>
        </select>

        <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className="border p-2 rounded font-bold">
          <option value="csv">Export as CSV</option>
          <option value="pdf">Export as PDF</option>
        </select>

        <button onClick={handleExport} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all"> Export </button>
      
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="text-center text-blue-400">No Transactions</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr No.</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Available Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((txn, index) => (
              <TableRow key={txn.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell rightAlign={true}>
                  {txn.increment ? "+" : "-"}{symbol}{txn.amount}
                </TableCell>
                <TableCell>{txn.description}</TableCell>
                <TableCell>{txn.mode}</TableCell>
                <TableCell>{format(new Date(txn.date), "dd-MM-yyyy")}</TableCell>
                <TableCell rightAlign={true}>{symbol}{txn.currentbalance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TransactionsTable;