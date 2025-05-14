export const hostedFieldStyles = {
  billingWebApp: {
    appearance: {
      variables: {
        // color: 'rgb(0, 0, 0)',
        fontSizeSm: '14px',
        fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
      },
    },
  },
  paymentPortal: {
    appearance: {
      variables: {
        // color: 'rgb(85, 85, 85)',
        fontSizeSm: '16px',
        fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
      },
    },
  },
  feeWise: {
    clientSecret: '',
    // Fully customizable with appearance API.
    fonts: [
      {
        cssSrc:
          'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap',
      },
    ],
    backgroundStyles: { backgroundColor: '#ffdfcb' },
    appearance: {
      variables: {
        fontFamily: 'Lato, helvetica, tahoma, calibri, sans-serif',
        fontWeightNormal: '500',
        fontSizeSm: '14px',
      },
      theme: 'none',
      labels: 'floating',
      rules: {
        '.Label': { color: '#b5b5b5' },
        '.PickerItem': {
          border: '1px solid #b5b5b5',
        },
        '.Input, .Tab': {
          border: '1px solid #b5b5b5',
          padding: '6px 8px 6px 8px',
        },
        '.Input:hover, .Tab:hover': {
          border: '1px solid #974bc3',
        },
        '.Input:focus, .Tab--selected': {
          border: '1px solid #974bc3',
          boxShadow: '0px 0px 0px 1px #974BC3',
          outline: 'none',
        },
        '.TabIcon, .TabIcon--selected, .TabIcon:hover, .Tab': {
          color: '#974bc3',
          // fill: 'var(--colorIconTab)',
          fill: '#974bc3',
        },
        '.TabLabel, .TabLabel--selected': {
          color: '#974bc3',
        },
      },
    },
  },
};
