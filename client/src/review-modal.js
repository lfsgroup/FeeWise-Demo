const ReviewModal = ({ cancelReview, reviewData, handleFeeWiseSubmit, amount }) => {
  return (
    <div className="sb-review-modal-wrapper">
      <div className="sb-review-modal">
        <h2>Review and process</h2>
        <div className="total-pay" style={{ fontSize: 18 }}>
          <h3 style={{ marginBottom: 0, fontSize: 12 }}>Total pay</h3>${Number(reviewData.charge.amount).toFixed(2)}{' '}
          <span style={{ fontSize: 12, color: 'gray' }}>
            {' '}
            (incl. ${Number(reviewData.payment_details.customer_fee_amount).toFixed(2)} surcharge)
          </span>
        </div>

        <button className="sb-review-back" onClick={cancelReview} title="close"></button>
        <div
          className="sb-box"
          style={{ wdith: '100%', height: 250, backgroundColor: '#efefef', marginTop: 10, marbinBottom: 10 }}
        ></div>
        <button className="sb-submit-button" title="Submit" onClick={handleFeeWiseSubmit}>
          Process
        </button>
      </div>
    </div>
  );
};
export default ReviewModal;
