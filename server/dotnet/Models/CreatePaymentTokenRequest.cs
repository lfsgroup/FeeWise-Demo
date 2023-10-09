using FeeWise.Model;
using Newtonsoft.Json;

namespace Server;

public class CreatePaymentTokenRequest
{
    [JsonProperty("debtor", NullValueHandling = NullValueHandling.Ignore)]
    public Debtor? Debtor { get; set; }

    [JsonProperty("token_type", NullValueHandling = NullValueHandling.Ignore)]
    public TokenType TokenType { get; set; }

    [JsonProperty("payment_methods", NullValueHandling = NullValueHandling.Ignore)]
    public List<PaymentMethod> PaymentMethods { get; set; }
}