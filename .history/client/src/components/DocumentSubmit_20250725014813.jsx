// import React, { useState, useCallback, useRef, useEffect } from 'react';

// // TypingEffect component remains unchanged (no SVGs here)
// const TypingEffect = ({ text, speed = 100, cursorChar = '|' }) => {
//   const [displayedText, setDisplayedText] = useState('');
//   const [isTyping, setIsTyping] = useState(true);
//   const [cursorVisible, setCursorVisible] = useState(true);

//   useEffect(() => {
//     let charIndex = 0;
//     let typingInterval;
//     let cursorInterval;

//     const startTyping = () => {
//       setIsTyping(true);
//       setCursorVisible(true);
//       setDisplayedText(''); // Reset text for re-typing

//       typingInterval = setInterval(() => {
//         if (charIndex < text.length) {
//           setDisplayedText((prev) => prev + text.charAt(charIndex));
//           charIndex++;
//         } else {
//           clearInterval(typingInterval);
//           setIsTyping(false);
//           setTimeout(() => {
//             charIndex = 0;
//             startTyping();
//           }, 2000);
//         }
//       }, speed);
//     };

//     startTyping();

//     cursorInterval = setInterval(() => {
//       setCursorVisible((prev) => !prev);
//     }, 500);

//     return () => {
//       clearInterval(typingInterval);
//       clearInterval(cursorInterval);
//     };
//   }, [text, speed]);

//   return (
//     <p className="text-xl text-center text-gray-700 font-medium mb-8">
//       {displayedText}
//       <span className={`transition-opacity duration-300 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}>
//         {cursorChar}
//       </span>
//     </p>
//   );
// };

// export default function App() {
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [showPrintingPage, setShowPrintingPage] = useState(false);

//   const handleFileUpload = (files) => {
//     setUploadedFiles(prevFiles => [...prevFiles, ...Array.from(files)]);
//   };

//   const handleRemoveFile = (fileToRemove) => {
//     setUploadedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
//   };

//   const handleProcessFiles = () => {
//     setShowPrintingPage(true);
//   };

//   const handleGoBack = () => {
//     setShowPrintingPage(false);
//     setUploadedFiles([]);
//   };

//   if (showPrintingPage) {
//     return <PrintingPage files={uploadedFiles} onGoBack={handleGoBack} />;
//   }

//   return (
//     <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 font-sans">
//       <div className="bg-base-100 p-8 rounded-lg shadow-xl max-w-2xl w-full">
//         <h1 className="text-5xl font-extrabold text-center mb-2 tracking-tight">PaperSprint.</h1>
//         <TypingEffect text="Your Fast & Secure Printing Solution" speed={90} />

//         <FileUploadArea onFileUpload={handleFileUpload} />

//         {uploadedFiles.length > 0 && (
//           <div className="mt-8">
//             <h2 className="text-2xl font-semibold mb-4">Uploaded Files:</h2>
//             <div className="space-y-4">
//               {uploadedFiles.map((file, index) => (
//                 <FileDetailCard key={index} file={file} onRemove={handleRemoveFile} />
//               ))}
//             </div>
//             <div className="mt-6 text-center">
//               <button
//                 onClick={handleProcessFiles}
//                 className="btn btn-primary"
//               >
//                 Proceed to Print
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function FileUploadArea({ onFileUpload }) {
//   const [isDragging, setIsDragging] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleDragOver = useCallback((event) => {
//     event.preventDefault();
//     setIsDragging(true);
//   }, []);

//   const handleDragLeave = useCallback(() => {
//     setIsDragging(false);
//   }, []);

//   const handleDrop = useCallback((event) => {
//     event.preventDefault();
//     setIsDragging(false);
//     const files = event.dataTransfer.files;
//     if (files.length > 0) {
//       onFileUpload(files);
//     }
//   }, [onFileUpload]);

//   const handleFileSelect = useCallback((event) => {
//     const files = event.target.files;
//     if (files.length > 0) {
//       onFileUpload(files);
//     }
//   }, [onFileUpload]);

//   const handleBrowseClick = useCallback(() => {
//     fileInputRef.current.click();
//   }, []);

//   return (
//     <div
//       className={`border-2 border-dashed rounded-lg p-10 text-center transition-all duration-200 ease-in-out cursor-pointer relative overflow-hidden
//         ${isDragging ? 'border-primary bg-primary/20 scale-105' : 'border-base-300 bg-base-100'}
//         hover:border-primary hover:bg-primary/10 hover:scale-102
//       `}
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       onDrop={handleDrop}
//       onClick={handleBrowseClick}
//     >
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileSelect}
//         className="hidden"
//         multiple
//         accept=".pdf,.png,.jpg,.jpeg"
//       />
//       <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
//         <span className="text-4xl text-primary">📄</span> {/* Simple emoji icon instead of SVG */}
//         <p className="text-lg font-semibold text-base-content">Upload your file</p>
//         <p className="text-base-content/70">Drag and drop here, or click to browse</p>
//         <p className="text-sm text-base-content/50 mt-2">Supported formats: PDF, PNG, JPG</p>
//       </div>
//     </div>
//   );
// }

