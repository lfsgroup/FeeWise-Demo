using FeeWise.Api;
using FeeWise.Model;
using FeeWise.Client;
using Microsoft.Extensions.Options;

namespace Server;

public class FeeWiseProxy : IFeeWiseProxy
{
    private readonly FeeWiseOptions _options;
    private readonly FirmApi _firmApi;
    private readonly PaymentsApi _paymentsApi;
    private readonly ILogger<FeeWiseProxy> _logger;
    public FeeWiseProxy(IOptions<FeeWiseOptions> options, ILogger<FeeWiseProxy> logger)
    {
        _options = options.Value;
        var config = new Configuration
        {
            BasePath = _options.PartnerApiUrl
        };
        config.ApiKey.Add("X-API-KEY", _options.PartnerApiKey);
        config.ApiKey.Add("X-CHANNEL-PARTNER-ID", _options.ChannelPartnerId);
        _firmApi = new FirmApi(config);
        _paymentsApi = new PaymentsApi(config);
        _logger = logger;
    }

    public FeeWiseOptions GetConfig()
    {
        return _options;
    }

    public async Task<ApiResponse<BankAccountsResponse>> GetBankAccounts()
    {
        ApiResponse<BankAccountsResponse> response;
        try
        {
            response = await _firmApi.GetFirmBankAccountsWithHttpInfoAsync(_options.FirmId);
        }
        catch (Exception e)
        {
            _logger.LogError($"FeeWise GetBankAccounts failed with exception {e}");
            return new ApiResponse<BankAccountsResponse>(System.Net.HttpStatusCode.InternalServerError, null);
        }
        return response;
    }

    public async Task<ApiResponse<CustomersResponse>> GetCustomers()
    {
        ApiResponse<CustomersResponse> response;
        try
        {
            response = await _firmApi.GetFirmCustomersWithHttpInfoAsync(_options.FirmId);
        }
        catch (Exception e)
        {
            _logger.LogError($"FeeWise GetCustomers failed with exception {e}");
            return new ApiResponse<CustomersResponse>(System.Net.HttpStatusCode.InternalServerError, null);
        }
        return response;
    }

    public async Task<ApiResponse<ChargeAndPayResponse>> CreateCharge(CreateChargeRequest request)
    {
        var charge = new Charge
        (
            firmId: _options.FirmId,
            amount: request.Amount.ToString(),
            settlementAccountId: request.SettlementAccountId
        );
        ApiResponse<ChargeAndPayResponse> response;
        try
        {
            response = await _paymentsApi.CreateChargeAndPayWithCustomerPaymentTokenWithHttpInfoAsync(request.PaymentMethodId, _options.FirmId, charge);
        }
        catch (Exception e)
        {
            _logger.LogError($"FeeWise Charging payment token failed with exception {e}");
            return new ApiResponse<ChargeAndPayResponse>(System.Net.HttpStatusCode.InternalServerError, null);
        }
        return response;
    }

    public async Task<ApiResponse<PaymentTokenResponse>> CreatePaymentToken(CreatePaymentTokenRequest request)
    {
        var tokenRequest = new PaymentTokenBody
        (
            debtor: request.Debtor,
            tokenType: request.TokenType
        );
        ApiResponse<PaymentTokenResponse> response;
        try
        {
            response = await _firmApi.CreatePaymentTokenWithHttpInfoAsync(_options.FirmId, tokenRequest);
        }
        catch (Exception e)
        {
            _logger.LogError($"FeeWise CreatePaymentToken failed with exception {e}");
            return new ApiResponse<PaymentTokenResponse>(System.Net.HttpStatusCode.InternalServerError, null);
        }
        return response;
    }
}