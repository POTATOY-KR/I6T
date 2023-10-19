import {Router} from "express"
import {queryByPositionValidator} from '../middlewares/query_validator.js'
import GymModel from '../models/gym.js'

const router = Router()

router.get("/",queryByPositionValidator,async (req,res)=>{
    // todo implement this!

    const px = parseFloat(req.query.px)
    const py = parseFloat(req.query.py)
    const resultCount = parseInt(req.query.resultCount)

    const data = await GymModel.getByPosition(px,py,resultCount);

    res.json({
        "resultCode" : 200,
        "contents": data
    })
});

export default router;