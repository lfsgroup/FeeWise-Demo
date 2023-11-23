package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/rs/zerolog/log"
)

type FeeWiseProxy struct {
	BaseUrl          string `json:"base_url,omitempty"`
	ChannelPartnerId string `json:"channel_partner_id,omitempty"`
	ApiKey           string `json:"api_key,omitempty"`
	FirmId           string `json:"firm_id,omitempty"`
}

func (p FeeWiseProxy) handleConfig(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, p)
}

func (p FeeWiseProxy) handleGetCustomers(w http.ResponseWriter, r *http.Request) {
	url := fmt.Sprintf("%s/api/v3/partner/firms/%s/customers", p.BaseUrl, p.FirmId)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		writeJSONErrorMessage(w, "Server error", 500)
		return
	}
	req.Header.Set("x-api-key", p.ApiKey)
	req.Header.Set("x-channel-partner-id", p.ChannelPartnerId)
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		writeJSONErrorMessage(w, "Error calling feeWise get customers", 500)
		return

	}
	feeWiseCustomers, err := io.ReadAll(response.Body)
	if err != nil {
		writeJSONErrorMessage(w, "Error reading feeWise response", 500)
		return
	}

	log.Debug().Msgf("FeeWise Partner Api response: %s", string(feeWiseCustomers))
	var customersResponse CustomersResponse
	err = json.Unmarshal(feeWiseCustomers, &customersResponse)
	if err != nil {
		writeJSONErrorMessage(w, "Error unmarshalling feeWise response", 500)
		return
	}
	w.WriteHeader(response.StatusCode)
	writeJSON(w, customersResponse)
}

func (p FeeWiseProxy) handleGetAccounts(w http.ResponseWriter, r *http.Request) {
	url := fmt.Sprintf("%s/api/v3/partner/firms/%s/accounts", p.BaseUrl, p.FirmId)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		writeJSONErrorMessage(w, "Server error", 500)
		return
	}
	req.Header.Set("x-api-key", p.ApiKey)
	req.Header.Set("x-channel-partner-id", p.ChannelPartnerId)
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		writeJSONErrorMessage(w, "Error calling feeWise get bank accounts", 500)
		return
	}
	accounts, err := io.ReadAll(response.Body)
	if err != nil {
		writeJSONErrorMessage(w, "Error reading feeWise response", 500)
		return
	}
	log.Debug().Msgf("FeeWise Partner Api response: %s", string(accounts))
	var accountsResponse AccountsResponse
	err = json.Unmarshal(accounts, &accountsResponse)
	if err != nil {
		writeJSONErrorMessage(w, "Error unmarshalling feeWise response", 500)
		return
	}
	w.WriteHeader(response.StatusCode)
	writeJSON(w, accountsResponse)
}

func (p FeeWiseProxy) handleCreateCharge(w http.ResponseWriter, r *http.Request) {
	var chargeRequest CreateChargeRequest
	err := json.NewDecoder(r.Body).Decode(&chargeRequest)
	if err != nil {
		writeJSONErrorMessage(w, "Error decoding request", 500)
		return
	}

	feeWiseChargeRequest := FeeWiseChargeRequest{
		FirmID:              p.FirmId,
		Amount:              chargeRequest.Amount.String(),
		SettlementAccountId: chargeRequest.SettlementAccountID,
	}

	body, _ := json.Marshal(feeWiseChargeRequest)
	bodyReader := bytes.NewReader(body)
	url := fmt.Sprintf("%s/api/v3/partner/firms/%s/charges/payment_token/%s", p.BaseUrl, p.FirmId, chargeRequest.PaymentMethodID)
	req, err := http.NewRequest(http.MethodPost, url, bodyReader)
	if err != nil {
		writeJSONErrorMessage(w, "Server error", 500)
		return
	}
	req.Header.Set("x-api-key", p.ApiKey)
	req.Header.Set("x-channel-partner-id", p.ChannelPartnerId)
	req.Header.Set("content-type", "application/json")
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		writeJSONErrorMessage(w, "Error calling feeWise create and confirm charge", 500)
		return
	}

	createChargeResponse, err := io.ReadAll(response.Body)
	if err != nil {
		writeJSONErrorMessage(w, "Error reading feeWise response", 500)
		return
	}
	log.Debug().Msgf("FeeWise Partner Api response: %s", string(createChargeResponse))
	var result CreateChargeResponse
	err = json.Unmarshal(createChargeResponse, &result)
	if err != nil {
		writeJSONErrorMessage(w, "Error unmarshalling feeWise response", 500)
		return
	}
	w.WriteHeader(response.StatusCode)
	writeJSON(w, result)
}

func (p FeeWiseProxy) handleCreatePaymentToken(w http.ResponseWriter, r *http.Request) {
	var paymentTokenRequest CreatePaymentTokenRequest
	err := json.NewDecoder(r.Body).Decode(&paymentTokenRequest)
	if err != nil {
		writeJSONErrorMessage(w, "Error decoding request", 500)
		return
	}
	paymentTokenRequest.PaymentMethods = []PaymentMethod{PaymentMethodCard, PaymentMethodDirectDebit}
	paymentTokenRequest.TokenType = "SingleUse"

	body, _ := json.Marshal(paymentTokenRequest)
	bodyReader := bytes.NewReader(body)
	url := fmt.Sprintf("%s/api/v3/partner/firms/%s/payment_token", p.BaseUrl, p.FirmId)
	req, err := http.NewRequest(http.MethodPost, url, bodyReader)
	if err != nil {
		writeJSONErrorMessage(w, "Server error", 500)
		return
	}
	req.Header.Set("x-api-key", p.ApiKey)
	req.Header.Set("x-channel-partner-id", p.ChannelPartnerId)
	req.Header.Set("content-type", "application/json")
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		writeJSONErrorMessage(w, "Error calling feeWise create payment token", 500)
		return
	}
	paymentTokenResponse, err := io.ReadAll(response.Body)
	if err != nil {
		writeJSONErrorMessage(w, "Error reading feeWise response", 500)
		return
	}
	log.Debug().Msgf("FeeWise Partner Api response: %s", string(paymentTokenResponse))
	var result CreatePaymentTokenResponse
	err = json.Unmarshal(paymentTokenResponse, &result)
	if err != nil {
		writeJSONErrorMessage(w, "Error unmarshalling feeWise response", 500)
		return
	}
	w.WriteHeader(response.StatusCode)
	writeJSON(w, result)
}
