import { hostedFieldStyles } from './styles';
import Capture from './Capture';
import { useContext, useEffect, useState } from 'react';

import { SelectedCustomerContext } from './context/customerContext';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from './baseUrl';
const CaptureRecurringContainer = () => {
  // grab setupFeewise from the window
  const setupFeewise = window.setupFeewise;
  
  const [feeWiseApi, setFeeWiseApi] = useState(null);
  const customerStore = useContext(SelectedCustomerContext);
  const navigate = useNavigate();
  const [captureResponse, setCaptureResponse] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [feeWiseUri, setFeeWiseUri] = useState('');
  
  //change this to test different dynamic styles
  const feeWiseOptions = hostedFieldStyles.paymentPortal;

  const handleFeeWiseSubmit = async (e) => {
    console.log('handleFeeWiseSubmit');
    setDisableSubmit(true);
    let response;
    try {
      response = await feeWiseApi?.submit();
      setCaptureResponse(response); 
    } catch (error) {
      console.log(error);
      setCaptureResponse(error); 
    }
    
    setDisableSubmit(false);
  };

  const cancelAddNew = async () => {
    navigate('/');
  };

  const mountFeeWise = async (uri) => {
    const feeWise = await setupFeewise(uri, true, false, feeWiseOptions);
    try {
      feeWise.mount('#feewise-iframe-wrapper');
    } catch (error) {
      alert(error);
    }
    setFeeWiseApi(feeWise);
  };

  const createPaymentToken = async (customer) => {
    let response;
    const request = {
      description: '',
      debtor: {
        external_id: customer.debtor.external_id,
        first_name: customer.debtor.first_name,
        last_name: customer.debtor.last_name,
        email: customer.debtor.email,
        contact_number: customer.debtor.contact_number,
      },
      payment_methods_override: ['Card', 'DirectDebit'],
      store_payment_methods: ['Card', 'DirectDebit'],
    };

    try {
      const r = await fetch(`${BASE_URL}/create-payment-token`, {
        method: 'POST',
        body: JSON.stringify({ debtor: { ...request.debtor }, token_type: 'MultiUse' }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      response = await r.json();
      setFeeWiseUri(response.capture_uri);
    } catch(error) {
      console.error(error);
      return error;
    }

    return response;
  };

  useEffect(() => {
    try {
      new URL(feeWiseUri)
      mountFeeWise(feeWiseUri)
    } catch(error) {
      console.log('no uri loaded')
    }
  }, [feeWiseUri])
  useEffect(() => {
    createPaymentToken(customerStore.customer)
  }, [customerStore.customer]);

  return (
    <div>
      <Capture
        customer={customerStore.customer}
        disableSubmit={disableSubmit}
        captureResponse={captureResponse}
        cancelAddNew={cancelAddNew}
        handleFeeWiseSubmit={handleFeeWiseSubmit}
      />
    </div>
  );
};

export default CaptureRecurringContainer;
