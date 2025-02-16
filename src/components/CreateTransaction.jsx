import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../helpers/api";

const CreateTransaction = ({ onClose, currBalance}) => {
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState("Cash");
  const [amount, setAmount] = useState("");
  const [increment, setIncrement] = useState(true);
  const [date, setDate] = useState(new Date());

  const handleSubmit = () => {
    if (!description || !amount) {
      alert("Please fill in all fields");
      return;
    }
    const currentbalance = increment ? currBalance+amount : currBalance-amount;
    const newTransaction = {description, mode, amount: parseFloat(amount), increment, date, currentbalance};
    onClose();
    api.post("/account", newTransaction);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 mt-12">
        <h2 className="text-xl font-bold mb-4">Create Transaction</h2>

        <label className="block mb-2 font-semibold">Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 font-semibold">Mode:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full p-2 border rounded mb-4">
          <option>Cash</option>
          <option>Debit Card</option>
          <option>Credit Card</option>
          <option>Bank Transfer</option>
          <option>Crypto</option>
        </select>

        <label className="block mb-2 font-semibold">Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 border rounded mb-4"/>

        <label className="block mb-2 font-semibold">Type:</label>
        <div className="flex gap-4 mb-4">
          <button className={`px-4 py-2 rounded ${increment ? "bg-green-600 text-white" : "bg-gray-200"}`}
            onClick={() => setIncrement(true)}> Credit +
          </button>
          <button className={`px-4 py-2 rounded ${!increment ? "bg-red-600 text-white" : "bg-gray-200"}`}
            onClick={() => setIncrement(false)}
          > Debit &nbsp;-
          </button>
        </div>

        <label className="block mb-2 font-semibold">Date:</label>
        <DatePicker
          selected={date}
          onChange={(d) => setDate(d)}
          maxDate={new Date()}
          className="w-full p-2 border rounded mb-4"
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
        />

        <div className="flex justify-end gap-2">
          <button className="bg-gray-400 px-4 py-2 rounded text-white hover:bg-gray-500" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-700" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTransaction;