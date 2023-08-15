import './App.css';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectedCustomerDispatchContext } from './context/customerContext';
import { ROUTE_CAPTURE_RECURRING, ROUTE_CAPTURE_AND_CHARGE, ROUTE_NEW_CUSTOMER } from './routes';
import { BASE_URL } from './baseUrl';
function Home() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const dispatchSelectedCustomer = useContext(SelectedCustomerDispatchContext);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState('');
  const fetchCustomers = () => {
    fetch(`${BASE_URL}/customers`).then(async (r) => {
      const response = await r.json();
      setCustomers(response.customers);
    });
  };

  const fetchAccounts = () => {
    fetch(`${BASE_URL}/accounts`).then(async (r) => {
      const accounts = await r.json();
      const accountsArr = accounts.office_accounts.concat(accounts.trust_accounts);

      setBankAccounts(accountsArr);
    });
  };

  useEffect(() => {
    setDisableSubmit(!amount || !selectedAccount || !selectedPaymentMethod || isSubmitting)
  }, [amount, selectedAccount, selectedPaymentMethod, isSubmitting])

  useEffect(() => {
    dispatchSelectedCustomer({
      type: 'update',
      customer: undefined,
    });
    fetchCustomers();
    fetchAccounts();
  }, [dispatchSelectedCustomer]);

  const handleSelectedCustomerId = (e) => {
    const filteredCustomer = customers.filter((c) => c.debtor.debtor_id === e.target.value);
    dispatchSelectedCustomer({
      type: 'update',
      customer: filteredCustomer[0],
    });
    setSelectedCustomer(filteredCustomer[0]);
  };

  const handleSelectedAccount = (e) => {
    setSelectedAccount(e.target.value);
  };

  const handleSelectedPaymentMethod = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleRouteCaptureRecurring = () => {
    navigate(ROUTE_CAPTURE_RECURRING);
  };

  const handleRouteCharge = () => {
    navigate(ROUTE_CAPTURE_AND_CHARGE);
  };

  const handleAddNewCustomer = () => {
    navigate(ROUTE_NEW_CUSTOMER);
  };

  const handleChargePaymentMethod = () => {
    setIsSubmitting(true);
    const payload = {
      customerId: selectedCustomer.debtor.debtor_id,
      paymentMethodId: selectedPaymentMethod,
      amount,
      settlementAccountId: selectedAccount,
    };
    fetch(`${BASE_URL}/create-charge`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(async (r) => {
      const response = await r.json();
      setIsSubmitting(false);
      setPaymentResponse(response);
      navigate('/');
    });
  };

  return (
    <main>
      <div>
        <div>
          <label className="label">
            <b>Select Customer</b>
          </label>
          <select onChange={handleSelectedCustomerId}>
            <option key="default" value="default">
              Add a new customer...
            </option>
            {customers?.map((customer) => (
              <option key={customer.debtor.debtor_id} value={customer.debtor.debtor_id}>
                {customer.debtor.name}
              </option>
            ))}
          </select>
        </div>
        {selectedCustomer && (
          <div>
            <h1>
              {selectedCustomer?.debtor?.first_name} {selectedCustomer?.debtor?.last_name}
            </h1>
            {!selectedCustomer.payment_methods ? (
              <div>
                <p>No payment methods!!</p>
              </div>
            ) : (
              <div>
                <div>
                  <label className="label">
                    <b>Payment method</b>
                  </label>
                  <select onChange={handleSelectedPaymentMethod}>
                    <option key="default" value="default">
                      Select payment method...
                    </option>
                    {selectedCustomer.payment_methods.map((paymentMethod) => (
                      <option key={paymentMethod.payment_token} value={paymentMethod.payment_token}>
                        {paymentMethod.scheme
                          ? `${paymentMethod.scheme} ending in ${paymentMethod.scheme_partial_number}`
                          : 'US Bank Account'}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="label">
                  <b>Settlement Account</b>
                </label>
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

                <label>
                  <b>Amount</b>
                </label>
                <input type="number" step="0.01" placeholder="0.00" onChange={handleAmountChange}></input>
                <button
                  onClick={handleChargePaymentMethod}
                  disabled={disableSubmit}
                >
                  Charge ${amount}
                </button>
              </div>
            )}
            <button onClick={handleRouteCaptureRecurring}>Add a payment method for future use</button>
            <button onClick={handleRouteCharge}>Make a single charge to a new payment method</button>
          </div>
        )}
        <button onClick={handleAddNewCustomer}>Add a new customer</button>
        {paymentResponse && (
          <div className="payment-result">
            <h2>Charge Result</h2>
            <pre>{JSON.stringify(paymentResponse, undefined, 2)}</pre>
          </div>
        )}
      </div>
    </main>
  );
}

export default Home;
