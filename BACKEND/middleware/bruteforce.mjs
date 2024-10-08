import ExpressBrute from "express-brute";

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store, {
    freeRetries: 5,
    minWait: 5 * 60 * 1000,
    maxWait: 60 * 60 * 1000,
    lifetime: 15 * 60, 
});

export default bruteforce;
