import axios from 'axios';

export const sendOrderEmail = async ({ to_email, customer_name, order_id, total_amount }) => {
  const serviceID = process.env.EMAILJS_SERVICE_ID;
  const templateID = process.env.EMAILJS_TEMPLATE_ID;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  const payload = {
    service_id: serviceID,
    template_id: templateID,
    user_id: privateKey,
    template_params: {
      to_email,
      customer_name,
      order_id,
      total_amount,
    },
  };

  try {
    const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ Email sent:', response.data);
  } catch (err) {
    if (err.response?.data) {
      console.error('❌ EmailJS error:', err.response.data);
    } else {
      console.error('❌ Email send failed:', err.message);
    }
    throw new Error("Email sending failed");
  }
};
