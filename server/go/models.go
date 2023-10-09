package main

import (
	"time"

	"github.com/gofrs/uuid"
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
		Debtor *struct {
			ContactNumber string `json:"contact_number"`
			DebtorID      string `json:"debtor_id"`
			Email         string `json:"email"`
			ExternalID    string `json:"external_id"`
			FirstName     string `json:"first_name"`
			LastName      string `json:"last_name"`
			Name          string `json:"name"`
		} `json:"debtor,omitempty"`
		PaymentMethods *[]CustomerPaymentMethod `json:"payment_methods,omitempty"`
	} `json:"customers"`
}

type CustomerPaymentMethod struct {
	Card            *CardPayment   `json:"card,omitempty"`
	CardDescription *string        `json:"card_description,omitempty"`
	Debit           *DebitPayment  `json:"debit,omitempty"`
	PaymentMethod   *PaymentMethod `json:"payment_method,omitempty"`

	// PaymentToken The unique ID for this customer's payment method, this can be used to charge the associated customer
	PaymentToken *uuid.UUID `json:"payment_token,omitempty"`
}

// CardPayment defines model for CardPayment.
type CardPayment struct {
	CardholderName *string `json:"cardholder_name,omitempty"`

	// Country Country code (e.g. US, CA)
	Country        *string    `json:"country,omitempty"`
	ExpirationDate *time.Time `json:"expiration_date,omitempty"`

	// FundingType Funding type (e.g. credit, debit)
	FundingType *string `json:"funding_type,omitempty"`

	// Scheme Card scheme (e.g. Visa, Mastercard)
	Scheme *string `json:"scheme,omitempty"`

	// SchemePartialNumber Partial card number
	SchemePartialNumber *string `json:"scheme_partial_number,omitempty"`
}

// DebitPayment defines model for DebitPayment.
type DebitPayment struct {
	// AccountName Name of the account holder
	AccountName *string `json:"account_name,omitempty"`

	// AccountPartialNumber Partial account number
	AccountPartialNumber *string `json:"account_partial_number,omitempty"`

	// BankName Name of the bank
	BankName *string `json:"bank_name,omitempty"`

	// BranchCode Bank branch code
	BranchCode *string `json:"branch_code,omitempty"`

	// Country Country code (e.g. US, CA)
	Country *string `json:"country,omitempty"`
}

type PaymentMethod string

const (
	PaymentMethodCard        PaymentMethod = "Card"
	PaymentMethodDirectDebit PaymentMethod = "DirectDebit"
)

type CreatePaymentTokenRequest struct {
	Debtor struct {
		ExternalID    string `json:"external_id,omitempty"`
		FirstName     string `json:"first_name,omitempty"`
		LastName      string `json:"last_name,omitempty"`
		Email         string `json:"email,omitempty"`
		ContactNumber string `json:"contact_number,omitempty"`
	} `json:"debtor,omitempty"`
	TokenType      string           `json:"token_type,omitempty"`
	PaymentMethods *[]PaymentMethod `json:"payment_methods,omitempty"`
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
