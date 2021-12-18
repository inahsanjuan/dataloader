# Dataloader

Dependency Injection friendly adaptation of [graphql/dataloader](https://github.com/graphql/dataloader) for NestJS.

> This package internally uses `AsyncLocalStorage` to provide a clean cache map for each dataloader in each request, but it may have [a slight negative impact on the performance](https://github.com/nodejs/node/issues/34493#issuecomment-845094849).

## Installation

```
npm i @nestjs-devkit/dataloader
```

## Tutorial

### Defining DataLoaders

To define a dataloader, we simply extend the abstract `DataLoader` and implement the `resolve()` method.

```ts
import { DataLoader } from "@nestjs-devkit/dataloader";
// ... more imports

@Injectable()
export class UserIdLoader extends DataLoader<number, User> {
  constructor(@InjectRepository(User) private repo: EntityRepository<User>) {}

  protected async resolve(keys: number[]): Promise<User[]> {
    return this.repo.find({ id: { $in: keys } });
  }
}
```

### Preparing DataLoaders

Before using the dataloaders, we need to firstly provide these dataloaders.

```ts
@Module({
  providers: [UserIdLoader],
  exports: [UserIdLoader],
})
export class UsersModule {}
```

Besides, the `DataLoaderModule` is also required for them to work.

```ts
@Module({
  imports: [DataLoaderModule.forRoot()],
})
export class AppModule {}
```

### Using Dataloaders

Now we can use the dataloaders simply by injecting them into your resolvers.

```ts
@Resolver(() => Book)
export class BooksResolver {
  constructor(private userIdLoader: UserIdLoader) {}

  @ResolveField()
  async owner(@Parent() book: Book) {
    return this.userIdLoader.load(book.owner.id);
  }
}
```

Remember to import the module where the dataloader is defined.

```ts
@Module({
  imports: [forwardRef(() => UsersModule)],
})
export class BooksModule {}
```

## Advanced

### Cross-Platform

There is a `DataLoaderContext` used to provide clean cache maps for dataloaders in each request, which need to be applied by a middleware.

By default, a built-in middleware will be used to apply the context for Express. You can disable it and implement your own one for other platforms.

```ts
@Module({
  imports: [DataLoaderModule.forRoot({ middleware: false })],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(FastifyDataLoaderModule).forRoutes("(*)");
  }
}
```

## Contributing

Pull requests are always welcome, but please open an issue firstly before major changes. ;]