// function FileDetailCard({ file, onRemove }) {
//   const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
//   const lastModifiedDate = new Date(file.lastModified).toLocaleDateString();
//   const [previewUrl, setPreviewUrl] = useState(null);

//   useEffect(() => {
//     if (file && file.type.startsWith('image/')) {
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//       return () => URL.revokeObjectURL(url);
//     } else {
//       setPreviewUrl(null);
//     }
//   }, [file]);

//   return (
//     <div className="card bg-base-100 shadow-md flex flex-col md:flex-row items-center p-4 relative">
//       {previewUrl && (
//         <figure className="w-24 h-24 mr-4">
//           <img src={previewUrl} alt="Preview" className="object-contain rounded-md" />
//         </figure>
//       )}

//       {!previewUrl && (
//         <div className="w-24 h-24 mr-4 flex items-center justify-center bg-base-200 rounded-md text-3xl text-base-content/50">
//           {file.type === 'application/pdf' ? '📄' : '📁'}
//         </div>
//       )}

//       <div className="flex-grow">
//         <h3 className="font-medium truncate max-w-xs">{file.name}</h3>
//         <div className="text-sm text-base-content/70 flex flex-wrap gap-2 mt-1">
//           <span className="badge badge-outline">{fileSizeMB} MB</span>
//           <span className="badge badge-outline">{file.type || 'Unknown'}</span>
//           <span className="badge badge-outline">Modified: {lastModifiedDate}</span>
//         </div>
//       </div>

//       <button
//         onClick={() => onRemove(file)}
//         className="btn btn-sm btn-error btn-circle absolute top-2 right-2"
//         aria-label="Remove file"
//         type="button"
//       >
//         ✕
//       </button>
//     </div>
//   );
// }

// function PrintingPage({ files, onGoBack }) {
//   const [printColor, setPrintColor] = useState('color');
//   const [numberOfCopies, setNumberOfCopies] = useState(1);
//   const [destination, setDestination] = useState('Microsoft Print to PDF');
//   const [pages, setPages] = useState('all');
//   const [customPageRange, setCustomPageRange] = useState('');
//   const [layout, setLayout] = useState('portrait');
//   const [size, setSize] = useState('A4');
//   const [binding, setBinding] = useState(false);

//   const fileToPreview = files.length > 0 ? files[0] : null;

//   const handlePrintJob = async () => {
//     const formData = new FormData();
//     files.forEach((file) => formData.append('documents', file));
//     formData.append('size', size);
//     formData.append('colorType', printColor === 'color' ? 'color' : 'bw');
//     formData.append('binding', binding ? 'true' : 'false');
//     formData.append('copies', numberOfCopies.toString());

//     const bearerToken = localStorage.getItem('token');

//     if (!bearerToken) {
//       console.error('No access token found in localStorage.');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:8000/api/v1/documents/upload', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${bearerToken}`,
//           // Don't set Content-Type manually for FormData
//         },
//         body: formData,
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'Upload failed');
//       }

//       // ✅ Successful upload
//       if (Array.isArray(result.message)) {
//         const documentIds = result.message.map(doc => doc._id);
//         const existingIds = JSON.parse(localStorage.getItem('documentIds') || '[]');
//         const updatedIds = [...new Set([...existingIds, ...documentIds])]; // avoid duplicates
//         localStorage.setItem('documentIds', JSON.stringify(updatedIds));
//         console.log('Stored document IDs:', updatedIds);
//       }
//       window.location.href = '/cart';
//     } catch (err) {
//       console.error('Error during file upload:', err);
//       alert('Failed to upload documents. Please try again.');
//     }
//   };



