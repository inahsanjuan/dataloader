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

### Context Scope

There is a `DataLoaderContext` used to provide clean cache maps for dataloaders in each request, which need to be applied by an interceptor or a middleware.

They have no differences when there is only one operation in every requests. But when it comes to multi-operation requests, a middleware have a much better behavior than an interceptor, because middlewares are applied to the whole request while interceptors are applied to every single operations.

By default, an interceptor is will be used, which has better cross-platform. You can switch to an middleware, which works on Express only, or just disable it to implement one by yourself through the options of the `DataLoaderModule`.

```ts
DataLoaderModule.forRoot({ context: "interceptor" });
DataLoaderModule.forRoot({ context: "middleware" });
DataLoaderModule.forRoot({ context: false });
```

## Contributing

Pull requests are always welcome, but please open an issue firstly before major changes. ;]
