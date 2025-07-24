import React from 'react';
import axios from 'axios';

export default function PaymentButton({ amount }) {
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    // Create order on backend
    const { data } = await axios.post('http://localhost:8000/api/v1/payment/create-order', {
      amount, // should be a number like 199 (not undefined)
    });


    const options = {
      key: 'rzp_test_DW4W1HImiDMy9T', // Replace with Razorpay public key
      amount: data.data.amount,
      currency: 'INR',
      name: 'PrintSprint',
      description: 'Order Payment',
      order_id: data.data.id,
      handler: async function (response) {
        const verifyRes = await axios.post('http://localhost:8000/api/v1/payment/verify', {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        alert('Payment successful and verified!');
        console.log(verifyRes.data);
      },
      theme: {
        color: '#0f172a',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
    >
      Pay ₹{amount}
    </button>
  );
}
