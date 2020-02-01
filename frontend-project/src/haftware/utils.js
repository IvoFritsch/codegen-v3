export const focusInput = ( id ) => {
  const input = document.getElementById( id );
  if( input ) input.focus();
}

export const sqlStringToDate = ( sqlString ) => {
  const date = new Date();
  date.setFullYear( sqlString.substring(0, 4) );
  date.setMonth( parseInt( sqlString.substring(5, 7), 10 ) -1 );
  date.setDate( sqlString.substring(8, 10) );
  return date;
}

export const monthToMillis = ( monthString ) => {
  const date = new Date();
  date.setFullYear( monthString.substring(3) );
  date.setMonth( parseInt( monthString.substring(0, 2), 10 ) -1 );
  date.setDate( 1 );
  date.setHours( 0 );
  date.setMinutes( 0 );
  date.setSeconds( 0 );
  const startDate = date.getTime();
  date.setMonth(date.getMonth()+1);
  const endDate = date.getTime();
  return {startDate, endDate};
}

export const millisToString = (millis) => {
  if( !millis ) return '';
  const isoString = new Date(millis - (new Date(millis).getTimezoneOffset() * 60000)).toISOString();
  return `${isoString.substring(8, 10)}/${isoString.substring(5, 7)}/${isoString.substring(0, 4)} ${isoString.substring(11, 16)}`;
}

export const millisToStringNoHour = (millis) => {
  if( !millis ) return '';
  const isoString = new Date(millis).toISOString();
  return `${isoString.substring(8, 10)}/${isoString.substring(5, 7)}/${isoString.substring(0, 4)}`;
}

export const stringDateFormat = (stringDate) => {
  if(!stringDate) return '';
  return `${stringDate.substring(8, 10)}/${stringDate.substring(5, 7)}/${stringDate.substring(0, 4)} ${stringDate.substring(11, 16)}`;
}

export const calculaDiferenca = (valorAntes, valorDepois, taxa) => {
  // console.log(valorAntes, valorDepois, taxa);
  
  if( !valorAntes || !valorDepois ) return 0;
  valorAntes = parseFloat( valorAntes, 10 );
  valorDepois = parseFloat( valorDepois, 10 );

  const diferenca = (((valorDepois - valorAntes) / valorAntes) * 100) - taxa;
  
  return `${diferenca.toFixed(2)}`;
}

export const removeFinalZerosNumber = ( stringNumber ) => {
  if(!stringNumber) return;
  let indexZeros = undefined;
  for (var i = 0; i < stringNumber.length; i++) {
    if( stringNumber[i] === '0' ) {
      if( typeof indexZeros === 'undefined' ) indexZeros = i;
    } else indexZeros = undefined;
  }

  if( typeof indexZeros !== 'undefined' ) {
    stringNumber = stringNumber.substring(0, indexZeros);
  }

  return parseFloat(stringNumber, 10);
}

export const addZero = ( number ) => {
  return number > 9 ? number : '0'+number;
}