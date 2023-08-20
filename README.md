## FeeWise demo

### Overview
This repository contains a small demonstration of the in-development FeeWise-js, which aims to provide a hostable FeeWise page for collecting payment method details.

It contains a React client app, with choice of a self-hosted Go server, or .NET 7 server

#### Client App
Written in React using Create React App, the app provides the following functionality:
- Retrieve customers who have stored payment methods
- Charge an existing payment method
- Make a single charge to a new payment method
- Add a new reusable payment method
- Create a new customer and add a new reusable payment method


#### Server
FeeWise partner api credentials are private, so the FeeWise partner api should <u>never</u> be called from a browser.

The following servers are provided for reference, and simply act as a passthrough for the partner api:
- .NET 7
    - utilises the FeeWise client library for consuming the partner api: https://www.nuget.org/packages/FeeWise 
- Go
    - illustrates a more manual approach, no client library available for Go at this time

### Running
- configure and run your choice of server:
    - [Go](/server/go/README.md)
    - [.NET 7](/server/dotnet/README.md)

- run the client app:
    - [React](/client/README.md)



