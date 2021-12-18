import { DynamicModule, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { DataLoaderContextInterceptor } from "./data-loader-context.interceptor";
import { DataLoaderMiddlewareModule } from "./data-loader-middleware.module";

/**
 * A wrap of the `dataloader` package, which provides class-based usage and
 * request-scoped cache.
 */
@Module({})
export class DataLoaderModule {
  static forRoot(options: DataLoaderModuleOptions = {}): DynamicModule {
    const definition: DynamicModule = {
      module: DataLoaderModule,
      imports: [],
      providers: [],
    };

    options.context = options.context ?? "interceptor";
    if (options.context == "middleware")
      definition.imports!.push(DataLoaderMiddlewareModule);
    else if (options.context == "interceptor")
      definition.providers!.push({
        provide: APP_INTERCEPTOR,
        useClass: DataLoaderContextInterceptor,
      });

    return definition;
  }
}

interface DataLoaderModuleOptions {
  /**
   * Specify how the context will be applied.
   */
  context?: false | "interceptor" | "middleware";
}
