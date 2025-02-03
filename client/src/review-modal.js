// const reviewData = {
//   charge: {
//     amount: '67',
//     charge_id: '2eb3c6e9-7841-4c96-9b57-dafa8b692b36',
//     debtor: {
//       external_id: '3567c307-1664-4c9f-8c76-7900670cac39',
//       first_name: 'Jane',
//       last_name: 'Doe',
//       email: 'dhiraj+janedoe@rapidpaylegal.com',
//       contact_number: '0491729889',
//     },
//     external_reference: 'Charge0042',
//     firm_id: 'facade00-0000-4000-a000-000000000000',
//     settlement_account_id: 'd986578d-fe03-4dc2-8fb7-28c579ee45ec',
//   },
//   payment_details: {
//     amount: '48.36',
//     artifact_id: '2eb3c6e9-7841-4c96-9b57-dafa8b692b36',
//     card_details: {
//       country: 'US',
//       funding_type: 'Credit',
//       scheme: 'visa',
//       scheme_partial_number: '0077',
//     },
//     customer_fee_amount: '1.36',
//     customer_fee_pricing: '2.9%',
//     date: '2025-02-03T16:05:39.883214+11:00',
//     payer_details: {
//       contact_number: '0491729889',
//       email: 'dhiraj+janedoe@rapidpaylegal.com',
//       name: 'Jane Doe',
//     },
//     payment_id: '9c9e5e4a-cf38-4233-83ef-4ef47edd393c',
//     payment_method: 'Card',
//     session_id: 'ccaa5dad-bcc1-46a7-8508-bbfac631803c',
//     subtotal: '47',
//   },
// };
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
