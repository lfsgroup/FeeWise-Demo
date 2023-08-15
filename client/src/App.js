import { AppLayout } from './AppLayout';
import { BrowserRouter } from 'react-router-dom';
import { SelectedCustomerContext, SelectedCustomerDispatchContext } from './context/customerContext';
import { useReducer } from 'react';
import { customerReducer } from './reducers/customerReducer';

const App = () => {
  const [customerContext, customerDispatch] = useReducer(customerReducer, '');
  return (
        <SelectedCustomerContext.Provider value={customerContext}>
          <SelectedCustomerDispatchContext.Provider value={customerDispatch}>
            <BrowserRouter>
              <AppLayout />
            </BrowserRouter>
          </SelectedCustomerDispatchContext.Provider>
        </SelectedCustomerContext.Provider>
  );
};

export default App;
