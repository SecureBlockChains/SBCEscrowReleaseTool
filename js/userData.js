const {shell} = require('electron');
var userAddress = document.getElementById("userAddress");
var userSecret = document.getElementById("userSecret");
var userHash = document.getElementById("userHash");
var userFulfillment = document.getElementById("userFulfillment");
var userSelectedFee = document.getElementById("userSelectedFee");
var resultDiv = document.getElementById("resultDiv");
var resultText = document.getElementById("resultText");
var walletRegex = /^s[a-km-zA-HJ-NP-Z1-9]{24,34}$/;
var thisFee;
var owner;
var condition;
var offerSequence;
var sequence;
var keypair;
var address;
var fulfillment;
var submitData = document.getElementById("submitData");

submitData.onclick = function(){
    address = userAddress.value;
    var passwordFulfillmentTest = isFullfillment(userFulfillment.value);
    function isFullfillment(str) {
        var isLowercase = str.startsWith("a022802");
        var isUppercase = str.startsWith("A022802");
        if ((isLowercase && str.length >= 32) || (isUppercase && str.length >= 32)){
          return true;
        }else {
          return false;
        }
    }
    if(userFulfillment.value == null || userFulfillment.value == "") {

        fulfillment = null;
    }else {
        if(passwordFulfillmentTest == false){
            var passwordBasedCondition = getBellsWithPassword(userFulfillment.value);
            fulfillment = passwordBasedCondition.fulfillment;
        }else{
            fulfillment = userFulfillment.value;
        }
    }

    resultDiv.style.display = "none";
    var validSecret = walletRegex.test(userSecret.value);
    if(validSecret == true){
        
        if(userSelectedFee.value == ""){
            thisFee = "5000";
            processEscrowRelease();
        }else if(Number(userSelectedFee.value) > 5000000){
            resultDiv.style.display = "block";
            resultDiv.style.border = "3px dashed red";
            resultText.innerHTML = "You have entered a network fee in excess of 5XRP which is CRAZY! 1 Million Drops is 1XRP. If you REALLY want to waste money, enter 4999999. "
            return;
        }else{
            thisFee = userSelectedFee.value;
            processEscrowRelease();
        }
        
    }else if (validSecret == false){
        resultDiv.style.display = "block";
        resultDiv.style.border = "1px dashed red";
        resultText.innerHTML = "This is not a valid Secret Key";
    }
}

var processEscrowRelease = function(){
    keypair = myKeyPair(userSecret.value);
        getTransaction(function(obj){
            owner = obj.result.Account;
            condition = obj.result.Condition;
            offerSequence = obj.result.Sequence;
            getAccountInfo(function(obj){
                if(obj.result.error == "actNotFound"){
                    resultDiv.style.display = "block";
                    resultDiv.style.border = "3px dashed red";
                    resultText.innerHTML = "This account has not been activated. Use an account with at least 21 XRP"
                }else{
                    sequence = obj.result.account_data.Sequence;
                }
                
                var escrowBlob = signEscrowFinish(sequence, offerSequence, address, keypair, owner, condition, fulfillment, thisFee);
                submit(function(obj){
                    if(obj.result.engine_result == "tesSUCCESS"){
                        resultDiv.style.display = "block";
                        resultDiv.style.border = "3px dashed green";
                        hashLink = "https://xrpcharts.ripple.com/#/transactions/"+obj.result.tx_json.hash
                        resultText.innerHTML = "Your Escrow Has Been Unlocked. <a href='#' onclick='openSite(hashLink)'>See It On XRP Charts</a> It may take a minute or two to show up."
                    }else if(obj.result.engine_result == "tecNO_TARGET"){
                        resultDiv.style.display = "block";
                        resultDiv.style.border = "3px dashed red";
                        resultText.innerHTML = "There is a problem. It is likely this escrow has been already been released."
                    }else if(obj.result.error == "invalidTransaction"){
                        resultDiv.style.display = "block";
                        resultDiv.style.border = "3px dashed red";
                        resultText.innerHTML = "This is not a valid Transaction. Please Check all information data and try again."
                    }else if(obj.result.engine_result == "tecCRYPTOCONDITION_ERROR"){
                        resultDiv.style.display = "block";
                        resultDiv.style.border = "3px dashed red";
                        resultText.innerHTML = "This is not the correct Fulfillment ID for this Escrow."
                    }else if(obj.result.engine_result == "telINSUF_FEE_P"){
                        resultDiv.style.display = "block";
                        resultDiv.style.border = "3px dashed red";
                        resultText.innerHTML = "This fee is not enough for current network conditions. We reccomend a fee of at least 5000 drops."
                    }else if(obj.result.engine_result == "terQUEUED"){
                        resultDiv.style.display = "block";
                        resultDiv.style.border = "3px dashed green";
                        hashLink = "https://xrpcharts.ripple.com/#/transactions/"+obj.result.tx_json.hash
                        resultText.innerHTML = "Your Escrow Has Been Queued because of the Low fee, It will be unlocked as soon as network conditions permit. <a href='#' onclick='openSite(hashLink)'>See It On XRP Charts</a> It may take a minute or two to show up."
                    }else if(obj.result.engine_result == "temMALFORMED" || obj.result.engine_result == "temBAD_SIGNATURE"){
                        resultDiv.style.display = "block";
                        resultDiv.style.border = "3px dashed red";
                        resultText.innerHTML = "There is a problem. It is likely this TX hash does not reference an Escrow."
                    }
                }, escrowBlob.signedTransaction)
                },address);
        },userHash.value);  
    }


var openSite = function(site){
    shell.openExternal(site);
}