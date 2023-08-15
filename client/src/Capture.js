const Capture = ({
  customer,
  disableSubmit,
  captureResponse,
  handleFeeWiseSubmit,
  cancelAddNew,
  chargeResponse = null,
}) => {
  return (
    <div>
      <h1>
        Collecting payment method details for {customer?.debtor?.first_name} {customer?.debtor?.last_name}
      </h1>

      <div className="add-new-payment-method">
        <button onClick={cancelAddNew}>Done</button>
        <div id="feewise-iframe-wrapper" className="iframe-wrapper"></div>
        {!captureResponse && (
          <button onClick={handleFeeWiseSubmit} disabled={disableSubmit}>
            Submit
          </button>
        )}
      </div>

      {captureResponse && (
        <div className="payment-result">
          <h2>Capture Result</h2>
          <pre>{JSON.stringify(captureResponse, undefined, 2)}</pre>
        </div>
      )}

      {chargeResponse && (
        <div className="payment-result">
          <h2>Charge Result</h2>
          <pre>{JSON.stringify(chargeResponse, undefined, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Capture;
