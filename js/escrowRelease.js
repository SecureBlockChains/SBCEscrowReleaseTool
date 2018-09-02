const sign = require("ripple-sign-keypairs");
var rippleKeyPairs = require("ripple-keypairs");
const cc = require("five-bells-condition");
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var SERVER = "https://s2.ripple.com:51234";


var myKeyPair = function(userSecret){
  return rippleKeyPairs.deriveKeypair(userSecret);
}

var getAccountInfo = function(callback,address) {
  var xhttp = new XMLHttpRequest();
  var daJson = {
    "method": "account_info",
    "params": [
      {
        "account": address,
        "ledger_index":"validated"
      }
    ]
  }
  var myJsonString = JSON.stringify(daJson);
  xhttp.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {

        var myObj = JSON.parse(xhttp.responseText);
        if(callback) callback(myObj);

      }else {

      }

  };
  xhttp.open("POST", SERVER, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(myJsonString);
}

var getTransaction = function(callback,hash) {
  var xhttp = new XMLHttpRequest();
  var daJson = {
    "method": "tx",
    "params": [
      {
        "transaction": hash,
        "binary": false
      }
    ]
  }
  var myJsonString = JSON.stringify(daJson);
  xhttp.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {

        var myObj = JSON.parse(xhttp.responseText);

        if(callback) callback(myObj);

      }else {

      }

  };
  xhttp.open("POST", SERVER, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(myJsonString);
}

var signEscrowFinish = function(sequence,offerSequence,thisAddress,keypair,owner,condition,fulfillment,fee) {

    let tx = {
          "TransactionType":"EscrowFinish",
          "Account":thisAddress,
          "Owner":owner,
          "Fee":fee,
          "Sequence":sequence,
          "OfferSequence":offerSequence,
          
        }
        if (condition != null) {
          tx.Condition = condition.toUpperCase();
        }
  
        if (fulfillment != null) {
          tx.Fulfillment =  fulfillment.toUpperCase();
        }
        console.log(tx);
    const txJSON = JSON.stringify(tx);
    const txSign = sign(txJSON, keypair);
    return txSign
  }

var submit = function(callback,txBlob) {
    var xhttp = new XMLHttpRequest();
    var daJson = {
      "method": "submit",
      "params": [
        {
          "tx_blob":txBlob,
          "binary": false
        }
      ]
    }
    var myJsonString = JSON.stringify(daJson);
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

          var myObj = JSON.parse(xhttp.responseText);

          if(callback) callback(myObj);
  
        }else {
  
        }
  
    };
    xhttp.open("POST", SERVER, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(myJsonString);
  }

  function getBellsWithPassword(str) {
    var currentStr = str
    var currentLength = 32 - str.length
    if(currentLength > 0) {
      for(var i = 0; i < currentLength; i++){
        currentStr = currentStr+"0";
      }
    }
    var buf = Buffer.from(currentStr, 'utf8');
    const fulfillment_bytes = buf;
    const myFulfillment = new cc.PreimageSha256();
    myFulfillment.setPreimage(fulfillment_bytes);
  
    var fulfillment = myFulfillment.serializeBinary().toString('hex')
    var condition = myFulfillment.getConditionBinary().toString('hex')
  
    var bells = {
      "fulfillment":fulfillment,
      "condition":condition
    }
  
    return bells;
  }