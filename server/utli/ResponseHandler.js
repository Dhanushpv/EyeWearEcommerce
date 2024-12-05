exports.success_function=function success_function(api_Data){
    let res={
        success:true,
        statuscode:200,
        data:api_Data.data ?api_Data.data:null,
        message:api_Data.message ? api_Data.message:null,
        
    }
    return res;
}
exports.error_function=function error_function(api_Data){
    let res={
        success:false,
        statuscode:400,
        message:api_Data.message ? api_Data.message:null,
        data:api_Data.data ?api_Data.data:null,
    }
    return res;
}