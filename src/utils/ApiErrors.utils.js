class ApiError extends Error{
   
    constructor(
        //Yaha default value rhega
        statusCode,
        messege="Something went Wrong",
        stack="",
        errors=[]
    ){
        //yaha overwrite krnege upar wala cheez
        super(messege)
        this.statusCode=statusCode
        this.data=null
        this.message=messege
        this.success=false
        this.errors=this.errors

        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}