var DibuToken=artifacts.require('../contracts/dibuToken.sol');

contract('DibuToken',function(accounts) {
    var tokenInstance;
    it('initialises the contract with the correct values',function(){
        return DibuToken.deployed().then(function(instance){
            tokenInstance=instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name,'Dibu','has the correct name');
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol,'dibu','has the correct symbol');
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard,'Dibu Token v1.0','has the correct standard');
        })

    })
    it('sets the total supply upon deployment',function(){
       return DibuToken.deployed().then(function(instance){
           tokenInstance=instance;
           return tokenInstance.totalSupply();
       }).then(function(totalSupply){
          assert.equal(totalSupply.toNumber(),1000000,'sets the total to 1,000,000');
          return tokenInstance.balanceOf(accounts[0]);
       }).then(function(adminBalance){
          assert.equal(adminBalance.toNumber(),1000000,'it allocates the initial supply to the admin');
       });
    });

    it('transfers token owernship',function(){
        return DibuToken.deployed().then(function(instance){
            tokenInstance=instance;
            return tokenInstance.transfer(accounts[1],99999999);

        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0,'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1],25000,{from:accounts[0]});
           
        }).then(function(success){
            assert.equal(success,true,'it returns true');
            return tokenInstance.transfer(accounts[1],25000,{from:accounts[0]}); 
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,'triggers one event');
            assert.equal(receipt.logs[0].event,'Transfer','should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from,accounts[0],'logs the account the tokens are transfered from');
            assert.equal(receipt.logs[0].args._to,accounts[1],'logs the account the tokens are transfered to');
            assert.equal(receipt.logs[0].args._value,25000,'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance){
            assert.equal(balance.toNumber(),25000,'adds the mount to the receiving account'); 
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(),975000,'deducts the amount from the sender');
        });

    });
    it('approves token sfor delegated transfer',function(){
        return DibuToken.deployed().then(function(instance){
            tokenInstance=instance;
            return tokenInstance.approve.call(accounts[1],100);
        }).then(function(success){
            assert.equal(success,true,'it return true');
            return tokenInstance.approve(accounts[1],100,{from:accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,'triggers one event');
            assert.equal(receipt.logs[0].event,'Approval','should be the "Approval" event');
            assert.equal(receipt.logs[0].args._owner,accounts[0],'logs the account the tokens are transfered from');
            assert.equal(receipt.logs[0].args._spender,accounts[1],'logs the account the tokens are transfered to');
            assert.equal(receipt.logs[0].args._value,100,'logs the transfer amount');
            return tokenInstance.allowance(accounts[0],accounts[1]);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(),100,'stores the allowance for delegated transfer');
        })
    });

    it('handles delegated token transfer',function(){
        return DibuToken.deployed().then(function(instance){
            tokenInstance=instance;
             fromAccount=accounts[2];
             toAccount=accounts[3];
             spendingAccount=accounts[4];
            return tokenInstance.transfer(fromAccount,100,{from:accounts[0]});
        }).then(function(receipt){
            return tokenInstance.approve(spendingAccount,10,{from:fromAccount});
        }).then(function(receipt){
            return tokenInstance.transferFrom(fromAccount,toAccount,9999,{from:spendingAccount});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0,'cannot transfer value larger than balance ');
            return tokenInstance.transferFrom(fromAccount,toAccount,20,{from:spendingAccount});

        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0,'cannot transfer value larger than approved amount');
            return tokenInstance.transferFrom.call(fromAccount,toAccount,10,{from:spendingAccount});
        }).then(function(success){
            assert.equal(success,true,'it returns true');
            return tokenInstance.transferFrom(fromAccount,toAccount,10,{from:spendingAccount});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,'triggers one event');
            assert.equal(receipt.logs[0].event,'Transfer','should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from,fromAccount,'logs the account the tokens are transfered from');
            assert.equal(receipt.logs[0].args._to,toAccount,'logs the account the tokens are transfered to');
            assert.equal(receipt.logs[0].args._value,10,'logs the transfer amount');
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(),90,'deducts the amout from tht sending account');
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance){
            assert.equal(balance,10,'adds the amount to the receving account');
            return tokenInstance.allowance(fromAccount,spendingAccount);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(),0,'deducts the amount from the allowance');
        })
    })
})
