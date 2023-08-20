using FeeWise.Client;
using FeeWise.Model;

namespace Server;
public interface IFeeWiseProxy
{
    Task<ApiResponse<BankAccountsResponse>> GetBankAccounts();

    FeeWiseOptions GetConfig();

    Task<ApiResponse<CustomersResponse>> GetCustomers();

    Task<ApiResponse<ChargeAndPayResponse>> CreateCharge(CreateChargeRequest request);

    Task<ApiResponse<PaymentTokenResponse>> CreatePaymentToken(CreatePaymentTokenRequest request);
}