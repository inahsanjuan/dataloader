import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { DataLoaderContextMiddleware } from "./data-loader-context.middleware";

/**
 * Apply the {@link DataLoaderContextMiddleware} for all routes.
 *
 * Works with Express only.
 */
@Module({})
export class DataLoaderMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(DataLoaderContextMiddleware).forRoutes("*");
  }
}
