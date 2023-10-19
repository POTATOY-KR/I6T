import axios from 'axios';
import AWS from 'aws-sdk'

import {parseCsvStr, zip} from '../utils.js'

import RestaurantModel from './restaurant.js';

const ServiceKey = 'Qk+bsSqrR0J2g+Z3idiTEuCXBzTVibkHcGN+UiVhmecHx6bsyCXMc9k2AE71gmlpHB6s6y6eAGbOJT3iHuUz6w=='

class MenuScheme{
    constructor(
        menuCode = -1,
        Desc_Kor = "",
        Serving_Wt = "",
        Nutr_Cont1 = "",
        Nutr_Cont2 = "",
        Nutr_Cont3 = "",
        Nutr_Cont4 = "",
        Nutr_Cont5 = "",
        Nutr_Cont6 = "",
        Nutr_Cont7 = "",
        Nutr_Cont8 = "",
        Nutr_Cont9 = ""
    ){
        this.menuCode = menuCode
        this.Desc_Kor = Desc_Kor
        this.Serving_Wt = Serving_Wt
        this.Nutr_Cont1 = Nutr_Cont1
        this.Nutr_Cont2 = Nutr_Cont2
        this.Nutr_Cont3 = Nutr_Cont3
        this.Nutr_Cont4 = Nutr_Cont4
        this.Nutr_Cont5 = Nutr_Cont5
        this.Nutr_Cont6 = Nutr_Cont6
        this.Nutr_Cont7 = Nutr_Cont7
        this.Nutr_Cont8 = Nutr_Cont8
        this.Nutr_Cont9 = Nutr_Cont9
    }

    toJson(){
        return {
            "menuCode" : this.menuCode,
            "식품이름" : this.Desc_Kor,
            "1회제공량" : this.Serving_Wt,
            "열량" : this.Nutr_Cont1,
            "탄수화물" : this.Nutr_Cont2,
            "단백질" : this.Nutr_Cont3,
            "지방": this.Nutr_Cont4,
            "당류": this.Nutr_Cont5,
            "나트륨": this.Nutr_Cont6,
            "콜레스테롤":this.Nutr_Cont7,
            "포화지방산":this.Nutr_Cont8,
            "트랜스지방산":this.Nutr_Cont9
        }
    }
};

class MenuModel{
    static #foodNameMap = NaN

    static async #fetchFoodNameMap(){
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESSKEY, 
            secretAccessKey: process.env.AWS_SECRETKEY, 
            Bucket: process.env.AWS_S3_BUCKETNAME
          });

        const params = {
            Bucket: process.env.AWS_S3_BUCKETNAME, 
            Key: process.env.AWS_S3_MENUNAMEMAP_FILENAME 
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
            let records = parseCsvStr(csv_data);
            let map = {}
            
            records.forEach((record)=>{
                map[record[0]]=record[1]
            })
            this.#foodNameMap = map
        })
    }

    static async #requestData(menuname){

        // more stable url
        const requestUrl = 'http://apis.data.go.kr/1471000/FoodNtrIrdntInfoService1/getFoodNtrItdntList1';

        return axios.get(requestUrl,{
            params:{
                'serviceKey':ServiceKey,
                'desc_kor':menuname,
                'numOfRows' : 3,
                'pageNo' : 1,
                'type' : 'json'
            },
            withCredentials:true
        }).then((response)=>{
            // parse MenuScheme and return MenuScheme

            const originalItems = response['data']['body']['items']
            if (!originalItems || originalItems.length < 1){
                return NaN
            }

            const record = originalItems[0]
            console.log(record)

            return new MenuScheme(
                0, //menucode
                record["DESC_KOR"], //desc_kor
                record["SERVING_WT"], //serving_wt
                record["NUTR_CONT1"], //nutr_cont1
                record["NUTR_CONT2"],// nutr_cont2
                record["NUTR_CONT3"],// nutr_cont3
                record["NUTR_CONT4"],// nutr_cont4
                record["NUTR_CONT5"],// nutr_cont5
                record["NUTR_CONT6"],// nutr_cont6
                record["NUTR_CONT7"],// nutr_cont7
                record["NUTR_CONT8"],// nutr_cont8
                record["NUTR_CONT9"],// nutr_cont9
            )
            
        }).catch((err)=>{
            throw err
        })
    }

    static async getByMenu(restaurantCode,resultCount){
        // get menu data of restaurant if available

        if(isNaN(this.#foodNameMap))
            await this.#fetchFoodNameMap();

        const restaurantData = await RestaurantModel.getByRestaurantCode(restaurantCode)
        if (!restaurantData) return []
        
        const menuNames = restaurantData["주요음식"];
        
        // use alternative name for query if possible
        const replacedNames = menuNames.map(x=>{
            if(x in this.#foodNameMap){
                return this.#foodNameMap[x]
            }
            return x
        })

        let menuDatas = await Promise.all(replacedNames.map(async (foodName)=>{
            return this.#requestData(foodName)
        }))

        let ret = zip(menuNames,menuDatas).map((dat)=>{
            const realname = dat[0];
            let menuData = dat[1];
            if(menuData){
                menuData.Desc_Kor = realname
            }
            return menuData;
        })

        ret = ret.filter(data => data).map(data=>data.toJson())
        .slice(0,Math.min(ret.length,resultCount))

        return ret
    }
};

export default MenuModel;