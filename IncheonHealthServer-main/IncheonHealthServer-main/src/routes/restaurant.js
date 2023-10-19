import {request, response, Router} from "express"
import {queryByPositionValidator, queryByRestNumberValidator} from '../middlewares/query_validator.js'
import RestaurantModel from '../models/restaurant.js'
import MenuModel from '../models/menu.js'

const router = Router()

router.get("/",queryByPositionValidator,async (req,res)=>{
    
    const px = parseFloat(req.query.px)
    const py = parseFloat(req.query.py)
    const resultCount = parseInt(req.query.resultCount)

    const data = await RestaurantModel.getByPosition(px,py,resultCount);

    res.json({
        "resultCode" : 200,
        "contents": data
    })
});

router.get("/menu",queryByRestNumberValidator,async (req,res,next)=>{
    const restaurantNumber = req.query.restaurantNumber;
    const resultCount = parseInt(req.query.resultCount);
    const nut_data = await MenuModel.getByMenu(restaurantNumber,resultCount);

    res.json({
      "resultCode" : 200,
      "contents": nut_data
    })
    
});

export default router;