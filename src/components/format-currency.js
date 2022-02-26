const formatCurrency = (num, currency = 'USD', locale = 'en-US') => {
  if (currency === 'PHP') locale = 'fil';
  if (currency === 'AUS') currency = 'USD';
  if (currency.includes('Z')) 
    currency =
        currency === 'Z-PHP'
          ? 'PHP'
          : currency === 'Z-C$'
          ? 'CAD'
          : currency === 'Z-MXN'
          ? 'MXN'
          : 'USD';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(num);
}

export default formatCurrency;
