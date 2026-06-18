export const currencyFormatter = new Intl.NumberFormat(
  'en-US', // english - united states
  {
    style: 'currency', // format it as money
    currency: 'USD', //dollars
  }
);




// Intl.NumberFormat Creates a formatter object.
// 'en-US' Means: English - United States
// US: $12.99 , Germany: 12,99 €
