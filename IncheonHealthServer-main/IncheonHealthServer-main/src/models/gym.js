import AWS from 'aws-sdk'
import {parseCsvStr, euclidDist} from '../utils.js'

class GymScheme{
    constructor(
        gymCode = -1,
        name = "",
        address = "",
        phoneNumber = "",
        px = 0.0,
        py = 0.0
    ){
        this.gymCode = gymCode
        this.gymName = name
        this.address = address
        this.phoneNumber = phoneNumber
        this.px = px
        this.py = py
    }

    toJson(){
        return {
            "gymCode" : this.gymCode,
            "상호명" : this.gymName,
            "도로명주소" : this.address,
            "전화번호" : this.phoneNumber,
            "px": this.px,
            "py": this.py
        }
    }
};

class GymModel{
    static #data = NaN

    static async #fetchData(){
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESSKEY, 
            secretAccessKey: process.env.AWS_SECRETKEY, 
            Bucket: process.env.AWS_S3_BUCKETNAME
          });

        const params = {
            Bucket: process.env.AWS_S3_BUCKETNAME, 
            Key: process.env.AWS_S3_GYM_FILENAME 
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
                    new GymScheme(
                        parseInt(records[i][0]), //gymcode
                        records[i][1], //gymName
                        records[i][2], //address
                        records[i][3], //phone number
                        parseFloat(records[i][5]), // px
                        parseFloat(records[i][6]) // py
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
};

export default GymModel