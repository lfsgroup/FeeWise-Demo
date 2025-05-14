import { useEffect, useState, useContext } from 'react';
import { SelectedCustomerDispatchContext } from './context/customerContext';
import { useNavigate } from 'react-router-dom';
import { ROUTE_CAPTURE_RECURRING, ROUTE_CAPTURE_AND_CHARGE, ROUTE_NEW_CUSTOMER } from './routes';
import { SelectedCustomerContext } from './context/customerContext';
import ReviewModal from './review-modal';
import { BASE_URL } from './baseUrl';

function ChargeContainer() {
  const customerStore = useContext(SelectedCustomerContext);
  const navigate = useNavigate();
  const [bankAccounts, setBankAccounts] = useState([]);
  const dispatchSelectedCustomer = useContext(SelectedCustomerDispatchContext);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState('');
  const [reviewData, setReviewData] = useState(null);

  const [chargeResponse, setChargeResponse] = useState('');
  const [reviewReady, setReviewReady] = useState(false);
  const fetchAccounts = () => {
    fetch(`${BASE_URL}/accounts`).then(async (r) => {
      const accounts = await r.json();
      const accountsArr = accounts.office_accounts.concat(accounts.trust_accounts);
      setBankAccounts(accountsArr);
    });
  };
  useEffect(() => {
    if (!customerStore.customer) {
      navigate(`/${ROUTE_NEW_CUSTOMER}`);
      return;
    }
    setSelectedCustomer(customerStore.customer);
    fetchAccounts();
  }, [customerStore.customer]);

  useEffect(() => {
    setDisableSubmit(!amount || !selectedAccount || !selectedPaymentMethod || isSubmitting);
  }, [amount, selectedAccount, selectedPaymentMethod, isSubmitting]);

  const handleSelectedAccount = (e) => {
    setSelectedAccount(e.target.value);
  };

  const handleSelectedPaymentMethod = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleChargePaymentMethod = () => {
    setPaymentResponse('');
    setIsSubmitting(true);
    const payload = {
      charge: {
        debtor: selectedCustomer.debtor,
        paymentMethodId: selectedPaymentMethod,
        amount,
        settlement_account_id: selectedAccount,
        surcharge_choice_override: 'Customer',
      },
    };
    fetch(`${BASE_URL}/create-charge`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (r) => {
      const response = await r.json();
      if (r.status === 402) {
        // payment review required
        setReviewReady(true);
        setReviewData(response?.payment_review);
      } else {
        setPaymentResponse(response);
      }
      setIsSubmitting(false);
      navigate('/');
    });
  };
  const cancelReview = () => {
    setReviewReady(false);
  };
  const confirmPayment = async () => {
    const payload = {
      charge_id: reviewData.charge.charge_id,
      payment_id: reviewData.payment_details.payment_id,
    };

    fetch(`${BASE_URL}/confirm-payment`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (r) => {
        const response = await r.json();
        setPaymentResponse(response);
        setReviewReady(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="sb-form payment-method-form">
      <h2 className="sb-form-title">
        {selectedCustomer?.debtor?.first_name} {selectedCustomer?.debtor?.last_name}
      </h2>
      <p className="sb-form-titleInfo">Select payment method, account, and amount to charge</p>
      {!selectedCustomer?.payment_methods ? (
        <div>
          <p>No payment methods!!</p>
        </div>
      ) : (
        <div>
          <label className="label">
            <b>Payment method</b>
            <select onChange={handleSelectedPaymentMethod}>
              <option key="default" value="default">
                Select payment method...
              </option>
              {selectedCustomer?.payment_methods.map((paymentMethod) => (
                <option key={paymentMethod.payment_token} value={paymentMethod.payment_token}>
                  {paymentMethod.card
                    ? `${paymentMethod.card.scheme} ending in ${paymentMethod.card.scheme_partial_number}`
                    : `${paymentMethod.debit.country} bank account ending in ${paymentMethod.debit.account_partial_number}`}
                </option>
              ))}
            </select>
          </label>
          <label className="label">
            <b>Settlement Account</b>

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
            <b>Amount</b>
            <input type="number" step="0.01" placeholder="0.00" onChange={handleAmountChange}></input>
          </label>
          <button onClick={handleChargePaymentMethod} disabled={disableSubmit}>
            Charge ${amount || 0} now
          </button>
        </div>
      )}{' '}
      {reviewReady && (
        <ReviewModal reviewData={reviewData} cancelReview={cancelReview} handleFeeWiseSubmit={confirmPayment} />
      )}
      {paymentResponse && (
        <div className="payment-result sb-result-box">
          <p>Charge Result: successfully charged</p>
          <code>
            <pre>{JSON.stringify(paymentResponse, undefined, 2)}</pre>
          </code>
        </div>
      )}
    </div>
  );
}

export default ChargeContainer;
