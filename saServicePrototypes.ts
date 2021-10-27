saService_.prototype.addUser = function(userEmail){
    this.subAccounts_.push(userEmail);
    return self;
}

saService_.prototype.addUsers = function(userEmailArray){
    this.subAccounts_ =  this.subAccounts_.concat(userEmailArray);
    return self;
}

saService_.prototype.removeUsers = function(){
    this.subAccounts_ = null;
    return self;
}

saService_.prototype.removeUser = function(userEmail){
    var index = this.subAccounts_.indexOf(userEmail);
    if (index > -1) {
        this.subAccounts_.splice(index, 1);
    }
    return self;
}

saService_.prototype.generateJWT_ = function(){
    var sResult="",
        claim="",
        JWTs = {},
        header = Utilities.base64Encode('{"alg":"RS256","typ":"JWT"}');

    if(!this.subAccounts_){
        throw new Error("You must add at least one user account");
    }

    for(var i=0; i < this.subAccounts_.length; i++){
        claim = header+"."+Utilities.base64Encode(JSON.stringify(this.makeClaim(this.subAccounts_[i])));
        JWTs[this.subAccounts_[i]]={"signedClaim": claim +"."+ Utilities.base64Encode(Utilities.computeRsaSha256Signature(claim, this.rsaKey_)),
                                "expire":this.expireTime_};
    }
    this.jwts_ = JWTs;
    return self;
} 

saService_.prototype.getToken = function(userEmail){
    if(!(userEmail in this.tokens_)){
        throw new Error("User not found");    
    }else{
        return this.tokens_[userEmail];
    }
}

saService_.prototype.getTokens = function(){
    return this.tokens_; 
}




saService_.prototype.requestToken = function(){
    this.generateJWT_();
    if(!this.jwts_){
        throw 'You must run generateJWT'
    }

    var params = {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: ''
    }


    var url = "https://www.googleapis.com/oauth2/v3/token"
    var parameters: Object = { 'method' : 'post',                    
                        'payload' : params,
                        muteHttpExceptions:true};

    var response: Object;

    for(var user in this.jwts_){
        params.assertion = this.jwts_[user].signedClaim;
        response = JSON.parse(UrlFetchApp.fetch(url,parameters).getContentText());
        
        // if(response.error){
        // if(response.error === "invalid_grant"){
        //     tokens_[user]={};
        //     tokens_[user].token = "invalid_grant: Does this user exist?";
        //     tokens_[user].expire = this.jwts_[user].expire;
        // }else{
        //     throw new Error('There was an error requesting a Token from the OAuth server: '+ response.error);
        // }
        // }
        
        // if(response.access_token){
        //     this.tokens_[user]={};
        //     this.tokens_[user].token = response.access_token;
        //     this.tokens_[user].expire = this.jwts_[user].expire;
        // }
    }
    return self;
}


saService_.prototype.tokenService = function(email){
    return function(){
        var token = this.getToken(email);
        if(token.expire<(Date.now()/1000).toString().substr(0,10)){
            this.requestToken()
        }
        return this.getToken(email).token;
    }
}

saService_.prototype.makeClaim = function(subAccount){
    var now = (Date.now()/1000).toString().substr(0,10);
    var exp = (parseInt(now) + 3600).toString().substr(0,10);
    this.expireTime_ = exp;
    var claim = 
        {
            "iss": this.saEmail_,
            "sub": subAccount,
            "scope": this.Scopes_.join(" "),
            "aud":"https://www.googleapis.com/oauth2/v3/token",
            "iat": now,
            "exp": exp
        };
    if(subAccount === this.saEmail_){
        delete claim.sub;
    }
    return claim;
}
