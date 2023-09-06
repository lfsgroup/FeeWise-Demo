import './App.css';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectedCustomerDispatchContext } from './context/customerContext';
import { ROUTE_CAPTURE_RECURRING, ROUTE_CAPTURE_AND_CHARGE, ROUTE_NEW_CUSTOMER } from './routes';
import Loader from './loader';
import CaptureRecurringContainer from './CaptureRecurringContainer';
import CaptureAndChargeContainer from './CaptureAndChargeContainer';
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('charge'); // charge, add-payment-method, single-charge
  const fetchCustomers = () => {
    setIsLoading(true);
    fetch(`${BASE_URL}/customers`).then(async (r) => {
      const response = await r.json();
      setCustomers(response.customers);
      setIsLoading(false);
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
    setDisableSubmit(!amount || !selectedAccount || !selectedPaymentMethod || isSubmitting);
  }, [amount, selectedAccount, selectedPaymentMethod, isSubmitting]);

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
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (r) => {
      const response = await r.json();
      setIsSubmitting(false);
      setPaymentResponse(response);
      navigate('/');
    });
  };

  const cancelSelection = () => {
    setSelectedCustomer(null);
    setPaymentResponse('');
  };

  const selectTab=(tabName)=>{
    return ()=>{
      setSelectedTab(tabName);
      setPaymentResponse('');

    }
  }

  return (
    <main id="sb-main">
      <div>
        <button className="add-new-customer" onClick={handleAddNewCustomer}>
          Add a new customer
        </button>
        <h1 className="sb-form-title"> Customers </h1>
        <div className="sb-form">
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <Loader />
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Loading customers...</div>
            </div>
          )}
          {!isLoading && (
            <label className="label">
              Select Customer
              <select
                onChange={handleSelectedCustomerId}
                style={{ fontSize: '1rem', padding: 8, minWidth: 300 }}
                value={selectedCustomer?.debtor?.debtor_id || ''}
              >
                <option key="default" value="default">
                  -- select customer --
                </option>
                {customers?.map((customer) => (
                  <option key={customer.debtor.debtor_id} value={customer.debtor.debtor_id}>
                    {customer.debtor.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {selectedCustomer && (
          <div>
            <div className="sb-tab-list">
              <span
                className={`sb-tab ${selectedTab === 'charge' ? 'selected' : ''}`}
                onClick={selectTab('charge')}
              >
                Charge
              </span>
              <span
                className={`sb-tab ${selectedTab === 'add-payment-method' ? 'selected' : ''}`}
                onClick={selectTab('add-payment-method')}
              >
                Add Payment Method{' '}
              </span>
              <span
                className={`sb-tab ${selectedTab === 'single-charge' ? 'selected' : ''}`}
                onClick={selectTab('single-charge')}
              >
                Add payment method and Charge
              </span>
            </div>

            {selectedTab === 'charge' && (
              <div className="sb-form payment-method-form">
                <h2 className="sb-form-title">
                  {selectedCustomer?.debtor?.first_name} {selectedCustomer?.debtor?.last_name}
                </h2>
                <p className="sb-form-titleInfo">Select payment method, account, and amount to charge</p>
                {!selectedCustomer.payment_methods ? (
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
                        {selectedCustomer.payment_methods.map((paymentMethod) => (
                          <option key={paymentMethod.payment_token} value={paymentMethod.payment_token}>
                            {paymentMethod.scheme
                              ? `${paymentMethod.scheme} ending in ${paymentMethod.scheme_partial_number}`
                              : 'US Bank Account'}
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
                )}
              </div>
            )}

            {selectedTab === 'add-payment-method' && (
              <div>
                <CaptureRecurringContainer />
              </div>
            )}
            {selectedTab === 'single-charge' && (
              <div>
                <CaptureAndChargeContainer />
              </div>
            )}
          </div>
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
      {selectedCustomer && (
        <div>
          <button onClick={cancelSelection} className="btn-secondary">
            Cancel
            <span style={{ fontSize: 20, lineHeight: '15px', verticalAlign: 'middle', marginLeft: 10 }}>&#10539;</span>
          </button>
        </div>
      )}
    </main>
  );
}

export default Home;
