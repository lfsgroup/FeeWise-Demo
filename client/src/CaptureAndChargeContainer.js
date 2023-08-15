import { hostedFieldStyles } from './styles';
import Capture from './Capture';
import { useContext, useEffect, useState } from 'react';

import { SelectedCustomerContext } from './context/customerContext';
import { useNavigate } from 'react-router-dom';
import { ROUTE_NEW_CUSTOMER } from './routes';

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
  //change this to test different dynamic styles
  const feeWiseOptions = hostedFieldStyles.paymentPortal;

  const handleSelectedAccount = (e) => {
    setSelectedAccount(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleFeeWiseSubmit = async () => {
    setDisableSubmit(true);
    try {
      const response = await feeWiseApi?.submit();
      chargePaymentMethod(response.response.paymentMethod.paymentToken);
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

  const chargePaymentMethod = (paymentMethodId) => {
    setDisableSubmit(true);
    const payload = {
      customerId: customer.debtor.debtor_id,
      paymentMethodId: paymentMethodId,
      amount,
      settlementAccountId: selectedAccount,
    };
    fetch('http://localhost:4242/create-charge', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(async (r) => {
      const response = await r.json();
      setChargeResponse(response);
    });
    setDisableSubmit(false);
  };

  const mountFeeWise = async (captureUri) => {
    const feeWise = await setupFeewise(captureUri, true, false, feeWiseOptions);
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
      payment_methods_override: ['Card', 'DirectDebit'],
      store_payment_methods: ['Card', 'DirectDebit'],
    };

    fetch('http://localhost:4242/create-payment-token', {
      method: 'POST',
      body: JSON.stringify({ debtor: { ...request.debtor }, token_type: 'SingleUse' }),
    }).then(async (r) => {
      response = await r.json();
      setFeeWiseUri(response.capture_uri)
    });

    // return response;
  };
  useEffect(() => {
    setDisableSubmit(!amount || !selectedAccount);
  }, [amount, selectedAccount]);

  useEffect(() => {
    if (!customerStore.customer) {
      navigate(`/${ROUTE_NEW_CUSTOMER}`);
      return;
    }
    setCustomer(customerStore.customer);
    fetch('http://localhost:4242/accounts').then(async (r) => {
      const accounts = await r.json();
      const accountsArr = accounts.office_accounts.concat(accounts.trust_accounts);

      setBankAccounts(accountsArr);
    });

    createPaymentToken(customerStore.customer);
  }, [customerStore.customer]);

  useEffect(() => {
    console.log('mount effect')
    try {
      new URL(feeWiseUri);
      mountFeeWise(feeWiseUri);
    } catch (error) {
      console.log('no uri loaded');
    }
  }, [feeWiseUri]);

  return (
    <div>
      <div>
        <h1>
          {customer?.debtor?.first_name} {customer?.debtor?.last_name}
        </h1>

        <div>
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
        </div>
      </div>
      <Capture
        customer={customerStore.customer}
        disableSubmit={disableSubmit}
        captureResponse={captureResponse}
        chargeResponse={chargeResponse}
        cancelAddNew={cancelAddNew}
        handleFeeWiseSubmit={handleFeeWiseSubmit}
      />
    </div>
  );
};

export default CaptureAndChargeContainer;
