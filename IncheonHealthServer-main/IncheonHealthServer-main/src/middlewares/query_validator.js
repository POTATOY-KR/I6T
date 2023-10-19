import validator from "validator";

// validator is commonjs library
const {isFloat, isInt} = validator;

const queryByPositionValidator = (req,res,next)=>{
    const InvalidReqErr = new Error();
    InvalidReqErr.statusCode = 400;

    if(!req.query || !req.query.px || !req.query.py){
        throw InvalidReqErr
    }

    if(!isFloat(req.query.px) || !isFloat(req.query.py)){
        throw InvalidReqErr
    }

    if(!req.query.resultCount){
        req.query.resultCount = "10";
    }
    
    if (!isInt(req.query.resultCount)){
        throw InvalidReqErr
    }

    next();

};

const queryByRestNumberValidator = (req,res,next)=>{
    const InvalidReqErr = new Error();
    InvalidReqErr.statusCode = 400;

    if(!req.query || !req.query.restaurantNumber){
        throw InvalidReqErr
    }

    if(!isInt(req.query.restaurantNumber)){
        throw InvalidReqErr
    }

    if(!req.query.resultCount){
        req.query.resultCount = "10";
    }
    
    if (!isInt(req.query.resultCount)){
        throw InvalidReqErr
    }

    next();
};

export {
    queryByPositionValidator,
    queryByRestNumberValidator
};