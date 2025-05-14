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
	Charge struct {
		PaymentMethodID         string          `json:"paymentMethodID"`
		Amount                  decimal.Decimal `json:"amount"`
		SettlementAccountID     string          `json:"settlement_account_id"`
		Debtor                  Debtor          `json:"debtor,omitempty"`
		ChargeId                string          `json:"charge_id,omitempty"`
		PaymentID               string          `json:"payment_id,omitempty"`
		SurchargeChoiceOverride string          `json:"surcharge_choice_override,omitempty"`
	}
}

type ConfirmChargeRequest struct {
	ChargeId  string `json:"charge_id,omitempty"`
	PaymentID string `json:"payment_id,omitempty"`
}

type FeeWiseChargeRequest struct {
	Charge ChargeRequest `json:"charge,omitempty"`
}

type ChargeRequest struct {
	Amount                  string   `json:"amount"`
	SettlementAccountId     string   `json:"settlement_account_id"`
	Description             string   `json:"description"`
	Debtor                  Debtor   `json:"debtor,omitempty"`
	Notes                   []string `json:"notes,omitempty"`
	SurchargeChoiceOverride string   `json:"surcharge_choice_override,omitempty"`
}
type PaymentReviewResponse struct {
	PaymentReview CreateChargeResponse `json:"payment_review"`
}

type CreateChargeResponse struct {
	Charge         *Charge         `json:"charge,omitempty"`
	PaymentDetails *PaymentDetails `json:"payment_details,omitempty"`
}

type Charge struct {
	Amount              decimal.Decimal  `json:"amount"`
	AmountDue           *decimal.Decimal `json:"amount_due,omitempty"`
	ChargeId            *uuid.UUID       `json:"charge_id,omitempty"`
	Debtor              *Debtor          `json:"debtor,omitempty"`
	Description         *string          `json:"description,omitempty"`
	ExternalId          *string          `json:"external_id,omitempty"`
	ExternalReference   *string          `json:"external_reference,omitempty"`
	FirmId              *uuid.UUID       `json:"firm_id,omitempty"`
	SettlementAccountId *uuid.UUID       `json:"settlement_account_id,omitempty"`
}
type PaymentDetails struct {
	Amount             *decimal.Decimal `json:"amount,omitempty"`
	ArtifactId         *uuid.UUID       `json:"artifact_id,omitempty"`
	CardDetails        *CardPayment     `json:"card_details,omitempty"`
	CustomerFeeAmount  *decimal.Decimal `json:"customer_fee_amount,omitempty"`
	CustomerFeePricing *string          `json:"customer_fee_pricing,omitempty"`
	Date               *time.Time       `json:"date,omitempty"`
	DirectDebitDetails *DebitPayment    `json:"direct_debit_details,omitempty"`
	PayerDetails       *Payer           `json:"payer_details,omitempty"`
	PaymentId          *uuid.UUID       `json:"payment_id,omitempty"`
	PaymentMethod      *PaymentMethod   `json:"payment_method,omitempty"`
	SessionId          *uuid.UUID       `json:"session_id,omitempty"`
	Subtotal           *decimal.Decimal `json:"subtotal,omitempty"`
}

type CardPayment struct {
	Country             *string `json:"country,omitempty"`
	FundingType         *string `json:"funding_type,omitempty"`
	Scheme              *string `json:"scheme,omitempty"`
	SchemePartialNumber *string `json:"scheme_partial_number,omitempty"`
}

type DebitPayment struct {
	AccountName          *string `json:"account_name,omitempty"`
	AccountPartialNumber *string `json:"account_partial_number,omitempty"`
	BankName             *string `json:"bank_name,omitempty"`
	BranchCode           *string `json:"branch_code,omitempty"`
	Country              *string `json:"country,omitempty"`
}

type Payer struct {
	Address       *string `json:"address,omitempty"`
	ContactNumber *string `json:"contact_number,omitempty"`
	Email         *string `json:"email,omitempty"`
	Name          *string `json:"name,omitempty"`
}
type Debtor struct {
	ExternalID    *string `json:"external_id,omitempty"`
	FirstName     *string `json:"first_name,omitempty"`
	LastName      *string `json:"last_name,omitempty"`
	Email         *string `json:"email,omitempty"`
	ContactNumber *string `json:"contact_number,omitempty"`
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
