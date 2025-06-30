import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../../feature/admin/adminActions";
import {
    CloudArrowUpIcon,
    PhotoIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

function ImageUpload() {
    const dispatch = useDispatch();
    const { uploadedImageUrl, uploadingImage, error } = useSelector(
        (state) => state.admin
    );
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    // Log Redux state changes
    console.log("ImageUpload: Redux state - uploadedImageUrl:", uploadedImageUrl, "uploadingImage:", uploadingImage, "error:", error);

    const handleImageUpload = () => {
        if (selectedImageFile) {
            console.log("ImageUpload: Starting image upload for file:", selectedImageFile.name);
            console.log("ImageUpload: Dispatching uploadImage action");
            dispatch(uploadImage(selectedImageFile));
        } else {
            console.log("ImageUpload: No file selected");
        }
    };

    const handleFileSelect = (file) => {
        console.log("ImageUpload: File selected:", file ? file.name : "null");
        if (file && file.type.startsWith('image/')) {
            setSelectedImageFile(file);
            console.log("ImageUpload: Valid image file set");
        } else {
            console.log("ImageUpload: Invalid file type or no file");
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    }; return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <PhotoIcon className="h-6 w-6 mr-2 text-blue-600" />
                    Upload Image
                </h3>
                <p className="text-gray-600 mt-1">Upload a high-quality image for your product or category</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                        <div className="text-red-700">{error}</div>
                    </div>
                </div>
            )}

            {/* Drag and Drop Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : uploadedImageUrl
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {uploadedImageUrl ? (
                    <div className="space-y-4">
                        <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
                        <div>
                            <p className="text-green-800 font-medium text-lg">Image uploaded successfully!</p>
                            <img
                                src={uploadedImageUrl}
                                alt="Uploaded preview"
                                className="mt-4 h-32 w-32 object-cover rounded-lg border-2 border-green-200 mx-auto shadow-sm"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                            <p className="text-2xl font-bold text-gray-700">
                                {dragActive ? 'Drop your image here' : 'Drag and drop your image here'}
                            </p>
                            <p className="text-gray-500 text-lg mt-2">or</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileSelect(e.target.files[0])}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
                            >
                                Choose File
                            </label>

                            {selectedImageFile && (
                                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                    <div className="text-center sm:text-left">
                                        <p className="font-bold text-gray-700">{selectedImageFile.name}</p>
                                        <p className="text-gray-500 text-sm">
                                            {(selectedImageFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        <p className="text-blue-600 text-sm font-medium">
                                            ⚠️ Click "Upload Image" to proceed
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleImageUpload}
                                        disabled={uploadingImage}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-xl hover:shadow-2xl hover:scale-105 flex items-center animate-pulse"
                                    >
                                        {uploadingImage ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-4 border-white border-t-transparent mr-3"></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <CloudArrowUpIcon className="h-5 w-5 mr-3" />
                                                Upload Image
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-100 p-4 rounded-xl">
                            <p className="text-sm text-gray-600 font-medium">
                                📸 Supported formats: JPG, PNG, GIF • 📏 Max size: 10MB • ✨ Best quality: 1080x1080px
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ImageUpload;
