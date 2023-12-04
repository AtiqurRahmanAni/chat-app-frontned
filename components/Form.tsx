import { useState } from "react";
import React from "react";

type HandleSubmitType = (value: string) => void;

function Form({ handleSubmit }: { handleSubmit: HandleSubmitType }) {
  const [message, setMessage] = useState("");

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    handleSubmit(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex justify-center gap-x-4 w-full"
    >
      <input
        type="text"
        id="first_name"
        className="flex-1 bg-gray-50 border border-gray-300 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        placeholder="Email"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button type="submit" className="p-2.5 rounded-lg bg-amber-300">
        Text
      </button>
    </form>
  );
}

export default Form;
