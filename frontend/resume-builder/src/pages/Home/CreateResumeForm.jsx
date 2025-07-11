import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from "../../components/inputs/input";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const CreateResumeForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleCreateResume = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a resume title");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, { title });
      if (response.data?._id) {
        navigate(`/resume/${response.data._id}`);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-black">
        {/* Close Button (Optional) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>

        <h3 className="text-xl font-bold text-gray-900">Create New Resume</h3>
        <p className="text-sm text-gray-600 mt-1.5 mb-4">
          Give your resume a title to get started. You can edit all details later.
        </p>

        <form onSubmit={handleCreateResume} className="flex flex-col gap-4">
          <Input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            label="Resume Title"
            placeholder="Eg: Mike's Resume"
            type="text"
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white text-sm font-semibold py-2 rounded-lg hover:bg-gray-800 transition-all duration-150"
          >
            Create Resume
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateResumeForm;
