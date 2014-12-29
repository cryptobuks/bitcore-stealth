'use strict';

var assert = require('assert');
var bitcore = require('bitcore');

var StealthAddress = require('../');

var PrivateKey = bitcore.PrivateKey;

var aliceKey = new PrivateKey('L1Ejc5dAigm5XrM3mNptMEsNnHzS7s51YxU7J61ewGshZTKkbmzJ');
var bobKey   = new PrivateKey('KxfxrUXSMjJQcb3JgnaaA6MqsrKQ1nBSxvhuigdKRyFiEm6BZDgG');

var saddrLive = 'vJmtjxSDxNPXL4RNapp9ARdqKz3uJyf1EDGjr1Fgqs9c8mYsVH82h8wvnA4i5rtJ57mr3kor1EVJrd4e5upACJd588xe52yXtzumxj';
var scanKeyLive = '025e58a31122b38c86abc119b9379fe247410aee87a533f9c07b189aef6c3c1f52';
var spendKeyLive = '03616562c98e7d7b74be409a787cec3a912122f3fb331a9bee9b0b73ce7b9f50af';

var saddrTest = 'waPTqV9DUa13rP6meQh2b8XUHrxDDgL5yCycNpRLh5CzyZXmhzR3kLwyVSNxTBhW8dwHbwVhMATrepTRRF79mw3r3hHrAGwCiebxTi';
var scanKeyTest = '02161a00c1033d2b3ad25adb48b5b8f762458ef7d00be574ef2b5234c736437e55';
var spendKeyTest = '03c754bddd34efee26ff66084ca101e1b03da4ec623d34051edaef48e1b0c06f99';

var multisigAddress = '2Ctqsd4cHgrGfMqFgQXrRmREFZdSrNSys7LQSMaK6y9bhsVsFuDbsgipTCXyZtRwHydd6Wcacghh78oHA8NcGAhqcpRfPHFpj6XvZGyGgsN2HDXtd8ULjpoUCbJfPJB4woFhX2Rds4ZwfQ5xmHaW';

describe('Stealth Address', function() {
  
  it('provides a constructor', function() {
    assert.equal(typeof StealthAddress , 'function');
  });
  
  it('should not require the "new" keyword', function() {
    var address = StealthAddress(saddrLive);
    assert.ok(address instanceof StealthAddress);
  });
  
  it('creates from livenet string', function() {
    var address = new StealthAddress(saddrLive);
    assert.ok(address instanceof StealthAddress);

    assert.equal(address.network, bitcore.Networks.livenet);
    assert.equal(address.reuseScan, 0);
    assert.equal(address.scanKey.toString(), scanKeyLive);
    assert.equal(address.spendKeys.length, 1);
    assert.equal(address.spendKeys[0].toString(), spendKeyLive);
    assert.equal(address.signatures, 1);
    assert.equal(address.prefix, '');
  });

  it('creates from testnet string', function() {
    var address = new StealthAddress(saddrTest);
    assert.ok(address instanceof StealthAddress);

    assert.equal(address.network, bitcore.Networks.testnet);
    assert.equal(address.reuseScan, false);
    assert.equal(address.scanKey.toString(), scanKeyTest);
    assert.equal(address.spendKeys.length, 1);
    assert.equal(address.spendKeys[0].toString(), spendKeyTest);
    assert.equal(address.signatures, 1);
    assert.equal(address.prefix, '');
  });

  it('creates from scanKey', function() {
    var scankey = new bitcore.PublicKey(scanKeyLive);
    var address = new StealthAddress(scankey);
    assert.equal(address.reuseScan, true);
    console.log(address.toString());
  });

  it('creates from spendKeys array and scanKey', function() {
    var scankey = new bitcore.PublicKey(scanKeyLive);
    var spendKeys = [new bitcore.PublicKey(spendKeyLive)];

    var address = new StealthAddress(scankey, spendKeys);
    assert.equal(address.toString(), saddrLive);
    assert.equal(address.reuseScan, false);
  });

  it('creates from simple spendKey and scannKey', function() {
    var scankey = new bitcore.PublicKey(scanKeyLive);
    var spendKey = new bitcore.PublicKey(spendKeyLive);

    var address = new StealthAddress(scankey, spendKey);
    assert.equal(address.toString(), saddrLive);
    assert.equal(address.reuseScan, false);
  });

  it('creates from simple spendKey and scannKey strings', function() {
    var address = new StealthAddress(scanKeyLive, spendKeyLive);
    assert.equal(address.toString(), saddrLive);
    assert.equal(address.reuseScan, false);
  });

  it('support multisig addresses', function() {
    var spendKeys = [spendKeyLive, spendKeyTest];
    var address = new StealthAddress(scanKeyLive, spendKeys, 2);
    assert.equal(address.toString(), multisigAddress);
    assert.equal(address.reuseScan, false);
  });

  it('multisig addresses requires all signatures by defualt', function() {
    var spendKeys = [spendKeyLive, spendKeyTest];
    var address = new StealthAddress(scanKeyLive, spendKeys);
    assert.equal(address.signatures, 2);
  });

  it('validates number of signatures', function() {
    var spendKeys = [spendKeyLive, spendKeyLive];
    var address = new StealthAddress(scanKeyLive, spendKeys, 2);
    assert.throws(function() {
      new StealthAddress(spendKeys, scanKeyLive, 3);
    });
  });

});