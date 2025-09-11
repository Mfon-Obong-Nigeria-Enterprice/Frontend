import { useState } from "react";

export default function TestFormPage() {
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log("🔥 Test form submitted!");
    e.preventDefault();
    e.stopPropagation();
    alert("Form submitted successfully!");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Test Form Page</h1>
      
      <form onSubmit={handleFormSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-1">Test Input</label>
          <input
            type="text"
            placeholder="Enter something"
            className="w-full rounded-md border px-3 py-2 text-sm"
            required
          />
        </div>
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Submit Test Form
        </button>
      </form>
    </div>
  );
}

