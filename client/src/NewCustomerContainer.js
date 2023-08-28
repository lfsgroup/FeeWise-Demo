import NewCustomer from './NewCustomer';
import { useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { SelectedCustomerDispatchContext } from './context/customerContext';
import CaptureRecurringContainer from './CaptureRecurringContainer';
import { useNavigate } from 'react-router-dom';

const NewCustomerContainer = () => {
  const navigate = useNavigate();
  const dispatch = useContext(SelectedCustomerDispatchContext);
  const [selectedTab, setSelectedTab] = useState('customer-detail'); // customer-detail, card-detail

  const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
  });

  const handleNewCustomerSubmit = () => {
    const newCustomerRequest = {
      debtor: {
        external_id: uuid(),
        first_name: newCustomer.first_name,
        last_name: newCustomer.last_name,
        email: newCustomer.email,
        contact_number: newCustomer.contact_number,
      },
    };

    dispatch({
      type: 'update',
      customer: newCustomerRequest,
    });
    setSelectedTab('card-detail');
  };

  const handleNewCustomerChange = (e) => {
    const { value, name } = e.target;
    const cust = { ...newCustomer };
    switch (name) {
      case 'firstName':
        cust.first_name = value;
        break;
      case 'lastName':
        cust.last_name = value;
        break;
      case 'email':
        cust.email = value;
        break;
      case 'contact':
        cust.contact_number = value;
        break;
      default:
        break;
    }
    setNewCustomer(cust);
  };

  const goHome = async () => {
    navigate('/');
  };

  const gotoCustomerDetails =()=>{
    setSelectedTab("customer-detail")
  }
  return (
    <>
      <main  id="sb-main">
        <div>
          {selectedTab === 'customer-detail' && (
            <div>
              <NewCustomer
                handleNewCustomerSubmit={handleNewCustomerSubmit}
                handleNewCustomerChange={handleNewCustomerChange}
                newCustomer={newCustomer}
              />
            </div>
          )}
          {selectedTab === 'card-detail' && (
            <div>
              <CaptureRecurringContainer gotoCustomerDetails={gotoCustomerDetails}/>
            </div>
          )}
        </div>
        <div>
          <button className="btn-secondary" onClick={goHome}>
            Cancel <span style={{fontSize : 20, lineHeight: "15px", verticalAlign: 'middle', marginLeft: 10}}>&#10539;</span>
          </button>
        </div>
      </main>
    </>
  );
};

export default NewCustomerContainer;
