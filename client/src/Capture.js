const Capture = ({
  disableSubmit,
  captureResponse,
  handleFeeWiseSubmit,
  chargeResponse = null,
  gotoCustomerDetails = null,
  review = false,
}) => {
  return (
    <div>
      <div className="sb-form add-new-payment-method">
        <h2 className="sb-form-title">Add payment details</h2>
        <div id="feewise-iframe-wrapper" className="iframe-wrapper"></div>

        {captureResponse && !captureResponse.error && (
          <div className="payment-result sb-result-box">
            <p>Capture Result: Added payment method successfully </p>
            {/* <pre>{JSON.stringify(captureResponse, undefined, 2)}</pre> */}
          </div>
        )}

        {captureResponse && captureResponse.error && (
          <div className="payment-result sb-error-box">
            <p>Capture Result: Add payment method failed </p>
            {/* <pre>{JSON.stringify(captureResponse, undefined, 2)}</pre> */}
          </div>
        )}

        {chargeResponse && (
          <div className="payment-result sb-result-box">
            <p>Charge Result: successfully charged!</p>
            {/* <pre>{JSON.stringify(chargeResponse, undefined, 2)}</pre> */}
          </div>
        )}
        {!((captureResponse && !captureResponse.error) || chargeResponse || review !== undefined) || (
          <div style={{ display: 'flex', flexDirection: 'col', gap: 10 }}>
            {gotoCustomerDetails && (
              <button onClick={gotoCustomerDetails} className="btn-secondary">
                &#8592; Back
              </button>
            )}
            <button onClick={handleFeeWiseSubmit} disabled={disableSubmit} style={{ display: 'inline-block' }}>
              {review !== undefined ? 'Review' : 'Submit'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Capture;