//   return (
//     <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 font-sans">
//       <div className="bg-base-100 p-8 rounded-lg shadow-xl max-w-5xl w-full flex flex-col lg:flex-row gap-6">
//         <div className="lg:w-1/2 p-4 bg-base-200 rounded-lg flex flex-col items-center justify-center">
//           {fileToPreview ? (
//             <>
//               <h2 className="text-2xl font-semibold mb-4 text-center">{fileToPreview.name}</h2>
//               <div className="w-full h-96 bg-base-100 rounded-md border border-base-300 flex items-center justify-center">
//                 <FilePreview file={fileToPreview} />
//               </div>
//             </>
//           ) : (
//             <p className="text-base-content/70 text-center">No file selected for preview.</p>
//           )}
//         </div>

//         <div className="lg:w-1/2 p-4 bg-base-100 rounded-lg shadow-inner flex flex-col space-y-4">
//           <h1 className="text-3xl font-bold mb-6">Print Options</h1>

//           {/* Destination */}
//           <div className="form-control w-full max-w-xs">
//             <label className="label"><span className="label-text font-semibold">Destination:</span></label>
//             <select
//               className="select select-bordered"
//               value={destination}
//               onChange={(e) => setDestination(e.target.value)}
//             >
//               <option>Microsoft Print to PDF</option>
//               <option>Save as PDF</option>
//               <option>Another Printer (Simulated)</option>
//             </select>
//           </div>

//           {/* Pages */}
//           <div className="form-control w-full max-w-xs">
//             <label className="label"><span className="label-text font-semibold">Pages:</span></label>
//             <select
//               className="select select-bordered"
//               value={pages}
//               onChange={(e) => setPages(e.target.value)}
//             >
//               <option value="all">All</option>
//               <option value="custom">Custom (e.g., 1-5, 8, 10-12)</option>
//             </select>
//             {pages === 'custom' && (
//               <input
//                 type="text"
//                 placeholder="e.g., 1-5, 8, 10-12"
//                 value={customPageRange}
//                 onChange={(e) => setCustomPageRange(e.target.value)}
//                 className="input input-bordered mt-2"
//               />
//             )}
//           </div>

//           {/* Layout */}
//           <div className="form-control w-full max-w-xs">
//             <label className="label"><span className="label-text font-semibold">Layout:</span></label>
//             <select
//               className="select select-bordered"
//               value={layout}
//               onChange={(e) => setLayout(e.target.value)}
//             >
//               <option value="portrait">Portrait</option>
//               <option value="landscape">Landscape</option>
//             </select>
//           </div>

//           {/* Color */}
//           <div className="form-control">
//             <label className="label"><span className="label-text font-semibold">Print Color:</span></label>
//             <div className="flex space-x-6">
//               <label className="cursor-pointer flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="printColor"
//                   className="radio"
//                   value="color"
//                   checked={printColor === 'color'}
//                   onChange={(e) => setPrintColor(e.target.value)}
//                 />
//                 <span>Color</span>
//               </label>
//               <label className="cursor-pointer flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="printColor"
//                   className="radio"
//                   value="black_white"
//                   checked={printColor === 'black_white'}
//                   onChange={(e) => setPrintColor(e.target.value)}
//                 />
//                 <span>Black & White</span>
//               </label>
//             </div>
//           </div>

//           {/* Size */}
//           <div className="form-control w-full max-w-xs">
//             <label className="label"><span className="label-text font-semibold">Size:</span></label>
//             <select
//               className="select select-bordered"
//               value={size}
//               onChange={(e) => setSize(e.target.value)}
//             >
//               <option>A4</option>
//               <option>Letter</option>
//               <option>Legal</option>
//             </select>
//           </div>

//           {/* Binding */}
//           <div className="form-control w-full max-w-xs">
//             <label className="label cursor-pointer flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 className="checkbox"
//                 checked={binding}
//                 onChange={(e) => setBinding(e.target.checked)}
//               />
//               <span className="label-text font-semibold">Add Binding</span>
//             </label>
//           </div>

//           {/* Number of Copies */}
//           <div className="form-control w-full max-w-xs">
//             <label className="label"><span className="label-text font-semibold">Number of Copies:</span></label>
//             <input
//               type="number"
//               min="1"
//               value={numberOfCopies}
//               onChange={(e) => setNumberOfCopies(Math.max(1, parseInt(e.target.value) || 1))}
//               className="input input-bordered"
//             />
//           </div>

