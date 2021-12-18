import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

import { DataLoaderContext } from ".";

export class DataLoaderContextInterceptor implements NestInterceptor {
  intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    return new Observable((subscriber) => {
      new DataLoaderContext().apply(() => next.handle().subscribe(subscriber));
    });
  }
}
