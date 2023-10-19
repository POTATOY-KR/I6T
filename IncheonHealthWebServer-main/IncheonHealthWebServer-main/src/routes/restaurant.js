import {Router} from 'express'
import axios from 'axios'

const router = Router()

router.get("/", (req,res,next)=>{

    axios.get(
        process.env.REST_ADDRESS+"/restaurants",
        {
            params:{
                "px":req.query.px,
                "py":req.query.py,
            }
        }
    ).then((response)=>{
        const contents = response["data"]["contents"]
        const resultCount = contents.length

        res.render('restaurants',{resultCode:200, listlength : Math.min(contents.length,resultCount), contents:contents});
    }).catch((err)=>{
        next(err)
    })    
});

router.get("/menu",(req,res,next)=>{
    axios.get(
        process.env.REST_ADDRESS+"/restaurants/menu",
        {
            params:{
                "restaurantNumber" : req.query.restaurantNumber
            }
        }
    ).then((response)=>{
        const contents = response["data"]["contents"]
        const resultCount = contents.length

        res.render('nutrition',{resultCode:200, listlength : Math.min(contents.length,resultCount), contents:contents});
    }).catch((err)=>{
        next(err)
    })
});

export default router;