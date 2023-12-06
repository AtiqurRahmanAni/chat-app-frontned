import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { MessageType } from "@/types";

type HandleSubmitType = (
  value: string | File,
  message_type: MessageType
) => Promise<void>;

function Form({ handleSubmit }: { handleSubmit: HandleSubmitType }) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setSelectedFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleFileSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      handleSubmit(selectedFile, MessageType.Image);
      setSelectedFile(null);
      setImagePreview(null);
    } else {
      alert("No file selected");
    }
  };

  const handleTextSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.length > 0) {
      handleSubmit(message, MessageType.Text);
      setMessage("");
    } else {
      alert("Text field empty");
    }
  };

  return (
    <form className="flex justify-center gap-x-4 w-full">
      <input
        type="text"
        id="first_name"
        className="flex-1 bg-gray-50 border border-gray-300 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />

      {!imagePreview ? (
        <>
          <label
            htmlFor="file_input"
            className="cursor-pointer flex items-center space-x-2"
          >
            <Image
              src="/icons/upload.svg"
              width={40}
              height={40}
              style={{ width: "40px", height: "40px" }}
              alt="upload icon"
            />
          </label>
          <input
            className="hidden"
            id="file_input"
            type="file"
            accept="image/png, image/gif, image/jpeg"
            onChange={handleFileChange}
          />
        </>
      ) : (
        <div className="relative">
          <Image
            src="/icons/close.png"
            width={20}
            height={20}
            alt="close icon"
            className="absolute right-0 top-2"
            onClick={() => {
              setSelectedFile(null);
              setImagePreview(null);
            }}
            style={{ width: "20px", height: "20px" }}
          />
          <Image
            src={imagePreview}
            alt="uploaded preview"
            className="rounded mt-2"
            width={100}
            height={100}
            style={{ width: "90px", height: "90px" }}
          />
        </div>
      )}
      <button
        type="submit"
        onClick={handleTextSubmit}
        className="p-2.5 rounded-lg bg-amber-300"
      >
        Text
      </button>
      <button
        type="submit"
        onClick={handleFileSubmit}
        className="p-2.5 rounded-lg bg-amber-300"
      >
        Upload
      </button>
    </form>
  );
}

export default Form;
