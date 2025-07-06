const checkoutNodeJssdk = require('paypal/checkout-server-sdk');

function environment() {
    let clientId = Process.env.AcDoUU31dxsExW07iXutn1ahhWT2aT2aTQWomVVVpD1LO5Rcg9RkA0eR9ycanbaii31pxuw6FWdSZCkbwf9
    let clientSecret = process.env.EMsStX6qKu0-Znb__r9h982-XZfno6V_XVinsfXsnlS_EAjhTTwWnKKQ7Pa7Sd;

    return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
};

module.exports = { client };