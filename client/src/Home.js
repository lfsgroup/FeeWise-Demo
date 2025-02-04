import './App.css';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectedCustomerDispatchContext } from './context/customerContext';
import { ROUTE_CAPTURE_RECURRING, ROUTE_CAPTURE_AND_CHARGE, ROUTE_NEW_CUSTOMER } from './routes';
import Loader from './loader';
import CaptureRecurringContainer from './CaptureRecurringContainer';
import CaptureAndChargeContainer from './CaptureAndChargeContainer';
import ChargeContainer from './ChargeContainer';
import { BASE_URL } from './baseUrl';

function Home() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const dispatchSelectedCustomer = useContext(SelectedCustomerDispatchContext);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('single-charge'); // charge, add-payment-method, single-charge

  const fetchCustomers = () => {
    setIsLoading(true);
    fetch(`${BASE_URL}/customers`).then(async (r) => {
      const response = await r.json();
      setCustomers(response.customers);
      setIsLoading(false);
    });
  };
  useEffect(() => {
    dispatchSelectedCustomer({
      type: 'update',
      customer: undefined,
    });
    fetchCustomers();
  }, [dispatchSelectedCustomer]);

  const handleSelectedCustomerId = (e) => {
    const filteredCustomer = customers.filter((c) => c.debtor.debtor_id === e.target.value);
    dispatchSelectedCustomer({
      type: 'update',
      customer: filteredCustomer[0],
    });
    setSelectedCustomer(filteredCustomer[0]);
  };

  const handleAddNewCustomer = () => {
    navigate(ROUTE_NEW_CUSTOMER);
  };

  const cancelSelection = () => {
    setSelectedCustomer(null);
  };

  const selectTab = (tabName) => {
    return () => {
      setSelectedTab(tabName);
    };
  };

  return (
    <main id="sb-main">
      <div>
        <button className="add-new-customer" onClick={handleAddNewCustomer}>
          Add a new customer
        </button>
        <h1 className="sb-form-title"> Customers </h1>
        <div className="sb-form">
          {isLoading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
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
              <span className={`sb-tab ${selectedTab === 'charge' ? 'selected' : ''}`} onClick={selectTab('charge')}>
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

            {selectedTab === 'charge' && <ChargeContainer />}
            {selectedTab === 'add-payment-method' && <CaptureRecurringContainer />}
            {selectedTab === 'single-charge' && <CaptureAndChargeContainer />}
          </div>
        )}
      </div>
      {selectedCustomer && (
        <div>
          <button onClick={cancelSelection} className="btn-secondary">
            Cancel
            <span
              style={{
                fontSize: 20,
                lineHeight: '15px',
                verticalAlign: 'middle',
                marginLeft: 10,
              }}
            >
              &#10539;
            </span>
          </button>
        </div>
      )}
    </main>
  );
}

export default Home;
