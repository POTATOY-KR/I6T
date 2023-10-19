import {Router} from "express"
import axios from 'axios'

const router = Router()

router.get("/",async (req,res,next)=>{

    axios.get(
        process.env.REST_ADDRESS+"/gyms",
        {
            params:{
                "px":req.query.px,
                "py":req.query.py,
            }
        }
    ).then((response)=>{
        const contents = response["data"]["contents"]
        const resultCount = contents.length

        res.render('gyms',{resultCode : 200, listlength : Math.min(contents.length,resultCount), contents : contents});
    }).catch((err)=>{
        next(err)
    })
    
});

export default router;