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
	err := godotenv.Load()
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
	return withHeaders(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != m {
			writeJSONError(w, nil, http.StatusMethodNotAllowed)
			return
		}
		h(w, r)
	})
}

func withHeaders(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") //don't do this for an actual app server pls, cbf implementing options
		h(w, r)
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
	return
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
