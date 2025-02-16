import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const Select = ({ onValueChange, value, children }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="border p-2 rounded w-full"
    >
      {children}
    </select>
  </div>
);

const SelectTrigger = ({ children }) => <option disabled>{children}</option>;
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

const IncomeExpenseGraph = ({ data }) => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filterData = () => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    let filtered = [...data];
    const currentDate = new Date();

    if (timeRange === "monthly") {
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      filtered = data.filter((d) => new Date(d.date) >= prevMonth);
    }

    if (timeRange === "yearly") {
      const prevYear = new Date(currentDate.getFullYear() - 1, 0, 1);
      filtered = data.filter((d) => new Date(d.date) >= prevYear);
    }

    if (timeRange === "custom" && startDate && endDate) {
      filtered = data.filter((d) => {
        const dataDate = new Date(d.date);
        return dataDate >= startDate && dataDate <= endDate;
      });
    }

    return filtered.map((d) => ({
      date: format(new Date(d.date), "MMM d, yyyy"),
      Income: d.increment ? d.amount : 0,
      Expense: !d.increment ? d.amount : 0,
    }));
  };

  return (
    <div className="p-4 w-full border rounded-lg shadow-md">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Income & Expense Graph</h2>
          <div className="flex gap-4">
            <Select onValueChange={setTimeRange} value={timeRange}>
              <SelectTrigger>Time Range: {timeRange}</SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {timeRange === "custom" && (
              <div className="flex gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Start Date"
                  className="border p-2 rounded"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  maxDate={new Date()} 
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText="End Date"
                  className="border p-2 rounded"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  maxDate={new Date()} 
                />
              </div>
            )}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filterData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Income" stroke="#4CAF50" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Expense" stroke="#F44336" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseGraph;