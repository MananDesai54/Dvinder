declare module "apollo-upload-server" {
  import { GraphQLScalarType } from "graphql";
  import { RequestHandler } from "express";
  import { Readable } from "stream";

  export interface UploadMiddlewareOptions {
    maxFieldSize?: number;
    maxFileSize?: number;
    maxFiles?: number;
  }

  export interface Upload {
    stream: Readable;
    filename: string;
    mimetype: string;
    encoding: string;
  }

  export const GraphQLUpload: GraphQLScalarType;
  export function apolloUploadExpress(
    options?: UploadMiddlewareOptions
  ): RequestHandler;
}
