var express = require('express');
var router = express.Router();
var Web3 = require('web3');
const fs = require("fs");
const solc = require('solc');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/create', function(req, res, next) {
    var web3;
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
        var source = fs.readFileSync('MyToken.sol', 'utf8');
        var compiledContract = solc.compile(source, 1);
        var abi = compiledContract.contracts[':MyToken'].interface;
        var bytecode = compiledContract.contracts[':MyToken'].bytecode;
        var gasEstimate = web3.eth.estimateGas({data: bytecode});
        var MyContract = web3.eth.contract(JSON.parse(abi));
        var myContractReturned = MyContract.new(1000, "testCoin",2,"TES", {
        from:"0x879609e964Ac7f113067F96486BA9fF2661C7330",
        data:bytecode,
        gas:gasEstimate}, function(err, myContract){
        if(!err) {
            if(!myContract.address) {
                console.log(myContract.transactionHash);
            } else {
                console.log(myContract.address); // the contract address
            }
        }
    });
        console.log("END OF COMPILATION");
});

module.exports = router;
