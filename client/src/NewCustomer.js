const NewCustomer = ({ handleNewCustomerChange, handleNewCustomerSubmit, newCustomer, gotoCustomerDetails }) => {
  return (
    <div className="sb-form new-customer-form">
      <h2 className="sb-form-title">New customer details</h2>
      <div style={{ margin: '0px 0 20px 0', fontSize: '0.8rem' }}> Please fill out customer details below.</div>

      <label>
        First Name:
        <input
          name="firstName"
          type="text"
          onChange={handleNewCustomerChange}
          value={newCustomer.first_name}
          required
        />
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
      <div style={{ display: 'flex', flexDirection: 'col', gap: 10 }}>
        <button onClick={handleNewCustomerSubmit}>Next &#8594;</button>

      </div>
    </div>
  );
};

export default NewCustomer;