//           <div className="flex justify-end space-x-4 mt-8">
//             <button
//               onClick={onGoBack}
//               className="btn btn-outline"
//               type="button"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handlePrintJob}
//               className="btn btn-primary"
//               type="button"
//             >
//               Print
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function FilePreview({ file }) {
//   const [previewUrl, setPreviewUrl] = useState(null);

//   useEffect(() => {
//     if (file) {
//       if (file.type.startsWith('image/')) {
//         const url = URL.createObjectURL(file);
//         setPreviewUrl(url);
//         return () => URL.revokeObjectURL(url);
//       } else {
//         setPreviewUrl(null);
//       }
//     }
//   }, [file]);

//   if (previewUrl) {
//     return (
//       <img src={previewUrl} alt="File preview" className="max-w-full max-h-full object-contain" />
//     );
//   } else if (file.type === 'application/pdf') {
//     return (
//       <div className="flex items-center justify-center w-full h-full bg-error text-error-content text-6xl font-bold">
//         PDF
//       </div>
//     );
//   } else {
//     return (
//       <div className="flex items-center justify-center w-full h-full bg-base-200 text-base-content text-6xl font-bold">
//         FILE
//       </div>
//     );
//   }
// }
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UploadCloud, FileText, X, CheckCircle, FolderOpen, ChevronLeft, Printer, Hardcover, Image, FileSearch } from 'lucide-react'; // Import all necessary Lucide icons
import { useNavigate } from 'react-router-dom'; // Still needed for navigation

// TypingEffect component
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
      setDisplayedText('');

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
    <p className="text-xl text-center text-gray-400 font-medium mb-10 tracking-wide">
      {displayedText}
      <span className={`transition-opacity duration-300 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}>
        {cursorChar}
      </span>
    </p>
  );
};

// FileUploadArea component
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
      className={`border-4 border-dashed rounded-xl p-12 text-center transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden mt-10
        ${isDragging ? 'border-blue-500 bg-blue-900/40 scale-102 shadow-lg' : 'border-gray-700 bg-gray-900'}
        hover:border-blue-500 hover:bg-gray-700 hover:scale-[1.01] shadow-md
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
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
        <UploadCloud className="w-20 h-20 text-blue-500 mb-2 drop-shadow-md" />
        <p className="text-2xl font-bold text-white">Drag & Drop Your Files Here</p>
        <p className="text-lg text-gray-400">or click to <span className="text-blue-400 font-semibold underline underline-offset-2">browse</span></p>
        <p className="text-sm text-gray-500 mt-2">Supported formats: PDF, PNG, JPG (Max 50MB per file)</p>
      </div>
    </div>
  );
}

// FileDetailCard component
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
    <div className="bg-gray-700 rounded-xl shadow-lg flex flex-col md:flex-row items-center p-5 relative transition-transform duration-200 hover:scale-[1.005] hover:shadow-xl border border-gray-600">
      {previewUrl ? (
        <figure className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden border border-gray-600 shadow-inner mr-5">
          <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
        </figure>
      ) : (
        <div className="w-28 h-28 flex-shrink-0 mr-5 flex items-center justify-center bg-blue-700 rounded-lg text-5xl text-white shadow-inner">
          <FileText className="w-16 h-16" />
        </div>
      )}

      <div className="flex-grow text-center md:text-left my-4 md:my-0">
        <h3 className="font-semibold text-xl truncate max-w-xs md:max-w-md text-white mb-2">{file.name}</h3>
        <div className="text-sm text-gray-400 flex flex-wrap justify-center md:justify-start gap-3 mt-1">
          <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full font-medium shadow-md">{fileSizeMB} MB</span>
          <span className="bg-gray-600 text-gray-200 px-3 py-1.5 rounded-full font-medium shadow-md">{file.type || 'Unknown'}</span>
          <span className="bg-gray-600 text-gray-200 px-3 py-1.5 rounded-full font-medium shadow-md">Modified: {lastModifiedDate}</span>
        </div>
      </div>

      <button
        onClick={() => onRemove(file)}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-600"
        aria-label="Remove file"
        type="button"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}

