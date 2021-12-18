import { CacheMap } from "dataloader";

import { DataLoader } from "./data-loader.class";
import { DataLoaderContext } from "./data-loader-context.class";

/**
 * Provide a clean cache state for each request.
 */
export class DataLoaderCacheMap<Key, Value, ValuePromise extends Promise<Value>>
  implements CacheMap<Key, ValuePromise>
{
  constructor(private loader: DataLoader<Key, Value>) {}

  get(key: Key): ValuePromise | undefined {
    return this.getContext().get(key);
  }
  set(key: Key, promise: ValuePromise): this {
    this.getContext().set(key, promise);
    return this;
  }
  delete(key: Key): boolean {
    return this.getContext().delete(key);
  }
  clear(): void {
    return this.getContext().clear();
  }

  private getContext() {
    const map = DataLoaderContext.current?.cacheMapContexts;
    if (!map)
      throw new Error(
        `${DataLoaderContext.name} must be applied for this route`,
      );

    let context = map.get(this.loader) as Map<Key, ValuePromise> | undefined;
    if (!context) {
      context = new Map();
      map.set(this.loader, context);
    }

    return context;
  }
}
