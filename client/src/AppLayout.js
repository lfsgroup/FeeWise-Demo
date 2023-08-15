import Home from './Home';
import NewCustomerContainer from './NewCustomerContainer';
import CaptureRecurringContainer from './CaptureRecurringContainer';
import CaptureAndChargeContainer from './CaptureAndChargeContainer';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from './logo.svg';
import { ROUTE_CAPTURE_RECURRING, ROUTE_CAPTURE_AND_CHARGE, ROUTE_NEW_CUSTOMER } from './routes';
import { BASE_URL } from './baseUrl';
export const AppLayout = () => {
  const [config, setConfig] = useState({
    firmId: '',
    apiKey: '',
    channelPartnerId: '',
    baseUrl: '',
  });

  useEffect(() => {
    fetch(`${BASE_URL}/config`).then(async (r) => {
      const configResponse = await r.json();
      const config = {
        firmId: configResponse.firm_id,
        apiKey: configResponse.api_key,
        channelPartnerId: configResponse.channel_partner_id,
        baseUrl: configResponse.base_url,
      };
      setConfig(config);
    });
  }, []);

  return (
    <>
      <img src={logo} alt="sb Logo" />
      <h2>Server will be calling the FeeWise Partner Api with the below config</h2>
      <p>
        <b>FirmId</b> {config.firmId}
      </p>
      <p>
        <b>Channel Partner ID</b> {config.channelPartnerId}
      </p>
      <p>
        <b>Api Key</b> {config.apiKey}
      </p>
      <p>
        <b>FeeWise Partner API base URL</b> {config.baseUrl}
      </p>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={ROUTE_CAPTURE_RECURRING} element={<CaptureRecurringContainer />} />
        <Route path={ROUTE_CAPTURE_AND_CHARGE} element={<CaptureAndChargeContainer />} />
        <Route path={ROUTE_NEW_CUSTOMER} element={<NewCustomerContainer />} />
      </Routes>
    </>
  );
};