// FilePreview component
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
      <img src={previewUrl} alt="File preview" className="max-w-full max-h-full object-contain rounded-md" />
    );
  } else if (file.type === 'application/pdf') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-blue-800 text-blue-100 text-6xl font-bold rounded-md p-4">
        <FileText className="w-24 h-24 mb-4" />
        <span className="text-xl">PDF Document</span>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-700 text-gray-300 text-6xl font-bold rounded-md p-4">
        <FolderOpen className="w-24 h-24 mb-4" />
        <span className="text-xl">Unsupported File</span>
      </div>
    );
  }
}

// PrintingPage component
function PrintingPage({ files, onGoBack }) {
  const [printColor, setPrintColor] = useState('color');
  const [numberOfCopies, setNumberOfCopies] = useState(1);
  const [destination, setDestination] = useState('Microsoft Print to PDF');
  const [pages, setPages] = useState('all');
  const [customPageRange, setCustomPageRange] = useState('');
  const [layout, setLayout] = useState('portrait');
  const [size, setSize] = useState('A4');
  const [binding, setBinding] = useState(false);

  const navigate = useNavigate();

  const fileToPreview = files.length > 0 ? files[0] : null;

  const handlePrintJob = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append('documents', file));
    formData.append('size', size);
    formData.append('colorType', printColor === 'color' ? 'color' : 'bw');
    formData.append('binding', binding ? 'true' : 'false');
    formData.append('copies', numberOfCopies.toString());

    const bearerToken = localStorage.getItem('token');

    if (!bearerToken) {
      console.error('No access token found in localStorage.');
      alert('You need to be logged in to print. Please log in.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/documents/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      if (Array.isArray(result.message)) {
        const documentIds = result.message.map(doc => doc._id);
        const existingIds = JSON.parse(localStorage.getItem('documentIds') || '[]');
        const updatedIds = [...new Set([...existingIds, ...documentIds])];
        localStorage.setItem('documentIds', JSON.stringify(updatedIds));
        console.log('Stored document IDs:', updatedIds);
      }

      navigate('/cart'); // Redirect to cart page after successful upload

    } catch (err) {
      console.error('Error during file upload:', err);
      alert('Failed to upload documents. Please try again.');
    }
  };


  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8 font-sans text-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10"
           style={{
             backgroundImage: "radial-gradient(at 80% 0%, hsl(240, 60%, 15%), transparent 70%), radial-gradient(at 20% 100%, hsl(210, 80%, 10%), transparent 70%)",
           }}
      ></div>

      <div className="relative z-10 bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-6xl w-full flex flex-col lg:flex-row gap-10 border border-blue-700 animate-fade-in-up">
        
        <div className="lg:w-1/2 p-6 bg-gray-900 rounded-xl flex flex-col items-center justify-center border border-gray-700 shadow-inner">
          {fileToPreview ? (
            <>
              <h2 className="text-2xl font-semibold mb-5 text-center text-white truncate w-full px-4">{fileToPreview.name}</h2>
              <div className="w-full h-96 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center overflow-hidden shadow-md">
                <FilePreview file={fileToPreview} />
              </div>
            </>
          ) : (
            <div className="text-gray-400 text-center text-lg p-6 flex flex-col items-center">
              <FileSearch className="w-16 h-16 mb-4 text-blue-400"/>
              No file selected for preview.
            </div>
          )}
        </div>

        <div className="lg:w-1/2 p-6 bg-gray-900 rounded-xl shadow-inner flex flex-col space-y-6 border border-gray-700">
          <h1 className="text-4xl font-bold mb-6 text-white text-center font-serif">Print Options</h1>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold text-gray-300">Destination:</span></label>
            <select
              className="select select-bordered w-full bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 rounded-lg py-3 text-base"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option className="text-gray-200 bg-gray-700">Microsoft Print to PDF</option>
              <option className="text-gray-200 bg-gray-700">Save as PDF</option>
              <option className="text-gray-200 bg-gray-700">Another Printer (Simulated)</option>
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold text-gray-300">Pages:</span></label>
            <select
              className="select select-bordered w-full bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 rounded-lg py-3 text-base"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
            >
              <option value="all" className="text-gray-200 bg-gray-700">All</option>
              <option value="custom" className="text-gray-200 bg-gray-700">Custom (e.g., 1-5, 8, 10-12)</option>
            </select>
            {pages === 'custom' && (
              <input
                type="text"
                placeholder="e.g., 1-5, 8, 10-12"
                value={customPageRange}
                onChange={(e) => setCustomPageRange(e.target.value)}
                className="input input-bordered mt-3 bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 rounded-lg"
              />
            )}
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold text-gray-300">Layout:</span></label>
            <select
              className="select select-bordered w-full bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 rounded-lg py-3 text-base"
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
            >
              <option value="portrait" className="text-gray-200 bg-gray-700">Portrait</option>
              <option value="landscape" className="text-gray-200 bg-gray-700">Landscape</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold text-gray-300">Print Color:</span></label>
            <div className="flex space-x-6">
              <label className="cursor-pointer flex items-center space-x-2">
                <input
                  type="radio"
                  name="printColor"
                  className="radio radio-primary"
                  value="color"
                  checked={printColor === 'color'}
                  onChange={(e) => setPrintColor(e.target.value)}
                />
                <span className="text-gray-200">Color</span>
              </label>
              <label className="cursor-pointer flex items-center space-x-2">
                <input
                  type="radio"
                  name="printColor"
                  className="radio radio-primary"
                  value="black_white"
                  checked={printColor === 'black_white'}
                  onChange={(e) => setPrintColor(e.target.value)}
                />
                <span className="text-gray-200">Black & White</span>
              </label>
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold text-gray-300">Size:</span></label>
            <select
              className="select select-bordered w-full bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 rounded-lg py-3 text-base"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option className="text-gray-200 bg-gray-700">A4</option>
              <option className="text-gray-200 bg-gray-700">Letter</option>
              <option className="text-gray-200 bg-gray-700">Legal</option>
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label cursor-pointer flex items-center space-x-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={binding}
                onChange={(e) => setBinding(e.target.checked)}
              />
              <span className="label-text font-semibold text-gray-300 text-lg">Add Binding <Hardcover className="inline-block w-5 h-5 ml-1 text-blue-400" /></span>
            </label>
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold text-gray-300">Number of Copies:</span></label>
            <input
              type="number"
              min="1"
              value={numberOfCopies}
              onChange={(e) => setNumberOfCopies(Math.max(1, parseInt(e.target.value) || 1))}
              className="input input-bordered bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 rounded-lg"
            />
          </div>

          <div className="flex justify-end space-x-6 mt-10">
            <button
              onClick={onGoBack}
              className="btn bg-gray-700 text-white border-gray-600 hover:bg-gray-600 px-6 py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all duration-200 text-lg"
              type="button"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
            <button
              onClick={handlePrintJob}
              className="btn bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
              type="button"
            >
              <Printer className="w-6 h-6" /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}


