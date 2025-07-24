import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  XCircle,
  FileText,
  ArrowLeft,
  Trash2,
  Upload,
  CheckCircle
} from 'lucide-react';

export default function CartPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

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

    // TODO: Replace with actual UI form data later
    const orderDetails = {
      documentIds,
      deliveryAddress: "123 Main Street, Bangalore",
      customerName: "Omar Rakhe",
      customerPhone: "9876543210",
      customerEmail: "omar@example.com",
      paymentType: "cash"
    };

    try {
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
      alert("Order placed successfully!");
      window.location.href = '/'; // ✅ redirect without React Router

    } catch (err) {
      console.error("❌ Unexpected error placing order:", err);
      alert("Unexpected error placing order.");
    }
  };


  const calculatePrice = () => {
    const pricePerPage = 2; // example pricing logic
    return totalPages * pricePerPage;
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-primary" /> Your Cart
          </h1>

          {loading && (
            <div className="flex justify-center items-center p-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}

          {error && (
            <div className="alert alert-error whitespace-pre-wrap mb-4">
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && documents.length === 0 && (
            <div className="text-center p-10 bg-base-100 rounded-box shadow-lg border">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg mb-4 text-gray-500">Your cart is empty. Add some documents!</p>
              <button onClick={() => (window.location.href = '/')} className="btn btn-primary btn-wide">
                <Upload className="w-4 h-4 mr-2" /> Upload Document
              </button>
            </div>
          )}

          {!loading && !error && documents.length > 0 && (
            <>
              <div className="space-y-5 mb-6">
                {documents.map(doc => (
                  <div key={doc._id} className="card bg-base-100 shadow-md border border-base-300">
                    <div className="card-body flex flex-col md:flex-row items-start gap-4">
                      <div className="w-28 h-28 rounded-md overflow-hidden border border-base-300">
                        {doc.fileUrl?.endsWith('.png') ||
                          doc.fileUrl?.endsWith('.jpg') ||
                          doc.fileUrl?.endsWith('.jpeg') ? (
                          <img
                            src={doc.fileUrl}
                            alt={doc.originalName}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="bg-primary text-white w-full h-full flex items-center justify-center">
                            <FileText className="w-10 h-10" />
                          </div>
                        )}
                      </div>

                      <div className="flex-grow">
                        <h2 className="card-title">{doc.originalName}</h2>
                        <div className="flex flex-wrap gap-2 text-sm mt-2">
                          <div className="badge badge-info">{doc.pageCount} pages</div>
                          <div className="badge badge-secondary">{doc.printOptions.size}</div>
                          <div className="badge badge-outline">
                            {doc.printOptions.colorType === 'color' ? 'Color' : 'B&W'}
                          </div>
                          {doc.printOptions.binding && <div className="badge badge-accent">Bound</div>}
                          <div className="badge badge-warning">Copies: {doc.printOptions.copies}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveDocument(doc._id)}
                        className="btn btn-sm btn-error self-start mt-2 md:mt-0"
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Order Summary */}
        {!loading && documents.length > 0 && (
          <div className="bg-base-100 shadow-lg rounded-box p-6 flex flex-col gap-4 self-start mt-2">
            <h2 className="text-xl font-bold border-b pb-2">Order Summary</h2>
            <div className="flex justify-between">
              <span>Total Documents</span>
              <span className="font-semibold">{totalDocuments}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Pages</span>
              <span className="font-semibold">{totalPages}</span>
            </div>
            <div className="flex justify-between">
              <span>Price (₹2/page)</span>
              <span className="font-semibold">₹{calculatePrice()}</span>
            </div>

            {orderPlaced ? (
              <div className="alert alert-success flex items-center gap-2 mt-2">
                <CheckCircle className="w-5 h-5" />
                Order Placed Successfully!
              </div>
            ) : (
              <button
                className={`btn btn-primary w-full mt-4 ${placingOrder ? 'btn-disabled' : ''}`}
                onClick={handlePlaceOrder}
              >
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            )}

            <button
              onClick={() => (window.location.href = '/')}
              className="btn btn-outline w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </button>

            <button onClick={handleClearCart} className="btn btn-error w-full">
              <Trash2 className="w-4 h-4 mr-2" /> Clear Cart
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
