using Newtonsoft.Json;

namespace Server;

public class CreateChargeRequest
{
    [JsonProperty("paymentMethodID", NullValueHandling = NullValueHandling.Ignore)]
    public Guid PaymentMethodId {get; set;}

    [JsonProperty("amount", NullValueHandling = NullValueHandling.Ignore)]
    public decimal Amount {get; set;}

    [JsonProperty("settlementAccountId", NullValueHandling = NullValueHandling.Ignore)]
    public Guid SettlementAccountId {get;set;}
}