// import HwResponse from './HwResponse.js';

const link = 'http://localhost:9080/api/';

export const getCookie = (cname) => {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const apiSend = ( path, data={}, options={} ) => {

  if( !options.method ) {
    options.method = 'POST';
  }

  let init = {method: options.method,
              ...( options.method === 'POST' ? {body: JSON.stringify( data )} : {}),
              credentials: 'include'
             };

  return fetch(`${ link }${ path }`, init )
        .then( res => res.text() )
        .then( res => {
          try {
            return JSON.parse( res );
          } catch (e) {
            return {};
          }
        } )
        .then( res => {
          
          console.log( options.method + ' > ', `${ link }${ path }`, data, res );
          
          return res;
        })
}

export const setURLParameter = ( key, value ) => {
  const params = new URLSearchParams( window.location.search );
  params.set( key, value );

  window.history.replaceState( {}, '', `?${params}` );
}

export const deleteURLParameter = ( key ) => {
  const params = new URLSearchParams( window.location.search );
  params.delete( key );

  window.history.replaceState( {}, '', `?${params}` );
}

export const getURLParameter = ( name ) => {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(window.location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

export default apiSend;
