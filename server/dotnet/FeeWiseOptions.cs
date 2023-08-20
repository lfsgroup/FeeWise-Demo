using Newtonsoft.Json;

namespace Server;

public class FeeWiseOptions
{
    [JsonProperty("api_key", NullValueHandling = NullValueHandling.Ignore)]
    public string? PartnerApiKey {get; set;}
    [JsonProperty("channel_partner_id", NullValueHandling = NullValueHandling.Ignore)]
    public string? ChannelPartnerId {get; set;}
    [JsonProperty("base_url", NullValueHandling = NullValueHandling.Ignore)]
    public string? PartnerApiUrl {get; set;}
    [JsonProperty("firm_id", NullValueHandling = NullValueHandling.Ignore)]
    public Guid FirmId {get; set;}
}