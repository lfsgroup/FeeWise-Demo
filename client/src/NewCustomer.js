const NewCustomer = ({ handleNewCustomerChange, handleNewCustomerSubmit, newCustomer }) => {
  return (
    <div>
      <h2>Customer details</h2>
      <label>
        First Name:
        <input name="firstName" type="text" onChange={handleNewCustomerChange} value={newCustomer.first_name} required />
      </label>
      <label>
        Last Name:
        <input name="lastName" type="text" onChange={handleNewCustomerChange} value={newCustomer.last_name} required />
      </label>
      <label>
        Email:
        <input name="email" type="text" onChange={handleNewCustomerChange} value={newCustomer.email} required />
      </label>
      <label>
        Contact Number:
        <input name="contact" type="text" onChange={handleNewCustomerChange} value={newCustomer.contact} required />
      </label>
      <button onClick={handleNewCustomerSubmit}>Next</button>
    </div>
  );
};

export default NewCustomer;
