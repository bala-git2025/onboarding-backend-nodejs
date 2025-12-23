export type HttpResponseBody = HttpBaseResponseBody | HttpBasicErrorResponseBody;
export type HttpErrorResponseBody = HttpBasicErrorResponseBody | HttpDetailedErrorResponseBody;

export function isHttpBasicErrorResponseBody(obj : HttpResponseBody): obj is HttpErrorResponseBody{
    return 'status' in obj && 'error' in obj;
}


export interface HttpBaseResponseBody{
    timestamp? : string,
    statusCode? : number,
    path? : string,
    message? : string
}

export interface HttpBasicErrorResponseBody extends Omit<HttpBaseResponseBody, 'statusCode'>{
    exception : string,
    trace? : String,
    error : string,
    message : string
}

export interface HttpDetailedErrorResponseBody extends HttpBaseResponseBody{
    errorDescrList? : ErrorDescription []
}

export interface ErrorDescription{
    fieldName : string,
    type : string,
    description : string
}