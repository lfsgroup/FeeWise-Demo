package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/rs/zerolog/log"

	"github.com/joho/godotenv"
)

func main() {

	envFile := os.Getenv("ENV_FILE")
	if envFile == "" {
		envFile = ".env"
	}

	err := godotenv.Load(envFile)
	if err != nil {
		log.Fatal().Msg("Error loading .env file")
	}

	feeWise := FeeWiseProxy{
		BaseUrl:          os.Getenv("PARTNER_API_URL"),
		ChannelPartnerId: os.Getenv("CHANNEL_PARTNER_ID"),
		ApiKey:           os.Getenv("PARTNER_API_KEY"),
		FirmId:           os.Getenv("FIRM_ID"),
	}

	handleFunc(http.MethodGet, "/config", feeWise.handleConfig)
	handleFunc(http.MethodGet, "/customers", feeWise.handleGetCustomers)
	handleFunc(http.MethodGet, "/accounts", feeWise.handleGetAccounts)
	handleFunc(http.MethodPost, "/create-charge", feeWise.handleCreateCharge)
	handleFunc(http.MethodPost, "/create-payment-token", feeWise.handleCreatePaymentToken)

	log.Printf("server running at %s", os.Getenv("DOMAIN"))
	log.Fatal().Msg(http.ListenAndServe(os.Getenv("DOMAIN"), nil).Error())

}

func handleFunc(method, path string, h http.HandlerFunc) {
	http.HandleFunc(path, withMethod(method, h))
}

func withMethod(m string, h http.HandlerFunc) http.HandlerFunc {
	return withCors(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != m && r.Method != "OPTIONS" {
			writeJSONError(w, nil, http.StatusMethodNotAllowed)
			return
		}
		h(w, r)
	})
}

func withCors(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		} else {
			h(w, r)
		}
	}
}

func writeJSON(w http.ResponseWriter, v interface{}) {

	var buf bytes.Buffer
	if err := json.NewEncoder(&buf).Encode(v); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("json.NewEncoder.Encode: %v", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if _, err := io.Copy(w, &buf); err != nil {
		log.Printf("io.Copy: %v", err)
		return
	}
}

func writeJSONError(w http.ResponseWriter, v interface{}, code int) {
	w.WriteHeader(code)
	writeJSON(w, v)
}

func writeJSONErrorMessage(w http.ResponseWriter, message string, code int) {
	resp := &ErrorResponse{
		Error: &ErrorResponseMessage{
			Message: message,
		},
	}
	writeJSONError(w, resp, code)
}
