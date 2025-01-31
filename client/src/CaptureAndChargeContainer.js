import { hostedFieldStyles } from './styles';
import Capture from './Capture';
import { useContext, useEffect, useState } from 'react';

import { SelectedCustomerContext } from './context/customerContext';
import ReviewModal from './review-modal';
import { useNavigate } from 'react-router-dom';
import { ROUTE_NEW_CUSTOMER } from './routes';
import { BASE_URL } from './baseUrl';
const CaptureAndChargeContainer = () => {
  const setupFeewise = window.setupFeewise;
  const [feeWiseApi, setFeeWiseApi] = useState(null);
  const customerStore = useContext(SelectedCustomerContext);
  const navigate = useNavigate();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [amount, setAmount] = useState('');
  const [captureResponse, setCaptureResponse] = useState('');
  const [chargeResponse, setChargeResponse] = useState('');
  const [customer, setCustomer] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [feeWiseUri, setFeeWiseUri] = useState('');
  const [feeWiseValid, setFeeWiseValid] = useState(false);
  //change this to test different dynamic styles
  const feeWiseOptions = hostedFieldStyles.paymentPortal;
  const [hasSurcharge, setHasSurcharge] = useState(false);
  const handleSelectedAccount = (e) => {
    setSelectedAccount(e.target.value);
  };
  const [disableReview, setDisableReview] = useState(false);
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const [reviewReady, setReviewReady] = useState(false);
  let capture = null;
  const [paymentToken, setPaymentToken] = useState('');
  const feewiseSubmit = async () => {
    setDisableSubmit(true);
    try {
      const response = await feeWiseApi?.submit();
      chargePaymentMethod(response.response.paymentMethodDetails.paymentToken);
      setPaymentToken(response.response.paymentMethodDetails.paymentToken);
      setCaptureResponse(response);
    } catch (error) {
      console.log(error);
      setCaptureResponse(error);
    } finally {
      setDisableSubmit(false);
    }
  };
  const reviewSubmit = async () => {
    setDisableSubmit(true);
    try {
      const response = await feeWiseApi?.submit();
      console.log('FW   review submit response: ', response);
      setPaymentToken(response.response.paymentMethodDetails.paymentToken);
      await new Promise((resolve) =>
        setTimeout(() => {
          setReviewReady(true);
          resolve(true);
        }, 1000),
      );
    } catch (error) {
      console.log(error);
      setCaptureResponse(error);
    } finally {
      setDisableSubmit(false);
    }
  };
  const handleFeeWiseSubmit = () => {
    if (hasSurcharge) {
      if (!reviewReady) {
        reviewSubmit();
      } else {
        // submit it
        chargePaymentMethod(paymentToken);
      }
    } else {
      feewiseSubmit();
    }
  };

  const cancelAddNew = async () => {
    navigate('/');
  };

  const chargePaymentMethod = (paymentMethodId) => {
    setDisableSubmit(true);
    const payload = {
      debtor: customer.debtor,
      paymentMethodId: paymentMethodId,
      amount,
      settlementAccountId: selectedAccount,
    };
    fetch(`${BASE_URL}/create-charge`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (r) => {
      const response = await r.json();
      setChargeResponse(response);
      setReviewReady(false);
      createPaymentToken(customerStore.customer);
    });
    setDisableSubmit(false);
  };

  const mountFeeWise = async (captureUri) => {
    const feeWise = await setupFeewise(captureUri, true, false, { ...feeWiseOptions, hasSurcharge });
    feeWise.on('formValidChange', (event) => {
      setFeeWiseValid(event.complete);
    });
    try {
      feeWise.mount('#feewise-iframe-wrapper');
    } catch (error) {
      alert(error);
    }
    setFeeWiseApi(feeWise);
  };

  const createPaymentToken = (customer) => {
    let response;
    const request = {
      amount,
      settlement_account_id: selectedAccount,
      description: '',
      debtor: {
        external_id: customer.debtor.external_id,
        first_name: customer.debtor.first_name,
        last_name: customer.debtor.last_name,
        email: customer.debtor.email,
        contact_number: customer.debtor.contact_number,
      },
    };

    fetch(`${BASE_URL}/create-payment-token`, {
      method: 'POST',
      body: JSON.stringify({
        debtor: { ...request.debtor },
        token_type: 'MultiUse',
        payment_methods: ['Card', 'DirectDebit'],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (r) => {
      response = await r.json();
      setHasSurcharge(true);
      setFeeWiseUri(response.capture_uri);
    });
  };
  useEffect(() => {
    setDisableSubmit(!amount || !selectedAccount || !feeWiseValid);
  }, [amount, selectedAccount, feeWiseValid]);

  useEffect(() => {
    if (!customerStore.customer) {
      navigate(`/${ROUTE_NEW_CUSTOMER}`);
      return;
    }
    setCustomer(customerStore.customer);
    fetch(`${BASE_URL}/accounts`).then(async (r) => {
      const accounts = await r.json();
      const accountsArr = accounts.office_accounts.concat(accounts.trust_accounts);

      setBankAccounts(accountsArr);
    });

    createPaymentToken(customerStore.customer);
  }, [customerStore.customer]);

  useEffect(() => {
    try {
      new URL(feeWiseUri);
      mountFeeWise(feeWiseUri);
    } catch (error) {
      console.log('no uri loaded');
    }
  }, [feeWiseUri]);

  const cancelReview = () => {
    setReviewReady(false);
    createPaymentToken(customerStore.customer);
  };

  return (
    <div>
      <div className="sb-form">
        <h2 className="sb-form-title">
          {customer?.debtor?.first_name} {customer?.debtor?.last_name}
        </h2>
        <div>
          <label className="label">
            Settlement Account
            <select onChange={handleSelectedAccount}>
              <option key="default" value="default">
                Select bank account...
              </option>
              {bankAccounts.map((account) => (
                <option key={account.account_id} value={account.account_id}>
                  {account.account_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Amount:
            <input type="number" step="0.01" placeholder="0.00" onChange={handleAmountChange}></input>
          </label>
        </div>
        {hasSurcharge && (
          <div className="sb-surcharge-info">
            <span className="sb-info-icon">!</span>A surcharge may apply to certain card payments. Any applicable fees
            can be reviewed before submitting payment.
          </div>
        )}
        {reviewReady && (
          <ReviewModal amount={amount} cancelReview={cancelReview} handleFeeWiseSubmit={handleFeeWiseSubmit} />
        )}
        <Capture
          disableSubmit={disableSubmit}
          captureResponse={captureResponse}
          chargeResponse={chargeResponse}
          handleFeeWiseSubmit={handleFeeWiseSubmit}
          review={hasSurcharge && reviewReady}
        />
      </div>
    </div>
  );
};

export default CaptureAndChargeContainer;
