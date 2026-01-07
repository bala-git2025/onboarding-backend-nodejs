import { Response } from 'express';
import {
  HttpBasicErrorResponseBody,
  HttpDetailedErrorResponseBody,
  HttpResponseBody,
  ErrorDescription,
} from './responseModel';
import { HttpConstants } from '../../common/constants';

// Base response builder
function buildResponseBody(statusCode: number, path: string, bodyObj?: HttpResponseBody): HttpResponseBody {
  return {
    timestamp: new Date().toISOString(),
    statusCode,
    path,
    ...bodyObj,
  };
}

// Success Responses
export function send200(res: Response, path: string, data: object) {
  res.status(200).json(buildResponseBody(200, path, { message: 'OK', ...data }));
}

export function send201(res: Response, path: string, data: object) {
  res.status(201).json(buildResponseBody(201, path, { message: 'Created', ...data }));
}

export function send204(res: Response) {
  res.status(204).send();
}

// Error Responses
export function send404(res: Response, path: string, errors: ErrorDescription[]) {
  const body: HttpDetailedErrorResponseBody = {
    errorDescrList: errors,
    message: HttpConstants.HTTP_404_NOT_FOUND,
  };
  res.status(404).json(buildResponseBody(404, path, body));
}

export function send500(res: Response, path: string, error?: Error) {
  const err = error ?? new Error(HttpConstants.HTTP_500_SOMETHING_WENT_WRONG);
  err.name = HttpConstants.HTTP_500_INTERNAL_SERVICE_ERROR;

  const body: HttpBasicErrorResponseBody = {
    exception: err.name,
    error: err.name,
    message: err.message,
    trace: err.stack,
  };
  res.status(500).json(buildResponseBody(500, path, body));
}

export function sendBasicError(res: Response, statusCode: number, path: string, error: Error, message?: string) {
  const body: HttpBasicErrorResponseBody = {
    exception: error.name,
    error: error.name,
    message: message ? `${message}: ${error.message}` : error.message,
    trace: error.stack,
  };
  res.status(statusCode).json(buildResponseBody(statusCode, path, body));
}

export function sendDetailedError(
  res: Response,
  statusCode: number,
  path: string,
  errorDescrList?: ErrorDescription[],
  message?: string
) {
  const body: HttpDetailedErrorResponseBody = {
    errorDescrList,
    message,
  };
  res.status(statusCode).json(buildResponseBody(statusCode, path, body));
}

export function send400(res: Response, path: string, errors: ErrorDescription[]) {
  const body: HttpDetailedErrorResponseBody = {
    errorDescrList: errors,
    message: HttpConstants.HTTP_400_BAD_REQUEST || "Bad Request",
  };
  res.status(400).json(buildResponseBody(400, path, body));
}