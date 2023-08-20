package main

import (
	"time"

	"github.com/shopspring/decimal"
)

type AccountsResponse struct {
	OfficeAccounts []struct {
		AccountID     string `json:"account_id"`
		AccountName   string `json:"account_name"`
		AccountNumber string `json:"account_number"`
		AccountType   string `json:"account_type"`
		Bank          string `json:"bank"`
		BranchCode    string `json:"branch_code"`
		IsDefault     bool   `json:"is_default"`
	} `json:"office_accounts"`
	TrustAccounts []struct {
		AccountID     string `json:"account_id"`
		AccountName   string `json:"account_name"`
		AccountNumber string `json:"account_number"`
		AccountType   string `json:"account_type"`
		Bank          string `json:"bank"`
		BranchCode    string `json:"branch_code"`
		IsDefault     bool   `json:"is_default"`
	} `json:"trust_accounts"`
}

type CustomersResponse struct {
	Customers []struct {
		Debtor struct {
			ContactNumber string `json:"contact_number"`
			DebtorID      string `json:"debtor_id"`
			Email         string `json:"email"`
			ExternalID    string `json:"external_id"`
			FirstName     string `json:"first_name"`
			LastName      string `json:"last_name"`
			Name          string `json:"name"`
		} `json:"debtor"`
		PaymentMethods []struct {
			Country             string    `json:"country"`
			ExpirationDate      time.Time `json:"expiration_date"`
			FundingType         string    `json:"funding_type"`
			PaymentToken        string    `json:"payment_token"`
			Scheme              string    `json:"scheme"`
			SchemePartialNumber string    `json:"scheme_partial_number"`
		} `json:"payment_methods,omitempty"`
	} `json:"customers"`
}

type CreatePaymentTokenRequest struct {
	Debtor struct {
		ExternalID    string `json:"external_id,omitempty"`
		FirstName     string `json:"first_name,omitempty"`
		LastName      string `json:"last_name,omitempty"`
		Email         string `json:"email,omitempty"`
		ContactNumber string `json:"contact_number,omitempty"`
	} `json:"debtor,omitempty"`
	TokenType string `json:"token_type,omitempty"`
}

type CreatePaymentTokenResponse struct {
	CaptureURI string `json:"capture_uri"`
	Debtor     struct {
		ContactNumber string `json:"contact_number"`
		DebtorID      string `json:"debtor_id"`
		Email         string `json:"email"`
		ExternalID    string `json:"external_id"`
		FirstName     string `json:"first_name"`
		LastName      string `json:"last_name"`
		Name          string `json:"name"`
	} `json:"debtor"`
	PaymentToken string `json:"payment_token"`
}

type CreateChargeRequest struct {
	PaymentMethodID     string          `json:"paymentMethodID"`
	Amount              decimal.Decimal `json:"amount"`
	SettlementAccountID string          `json:"settlementAccountId"`
}

type FeeWiseChargeRequest struct {
	FirmID              string `json:"firm_id"`
	Amount              string `json:"amount"`
	SettlementAccountId string `json:"settlement_account_id"`
	Description         string `json:"description"`
	Debtor              struct {
		ExternalID    string `json:"external_id"`
		FirstName     string `json:"first_name"`
		LastName      string `json:"last_name"`
		Email         string `json:"email"`
		ContactNumber string `json:"contact_number"`
	} `json:"debtor,omitempty"`
	Notes []string `json:"notes,omitempty"`
}

type CreateChargeResponse struct {
	Charge struct {
		Amount              string   `json:"amount"`
		ChargeID            string   `json:"charge_id"`
		Currency            string   `json:"currency"`
		Description         *string  `json:"description,omitempty"`
		ExternalReference   string   `json:"external_reference"`
		FirmID              string   `json:"firm_id"`
		Notes               []string `json:"notes"`
		SettlementAccountID string   `json:"settlement_account_id"`
		Debtor              struct {
			ExternalID    *string `json:"external_id,omitempty"`
			FirstName     *string `json:"first_name,omitempty"`
			LastName      *string `json:"last_name,omitempty"`
			Email         *string `json:"email,omitempty"`
			ContactNumber *string `json:"contact_number,omitempty"`
		} `json:"debtor,omitempty"`
	} `json:"charge"`
	PaymentID string `json:"payment_id"`
}

// ErrorResponseMessage represents the structure of the error
// object sent in failed responses.
type ErrorResponseMessage struct {
	Message string `json:"message"`
}

// ErrorResponse represents the structure of the error object sent
// in failed responses.
type ErrorResponse struct {
	Error *ErrorResponseMessage `json:"error"`
}
