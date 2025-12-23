export class HttpConstants {
    public static HTTP_400_BAD_REQUEST = "Bad request.";
    public static HTTP_401_UNAUTHORIZED = "Authorization information is missing or invalid";
    public static HTTP_403_FORBIDDEN = "Forbidden.";
    public static HTTP_404_NOT_FOUND = "Not Found.";
    public static HTTP_500_SOMETHING_WENT_WRONG = "Something went wrong.";
    public static HTTP_500_INTERNAL_SERVICE_ERROR = "Internal server error.";
    public static HTTP_503_SERVICE_UNAVAILABLE = "Service Unavailable.";
    public static HTTP_OTHER_TRY_AGAIN = "Try again later.";
    public static CREATE_JOURNAL = "/journals";
}

export enum HttpStatusCode {
    OK = 200,
    BadRequest = 400,
    InternalServerError = 500,
  }