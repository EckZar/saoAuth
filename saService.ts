/*
* GAS library for generating user OAuth Tokens via Google service account.
* @param {String} rsaKey The private_key from your service account JSON key
* @param {Array} Scopes An Array of scopes you want to authenticate
* @param {String} saEmail The service account Email
* @return {object} self for chaining
*/
function init(){

    let rsaKey = saCredentials.private_key;
    let scopes = ['https://www.googleapis.com/auth/script.processes']
    let saEmail = saCredentials.client_email;

    return new saService_(rsaKey, scopes, saEmail);
}
  
  
class saService_{

    rsaKey: string;
    scopes: Array<1>;
    saEmail: string;
    rsaKey_: string;
    scopes_: Array<1>;
    saEmail_: string;
    jwts_: string;
    tokens_: Object;
    expireTime_: Number;
    subAccounts_: Array<1>;

    addUser: (userEmail: any) => Window & typeof globalThis;
    addUsers: (userEmailArray: any) => Window & typeof globalThis;
    removeUsers: () => Window & typeof globalThis;
    removeUser: (userEmail: any) => Window & typeof globalThis;
    generateJWT_: () => Window & typeof globalThis;
    getToken: (userEmail: any) => any;
    getTokens: () => any;
    requestToken: () => Window & typeof globalThis;
    tokenService: (email: any) => () => any;
    makeClaim: (subAccount: any) => { iss: any; sub: any; scope: any; aud: string; iat: string; exp: string; };

    constructor(rsaKey, scopes, saEmail){
        this.rsaKey = rsaKey;
        this.scopes = scopes;
        this.saEmail = saEmail;
        this.rsaKey_ = rsaKey;
        this.scopes_ = scopes;
        this.saEmail_ = saEmail
        this.jwts_ = "";
        this.tokens_ = {};
        this.expireTime_ = 0;
        this.subAccounts_ = [];
    }    
}