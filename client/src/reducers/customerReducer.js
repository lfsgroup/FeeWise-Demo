export const customerReducer = (customer, action) => {
  switch (action.type) {
    case 'update':
      return { ...customer, customer: action.customer };
    default:
      return { ...customer };
  }
};
