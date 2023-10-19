# 인천 중구 헬스케어 서비스 서버코드

## API 상세

- 문서 참조

## 환경 변수

- Repository의 최상단에 아래 내용의 .env 파일을 추가
- `*_FILENAME`의 내용은 파일의 확장자를 포함하여 작성

```
AWS_ACCESSKEY=yourAccessKey
AWS_SECRETKEY=yourSecretKey

AWS_S3_BUCKETNAME=yourBucketName

AWS_S3_GYM_FILENAME=yourGymCsvFileName
AWS_S3_RESTAURANT_FILENAME=yourRestaurantCsvFileName
AWS_S3_MENUNAMEMAP_FILENAME=yourFoodNameMappingCsvFileName
```

추가한 .env 파일의 내용은 **절대로 commit에 포함하지** 말것!
