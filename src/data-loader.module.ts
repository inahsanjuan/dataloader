import { DynamicModule, Module } from "@nestjs/common";

import { DataLoaderMiddlewareModule } from "./data-loader-middleware.module";

/**
 * A wrap of the `dataloader` package, which provides class-based usage and
 * request-scoped cache.
 */
@Module({})
export class DataLoaderModule {
  static forRoot(options: DataLoaderModuleOptions = {}): DynamicModule {
    return {
      module: DataLoaderModule,
      imports: options.middleware ?? true ? [DataLoaderMiddlewareModule] : [],
    };
  }
}

interface DataLoaderModuleOptions {
  /**
   * Whether to import {@link DataLoaderMiddlewareModule}.
   */
  middleware?: boolean;
}
