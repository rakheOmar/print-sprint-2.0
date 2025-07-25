import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  XCircle,
  FileText,
  ArrowLeft,
  Trash2,
  Upload,
  CheckCircle,
  Loader2, // Added for loading spinner
  Info, // For empty cart message icon
  FileMinus // For remove button icon
} from 'lucide-react';
import PaymentButton from '../components/PaymentButton'; // Assuming this component is styled separately

export default function CartPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentType, setPaymentType] = useState('cash');

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);

      const documentIds = JSON.parse(localStorage.getItem('documentIds') || '[]');
      if (documentIds.length === 0) {
        setDocuments([]);
        setTotalPages(0);
        setTotalDocuments(0);
        setLoading(false);
        return;
      }

      const bearerToken = localStorage.getItem('token');
      const fetchedDocs = [];
      const missingDocIds = [];
      let currentTotalPages = 0;
      const fetchErrors = [];

      for (const id of documentIds) {
        try {
          const res = await fetch(`http://localhost:8000/api/v1/documents/my/${id}`, {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          });

          if (res.status === 404) {
            missingDocIds.push(id);
            continue;
          }

          const result = await res.json();
          const doc = result?.data || result?.message;
          if (doc?._id) {
            fetchedDocs.push(doc);
            currentTotalPages += doc.pageCount * doc.printOptions.copies;
          }
        } catch (e) {
          fetchErrors.push(`Failed to fetch document ${id}: ${e.message}`);
        }
      }

      const updatedDocumentIds = documentIds.filter(id => !missingDocIds.includes(id));
      localStorage.setItem('documentIds', JSON.stringify(updatedDocumentIds));

      setDocuments(fetchedDocs);
      setTotalPages(currentTotalPages);
      setTotalDocuments(fetchedDocs.length);
      if (fetchErrors.length) setError(fetchErrors.join('\n'));
      setLoading(false);
    };

    fetchDocuments();
  }, []);

  const handleClearCart = () => {
    localStorage.setItem('documentIds', '[]');
    setDocuments([]);
    setTotalPages(0);
    setTotalDocuments(0);
  };

  const handleRemoveDocument = (id) => {
    const updatedDocs = documents.filter(doc => doc._id !== id);
    const removed = documents.find(doc => doc._id === id);
    localStorage.setItem('documentIds', JSON.stringify(updatedDocs.map(doc => doc._id)));
    setDocuments(updatedDocs);
    if (removed) {
      setTotalPages(prev => prev - removed.pageCount * removed.printOptions.copies);
      setTotalDocuments(prev => prev - 1);
    }
  };

  const handlePlaceOrder = async () => {
    const bearerToken = localStorage.getItem('token');
    const documentIds = JSON.parse(localStorage.getItem('documentIds') || '[]');

    if (!bearerToken || documentIds.length === 0) {
      alert("Missing token or cart is empty");
      return;
    }

    setPlacingOrder(true);
    try {
      // NOTE: You'll need to fetch/get the actual user's delivery address, name, phone, email here
      // For now, using placeholders as in your original code
      const orderDetails = {
        documentIds,
        deliveryAddress: "123 Main Street, Bandra East, Mumbai", // Example address relevant to Mumbai
        customerName: "Omar Rakhe",
        customerPhone: "9876543210",
        customerEmail: "omar@example.com",
        paymentType
      };

      const response = await fetch('http://localhost:8000/api/v1/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(orderDetails),
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          console.error("Server error:", error);
          alert(error.message || "Failed to place order.");
        } else {
          const text = await response.text();
          console.error("Non-JSON error:", text);
          alert("Server returned HTML. Check backend.");
        }
        return;
      }

      const result = await response.json();
      console.log("✅ Order placed:", result);

      localStorage.setItem('documentIds', '[]');
      setOrderPlaced(true);
      // Removed immediate redirect for better user experience, show success message
      // and then allow user to navigate
    } catch (err) {
      console.error("❌ Unexpected error placing order:", err);
      alert("Unexpected error placing order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const calculatePrice = () => {
    const pricePerPage = 2; // Assuming ₹2 per page as in your code
    return totalPages * pricePerPage;
  };

  // --- Empty Cart State ---
  if (!loading && !error && documents.length === 0 && !orderPlaced) { // Added !orderPlaced to prevent showing empty cart immediately after placing
    return (
      <div className="min-h-screen bg-gray-950 p-6 flex flex-col justify-center items-center text-gray-100 font-sans">
        <div className="text-center p-12 bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full mx-auto border border-blue-700"> {/* Modern card with border */}
          <Info className="w-20 h-20 mx-auto text-blue-500 mb-6 drop-shadow-lg" /> {/* Larger, more prominent icon */}
          <h2 className="text-3xl font-serif font-bold mb-4 text-white">Your Cart Is Empty</h2> {/* Classic font for heading */}
          <p className="text-lg mb-6 text-gray-400">
            Looks like you haven't added any documents yet.
          </p>
          <button
            onClick={() => (window.location.href = '/print-section')}
            className="bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 text-lg w-full"
          >
            <Upload className="w-5 h-5" /> Start Printing Now
          </button>
        </div>
      </div>
    );
  }

  // --- Main Cart View (after documents fetched) ---
  return (
    <div className="min-h-screen bg-gray-950 p-6 text-gray-100 font-sans relative">
      {/* Subtle background texture/pattern */}
      <div className="absolute inset-0 z-0 opacity-10"
           style={{
             // IMPORTANT: Replace with the actual path to your subtle dark paper/fabric texture image
             backgroundImage: "url('/path/to/subtle-paper-texture-dark.png')",
             backgroundSize: 'cover',
             backgroundBlendMode: 'overlay',
           }}
      ></div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"> {/* Wider gap */}
        <div className="lg:col-span-2 space-y-6"> {/* Increased space-y */}
          <h1 className="text-4xl font-serif font-bold mb-6 flex items-center gap-3 text-white"> {/* Larger, serif font, gap */}
            <ShoppingCart className="w-9 h-9 text-blue-400 drop-shadow" /> Your Cart
          </h1>

          {loading && (
            <div className="flex justify-center items-center p-12 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
              <Loader2 className="animate-spin w-8 h-8 text-blue-500 mr-3" />
              <span className="text-xl text-gray-400">Loading Documents...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900 text-red-200 border border-red-700 rounded-lg p-4 flex items-center gap-3 shadow-md"> {/* Custom error styling */}
              <XCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {documents.length > 0 && (
            <div className="grid grid-cols-1 gap-5"> {/* Grid for cart items for better spacing */}
              {documents.map(doc => (
                <div key={doc._id} className="card bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-200"> {/* Styled card */}
                  <div className="card-body flex flex-col md:flex-row items-center gap-6 p-6"> {/* More padding, centered items */}
                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-gray-600 shadow-inner"> {/* Larger, modern image placeholder */}
                      {doc.fileUrl?.endsWith('.png') ||
                      doc.fileUrl?.endsWith('.jpg') ||
                      doc.fileUrl?.endsWith('.jpeg') ? (
                        <img
                          src={doc.fileUrl}
                          alt={doc.originalName}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="bg-blue-700 text-white w-full h-full flex items-center justify-center text-5xl font-bold"> {/* Accent color for placeholder */}
                          <FileText className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    <div className="flex-grow text-center md:text-left">
                      <h2 className="text-2xl font-semibold text-white mb-2">{doc.originalName}</h2> {/* Larger title */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm mt-3"> {/* Nicer badge layout */}
                        <span className="badge bg-blue-600 text-white px-3 py-1.5 rounded-full font-medium">{doc.pageCount} pages</span>
                        <span className="badge bg-gray-700 text-gray-200 px-3 py-1.5 rounded-full font-medium">{doc.printOptions.size}</span>
                        <span className="badge bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium">
                          {doc.printOptions.colorType === 'color' ? 'Color' : 'B&W'}
                        </span>
                        {doc.printOptions.binding && <span className="badge bg-yellow-600 text-white px-3 py-1.5 rounded-full font-medium">Bound</span>}
                        <span className="badge bg-orange-600 text-white px-3 py-1.5 rounded-full font-medium">Copies: {doc.printOptions.copies}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveDocument(doc._id)}
                      className="btn bg-red-600 hover:bg-red-700 text-white flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-200 shadow-md flex items-center gap-1.5"
                    >
                      <FileMinus className="w-5 h-5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

           <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <button
              onClick={() => (window.location.href = '/')}
              className="btn bg-gray-700 text-white border-gray-600 hover:bg-gray-600 px-6 py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all duration-200 w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Home
            </button>
            <button onClick={handleClearCart} className="btn bg-red-700 text-white border-red-600 hover:bg-red-800 px-6 py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all duration-200 w-full sm:w-auto">
              <Trash2 className="w-5 h-5" /> Clear Cart
            </button>
          </div>
        </div>

        {/* --- Order Summary --- */}
        <div className="bg-gray-800 shadow-2xl rounded-xl p-8 flex flex-col gap-5 self-start sticky lg:top-6 border border-blue-700"> {/* Sticky, more padding, border */}
          <h2 className="text-2xl font-serif font-bold text-white border-b border-gray-700 pb-4 mb-2">Order Summary</h2> {/* Serif font, stronger border */}
          
          <div className="flex justify-between text-lg text-gray-300"> {/* Larger text in summary */}
            <span>Total Documents</span>
            <span className="font-semibold text-white">{totalDocuments}</span>
          </div>
          <div className="flex justify-between text-lg text-gray-300">
            <span>Total Pages</span>
            <span className="font-semibold text-white">{totalPages}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold text-blue-400 border-t border-gray-700 pt-4 mt-4"> {/* Prominent total price */}
            <span>Total Price</span>
            <span>₹{calculatePrice()}</span>
          </div>

            <div className="mt-6">
            <label className="label text-base font-medium text-gray-300 mb-2">
              Payment Method
            </label>
            <select
              className="select select-bordered w-full mb-6 bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 rounded-lg py-4 text-lg" // Increased py-4 and added text-lg
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="cash">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>

            {orderPlaced ? (
              <div className="bg-green-700 text-green-100 p-4 rounded-lg flex items-center justify-center gap-3 text-lg font-semibold shadow-md animate-fade-in">
                <CheckCircle className="w-6 h-6" />
                Order Placed Successfully!
              </div>
            ) : paymentType === 'cash' ? (
              <button
                className={`btn bg-blue-600 text-white font-bold py-3 rounded-lg w-full shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 ${placingOrder ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={handlePlaceOrder}
                disabled={placingOrder}
              >
                {placingOrder ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" /> Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            ) : (
              <PaymentButton amount={calculatePrice()} />
            )}
          </div>
        </div>
      </div>
       {/* CSS for custom animations (if not already in your global CSS) */}
       <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 