import AWS from 'aws-sdk'
import {parseCsvStr, euclidDist} from '../utils.js'

class RestaurantScheme{
    constructor(
        restaurantCode = -1,
        name = "",
        address = "",
        phoneNumber = "",
        foodType="",
        mainFoods=[],
        px = 0.0,
        py = 0.0
    ){
        this.restaurantCode = restaurantCode
        this.restaurantName = name
        this.address = address
        this.phoneNumber = phoneNumber
        this.foodType = foodType
        this.mainFoods = mainFoods
        this.px = px
        this.py = py
    }

    toJson(){
        return {
            "restaurantCode" : this.restaurantCode,
            "상호명" : this.restaurantName,
            "도로명주소" : this.address,
            "전화번호" : this.phoneNumber,
            "음식유형" : this.foodType,
            "주요음식" : this.mainFoods,
            "px": this.px,
            "py": this.py
        }
    }
};

class RestaurantModel{
    static #data = NaN

    static async #fetchData(){
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESSKEY, 
            secretAccessKey: process.env.AWS_SECRETKEY, 
            Bucket: process.env.AWS_S3_BUCKETNAME
          });

        const params = {
            Bucket: process.env.AWS_S3_BUCKETNAME, 
            Key: process.env.AWS_S3_RESTAURANT_FILENAME 
        };

        const getObjPromise = new Promise((resolve, reject) => {
            s3.createBucket({
                Bucket: process.env.AWS_S3_BUCKETNAME     
            }, function () {
                s3.getObject(params, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        });


        return getObjPromise.then((data)=>{
            let csv_data = String(data['Body'],'utf8');
            let records = parseCsvStr(csv_data,true);
            let _data = []

            for(let i =0;i<records.length;++i){
                _data.push(
                    new RestaurantScheme(
                        parseInt(records[i][0]), //restaurantcode
                        records[i][1], //restaurantName
                        records[i][2], //address
                        records[i][3], //phone number
                        records[i][4],// foodtype, TODO : fix
                        records[i][5].split(',').map(x=>x.trim()),// mainfoods, TODO : fix
                        parseFloat(records[i][7]), // px
                        parseFloat(records[i][8]) // py
                    )
                )
            }

            this.#data = _data
        })
    }

    static async getByPosition(px,py,resultCount){

        if(isNaN(this.#data))
            await this.#fetchData();
        
        let _data = [...this.#data]
        _data = _data.map(value=>{
            value.dist = euclidDist(value.px,value.py,px,py)
            return value
        })
        .sort((a,b)=>{
            return a.dist - b.dist
        })
        .slice(0,Math.min(_data.length,resultCount))
        .map( x => x.toJson())

        return _data
    }

    static async getByRestaurantCode(restaurantCode){
        if(isNaN(this.#data))
            await this.#fetchData();

        if(restaurantCode<0 || restaurantCode>=this.#data.length){
            return NaN;
        }

        return this.#data[restaurantCode-1].toJson();
    }
};

export default RestaurantModel;