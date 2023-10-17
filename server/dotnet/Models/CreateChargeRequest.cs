using Newtonsoft.Json;
using FeeWise.Model;
namespace Server;

public class CreateChargeRequest
{
    [JsonProperty("paymentMethodID", NullValueHandling = NullValueHandling.Ignore)]
    public Guid PaymentMethodId {get; set;}

    [JsonProperty("amount", NullValueHandling = NullValueHandling.Ignore)]
    public decimal Amount {get; set;}

    [JsonProperty("settlementAccountId", NullValueHandling = NullValueHandling.Ignore)]
    public Guid SettlementAccountId {get;set;}

    [JsonProperty("debtor", NullValueHandling = NullValueHandling.Ignore)]
    public Debtor? Debtor { get; set; }
}