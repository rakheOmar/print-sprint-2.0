import React, { useState, useCallback, useRef, useEffect } from 'react';

// TypingEffect component remains unchanged (no SVGs here)
const TypingEffect = ({ text, speed = 100, cursorChar = '|' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let charIndex = 0;
    let typingInterval;
    let cursorInterval;

    const startTyping = () => {
      setIsTyping(true);
      setCursorVisible(true);
      setDisplayedText(''); // Reset text for re-typing

      typingInterval = setInterval(() => {
        if (charIndex < text.length) {
          setDisplayedText((prev) => prev + text.charAt(charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setTimeout(() => {
            charIndex = 0;
            startTyping();
          }, 2000);
        }
      }, speed);
    };

    startTyping();

    cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [text, speed]);

  return (
    <p className="text-xl text-center text-gray-700 font-medium mb-8">
      {displayedText}
      <span className={`transition-opacity duration-300 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}>
        {cursorChar}
      </span>
    </p>
  );
};

export default function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showPrintingPage, setShowPrintingPage] = useState(false);

  const handleFileUpload = (files) => {
    setUploadedFiles(prevFiles => [...prevFiles, ...Array.from(files)]);
  };

  const handleRemoveFile = (fileToRemove) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  const handleProcessFiles = () => {
    setShowPrintingPage(true);
  };

  const handleGoBack = () => {
    setShowPrintingPage(false);
    setUploadedFiles([]);
  };

  if (showPrintingPage) {
    return <PrintingPage files={uploadedFiles} onGoBack={handleGoBack} />;
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 font-sans">
      <div className="bg-base-100 p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h1 className="text-5xl font-extrabold text-center mb-2 tracking-tight">Sprint Print</h1>
        <TypingEffect text="Your Fast & Secure Printing Solution" speed={70} />

        <FileUploadArea onFileUpload={handleFileUpload} />

        {uploadedFiles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Uploaded Files:</h2>
            <div className="space-y-4">
              {uploadedFiles.map((file, index) => (
                <FileDetailCard key={index} file={file} onRemove={handleRemoveFile} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleProcessFiles}
                className="btn btn-primary"
              >
                Proceed to Print
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FileUploadArea({ onFileUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((event) => {
    const files = event.target.files;
    if (files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-10 text-center transition-all duration-200 ease-in-out cursor-pointer relative overflow-hidden
        ${isDragging ? 'border-primary bg-primary/20 scale-105' : 'border-base-300 bg-base-100'}
        hover:border-primary hover:bg-primary/10 hover:scale-102
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleBrowseClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple
        accept=".pdf,.png,.jpg,.jpeg"
      />
      <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
        <span className="text-4xl text-primary">📄</span> {/* Simple emoji icon instead of SVG */}
        <p className="text-lg font-semibold text-base-content">Upload your file</p>
        <p className="text-base-content/70">Drag and drop here, or click to browse</p>
        <p className="text-sm text-base-content/50 mt-2">Supported formats: PDF, PNG, JPG</p>
      </div>
    </div>
  );
}

function FileDetailCard({ file, onRemove }) {
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
  const lastModifiedDate = new Date(file.lastModified).toLocaleDateString();
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  return (
    <div className="card bg-base-100 shadow-md flex flex-col md:flex-row items-center p-4 relative">
      {previewUrl && (
        <figure className="w-24 h-24 mr-4">
          <img src={previewUrl} alt="Preview" className="object-contain rounded-md" />
        </figure>
      )}

      {!previewUrl && (
        <div className="w-24 h-24 mr-4 flex items-center justify-center bg-base-200 rounded-md text-3xl text-base-content/50">
          {file.type === 'application/pdf' ? '📄' : '📁'}
        </div>
      )}

      <div className="flex-grow">
        <h3 className="font-medium truncate max-w-xs">{file.name}</h3>
        <div className="text-sm text-base-content/70 flex flex-wrap gap-2 mt-1">
          <span className="badge badge-outline">{fileSizeMB} MB</span>
          <span className="badge badge-outline">{file.type || 'Unknown'}</span>
          <span className="badge badge-outline">Modified: {lastModifiedDate}</span>
        </div>
      </div>

      <button
        onClick={() => onRemove(file)}
        className="btn btn-sm btn-error btn-circle absolute top-2 right-2"
        aria-label="Remove file"
        type="button"
      >
        ✕
      </button>
    </div>
  );
}

function PrintingPage({ files, onGoBack }) {
  const [printColor, setPrintColor] = useState('color');
  const [numberOfCopies, setNumberOfCopies] = useState(1);
  const [destination, setDestination] = useState('Microsoft Print to PDF');
  const [pages, setPages] = useState('all');
  const [customPageRange, setCustomPageRange] = useState('');
  const [layout, setLayout] = useState('portrait');
  const [size, setSize] = useState('A4');
  const [binding, setBinding] = useState(false);

  const fileToPreview = files.length > 0 ? files[0] : null;

  const handlePrintJob = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append('documents', file));
    formData.append('size', size);
    formData.append('colorType', printColor === 'color' ? 'color' : 'bw');
    formData.append('binding', binding ? 'true' : 'false');
    formData.append('copies', numberOfCopies.toString());

    const bearerToken = localStorage.getItem('token'); // ✅ get token from storage

    if (!bearerToken) {
      console.error('No access token found in localStorage.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/documents/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          // ❌ Don't set Content-Type for FormData manually — browser will do it
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Upload failed:', data);
      } else {
        console.log('Upload success:', data);
      }
    } catch (err) {
      console.error('Unexpected error during upload:', err);
    }
  };


  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 font-sans">
      <div className="bg-base-100 p-8 rounded-lg shadow-xl max-w-5xl w-full flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 p-4 bg-base-200 rounded-lg flex flex-col items-center justify-center">
          {fileToPreview ? (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-center">{fileToPreview.name}</h2>
              <div className="w-full h-96 bg-base-100 rounded-md border border-base-300 flex items-center justify-center">
                <FilePreview file={fileToPreview} />
              </div>
            </>
          ) : (
            <p className="text-base-content/70 text-center">No file selected for preview.</p>
          )}
        </div>

        <div className="lg:w-1/2 p-4 bg-base-100 rounded-lg shadow-inner flex flex-col space-y-4">
          <h1 className="text-3xl font-bold mb-6">Print Options</h1>

          {/* Destination */}
          <div className="form-control w-full max-w-xs">
            <label className="label"><span className="label-text font-semibold">Destination:</span></label>
            <select
              className="select select-bordered"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option>Microsoft Print to PDF</option>
              <option>Save as PDF</option>
              <option>Another Printer (Simulated)</option>
            </select>
          </div>

          {/* Pages */}
          <div className="form-control w-full max-w-xs">
            <label className="label"><span className="label-text font-semibold">Pages:</span></label>
            <select
              className="select select-bordered"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
            >
              <option value="all">All</option>
              <option value="custom">Custom (e.g., 1-5, 8, 10-12)</option>
            </select>
            {pages === 'custom' && (
              <input
                type="text"
                placeholder="e.g., 1-5, 8, 10-12"
                value={customPageRange}
                onChange={(e) => setCustomPageRange(e.target.value)}
                className="input input-bordered mt-2"
              />
            )}
          </div>

          {/* Layout */}
          <div className="form-control w-full max-w-xs">
            <label className="label"><span className="label-text font-semibold">Layout:</span></label>
            <select
              className="select select-bordered"
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          {/* Color */}
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Print Color:</span></label>
            <div className="flex space-x-6">
              <label className="cursor-pointer flex items-center space-x-2">
                <input
                  type="radio"
                  name="printColor"
                  className="radio"
                  value="color"
                  checked={printColor === 'color'}
                  onChange={(e) => setPrintColor(e.target.value)}
                />
                <span>Color</span>
              </label>
              <label className="cursor-pointer flex items-center space-x-2">
                <input
                  type="radio"
                  name="printColor"
                  className="radio"
                  value="black_white"
                  checked={printColor === 'black_white'}
                  onChange={(e) => setPrintColor(e.target.value)}
                />
                <span>Black & White</span>
              </label>
            </div>
          </div>

          {/* Size */}
          <div className="form-control w-full max-w-xs">
            <label className="label"><span className="label-text font-semibold">Size:</span></label>
            <select
              className="select select-bordered"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option>A4</option>
              <option>Letter</option>
              <option>Legal</option>
            </select>
          </div>

          {/* Binding */}
          <div className="form-control w-full max-w-xs">
            <label className="label cursor-pointer flex items-center space-x-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={binding}
                onChange={(e) => setBinding(e.target.checked)}
              />
              <span className="label-text font-semibold">Add Binding</span>
            </label>
          </div>

          {/* Number of Copies */}
          <div className="form-control w-full max-w-xs">
            <label className="label"><span className="label-text font-semibold">Number of Copies:</span></label>
            <input
              type="number"
              min="1"
              value={numberOfCopies}
              onChange={(e) => setNumberOfCopies(Math.max(1, parseInt(e.target.value) || 1))}
              className="input input-bordered"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={onGoBack}
              className="btn btn-outline"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handlePrintJob}
              className="btn btn-primary"
              type="button"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilePreview({ file }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file) {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [file]);

  if (previewUrl) {
    return (
      <img src={previewUrl} alt="File preview" className="max-w-full max-h-full object-contain" />
    );
  } else if (file.type === 'application/pdf') {
    return (
      <div className="flex items-center justify-center w-full h-full bg-error text-error-content text-6xl font-bold">
        PDF
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center w-full h-full bg-base-200 text-base-content text-6xl font-bold">
        FILE
      </div>
    );
  }
}
