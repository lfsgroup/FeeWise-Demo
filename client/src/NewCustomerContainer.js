import NewCustomer from './NewCustomer';
import { useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { SelectedCustomerDispatchContext } from './context/customerContext';
import { ROUTE_CAPTURE_RECURRING } from './routes';
import { useNavigate } from 'react-router-dom';
const NewCustomerContainer = () => {
  const navigate = useNavigate();
  const dispatch = useContext(SelectedCustomerDispatchContext);
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
    navigate(`../${ROUTE_CAPTURE_RECURRING}`)
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
  return (
    <>
        <NewCustomer
          handleNewCustomerSubmit={handleNewCustomerSubmit}
          handleNewCustomerChange={handleNewCustomerChange}
          newCustomer={newCustomer}
        />
    </>
  );
};

export default NewCustomerContainer;
