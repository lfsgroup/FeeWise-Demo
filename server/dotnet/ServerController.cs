using System.Net;
using FeeWise.Model;
using Microsoft.AspNetCore.Mvc;

namespace Server;

[ApiController]
public class ServerController : ControllerBase
{
    private readonly ILogger<ServerController> _logger;
    private readonly IFeeWiseProxy _feeWiseProxy;

    public ServerController(ILogger<ServerController> logger, IFeeWiseProxy feeWiseProxy)
    {
        _logger = logger;
        _feeWiseProxy = feeWiseProxy;
    }

    [HttpGet]
    [Route("config")]
    public ActionResult GetConfig()
    {
        return Ok(_feeWiseProxy.GetConfig());
    }

    [HttpGet]
    [Route("customers")]
    public async Task<ActionResult<CustomersResponse>> GetCustomers()
    {
        var response = await _feeWiseProxy.GetCustomers();
        if (response.StatusCode == HttpStatusCode.OK)
            return Ok(response.Data);

        return StatusCode((int)HttpStatusCode.InternalServerError);
    }

    [HttpGet]
    [Route("accounts")]
    public async Task<ActionResult<BankAccountsResponse>> GetBankAccounts()
    {
        var response = await _feeWiseProxy.GetBankAccounts();
        if (response.StatusCode == HttpStatusCode.OK)
            return Ok(response.Data);

        return StatusCode((int)HttpStatusCode.InternalServerError);
    }

    [HttpPost]
    [Route("create-charge")]
    public async Task<ActionResult<ChargeAndPayResponse>> CreateCharge(CreateChargeRequest request)
    {

        var response = await _feeWiseProxy.CreateCharge(request);
        if (response.StatusCode == HttpStatusCode.OK)
            return Ok(response.Data);

        return StatusCode((int)HttpStatusCode.InternalServerError);
    }

    [HttpPost]
    [Route("create-payment-token")]
    public async Task<ActionResult<PaymentTokenResponse>> CreatePaymentToken(CreatePaymentTokenRequest request)
    {
        var response = await _feeWiseProxy.CreatePaymentToken(request);
        if (response.StatusCode == HttpStatusCode.OK)
            return Ok(response.Data);

        return StatusCode((int)HttpStatusCode.InternalServerError);
    }
}
