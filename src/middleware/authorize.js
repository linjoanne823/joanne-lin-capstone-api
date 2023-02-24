const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

function authorizeMiddleware(req, res, next) {
    if(!req.headers.authorization){
        res.status(403).json({error: "Not Authorized."})
    }else if(!req.headers.authorization.split(" ")[1]){
        res.status(403).json({error: "No token. Unauthorized"})
    }else{
        const token = req.headers.authorization.split(" ")[1];

        if (token) {
            console.log("Auth Token:", token);
            try{
                const result = jwt.verify(token, process.env.JWT_SECRET);
                console.log("auth result", result);
                if (result) {
                // Decode the token to pass along to end-points that may need
                // access to data stored in the token.
                    const decode = jwt.decode(token);
                    console.log("decode is: ", decode);
                    req.decode = decode;
                    next();
                }
            }catch(err){
                console.log(err)
                res.status(401).json({error: "Token expired"})
            }
        }
    }
  }

  module.exports=authorizeMiddleware;

