import React, { useState, useEffect } from 'react';
import { ShoppingCart, XCircle, FileText, ArrowLeft, Trash2, Upload } from 'lucide-react';

export default function CartPage({ onBack, onUpload }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);

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

      const bearerToken = 'Bearer <your-token-here>'; // Replace in real use
      const fetchedDocs = [];
      const missingDocIds = [];
      let currentTotalPages = 0;
      const fetchErrors = [];

      for (const id of documentIds) {
        try {
          const res = await fetch(`http://localhost:8000/api/v1/documents/my/${id}`, {
            headers: {
              Authorization: bearerToken,
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

  return (
    <div className="min-h-screen p-6 bg-base-200">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold flex justify-center items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-primary" /> Your Cart
          </h1>
        </div>

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
            <button onClick={onUpload} className="btn btn-primary btn-wide">
              <Upload className="w-4 h-4 mr-2" /> Upload Document
            </button>
          </div>
        )}

        {!loading && !error && documents.length > 0 && (
          <>
            <div className="space-y-5 mb-8">
              {documents.map(doc => (
                <div
                  key={doc._id}
                  className="card bg-base-100 shadow-md border border-base-300"
                >
                  <div className="card-body flex flex-col md:flex-row items-start gap-4">
                    {doc.fileUrl?.includes('.jpg') || doc.fileUrl?.includes('.png') ? (
                      <img
                        src={doc.fileUrl}
                        alt="Document"
                        className="w-28 h-28 rounded-md object-cover border"
                      />
                    ) : (
                      <div className="w-28 h-28 bg-primary text-white rounded-md flex items-center justify-center">
                        <FileText className="w-10 h-10" />
                      </div>
                    )}

                    <div className="flex-grow">
                      <h2 className="card-title">{doc.originalName}</h2>
                      <div className="flex flex-wrap gap-2 text-sm mt-2">
                        <div className="badge badge-info">{doc.pageCount} pages</div>
                        <div className="badge badge-secondary">
                          {doc.printOptions.size}
                        </div>
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

            <div className="stats shadow mb-6">
              <div className="stat">
                <div className="stat-title">Total Documents</div>
                <div className="stat-value">{totalDocuments}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Total Pages</div>
                <div className="stat-value">{totalPages}</div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button onClick={onBack} className="btn btn-outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </button>
              <button onClick={handleClearCart} className="btn btn-error">
                <Trash2 className="w-4 h-4 mr-2" /> Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