// Main DocumentSubmit component
export default function DocumentSubmit() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showPrintingPage, setShowPrintingPage] = useState(false);

  const handleFileUpload = (files) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const validFiles = Array.from(files).filter(file => allowedTypes.includes(file.type));
    setUploadedFiles(prevFiles => [...prevFiles, ...validFiles]);
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
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 font-sans text-gray-100 relative overflow-hidden">
      {/* Background gradient/texture for depth */}
      <div className="absolute inset-0 z-0 opacity-10"
           style={{
             backgroundImage: "radial-gradient(at 50% 0%, hsl(210, 80%, 15%), transparent 70%), radial-gradient(at 0% 100%, hsl(240, 60%, 10%), transparent 70%)",
           }}
      ></div>

      <div className="relative z-10 bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-3xl w-full border border-blue-700 animate-fade-in-up">
        <h1 className="text-6xl font-extrabold text-center mb-4 tracking-tight text-white drop-shadow-lg font-serif">PaperSprint.</h1>
        <TypingEffect text="Your Fast & Secure Printing Solution" speed={90} />

        <FileUploadArea onFileUpload={handleFileUpload} />

        {uploadedFiles.length > 0 && (
          <div className="mt-10 animate-fade-in delay-200">
            <h2 className="text-3xl font-bold mb-6 text-white text-center">Files Ready for Print ({uploadedFiles.length})</h2>
            <div className="space-y-5">
              {uploadedFiles.map((file, index) => (
                <FileDetailCard key={index} file={file} onRemove={handleRemoveFile} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={handleProcessFiles}
                className="btn bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 text-xl mx-auto"
              >
                <CheckCircle className="w-6 h-6" /> Proceed to Print
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}