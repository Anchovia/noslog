
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Bookmark
 * 
 */
export type Bookmark = $Result.DefaultSelection<Prisma.$BookmarkPayload>
/**
 * Model Music
 * 
 */
export type Music = $Result.DefaultSelection<Prisma.$MusicPayload>
/**
 * Model RecentPlay
 * 
 */
export type RecentPlay = $Result.DefaultSelection<Prisma.$RecentPlayPayload>
/**
 * Model UserBestGrade
 * 
 */
export type UserBestGrade = $Result.DefaultSelection<Prisma.$UserBestGradePayload>
/**
 * Model BasicBestPlay
 * 
 */
export type BasicBestPlay = $Result.DefaultSelection<Prisma.$BasicBestPlayPayload>
/**
 * Model RecitalBestPlay
 * 
 */
export type RecitalBestPlay = $Result.DefaultSelection<Prisma.$RecitalBestPlayPayload>
/**
 * Model PlayData
 * 
 */
export type PlayData = $Result.DefaultSelection<Prisma.$PlayDataPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookmark`: Exposes CRUD operations for the **Bookmark** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookmarks
    * const bookmarks = await prisma.bookmark.findMany()
    * ```
    */
  get bookmark(): Prisma.BookmarkDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.music`: Exposes CRUD operations for the **Music** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Music
    * const music = await prisma.music.findMany()
    * ```
    */
  get music(): Prisma.MusicDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.recentPlay`: Exposes CRUD operations for the **RecentPlay** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RecentPlays
    * const recentPlays = await prisma.recentPlay.findMany()
    * ```
    */
  get recentPlay(): Prisma.RecentPlayDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userBestGrade`: Exposes CRUD operations for the **UserBestGrade** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserBestGrades
    * const userBestGrades = await prisma.userBestGrade.findMany()
    * ```
    */
  get userBestGrade(): Prisma.UserBestGradeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.basicBestPlay`: Exposes CRUD operations for the **BasicBestPlay** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BasicBestPlays
    * const basicBestPlays = await prisma.basicBestPlay.findMany()
    * ```
    */
  get basicBestPlay(): Prisma.BasicBestPlayDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.recitalBestPlay`: Exposes CRUD operations for the **RecitalBestPlay** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RecitalBestPlays
    * const recitalBestPlays = await prisma.recitalBestPlay.findMany()
    * ```
    */
  get recitalBestPlay(): Prisma.RecitalBestPlayDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.playData`: Exposes CRUD operations for the **PlayData** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PlayData
    * const playData = await prisma.playData.findMany()
    * ```
    */
  get playData(): Prisma.PlayDataDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.15.0
   * Query Engine version: 85179d7826409ee107a6ba334b5e305ae3fba9fb
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Bookmark: 'Bookmark',
    Music: 'Music',
    RecentPlay: 'RecentPlay',
    UserBestGrade: 'UserBestGrade',
    BasicBestPlay: 'BasicBestPlay',
    RecitalBestPlay: 'RecitalBestPlay',
    PlayData: 'PlayData'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "bookmark" | "music" | "recentPlay" | "userBestGrade" | "basicBestPlay" | "recitalBestPlay" | "playData"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Bookmark: {
        payload: Prisma.$BookmarkPayload<ExtArgs>
        fields: Prisma.BookmarkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookmarkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookmarkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          findFirst: {
            args: Prisma.BookmarkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookmarkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          findMany: {
            args: Prisma.BookmarkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>[]
          }
          create: {
            args: Prisma.BookmarkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          createMany: {
            args: Prisma.BookmarkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookmarkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>[]
          }
          delete: {
            args: Prisma.BookmarkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          update: {
            args: Prisma.BookmarkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          deleteMany: {
            args: Prisma.BookmarkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookmarkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookmarkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>[]
          }
          upsert: {
            args: Prisma.BookmarkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          aggregate: {
            args: Prisma.BookmarkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookmark>
          }
          groupBy: {
            args: Prisma.BookmarkGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookmarkGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookmarkCountArgs<ExtArgs>
            result: $Utils.Optional<BookmarkCountAggregateOutputType> | number
          }
        }
      }
      Music: {
        payload: Prisma.$MusicPayload<ExtArgs>
        fields: Prisma.MusicFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MusicFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MusicFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPayload>
          }
          findFirst: {
            args: Prisma.MusicFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MusicFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPayload>
          }
          findMany: {
            args: Prisma.MusicFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPayload>[]
          }
          create: {
            args: Prisma.MusicCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPayload>
          }
          createMany: {
            args: Prisma.MusicCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MusicCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPayload>[]
          }
          delete: {
            args: Prisma.MusicDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPayload>
          }
          update: {
            args: Prisma.MusicUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPayload>
          }
          deleteMany: {
            args: Prisma.MusicDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MusicUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MusicUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPayload>[]
          }
          upsert: {
            args: Prisma.MusicUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPayload>
          }
          aggregate: {
            args: Prisma.MusicAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMusic>
          }
          groupBy: {
            args: Prisma.MusicGroupByArgs<ExtArgs>
            result: $Utils.Optional<MusicGroupByOutputType>[]
          }
          count: {
            args: Prisma.MusicCountArgs<ExtArgs>
            result: $Utils.Optional<MusicCountAggregateOutputType> | number
          }
        }
      }
      RecentPlay: {
        payload: Prisma.$RecentPlayPayload<ExtArgs>
        fields: Prisma.RecentPlayFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RecentPlayFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentPlayPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RecentPlayFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentPlayPayload>
          }
          findFirst: {
            args: Prisma.RecentPlayFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentPlayPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RecentPlayFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentPlayPayload>
          }
          findMany: {
            args: Prisma.RecentPlayFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentPlayPayload>[]
          }
          create: {
            args: Prisma.RecentPlayCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentPlayPayload>
          }
          createMany: {
            args: Prisma.RecentPlayCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RecentPlayCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentPlayPayload>[]
          }
          delete: {
            args: Prisma.RecentPlayDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentPlayPayload>
          }
          update: {
            args: Prisma.RecentPlayUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentPlayPayload>
          }
          deleteMany: {
            args: Prisma.RecentPlayDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RecentPlayUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RecentPlayUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentPlayPayload>[]
          }
          upsert: {
            args: Prisma.RecentPlayUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentPlayPayload>
          }
          aggregate: {
            args: Prisma.RecentPlayAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecentPlay>
          }
          groupBy: {
            args: Prisma.RecentPlayGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecentPlayGroupByOutputType>[]
          }
          count: {
            args: Prisma.RecentPlayCountArgs<ExtArgs>
            result: $Utils.Optional<RecentPlayCountAggregateOutputType> | number
          }
        }
      }
      UserBestGrade: {
        payload: Prisma.$UserBestGradePayload<ExtArgs>
        fields: Prisma.UserBestGradeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserBestGradeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBestGradePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserBestGradeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBestGradePayload>
          }
          findFirst: {
            args: Prisma.UserBestGradeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBestGradePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserBestGradeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBestGradePayload>
          }
          findMany: {
            args: Prisma.UserBestGradeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBestGradePayload>[]
          }
          create: {
            args: Prisma.UserBestGradeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBestGradePayload>
          }
          createMany: {
            args: Prisma.UserBestGradeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserBestGradeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBestGradePayload>[]
          }
          delete: {
            args: Prisma.UserBestGradeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBestGradePayload>
          }
          update: {
            args: Prisma.UserBestGradeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBestGradePayload>
          }
          deleteMany: {
            args: Prisma.UserBestGradeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserBestGradeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserBestGradeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBestGradePayload>[]
          }
          upsert: {
            args: Prisma.UserBestGradeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBestGradePayload>
          }
          aggregate: {
            args: Prisma.UserBestGradeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserBestGrade>
          }
          groupBy: {
            args: Prisma.UserBestGradeGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserBestGradeGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserBestGradeCountArgs<ExtArgs>
            result: $Utils.Optional<UserBestGradeCountAggregateOutputType> | number
          }
        }
      }
      BasicBestPlay: {
        payload: Prisma.$BasicBestPlayPayload<ExtArgs>
        fields: Prisma.BasicBestPlayFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BasicBestPlayFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasicBestPlayPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BasicBestPlayFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasicBestPlayPayload>
          }
          findFirst: {
            args: Prisma.BasicBestPlayFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasicBestPlayPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BasicBestPlayFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasicBestPlayPayload>
          }
          findMany: {
            args: Prisma.BasicBestPlayFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasicBestPlayPayload>[]
          }
          create: {
            args: Prisma.BasicBestPlayCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasicBestPlayPayload>
          }
          createMany: {
            args: Prisma.BasicBestPlayCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BasicBestPlayCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasicBestPlayPayload>[]
          }
          delete: {
            args: Prisma.BasicBestPlayDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasicBestPlayPayload>
          }
          update: {
            args: Prisma.BasicBestPlayUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasicBestPlayPayload>
          }
          deleteMany: {
            args: Prisma.BasicBestPlayDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BasicBestPlayUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BasicBestPlayUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasicBestPlayPayload>[]
          }
          upsert: {
            args: Prisma.BasicBestPlayUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasicBestPlayPayload>
          }
          aggregate: {
            args: Prisma.BasicBestPlayAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBasicBestPlay>
          }
          groupBy: {
            args: Prisma.BasicBestPlayGroupByArgs<ExtArgs>
            result: $Utils.Optional<BasicBestPlayGroupByOutputType>[]
          }
          count: {
            args: Prisma.BasicBestPlayCountArgs<ExtArgs>
            result: $Utils.Optional<BasicBestPlayCountAggregateOutputType> | number
          }
        }
      }
      RecitalBestPlay: {
        payload: Prisma.$RecitalBestPlayPayload<ExtArgs>
        fields: Prisma.RecitalBestPlayFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RecitalBestPlayFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecitalBestPlayPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RecitalBestPlayFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecitalBestPlayPayload>
          }
          findFirst: {
            args: Prisma.RecitalBestPlayFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecitalBestPlayPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RecitalBestPlayFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecitalBestPlayPayload>
          }
          findMany: {
            args: Prisma.RecitalBestPlayFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecitalBestPlayPayload>[]
          }
          create: {
            args: Prisma.RecitalBestPlayCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecitalBestPlayPayload>
          }
          createMany: {
            args: Prisma.RecitalBestPlayCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RecitalBestPlayCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecitalBestPlayPayload>[]
          }
          delete: {
            args: Prisma.RecitalBestPlayDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecitalBestPlayPayload>
          }
          update: {
            args: Prisma.RecitalBestPlayUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecitalBestPlayPayload>
          }
          deleteMany: {
            args: Prisma.RecitalBestPlayDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RecitalBestPlayUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RecitalBestPlayUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecitalBestPlayPayload>[]
          }
          upsert: {
            args: Prisma.RecitalBestPlayUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecitalBestPlayPayload>
          }
          aggregate: {
            args: Prisma.RecitalBestPlayAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecitalBestPlay>
          }
          groupBy: {
            args: Prisma.RecitalBestPlayGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecitalBestPlayGroupByOutputType>[]
          }
          count: {
            args: Prisma.RecitalBestPlayCountArgs<ExtArgs>
            result: $Utils.Optional<RecitalBestPlayCountAggregateOutputType> | number
          }
        }
      }
      PlayData: {
        payload: Prisma.$PlayDataPayload<ExtArgs>
        fields: Prisma.PlayDataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlayDataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayDataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlayDataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayDataPayload>
          }
          findFirst: {
            args: Prisma.PlayDataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayDataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlayDataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayDataPayload>
          }
          findMany: {
            args: Prisma.PlayDataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayDataPayload>[]
          }
          create: {
            args: Prisma.PlayDataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayDataPayload>
          }
          createMany: {
            args: Prisma.PlayDataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlayDataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayDataPayload>[]
          }
          delete: {
            args: Prisma.PlayDataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayDataPayload>
          }
          update: {
            args: Prisma.PlayDataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayDataPayload>
          }
          deleteMany: {
            args: Prisma.PlayDataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlayDataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlayDataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayDataPayload>[]
          }
          upsert: {
            args: Prisma.PlayDataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayDataPayload>
          }
          aggregate: {
            args: Prisma.PlayDataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayData>
          }
          groupBy: {
            args: Prisma.PlayDataGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlayDataGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlayDataCountArgs<ExtArgs>
            result: $Utils.Optional<PlayDataCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    bookmark?: BookmarkOmit
    music?: MusicOmit
    recentPlay?: RecentPlayOmit
    userBestGrade?: UserBestGradeOmit
    basicBestPlay?: BasicBestPlayOmit
    recitalBestPlay?: RecitalBestPlayOmit
    playData?: PlayDataOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    PlayHistory: number
    PlayData: number
    Bookmark: number
    BasicBestPlay: number
    RecitalBestPlay: number
    UserBestGrade: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    PlayHistory?: boolean | UserCountOutputTypeCountPlayHistoryArgs
    PlayData?: boolean | UserCountOutputTypeCountPlayDataArgs
    Bookmark?: boolean | UserCountOutputTypeCountBookmarkArgs
    BasicBestPlay?: boolean | UserCountOutputTypeCountBasicBestPlayArgs
    RecitalBestPlay?: boolean | UserCountOutputTypeCountRecitalBestPlayArgs
    UserBestGrade?: boolean | UserCountOutputTypeCountUserBestGradeArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPlayHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecentPlayWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPlayDataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayDataWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBookmarkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBasicBestPlayArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BasicBestPlayWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRecitalBestPlayArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecitalBestPlayWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUserBestGradeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserBestGradeWhereInput
  }


  /**
   * Count Type MusicCountOutputType
   */

  export type MusicCountOutputType = {
    RecentPlay: number
    PlayData: number
    Bookmark: number
    BasicBestPlay: number
    RecitalBestPlay: number
  }

  export type MusicCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    RecentPlay?: boolean | MusicCountOutputTypeCountRecentPlayArgs
    PlayData?: boolean | MusicCountOutputTypeCountPlayDataArgs
    Bookmark?: boolean | MusicCountOutputTypeCountBookmarkArgs
    BasicBestPlay?: boolean | MusicCountOutputTypeCountBasicBestPlayArgs
    RecitalBestPlay?: boolean | MusicCountOutputTypeCountRecitalBestPlayArgs
  }

  // Custom InputTypes
  /**
   * MusicCountOutputType without action
   */
  export type MusicCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicCountOutputType
     */
    select?: MusicCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MusicCountOutputType without action
   */
  export type MusicCountOutputTypeCountRecentPlayArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecentPlayWhereInput
  }

  /**
   * MusicCountOutputType without action
   */
  export type MusicCountOutputTypeCountPlayDataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayDataWhereInput
  }

  /**
   * MusicCountOutputType without action
   */
  export type MusicCountOutputTypeCountBookmarkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkWhereInput
  }

  /**
   * MusicCountOutputType without action
   */
  export type MusicCountOutputTypeCountBasicBestPlayArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BasicBestPlayWhereInput
  }

  /**
   * MusicCountOutputType without action
   */
  export type MusicCountOutputTypeCountRecitalBestPlayArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecitalBestPlayWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    kakao_id: number | null
    rank_basic: number | null
    rank_recital: number | null
    rank_basic_country: number | null
    rank_recital_country: number | null
    play_count: number | null
    score_p: number | null
    score_f: number | null
    score_s: number | null
    score_a2: number | null
    score_a: number | null
    score_b2: number | null
    score_b: number | null
    score_c: number | null
    score_d: number | null
    grade_basic: number | null
    grade_recital: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    kakao_id: bigint | null
    rank_basic: number | null
    rank_recital: number | null
    rank_basic_country: number | null
    rank_recital_country: number | null
    play_count: number | null
    score_p: number | null
    score_f: number | null
    score_s: number | null
    score_a2: number | null
    score_a: number | null
    score_b2: number | null
    score_b: number | null
    score_c: number | null
    score_d: number | null
    grade_basic: number | null
    grade_recital: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    username: string | null
    kakao_id: bigint | null
    discord_name: string | null
    discord_tag: string | null
    avatar: string | null
    country: string | null
    rank_basic: number | null
    rank_recital: number | null
    rank_basic_country: number | null
    rank_recital_country: number | null
    play_count: number | null
    score_p: number | null
    score_f: number | null
    score_s: number | null
    score_a2: number | null
    score_a: number | null
    score_b2: number | null
    score_b: number | null
    score_c: number | null
    score_d: number | null
    role: string | null
    grade_basic: number | null
    grade_recital: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    username: string | null
    kakao_id: bigint | null
    discord_name: string | null
    discord_tag: string | null
    avatar: string | null
    country: string | null
    rank_basic: number | null
    rank_recital: number | null
    rank_basic_country: number | null
    rank_recital_country: number | null
    play_count: number | null
    score_p: number | null
    score_f: number | null
    score_s: number | null
    score_a2: number | null
    score_a: number | null
    score_b2: number | null
    score_b: number | null
    score_c: number | null
    score_d: number | null
    role: string | null
    grade_basic: number | null
    grade_recital: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    kakao_id: number
    discord_name: number
    discord_tag: number
    avatar: number
    country: number
    rank_basic: number
    rank_recital: number
    rank_basic_country: number
    rank_recital_country: number
    play_count: number
    score_p: number
    score_f: number
    score_s: number
    score_a2: number
    score_a: number
    score_b2: number
    score_b: number
    score_c: number
    score_d: number
    role: number
    grade_basic: number
    grade_recital: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    kakao_id?: true
    rank_basic?: true
    rank_recital?: true
    rank_basic_country?: true
    rank_recital_country?: true
    play_count?: true
    score_p?: true
    score_f?: true
    score_s?: true
    score_a2?: true
    score_a?: true
    score_b2?: true
    score_b?: true
    score_c?: true
    score_d?: true
    grade_basic?: true
    grade_recital?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    kakao_id?: true
    rank_basic?: true
    rank_recital?: true
    rank_basic_country?: true
    rank_recital_country?: true
    play_count?: true
    score_p?: true
    score_f?: true
    score_s?: true
    score_a2?: true
    score_a?: true
    score_b2?: true
    score_b?: true
    score_c?: true
    score_d?: true
    grade_basic?: true
    grade_recital?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    kakao_id?: true
    discord_name?: true
    discord_tag?: true
    avatar?: true
    country?: true
    rank_basic?: true
    rank_recital?: true
    rank_basic_country?: true
    rank_recital_country?: true
    play_count?: true
    score_p?: true
    score_f?: true
    score_s?: true
    score_a2?: true
    score_a?: true
    score_b2?: true
    score_b?: true
    score_c?: true
    score_d?: true
    role?: true
    grade_basic?: true
    grade_recital?: true
    created_at?: true
    updated_at?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    kakao_id?: true
    discord_name?: true
    discord_tag?: true
    avatar?: true
    country?: true
    rank_basic?: true
    rank_recital?: true
    rank_basic_country?: true
    rank_recital_country?: true
    play_count?: true
    score_p?: true
    score_f?: true
    score_s?: true
    score_a2?: true
    score_a?: true
    score_b2?: true
    score_b?: true
    score_c?: true
    score_d?: true
    role?: true
    grade_basic?: true
    grade_recital?: true
    created_at?: true
    updated_at?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    kakao_id?: true
    discord_name?: true
    discord_tag?: true
    avatar?: true
    country?: true
    rank_basic?: true
    rank_recital?: true
    rank_basic_country?: true
    rank_recital_country?: true
    play_count?: true
    score_p?: true
    score_f?: true
    score_s?: true
    score_a2?: true
    score_a?: true
    score_b2?: true
    score_b?: true
    score_c?: true
    score_d?: true
    role?: true
    grade_basic?: true
    grade_recital?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    username: string | null
    kakao_id: bigint | null
    discord_name: string | null
    discord_tag: string | null
    avatar: string | null
    country: string
    rank_basic: number | null
    rank_recital: number | null
    rank_basic_country: number | null
    rank_recital_country: number | null
    play_count: number | null
    score_p: number | null
    score_f: number | null
    score_s: number | null
    score_a2: number | null
    score_a: number | null
    score_b2: number | null
    score_b: number | null
    score_c: number | null
    score_d: number | null
    role: string
    grade_basic: number | null
    grade_recital: number | null
    created_at: Date
    updated_at: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    kakao_id?: boolean
    discord_name?: boolean
    discord_tag?: boolean
    avatar?: boolean
    country?: boolean
    rank_basic?: boolean
    rank_recital?: boolean
    rank_basic_country?: boolean
    rank_recital_country?: boolean
    play_count?: boolean
    score_p?: boolean
    score_f?: boolean
    score_s?: boolean
    score_a2?: boolean
    score_a?: boolean
    score_b2?: boolean
    score_b?: boolean
    score_c?: boolean
    score_d?: boolean
    role?: boolean
    grade_basic?: boolean
    grade_recital?: boolean
    created_at?: boolean
    updated_at?: boolean
    PlayHistory?: boolean | User$PlayHistoryArgs<ExtArgs>
    PlayData?: boolean | User$PlayDataArgs<ExtArgs>
    Bookmark?: boolean | User$BookmarkArgs<ExtArgs>
    BasicBestPlay?: boolean | User$BasicBestPlayArgs<ExtArgs>
    RecitalBestPlay?: boolean | User$RecitalBestPlayArgs<ExtArgs>
    UserBestGrade?: boolean | User$UserBestGradeArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    kakao_id?: boolean
    discord_name?: boolean
    discord_tag?: boolean
    avatar?: boolean
    country?: boolean
    rank_basic?: boolean
    rank_recital?: boolean
    rank_basic_country?: boolean
    rank_recital_country?: boolean
    play_count?: boolean
    score_p?: boolean
    score_f?: boolean
    score_s?: boolean
    score_a2?: boolean
    score_a?: boolean
    score_b2?: boolean
    score_b?: boolean
    score_c?: boolean
    score_d?: boolean
    role?: boolean
    grade_basic?: boolean
    grade_recital?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    kakao_id?: boolean
    discord_name?: boolean
    discord_tag?: boolean
    avatar?: boolean
    country?: boolean
    rank_basic?: boolean
    rank_recital?: boolean
    rank_basic_country?: boolean
    rank_recital_country?: boolean
    play_count?: boolean
    score_p?: boolean
    score_f?: boolean
    score_s?: boolean
    score_a2?: boolean
    score_a?: boolean
    score_b2?: boolean
    score_b?: boolean
    score_c?: boolean
    score_d?: boolean
    role?: boolean
    grade_basic?: boolean
    grade_recital?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    kakao_id?: boolean
    discord_name?: boolean
    discord_tag?: boolean
    avatar?: boolean
    country?: boolean
    rank_basic?: boolean
    rank_recital?: boolean
    rank_basic_country?: boolean
    rank_recital_country?: boolean
    play_count?: boolean
    score_p?: boolean
    score_f?: boolean
    score_s?: boolean
    score_a2?: boolean
    score_a?: boolean
    score_b2?: boolean
    score_b?: boolean
    score_c?: boolean
    score_d?: boolean
    role?: boolean
    grade_basic?: boolean
    grade_recital?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "kakao_id" | "discord_name" | "discord_tag" | "avatar" | "country" | "rank_basic" | "rank_recital" | "rank_basic_country" | "rank_recital_country" | "play_count" | "score_p" | "score_f" | "score_s" | "score_a2" | "score_a" | "score_b2" | "score_b" | "score_c" | "score_d" | "role" | "grade_basic" | "grade_recital" | "created_at" | "updated_at", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    PlayHistory?: boolean | User$PlayHistoryArgs<ExtArgs>
    PlayData?: boolean | User$PlayDataArgs<ExtArgs>
    Bookmark?: boolean | User$BookmarkArgs<ExtArgs>
    BasicBestPlay?: boolean | User$BasicBestPlayArgs<ExtArgs>
    RecitalBestPlay?: boolean | User$RecitalBestPlayArgs<ExtArgs>
    UserBestGrade?: boolean | User$UserBestGradeArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      PlayHistory: Prisma.$RecentPlayPayload<ExtArgs>[]
      PlayData: Prisma.$PlayDataPayload<ExtArgs>[]
      Bookmark: Prisma.$BookmarkPayload<ExtArgs>[]
      BasicBestPlay: Prisma.$BasicBestPlayPayload<ExtArgs>[]
      RecitalBestPlay: Prisma.$RecitalBestPlayPayload<ExtArgs>[]
      UserBestGrade: Prisma.$UserBestGradePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      username: string | null
      kakao_id: bigint | null
      discord_name: string | null
      discord_tag: string | null
      avatar: string | null
      country: string
      rank_basic: number | null
      rank_recital: number | null
      rank_basic_country: number | null
      rank_recital_country: number | null
      play_count: number | null
      score_p: number | null
      score_f: number | null
      score_s: number | null
      score_a2: number | null
      score_a: number | null
      score_b2: number | null
      score_b: number | null
      score_c: number | null
      score_d: number | null
      role: string
      grade_basic: number | null
      grade_recital: number | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    PlayHistory<T extends User$PlayHistoryArgs<ExtArgs> = {}>(args?: Subset<T, User$PlayHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecentPlayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    PlayData<T extends User$PlayDataArgs<ExtArgs> = {}>(args?: Subset<T, User$PlayDataArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Bookmark<T extends User$BookmarkArgs<ExtArgs> = {}>(args?: Subset<T, User$BookmarkArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    BasicBestPlay<T extends User$BasicBestPlayArgs<ExtArgs> = {}>(args?: Subset<T, User$BasicBestPlayArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BasicBestPlayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    RecitalBestPlay<T extends User$RecitalBestPlayArgs<ExtArgs> = {}>(args?: Subset<T, User$RecitalBestPlayArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecitalBestPlayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    UserBestGrade<T extends User$UserBestGradeArgs<ExtArgs> = {}>(args?: Subset<T, User$UserBestGradeArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBestGradePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly username: FieldRef<"User", 'String'>
    readonly kakao_id: FieldRef<"User", 'BigInt'>
    readonly discord_name: FieldRef<"User", 'String'>
    readonly discord_tag: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly country: FieldRef<"User", 'String'>
    readonly rank_basic: FieldRef<"User", 'Int'>
    readonly rank_recital: FieldRef<"User", 'Int'>
    readonly rank_basic_country: FieldRef<"User", 'Int'>
    readonly rank_recital_country: FieldRef<"User", 'Int'>
    readonly play_count: FieldRef<"User", 'Int'>
    readonly score_p: FieldRef<"User", 'Int'>
    readonly score_f: FieldRef<"User", 'Int'>
    readonly score_s: FieldRef<"User", 'Int'>
    readonly score_a2: FieldRef<"User", 'Int'>
    readonly score_a: FieldRef<"User", 'Int'>
    readonly score_b2: FieldRef<"User", 'Int'>
    readonly score_b: FieldRef<"User", 'Int'>
    readonly score_c: FieldRef<"User", 'Int'>
    readonly score_d: FieldRef<"User", 'Int'>
    readonly role: FieldRef<"User", 'String'>
    readonly grade_basic: FieldRef<"User", 'Int'>
    readonly grade_recital: FieldRef<"User", 'Int'>
    readonly created_at: FieldRef<"User", 'DateTime'>
    readonly updated_at: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.PlayHistory
   */
  export type User$PlayHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentPlay
     */
    select?: RecentPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentPlay
     */
    omit?: RecentPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecentPlayInclude<ExtArgs> | null
    where?: RecentPlayWhereInput
    orderBy?: RecentPlayOrderByWithRelationInput | RecentPlayOrderByWithRelationInput[]
    cursor?: RecentPlayWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecentPlayScalarFieldEnum | RecentPlayScalarFieldEnum[]
  }

  /**
   * User.PlayData
   */
  export type User$PlayDataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayData
     */
    select?: PlayDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayData
     */
    omit?: PlayDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayDataInclude<ExtArgs> | null
    where?: PlayDataWhereInput
    orderBy?: PlayDataOrderByWithRelationInput | PlayDataOrderByWithRelationInput[]
    cursor?: PlayDataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayDataScalarFieldEnum | PlayDataScalarFieldEnum[]
  }

  /**
   * User.Bookmark
   */
  export type User$BookmarkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    where?: BookmarkWhereInput
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    cursor?: BookmarkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * User.BasicBestPlay
   */
  export type User$BasicBestPlayArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BasicBestPlay
     */
    select?: BasicBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BasicBestPlay
     */
    omit?: BasicBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BasicBestPlayInclude<ExtArgs> | null
    where?: BasicBestPlayWhereInput
    orderBy?: BasicBestPlayOrderByWithRelationInput | BasicBestPlayOrderByWithRelationInput[]
    cursor?: BasicBestPlayWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BasicBestPlayScalarFieldEnum | BasicBestPlayScalarFieldEnum[]
  }

  /**
   * User.RecitalBestPlay
   */
  export type User$RecitalBestPlayArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecitalBestPlay
     */
    select?: RecitalBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecitalBestPlay
     */
    omit?: RecitalBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecitalBestPlayInclude<ExtArgs> | null
    where?: RecitalBestPlayWhereInput
    orderBy?: RecitalBestPlayOrderByWithRelationInput | RecitalBestPlayOrderByWithRelationInput[]
    cursor?: RecitalBestPlayWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecitalBestPlayScalarFieldEnum | RecitalBestPlayScalarFieldEnum[]
  }

  /**
   * User.UserBestGrade
   */
  export type User$UserBestGradeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBestGrade
     */
    select?: UserBestGradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBestGrade
     */
    omit?: UserBestGradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBestGradeInclude<ExtArgs> | null
    where?: UserBestGradeWhereInput
    orderBy?: UserBestGradeOrderByWithRelationInput | UserBestGradeOrderByWithRelationInput[]
    cursor?: UserBestGradeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserBestGradeScalarFieldEnum | UserBestGradeScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Bookmark
   */

  export type AggregateBookmark = {
    _count: BookmarkCountAggregateOutputType | null
    _avg: BookmarkAvgAggregateOutputType | null
    _sum: BookmarkSumAggregateOutputType | null
    _min: BookmarkMinAggregateOutputType | null
    _max: BookmarkMaxAggregateOutputType | null
  }

  export type BookmarkAvgAggregateOutputType = {
    id: number | null
    user_id: number | null
    music_id: number | null
  }

  export type BookmarkSumAggregateOutputType = {
    id: number | null
    user_id: number | null
    music_id: number | null
  }

  export type BookmarkMinAggregateOutputType = {
    id: number | null
    user_id: number | null
    music_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type BookmarkMaxAggregateOutputType = {
    id: number | null
    user_id: number | null
    music_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type BookmarkCountAggregateOutputType = {
    id: number
    user_id: number
    music_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type BookmarkAvgAggregateInputType = {
    id?: true
    user_id?: true
    music_id?: true
  }

  export type BookmarkSumAggregateInputType = {
    id?: true
    user_id?: true
    music_id?: true
  }

  export type BookmarkMinAggregateInputType = {
    id?: true
    user_id?: true
    music_id?: true
    created_at?: true
    updated_at?: true
  }

  export type BookmarkMaxAggregateInputType = {
    id?: true
    user_id?: true
    music_id?: true
    created_at?: true
    updated_at?: true
  }

  export type BookmarkCountAggregateInputType = {
    id?: true
    user_id?: true
    music_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type BookmarkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookmark to aggregate.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bookmarks
    **/
    _count?: true | BookmarkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookmarkAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookmarkSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookmarkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookmarkMaxAggregateInputType
  }

  export type GetBookmarkAggregateType<T extends BookmarkAggregateArgs> = {
        [P in keyof T & keyof AggregateBookmark]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookmark[P]>
      : GetScalarType<T[P], AggregateBookmark[P]>
  }




  export type BookmarkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkWhereInput
    orderBy?: BookmarkOrderByWithAggregationInput | BookmarkOrderByWithAggregationInput[]
    by: BookmarkScalarFieldEnum[] | BookmarkScalarFieldEnum
    having?: BookmarkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookmarkCountAggregateInputType | true
    _avg?: BookmarkAvgAggregateInputType
    _sum?: BookmarkSumAggregateInputType
    _min?: BookmarkMinAggregateInputType
    _max?: BookmarkMaxAggregateInputType
  }

  export type BookmarkGroupByOutputType = {
    id: number
    user_id: number
    music_id: number
    created_at: Date
    updated_at: Date
    _count: BookmarkCountAggregateOutputType | null
    _avg: BookmarkAvgAggregateOutputType | null
    _sum: BookmarkSumAggregateOutputType | null
    _min: BookmarkMinAggregateOutputType | null
    _max: BookmarkMaxAggregateOutputType | null
  }

  type GetBookmarkGroupByPayload<T extends BookmarkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookmarkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookmarkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookmarkGroupByOutputType[P]>
            : GetScalarType<T[P], BookmarkGroupByOutputType[P]>
        }
      >
    >


  export type BookmarkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    music_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmark"]>

  export type BookmarkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    music_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmark"]>

  export type BookmarkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    music_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmark"]>

  export type BookmarkSelectScalar = {
    id?: boolean
    user_id?: boolean
    music_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type BookmarkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "music_id" | "created_at" | "updated_at", ExtArgs["result"]["bookmark"]>
  export type BookmarkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }
  export type BookmarkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }
  export type BookmarkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }

  export type $BookmarkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Bookmark"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      music: Prisma.$MusicPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      user_id: number
      music_id: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["bookmark"]>
    composites: {}
  }

  type BookmarkGetPayload<S extends boolean | null | undefined | BookmarkDefaultArgs> = $Result.GetResult<Prisma.$BookmarkPayload, S>

  type BookmarkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookmarkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookmarkCountAggregateInputType | true
    }

  export interface BookmarkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Bookmark'], meta: { name: 'Bookmark' } }
    /**
     * Find zero or one Bookmark that matches the filter.
     * @param {BookmarkFindUniqueArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookmarkFindUniqueArgs>(args: SelectSubset<T, BookmarkFindUniqueArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bookmark that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookmarkFindUniqueOrThrowArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookmarkFindUniqueOrThrowArgs>(args: SelectSubset<T, BookmarkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookmark that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkFindFirstArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookmarkFindFirstArgs>(args?: SelectSubset<T, BookmarkFindFirstArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookmark that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkFindFirstOrThrowArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookmarkFindFirstOrThrowArgs>(args?: SelectSubset<T, BookmarkFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bookmarks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookmarks
     * const bookmarks = await prisma.bookmark.findMany()
     * 
     * // Get first 10 Bookmarks
     * const bookmarks = await prisma.bookmark.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookmarkWithIdOnly = await prisma.bookmark.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookmarkFindManyArgs>(args?: SelectSubset<T, BookmarkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bookmark.
     * @param {BookmarkCreateArgs} args - Arguments to create a Bookmark.
     * @example
     * // Create one Bookmark
     * const Bookmark = await prisma.bookmark.create({
     *   data: {
     *     // ... data to create a Bookmark
     *   }
     * })
     * 
     */
    create<T extends BookmarkCreateArgs>(args: SelectSubset<T, BookmarkCreateArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bookmarks.
     * @param {BookmarkCreateManyArgs} args - Arguments to create many Bookmarks.
     * @example
     * // Create many Bookmarks
     * const bookmark = await prisma.bookmark.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookmarkCreateManyArgs>(args?: SelectSubset<T, BookmarkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bookmarks and returns the data saved in the database.
     * @param {BookmarkCreateManyAndReturnArgs} args - Arguments to create many Bookmarks.
     * @example
     * // Create many Bookmarks
     * const bookmark = await prisma.bookmark.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bookmarks and only return the `id`
     * const bookmarkWithIdOnly = await prisma.bookmark.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookmarkCreateManyAndReturnArgs>(args?: SelectSubset<T, BookmarkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Bookmark.
     * @param {BookmarkDeleteArgs} args - Arguments to delete one Bookmark.
     * @example
     * // Delete one Bookmark
     * const Bookmark = await prisma.bookmark.delete({
     *   where: {
     *     // ... filter to delete one Bookmark
     *   }
     * })
     * 
     */
    delete<T extends BookmarkDeleteArgs>(args: SelectSubset<T, BookmarkDeleteArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bookmark.
     * @param {BookmarkUpdateArgs} args - Arguments to update one Bookmark.
     * @example
     * // Update one Bookmark
     * const bookmark = await prisma.bookmark.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookmarkUpdateArgs>(args: SelectSubset<T, BookmarkUpdateArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bookmarks.
     * @param {BookmarkDeleteManyArgs} args - Arguments to filter Bookmarks to delete.
     * @example
     * // Delete a few Bookmarks
     * const { count } = await prisma.bookmark.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookmarkDeleteManyArgs>(args?: SelectSubset<T, BookmarkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookmarks
     * const bookmark = await prisma.bookmark.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookmarkUpdateManyArgs>(args: SelectSubset<T, BookmarkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookmarks and returns the data updated in the database.
     * @param {BookmarkUpdateManyAndReturnArgs} args - Arguments to update many Bookmarks.
     * @example
     * // Update many Bookmarks
     * const bookmark = await prisma.bookmark.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bookmarks and only return the `id`
     * const bookmarkWithIdOnly = await prisma.bookmark.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BookmarkUpdateManyAndReturnArgs>(args: SelectSubset<T, BookmarkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Bookmark.
     * @param {BookmarkUpsertArgs} args - Arguments to update or create a Bookmark.
     * @example
     * // Update or create a Bookmark
     * const bookmark = await prisma.bookmark.upsert({
     *   create: {
     *     // ... data to create a Bookmark
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bookmark we want to update
     *   }
     * })
     */
    upsert<T extends BookmarkUpsertArgs>(args: SelectSubset<T, BookmarkUpsertArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkCountArgs} args - Arguments to filter Bookmarks to count.
     * @example
     * // Count the number of Bookmarks
     * const count = await prisma.bookmark.count({
     *   where: {
     *     // ... the filter for the Bookmarks we want to count
     *   }
     * })
    **/
    count<T extends BookmarkCountArgs>(
      args?: Subset<T, BookmarkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookmarkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookmarkAggregateArgs>(args: Subset<T, BookmarkAggregateArgs>): Prisma.PrismaPromise<GetBookmarkAggregateType<T>>

    /**
     * Group by Bookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookmarkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookmarkGroupByArgs['orderBy'] }
        : { orderBy?: BookmarkGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookmarkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookmarkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Bookmark model
   */
  readonly fields: BookmarkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Bookmark.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookmarkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    music<T extends MusicDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MusicDefaultArgs<ExtArgs>>): Prisma__MusicClient<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Bookmark model
   */
  interface BookmarkFieldRefs {
    readonly id: FieldRef<"Bookmark", 'Int'>
    readonly user_id: FieldRef<"Bookmark", 'Int'>
    readonly music_id: FieldRef<"Bookmark", 'Int'>
    readonly created_at: FieldRef<"Bookmark", 'DateTime'>
    readonly updated_at: FieldRef<"Bookmark", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Bookmark findUnique
   */
  export type BookmarkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark findUniqueOrThrow
   */
  export type BookmarkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark findFirst
   */
  export type BookmarkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookmarks.
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookmarks.
     */
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Bookmark findFirstOrThrow
   */
  export type BookmarkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookmarks.
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookmarks.
     */
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Bookmark findMany
   */
  export type BookmarkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmarks to fetch.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bookmarks.
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Bookmark create
   */
  export type BookmarkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * The data needed to create a Bookmark.
     */
    data: XOR<BookmarkCreateInput, BookmarkUncheckedCreateInput>
  }

  /**
   * Bookmark createMany
   */
  export type BookmarkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bookmarks.
     */
    data: BookmarkCreateManyInput | BookmarkCreateManyInput[]
  }

  /**
   * Bookmark createManyAndReturn
   */
  export type BookmarkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * The data used to create many Bookmarks.
     */
    data: BookmarkCreateManyInput | BookmarkCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bookmark update
   */
  export type BookmarkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * The data needed to update a Bookmark.
     */
    data: XOR<BookmarkUpdateInput, BookmarkUncheckedUpdateInput>
    /**
     * Choose, which Bookmark to update.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark updateMany
   */
  export type BookmarkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bookmarks.
     */
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyInput>
    /**
     * Filter which Bookmarks to update
     */
    where?: BookmarkWhereInput
    /**
     * Limit how many Bookmarks to update.
     */
    limit?: number
  }

  /**
   * Bookmark updateManyAndReturn
   */
  export type BookmarkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * The data used to update Bookmarks.
     */
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyInput>
    /**
     * Filter which Bookmarks to update
     */
    where?: BookmarkWhereInput
    /**
     * Limit how many Bookmarks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bookmark upsert
   */
  export type BookmarkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * The filter to search for the Bookmark to update in case it exists.
     */
    where: BookmarkWhereUniqueInput
    /**
     * In case the Bookmark found by the `where` argument doesn't exist, create a new Bookmark with this data.
     */
    create: XOR<BookmarkCreateInput, BookmarkUncheckedCreateInput>
    /**
     * In case the Bookmark was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookmarkUpdateInput, BookmarkUncheckedUpdateInput>
  }

  /**
   * Bookmark delete
   */
  export type BookmarkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter which Bookmark to delete.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark deleteMany
   */
  export type BookmarkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookmarks to delete
     */
    where?: BookmarkWhereInput
    /**
     * Limit how many Bookmarks to delete.
     */
    limit?: number
  }

  /**
   * Bookmark without action
   */
  export type BookmarkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
  }


  /**
   * Model Music
   */

  export type AggregateMusic = {
    _count: MusicCountAggregateOutputType | null
    _avg: MusicAvgAggregateOutputType | null
    _sum: MusicSumAggregateOutputType | null
    _min: MusicMinAggregateOutputType | null
    _max: MusicMaxAggregateOutputType | null
  }

  export type MusicAvgAggregateOutputType = {
    id: number | null
    sheet_len: number | null
  }

  export type MusicSumAggregateOutputType = {
    id: number | null
    sheet_len: number | null
  }

  export type MusicMinAggregateOutputType = {
    id: number | null
    index: string | null
    title: string | null
    title_kana: string | null
    artist: string | null
    category: string | null
    category_short: string | null
    description: string | null
    background: string | null
    sheet_len: number | null
    difficulty_levels: string | null
    difficulty_name: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type MusicMaxAggregateOutputType = {
    id: number | null
    index: string | null
    title: string | null
    title_kana: string | null
    artist: string | null
    category: string | null
    category_short: string | null
    description: string | null
    background: string | null
    sheet_len: number | null
    difficulty_levels: string | null
    difficulty_name: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type MusicCountAggregateOutputType = {
    id: number
    index: number
    title: number
    title_kana: number
    artist: number
    category: number
    category_short: number
    description: number
    background: number
    sheet_len: number
    difficulty_levels: number
    difficulty_name: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type MusicAvgAggregateInputType = {
    id?: true
    sheet_len?: true
  }

  export type MusicSumAggregateInputType = {
    id?: true
    sheet_len?: true
  }

  export type MusicMinAggregateInputType = {
    id?: true
    index?: true
    title?: true
    title_kana?: true
    artist?: true
    category?: true
    category_short?: true
    description?: true
    background?: true
    sheet_len?: true
    difficulty_levels?: true
    difficulty_name?: true
    created_at?: true
    updated_at?: true
  }

  export type MusicMaxAggregateInputType = {
    id?: true
    index?: true
    title?: true
    title_kana?: true
    artist?: true
    category?: true
    category_short?: true
    description?: true
    background?: true
    sheet_len?: true
    difficulty_levels?: true
    difficulty_name?: true
    created_at?: true
    updated_at?: true
  }

  export type MusicCountAggregateInputType = {
    id?: true
    index?: true
    title?: true
    title_kana?: true
    artist?: true
    category?: true
    category_short?: true
    description?: true
    background?: true
    sheet_len?: true
    difficulty_levels?: true
    difficulty_name?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type MusicAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Music to aggregate.
     */
    where?: MusicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Music to fetch.
     */
    orderBy?: MusicOrderByWithRelationInput | MusicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MusicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Music from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Music.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Music
    **/
    _count?: true | MusicCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MusicAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MusicSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MusicMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MusicMaxAggregateInputType
  }

  export type GetMusicAggregateType<T extends MusicAggregateArgs> = {
        [P in keyof T & keyof AggregateMusic]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMusic[P]>
      : GetScalarType<T[P], AggregateMusic[P]>
  }




  export type MusicGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MusicWhereInput
    orderBy?: MusicOrderByWithAggregationInput | MusicOrderByWithAggregationInput[]
    by: MusicScalarFieldEnum[] | MusicScalarFieldEnum
    having?: MusicScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MusicCountAggregateInputType | true
    _avg?: MusicAvgAggregateInputType
    _sum?: MusicSumAggregateInputType
    _min?: MusicMinAggregateInputType
    _max?: MusicMaxAggregateInputType
  }

  export type MusicGroupByOutputType = {
    id: number
    index: string
    title: string
    title_kana: string
    artist: string | null
    category: string
    category_short: string
    description: string | null
    background: string | null
    sheet_len: number
    difficulty_levels: string
    difficulty_name: string
    created_at: Date
    updated_at: Date
    _count: MusicCountAggregateOutputType | null
    _avg: MusicAvgAggregateOutputType | null
    _sum: MusicSumAggregateOutputType | null
    _min: MusicMinAggregateOutputType | null
    _max: MusicMaxAggregateOutputType | null
  }

  type GetMusicGroupByPayload<T extends MusicGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MusicGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MusicGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MusicGroupByOutputType[P]>
            : GetScalarType<T[P], MusicGroupByOutputType[P]>
        }
      >
    >


  export type MusicSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    index?: boolean
    title?: boolean
    title_kana?: boolean
    artist?: boolean
    category?: boolean
    category_short?: boolean
    description?: boolean
    background?: boolean
    sheet_len?: boolean
    difficulty_levels?: boolean
    difficulty_name?: boolean
    created_at?: boolean
    updated_at?: boolean
    RecentPlay?: boolean | Music$RecentPlayArgs<ExtArgs>
    PlayData?: boolean | Music$PlayDataArgs<ExtArgs>
    Bookmark?: boolean | Music$BookmarkArgs<ExtArgs>
    BasicBestPlay?: boolean | Music$BasicBestPlayArgs<ExtArgs>
    RecitalBestPlay?: boolean | Music$RecitalBestPlayArgs<ExtArgs>
    _count?: boolean | MusicCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["music"]>

  export type MusicSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    index?: boolean
    title?: boolean
    title_kana?: boolean
    artist?: boolean
    category?: boolean
    category_short?: boolean
    description?: boolean
    background?: boolean
    sheet_len?: boolean
    difficulty_levels?: boolean
    difficulty_name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["music"]>

  export type MusicSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    index?: boolean
    title?: boolean
    title_kana?: boolean
    artist?: boolean
    category?: boolean
    category_short?: boolean
    description?: boolean
    background?: boolean
    sheet_len?: boolean
    difficulty_levels?: boolean
    difficulty_name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["music"]>

  export type MusicSelectScalar = {
    id?: boolean
    index?: boolean
    title?: boolean
    title_kana?: boolean
    artist?: boolean
    category?: boolean
    category_short?: boolean
    description?: boolean
    background?: boolean
    sheet_len?: boolean
    difficulty_levels?: boolean
    difficulty_name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type MusicOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "index" | "title" | "title_kana" | "artist" | "category" | "category_short" | "description" | "background" | "sheet_len" | "difficulty_levels" | "difficulty_name" | "created_at" | "updated_at", ExtArgs["result"]["music"]>
  export type MusicInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    RecentPlay?: boolean | Music$RecentPlayArgs<ExtArgs>
    PlayData?: boolean | Music$PlayDataArgs<ExtArgs>
    Bookmark?: boolean | Music$BookmarkArgs<ExtArgs>
    BasicBestPlay?: boolean | Music$BasicBestPlayArgs<ExtArgs>
    RecitalBestPlay?: boolean | Music$RecitalBestPlayArgs<ExtArgs>
    _count?: boolean | MusicCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MusicIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MusicIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MusicPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Music"
    objects: {
      RecentPlay: Prisma.$RecentPlayPayload<ExtArgs>[]
      PlayData: Prisma.$PlayDataPayload<ExtArgs>[]
      Bookmark: Prisma.$BookmarkPayload<ExtArgs>[]
      BasicBestPlay: Prisma.$BasicBestPlayPayload<ExtArgs>[]
      RecitalBestPlay: Prisma.$RecitalBestPlayPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      index: string
      title: string
      title_kana: string
      artist: string | null
      category: string
      category_short: string
      description: string | null
      background: string | null
      sheet_len: number
      difficulty_levels: string
      difficulty_name: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["music"]>
    composites: {}
  }

  type MusicGetPayload<S extends boolean | null | undefined | MusicDefaultArgs> = $Result.GetResult<Prisma.$MusicPayload, S>

  type MusicCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MusicFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MusicCountAggregateInputType | true
    }

  export interface MusicDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Music'], meta: { name: 'Music' } }
    /**
     * Find zero or one Music that matches the filter.
     * @param {MusicFindUniqueArgs} args - Arguments to find a Music
     * @example
     * // Get one Music
     * const music = await prisma.music.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MusicFindUniqueArgs>(args: SelectSubset<T, MusicFindUniqueArgs<ExtArgs>>): Prisma__MusicClient<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Music that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MusicFindUniqueOrThrowArgs} args - Arguments to find a Music
     * @example
     * // Get one Music
     * const music = await prisma.music.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MusicFindUniqueOrThrowArgs>(args: SelectSubset<T, MusicFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MusicClient<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Music that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicFindFirstArgs} args - Arguments to find a Music
     * @example
     * // Get one Music
     * const music = await prisma.music.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MusicFindFirstArgs>(args?: SelectSubset<T, MusicFindFirstArgs<ExtArgs>>): Prisma__MusicClient<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Music that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicFindFirstOrThrowArgs} args - Arguments to find a Music
     * @example
     * // Get one Music
     * const music = await prisma.music.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MusicFindFirstOrThrowArgs>(args?: SelectSubset<T, MusicFindFirstOrThrowArgs<ExtArgs>>): Prisma__MusicClient<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Music that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Music
     * const music = await prisma.music.findMany()
     * 
     * // Get first 10 Music
     * const music = await prisma.music.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const musicWithIdOnly = await prisma.music.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MusicFindManyArgs>(args?: SelectSubset<T, MusicFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Music.
     * @param {MusicCreateArgs} args - Arguments to create a Music.
     * @example
     * // Create one Music
     * const Music = await prisma.music.create({
     *   data: {
     *     // ... data to create a Music
     *   }
     * })
     * 
     */
    create<T extends MusicCreateArgs>(args: SelectSubset<T, MusicCreateArgs<ExtArgs>>): Prisma__MusicClient<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Music.
     * @param {MusicCreateManyArgs} args - Arguments to create many Music.
     * @example
     * // Create many Music
     * const music = await prisma.music.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MusicCreateManyArgs>(args?: SelectSubset<T, MusicCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Music and returns the data saved in the database.
     * @param {MusicCreateManyAndReturnArgs} args - Arguments to create many Music.
     * @example
     * // Create many Music
     * const music = await prisma.music.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Music and only return the `id`
     * const musicWithIdOnly = await prisma.music.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MusicCreateManyAndReturnArgs>(args?: SelectSubset<T, MusicCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Music.
     * @param {MusicDeleteArgs} args - Arguments to delete one Music.
     * @example
     * // Delete one Music
     * const Music = await prisma.music.delete({
     *   where: {
     *     // ... filter to delete one Music
     *   }
     * })
     * 
     */
    delete<T extends MusicDeleteArgs>(args: SelectSubset<T, MusicDeleteArgs<ExtArgs>>): Prisma__MusicClient<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Music.
     * @param {MusicUpdateArgs} args - Arguments to update one Music.
     * @example
     * // Update one Music
     * const music = await prisma.music.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MusicUpdateArgs>(args: SelectSubset<T, MusicUpdateArgs<ExtArgs>>): Prisma__MusicClient<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Music.
     * @param {MusicDeleteManyArgs} args - Arguments to filter Music to delete.
     * @example
     * // Delete a few Music
     * const { count } = await prisma.music.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MusicDeleteManyArgs>(args?: SelectSubset<T, MusicDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Music.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Music
     * const music = await prisma.music.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MusicUpdateManyArgs>(args: SelectSubset<T, MusicUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Music and returns the data updated in the database.
     * @param {MusicUpdateManyAndReturnArgs} args - Arguments to update many Music.
     * @example
     * // Update many Music
     * const music = await prisma.music.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Music and only return the `id`
     * const musicWithIdOnly = await prisma.music.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MusicUpdateManyAndReturnArgs>(args: SelectSubset<T, MusicUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Music.
     * @param {MusicUpsertArgs} args - Arguments to update or create a Music.
     * @example
     * // Update or create a Music
     * const music = await prisma.music.upsert({
     *   create: {
     *     // ... data to create a Music
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Music we want to update
     *   }
     * })
     */
    upsert<T extends MusicUpsertArgs>(args: SelectSubset<T, MusicUpsertArgs<ExtArgs>>): Prisma__MusicClient<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Music.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicCountArgs} args - Arguments to filter Music to count.
     * @example
     * // Count the number of Music
     * const count = await prisma.music.count({
     *   where: {
     *     // ... the filter for the Music we want to count
     *   }
     * })
    **/
    count<T extends MusicCountArgs>(
      args?: Subset<T, MusicCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MusicCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Music.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MusicAggregateArgs>(args: Subset<T, MusicAggregateArgs>): Prisma.PrismaPromise<GetMusicAggregateType<T>>

    /**
     * Group by Music.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MusicGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MusicGroupByArgs['orderBy'] }
        : { orderBy?: MusicGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MusicGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMusicGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Music model
   */
  readonly fields: MusicFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Music.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MusicClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    RecentPlay<T extends Music$RecentPlayArgs<ExtArgs> = {}>(args?: Subset<T, Music$RecentPlayArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecentPlayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    PlayData<T extends Music$PlayDataArgs<ExtArgs> = {}>(args?: Subset<T, Music$PlayDataArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Bookmark<T extends Music$BookmarkArgs<ExtArgs> = {}>(args?: Subset<T, Music$BookmarkArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    BasicBestPlay<T extends Music$BasicBestPlayArgs<ExtArgs> = {}>(args?: Subset<T, Music$BasicBestPlayArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BasicBestPlayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    RecitalBestPlay<T extends Music$RecitalBestPlayArgs<ExtArgs> = {}>(args?: Subset<T, Music$RecitalBestPlayArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecitalBestPlayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Music model
   */
  interface MusicFieldRefs {
    readonly id: FieldRef<"Music", 'Int'>
    readonly index: FieldRef<"Music", 'String'>
    readonly title: FieldRef<"Music", 'String'>
    readonly title_kana: FieldRef<"Music", 'String'>
    readonly artist: FieldRef<"Music", 'String'>
    readonly category: FieldRef<"Music", 'String'>
    readonly category_short: FieldRef<"Music", 'String'>
    readonly description: FieldRef<"Music", 'String'>
    readonly background: FieldRef<"Music", 'String'>
    readonly sheet_len: FieldRef<"Music", 'Int'>
    readonly difficulty_levels: FieldRef<"Music", 'String'>
    readonly difficulty_name: FieldRef<"Music", 'String'>
    readonly created_at: FieldRef<"Music", 'DateTime'>
    readonly updated_at: FieldRef<"Music", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Music findUnique
   */
  export type MusicFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Music
     */
    select?: MusicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Music
     */
    omit?: MusicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicInclude<ExtArgs> | null
    /**
     * Filter, which Music to fetch.
     */
    where: MusicWhereUniqueInput
  }

  /**
   * Music findUniqueOrThrow
   */
  export type MusicFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Music
     */
    select?: MusicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Music
     */
    omit?: MusicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicInclude<ExtArgs> | null
    /**
     * Filter, which Music to fetch.
     */
    where: MusicWhereUniqueInput
  }

  /**
   * Music findFirst
   */
  export type MusicFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Music
     */
    select?: MusicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Music
     */
    omit?: MusicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicInclude<ExtArgs> | null
    /**
     * Filter, which Music to fetch.
     */
    where?: MusicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Music to fetch.
     */
    orderBy?: MusicOrderByWithRelationInput | MusicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Music.
     */
    cursor?: MusicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Music from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Music.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Music.
     */
    distinct?: MusicScalarFieldEnum | MusicScalarFieldEnum[]
  }

  /**
   * Music findFirstOrThrow
   */
  export type MusicFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Music
     */
    select?: MusicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Music
     */
    omit?: MusicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicInclude<ExtArgs> | null
    /**
     * Filter, which Music to fetch.
     */
    where?: MusicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Music to fetch.
     */
    orderBy?: MusicOrderByWithRelationInput | MusicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Music.
     */
    cursor?: MusicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Music from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Music.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Music.
     */
    distinct?: MusicScalarFieldEnum | MusicScalarFieldEnum[]
  }

  /**
   * Music findMany
   */
  export type MusicFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Music
     */
    select?: MusicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Music
     */
    omit?: MusicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicInclude<ExtArgs> | null
    /**
     * Filter, which Music to fetch.
     */
    where?: MusicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Music to fetch.
     */
    orderBy?: MusicOrderByWithRelationInput | MusicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Music.
     */
    cursor?: MusicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Music from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Music.
     */
    skip?: number
    distinct?: MusicScalarFieldEnum | MusicScalarFieldEnum[]
  }

  /**
   * Music create
   */
  export type MusicCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Music
     */
    select?: MusicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Music
     */
    omit?: MusicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicInclude<ExtArgs> | null
    /**
     * The data needed to create a Music.
     */
    data: XOR<MusicCreateInput, MusicUncheckedCreateInput>
  }

  /**
   * Music createMany
   */
  export type MusicCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Music.
     */
    data: MusicCreateManyInput | MusicCreateManyInput[]
  }

  /**
   * Music createManyAndReturn
   */
  export type MusicCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Music
     */
    select?: MusicSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Music
     */
    omit?: MusicOmit<ExtArgs> | null
    /**
     * The data used to create many Music.
     */
    data: MusicCreateManyInput | MusicCreateManyInput[]
  }

  /**
   * Music update
   */
  export type MusicUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Music
     */
    select?: MusicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Music
     */
    omit?: MusicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicInclude<ExtArgs> | null
    /**
     * The data needed to update a Music.
     */
    data: XOR<MusicUpdateInput, MusicUncheckedUpdateInput>
    /**
     * Choose, which Music to update.
     */
    where: MusicWhereUniqueInput
  }

  /**
   * Music updateMany
   */
  export type MusicUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Music.
     */
    data: XOR<MusicUpdateManyMutationInput, MusicUncheckedUpdateManyInput>
    /**
     * Filter which Music to update
     */
    where?: MusicWhereInput
    /**
     * Limit how many Music to update.
     */
    limit?: number
  }

  /**
   * Music updateManyAndReturn
   */
  export type MusicUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Music
     */
    select?: MusicSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Music
     */
    omit?: MusicOmit<ExtArgs> | null
    /**
     * The data used to update Music.
     */
    data: XOR<MusicUpdateManyMutationInput, MusicUncheckedUpdateManyInput>
    /**
     * Filter which Music to update
     */
    where?: MusicWhereInput
    /**
     * Limit how many Music to update.
     */
    limit?: number
  }

  /**
   * Music upsert
   */
  export type MusicUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Music
     */
    select?: MusicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Music
     */
    omit?: MusicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicInclude<ExtArgs> | null
    /**
     * The filter to search for the Music to update in case it exists.
     */
    where: MusicWhereUniqueInput
    /**
     * In case the Music found by the `where` argument doesn't exist, create a new Music with this data.
     */
    create: XOR<MusicCreateInput, MusicUncheckedCreateInput>
    /**
     * In case the Music was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MusicUpdateInput, MusicUncheckedUpdateInput>
  }

  /**
   * Music delete
   */
  export type MusicDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Music
     */
    select?: MusicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Music
     */
    omit?: MusicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicInclude<ExtArgs> | null
    /**
     * Filter which Music to delete.
     */
    where: MusicWhereUniqueInput
  }

  /**
   * Music deleteMany
   */
  export type MusicDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Music to delete
     */
    where?: MusicWhereInput
    /**
     * Limit how many Music to delete.
     */
    limit?: number
  }

  /**
   * Music.RecentPlay
   */
  export type Music$RecentPlayArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentPlay
     */
    select?: RecentPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentPlay
     */
    omit?: RecentPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecentPlayInclude<ExtArgs> | null
    where?: RecentPlayWhereInput
    orderBy?: RecentPlayOrderByWithRelationInput | RecentPlayOrderByWithRelationInput[]
    cursor?: RecentPlayWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecentPlayScalarFieldEnum | RecentPlayScalarFieldEnum[]
  }

  /**
   * Music.PlayData
   */
  export type Music$PlayDataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayData
     */
    select?: PlayDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayData
     */
    omit?: PlayDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayDataInclude<ExtArgs> | null
    where?: PlayDataWhereInput
    orderBy?: PlayDataOrderByWithRelationInput | PlayDataOrderByWithRelationInput[]
    cursor?: PlayDataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayDataScalarFieldEnum | PlayDataScalarFieldEnum[]
  }

  /**
   * Music.Bookmark
   */
  export type Music$BookmarkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    where?: BookmarkWhereInput
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    cursor?: BookmarkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Music.BasicBestPlay
   */
  export type Music$BasicBestPlayArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BasicBestPlay
     */
    select?: BasicBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BasicBestPlay
     */
    omit?: BasicBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BasicBestPlayInclude<ExtArgs> | null
    where?: BasicBestPlayWhereInput
    orderBy?: BasicBestPlayOrderByWithRelationInput | BasicBestPlayOrderByWithRelationInput[]
    cursor?: BasicBestPlayWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BasicBestPlayScalarFieldEnum | BasicBestPlayScalarFieldEnum[]
  }

  /**
   * Music.RecitalBestPlay
   */
  export type Music$RecitalBestPlayArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecitalBestPlay
     */
    select?: RecitalBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecitalBestPlay
     */
    omit?: RecitalBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecitalBestPlayInclude<ExtArgs> | null
    where?: RecitalBestPlayWhereInput
    orderBy?: RecitalBestPlayOrderByWithRelationInput | RecitalBestPlayOrderByWithRelationInput[]
    cursor?: RecitalBestPlayWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecitalBestPlayScalarFieldEnum | RecitalBestPlayScalarFieldEnum[]
  }

  /**
   * Music without action
   */
  export type MusicDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Music
     */
    select?: MusicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Music
     */
    omit?: MusicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicInclude<ExtArgs> | null
  }


  /**
   * Model RecentPlay
   */

  export type AggregateRecentPlay = {
    _count: RecentPlayCountAggregateOutputType | null
    _avg: RecentPlayAvgAggregateOutputType | null
    _sum: RecentPlaySumAggregateOutputType | null
    _min: RecentPlayMinAggregateOutputType | null
    _max: RecentPlayMaxAggregateOutputType | null
  }

  export type RecentPlayAvgAggregateOutputType = {
    id: number | null
    level: number | null
    score: number | null
    max_combo: number | null
    grade_basic: number | null
    user_id: number | null
  }

  export type RecentPlaySumAggregateOutputType = {
    id: number | null
    level: number | null
    score: number | null
    max_combo: number | null
    grade_basic: number | null
    user_id: number | null
  }

  export type RecentPlayMinAggregateOutputType = {
    id: number | null
    difficulty: string | null
    level: number | null
    score: number | null
    max_combo: number | null
    rank: string | null
    play_time: string | null
    grade_basic: number | null
    created_at: Date | null
    updated_at: Date | null
    user_id: number | null
    music_idx: string | null
  }

  export type RecentPlayMaxAggregateOutputType = {
    id: number | null
    difficulty: string | null
    level: number | null
    score: number | null
    max_combo: number | null
    rank: string | null
    play_time: string | null
    grade_basic: number | null
    created_at: Date | null
    updated_at: Date | null
    user_id: number | null
    music_idx: string | null
  }

  export type RecentPlayCountAggregateOutputType = {
    id: number
    difficulty: number
    level: number
    score: number
    max_combo: number
    rank: number
    play_time: number
    grade_basic: number
    created_at: number
    updated_at: number
    user_id: number
    music_idx: number
    _all: number
  }


  export type RecentPlayAvgAggregateInputType = {
    id?: true
    level?: true
    score?: true
    max_combo?: true
    grade_basic?: true
    user_id?: true
  }

  export type RecentPlaySumAggregateInputType = {
    id?: true
    level?: true
    score?: true
    max_combo?: true
    grade_basic?: true
    user_id?: true
  }

  export type RecentPlayMinAggregateInputType = {
    id?: true
    difficulty?: true
    level?: true
    score?: true
    max_combo?: true
    rank?: true
    play_time?: true
    grade_basic?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    music_idx?: true
  }

  export type RecentPlayMaxAggregateInputType = {
    id?: true
    difficulty?: true
    level?: true
    score?: true
    max_combo?: true
    rank?: true
    play_time?: true
    grade_basic?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    music_idx?: true
  }

  export type RecentPlayCountAggregateInputType = {
    id?: true
    difficulty?: true
    level?: true
    score?: true
    max_combo?: true
    rank?: true
    play_time?: true
    grade_basic?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    music_idx?: true
    _all?: true
  }

  export type RecentPlayAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecentPlay to aggregate.
     */
    where?: RecentPlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecentPlays to fetch.
     */
    orderBy?: RecentPlayOrderByWithRelationInput | RecentPlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecentPlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecentPlays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecentPlays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RecentPlays
    **/
    _count?: true | RecentPlayCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RecentPlayAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RecentPlaySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecentPlayMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecentPlayMaxAggregateInputType
  }

  export type GetRecentPlayAggregateType<T extends RecentPlayAggregateArgs> = {
        [P in keyof T & keyof AggregateRecentPlay]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecentPlay[P]>
      : GetScalarType<T[P], AggregateRecentPlay[P]>
  }




  export type RecentPlayGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecentPlayWhereInput
    orderBy?: RecentPlayOrderByWithAggregationInput | RecentPlayOrderByWithAggregationInput[]
    by: RecentPlayScalarFieldEnum[] | RecentPlayScalarFieldEnum
    having?: RecentPlayScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecentPlayCountAggregateInputType | true
    _avg?: RecentPlayAvgAggregateInputType
    _sum?: RecentPlaySumAggregateInputType
    _min?: RecentPlayMinAggregateInputType
    _max?: RecentPlayMaxAggregateInputType
  }

  export type RecentPlayGroupByOutputType = {
    id: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    play_time: string
    grade_basic: number
    created_at: Date
    updated_at: Date
    user_id: number
    music_idx: string
    _count: RecentPlayCountAggregateOutputType | null
    _avg: RecentPlayAvgAggregateOutputType | null
    _sum: RecentPlaySumAggregateOutputType | null
    _min: RecentPlayMinAggregateOutputType | null
    _max: RecentPlayMaxAggregateOutputType | null
  }

  type GetRecentPlayGroupByPayload<T extends RecentPlayGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecentPlayGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecentPlayGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecentPlayGroupByOutputType[P]>
            : GetScalarType<T[P], RecentPlayGroupByOutputType[P]>
        }
      >
    >


  export type RecentPlaySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    difficulty?: boolean
    level?: boolean
    score?: boolean
    max_combo?: boolean
    rank?: boolean
    play_time?: boolean
    grade_basic?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recentPlay"]>

  export type RecentPlaySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    difficulty?: boolean
    level?: boolean
    score?: boolean
    max_combo?: boolean
    rank?: boolean
    play_time?: boolean
    grade_basic?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recentPlay"]>

  export type RecentPlaySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    difficulty?: boolean
    level?: boolean
    score?: boolean
    max_combo?: boolean
    rank?: boolean
    play_time?: boolean
    grade_basic?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recentPlay"]>

  export type RecentPlaySelectScalar = {
    id?: boolean
    difficulty?: boolean
    level?: boolean
    score?: boolean
    max_combo?: boolean
    rank?: boolean
    play_time?: boolean
    grade_basic?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
  }

  export type RecentPlayOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "difficulty" | "level" | "score" | "max_combo" | "rank" | "play_time" | "grade_basic" | "created_at" | "updated_at" | "user_id" | "music_idx", ExtArgs["result"]["recentPlay"]>
  export type RecentPlayInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }
  export type RecentPlayIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }
  export type RecentPlayIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }

  export type $RecentPlayPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RecentPlay"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      music: Prisma.$MusicPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      difficulty: string
      level: number
      score: number
      max_combo: number
      rank: string
      play_time: string
      grade_basic: number
      created_at: Date
      updated_at: Date
      user_id: number
      music_idx: string
    }, ExtArgs["result"]["recentPlay"]>
    composites: {}
  }

  type RecentPlayGetPayload<S extends boolean | null | undefined | RecentPlayDefaultArgs> = $Result.GetResult<Prisma.$RecentPlayPayload, S>

  type RecentPlayCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RecentPlayFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RecentPlayCountAggregateInputType | true
    }

  export interface RecentPlayDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RecentPlay'], meta: { name: 'RecentPlay' } }
    /**
     * Find zero or one RecentPlay that matches the filter.
     * @param {RecentPlayFindUniqueArgs} args - Arguments to find a RecentPlay
     * @example
     * // Get one RecentPlay
     * const recentPlay = await prisma.recentPlay.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RecentPlayFindUniqueArgs>(args: SelectSubset<T, RecentPlayFindUniqueArgs<ExtArgs>>): Prisma__RecentPlayClient<$Result.GetResult<Prisma.$RecentPlayPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RecentPlay that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RecentPlayFindUniqueOrThrowArgs} args - Arguments to find a RecentPlay
     * @example
     * // Get one RecentPlay
     * const recentPlay = await prisma.recentPlay.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RecentPlayFindUniqueOrThrowArgs>(args: SelectSubset<T, RecentPlayFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RecentPlayClient<$Result.GetResult<Prisma.$RecentPlayPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RecentPlay that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentPlayFindFirstArgs} args - Arguments to find a RecentPlay
     * @example
     * // Get one RecentPlay
     * const recentPlay = await prisma.recentPlay.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RecentPlayFindFirstArgs>(args?: SelectSubset<T, RecentPlayFindFirstArgs<ExtArgs>>): Prisma__RecentPlayClient<$Result.GetResult<Prisma.$RecentPlayPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RecentPlay that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentPlayFindFirstOrThrowArgs} args - Arguments to find a RecentPlay
     * @example
     * // Get one RecentPlay
     * const recentPlay = await prisma.recentPlay.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RecentPlayFindFirstOrThrowArgs>(args?: SelectSubset<T, RecentPlayFindFirstOrThrowArgs<ExtArgs>>): Prisma__RecentPlayClient<$Result.GetResult<Prisma.$RecentPlayPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RecentPlays that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentPlayFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RecentPlays
     * const recentPlays = await prisma.recentPlay.findMany()
     * 
     * // Get first 10 RecentPlays
     * const recentPlays = await prisma.recentPlay.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recentPlayWithIdOnly = await prisma.recentPlay.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RecentPlayFindManyArgs>(args?: SelectSubset<T, RecentPlayFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecentPlayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RecentPlay.
     * @param {RecentPlayCreateArgs} args - Arguments to create a RecentPlay.
     * @example
     * // Create one RecentPlay
     * const RecentPlay = await prisma.recentPlay.create({
     *   data: {
     *     // ... data to create a RecentPlay
     *   }
     * })
     * 
     */
    create<T extends RecentPlayCreateArgs>(args: SelectSubset<T, RecentPlayCreateArgs<ExtArgs>>): Prisma__RecentPlayClient<$Result.GetResult<Prisma.$RecentPlayPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RecentPlays.
     * @param {RecentPlayCreateManyArgs} args - Arguments to create many RecentPlays.
     * @example
     * // Create many RecentPlays
     * const recentPlay = await prisma.recentPlay.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RecentPlayCreateManyArgs>(args?: SelectSubset<T, RecentPlayCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RecentPlays and returns the data saved in the database.
     * @param {RecentPlayCreateManyAndReturnArgs} args - Arguments to create many RecentPlays.
     * @example
     * // Create many RecentPlays
     * const recentPlay = await prisma.recentPlay.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RecentPlays and only return the `id`
     * const recentPlayWithIdOnly = await prisma.recentPlay.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RecentPlayCreateManyAndReturnArgs>(args?: SelectSubset<T, RecentPlayCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecentPlayPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RecentPlay.
     * @param {RecentPlayDeleteArgs} args - Arguments to delete one RecentPlay.
     * @example
     * // Delete one RecentPlay
     * const RecentPlay = await prisma.recentPlay.delete({
     *   where: {
     *     // ... filter to delete one RecentPlay
     *   }
     * })
     * 
     */
    delete<T extends RecentPlayDeleteArgs>(args: SelectSubset<T, RecentPlayDeleteArgs<ExtArgs>>): Prisma__RecentPlayClient<$Result.GetResult<Prisma.$RecentPlayPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RecentPlay.
     * @param {RecentPlayUpdateArgs} args - Arguments to update one RecentPlay.
     * @example
     * // Update one RecentPlay
     * const recentPlay = await prisma.recentPlay.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RecentPlayUpdateArgs>(args: SelectSubset<T, RecentPlayUpdateArgs<ExtArgs>>): Prisma__RecentPlayClient<$Result.GetResult<Prisma.$RecentPlayPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RecentPlays.
     * @param {RecentPlayDeleteManyArgs} args - Arguments to filter RecentPlays to delete.
     * @example
     * // Delete a few RecentPlays
     * const { count } = await prisma.recentPlay.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RecentPlayDeleteManyArgs>(args?: SelectSubset<T, RecentPlayDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecentPlays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentPlayUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RecentPlays
     * const recentPlay = await prisma.recentPlay.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RecentPlayUpdateManyArgs>(args: SelectSubset<T, RecentPlayUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecentPlays and returns the data updated in the database.
     * @param {RecentPlayUpdateManyAndReturnArgs} args - Arguments to update many RecentPlays.
     * @example
     * // Update many RecentPlays
     * const recentPlay = await prisma.recentPlay.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RecentPlays and only return the `id`
     * const recentPlayWithIdOnly = await prisma.recentPlay.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RecentPlayUpdateManyAndReturnArgs>(args: SelectSubset<T, RecentPlayUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecentPlayPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RecentPlay.
     * @param {RecentPlayUpsertArgs} args - Arguments to update or create a RecentPlay.
     * @example
     * // Update or create a RecentPlay
     * const recentPlay = await prisma.recentPlay.upsert({
     *   create: {
     *     // ... data to create a RecentPlay
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RecentPlay we want to update
     *   }
     * })
     */
    upsert<T extends RecentPlayUpsertArgs>(args: SelectSubset<T, RecentPlayUpsertArgs<ExtArgs>>): Prisma__RecentPlayClient<$Result.GetResult<Prisma.$RecentPlayPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RecentPlays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentPlayCountArgs} args - Arguments to filter RecentPlays to count.
     * @example
     * // Count the number of RecentPlays
     * const count = await prisma.recentPlay.count({
     *   where: {
     *     // ... the filter for the RecentPlays we want to count
     *   }
     * })
    **/
    count<T extends RecentPlayCountArgs>(
      args?: Subset<T, RecentPlayCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecentPlayCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RecentPlay.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentPlayAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RecentPlayAggregateArgs>(args: Subset<T, RecentPlayAggregateArgs>): Prisma.PrismaPromise<GetRecentPlayAggregateType<T>>

    /**
     * Group by RecentPlay.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentPlayGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RecentPlayGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecentPlayGroupByArgs['orderBy'] }
        : { orderBy?: RecentPlayGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RecentPlayGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecentPlayGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RecentPlay model
   */
  readonly fields: RecentPlayFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RecentPlay.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RecentPlayClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    music<T extends MusicDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MusicDefaultArgs<ExtArgs>>): Prisma__MusicClient<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RecentPlay model
   */
  interface RecentPlayFieldRefs {
    readonly id: FieldRef<"RecentPlay", 'Int'>
    readonly difficulty: FieldRef<"RecentPlay", 'String'>
    readonly level: FieldRef<"RecentPlay", 'Int'>
    readonly score: FieldRef<"RecentPlay", 'Int'>
    readonly max_combo: FieldRef<"RecentPlay", 'Int'>
    readonly rank: FieldRef<"RecentPlay", 'String'>
    readonly play_time: FieldRef<"RecentPlay", 'String'>
    readonly grade_basic: FieldRef<"RecentPlay", 'Int'>
    readonly created_at: FieldRef<"RecentPlay", 'DateTime'>
    readonly updated_at: FieldRef<"RecentPlay", 'DateTime'>
    readonly user_id: FieldRef<"RecentPlay", 'Int'>
    readonly music_idx: FieldRef<"RecentPlay", 'String'>
  }
    

  // Custom InputTypes
  /**
   * RecentPlay findUnique
   */
  export type RecentPlayFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentPlay
     */
    select?: RecentPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentPlay
     */
    omit?: RecentPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecentPlayInclude<ExtArgs> | null
    /**
     * Filter, which RecentPlay to fetch.
     */
    where: RecentPlayWhereUniqueInput
  }

  /**
   * RecentPlay findUniqueOrThrow
   */
  export type RecentPlayFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentPlay
     */
    select?: RecentPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentPlay
     */
    omit?: RecentPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecentPlayInclude<ExtArgs> | null
    /**
     * Filter, which RecentPlay to fetch.
     */
    where: RecentPlayWhereUniqueInput
  }

  /**
   * RecentPlay findFirst
   */
  export type RecentPlayFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentPlay
     */
    select?: RecentPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentPlay
     */
    omit?: RecentPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecentPlayInclude<ExtArgs> | null
    /**
     * Filter, which RecentPlay to fetch.
     */
    where?: RecentPlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecentPlays to fetch.
     */
    orderBy?: RecentPlayOrderByWithRelationInput | RecentPlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecentPlays.
     */
    cursor?: RecentPlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecentPlays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecentPlays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecentPlays.
     */
    distinct?: RecentPlayScalarFieldEnum | RecentPlayScalarFieldEnum[]
  }

  /**
   * RecentPlay findFirstOrThrow
   */
  export type RecentPlayFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentPlay
     */
    select?: RecentPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentPlay
     */
    omit?: RecentPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecentPlayInclude<ExtArgs> | null
    /**
     * Filter, which RecentPlay to fetch.
     */
    where?: RecentPlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecentPlays to fetch.
     */
    orderBy?: RecentPlayOrderByWithRelationInput | RecentPlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecentPlays.
     */
    cursor?: RecentPlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecentPlays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecentPlays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecentPlays.
     */
    distinct?: RecentPlayScalarFieldEnum | RecentPlayScalarFieldEnum[]
  }

  /**
   * RecentPlay findMany
   */
  export type RecentPlayFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentPlay
     */
    select?: RecentPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentPlay
     */
    omit?: RecentPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecentPlayInclude<ExtArgs> | null
    /**
     * Filter, which RecentPlays to fetch.
     */
    where?: RecentPlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecentPlays to fetch.
     */
    orderBy?: RecentPlayOrderByWithRelationInput | RecentPlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RecentPlays.
     */
    cursor?: RecentPlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecentPlays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecentPlays.
     */
    skip?: number
    distinct?: RecentPlayScalarFieldEnum | RecentPlayScalarFieldEnum[]
  }

  /**
   * RecentPlay create
   */
  export type RecentPlayCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentPlay
     */
    select?: RecentPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentPlay
     */
    omit?: RecentPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecentPlayInclude<ExtArgs> | null
    /**
     * The data needed to create a RecentPlay.
     */
    data: XOR<RecentPlayCreateInput, RecentPlayUncheckedCreateInput>
  }

  /**
   * RecentPlay createMany
   */
  export type RecentPlayCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RecentPlays.
     */
    data: RecentPlayCreateManyInput | RecentPlayCreateManyInput[]
  }

  /**
   * RecentPlay createManyAndReturn
   */
  export type RecentPlayCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentPlay
     */
    select?: RecentPlaySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RecentPlay
     */
    omit?: RecentPlayOmit<ExtArgs> | null
    /**
     * The data used to create many RecentPlays.
     */
    data: RecentPlayCreateManyInput | RecentPlayCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecentPlayIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RecentPlay update
   */
  export type RecentPlayUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentPlay
     */
    select?: RecentPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentPlay
     */
    omit?: RecentPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecentPlayInclude<ExtArgs> | null
    /**
     * The data needed to update a RecentPlay.
     */
    data: XOR<RecentPlayUpdateInput, RecentPlayUncheckedUpdateInput>
    /**
     * Choose, which RecentPlay to update.
     */
    where: RecentPlayWhereUniqueInput
  }

  /**
   * RecentPlay updateMany
   */
  export type RecentPlayUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RecentPlays.
     */
    data: XOR<RecentPlayUpdateManyMutationInput, RecentPlayUncheckedUpdateManyInput>
    /**
     * Filter which RecentPlays to update
     */
    where?: RecentPlayWhereInput
    /**
     * Limit how many RecentPlays to update.
     */
    limit?: number
  }

  /**
   * RecentPlay updateManyAndReturn
   */
  export type RecentPlayUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentPlay
     */
    select?: RecentPlaySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RecentPlay
     */
    omit?: RecentPlayOmit<ExtArgs> | null
    /**
     * The data used to update RecentPlays.
     */
    data: XOR<RecentPlayUpdateManyMutationInput, RecentPlayUncheckedUpdateManyInput>
    /**
     * Filter which RecentPlays to update
     */
    where?: RecentPlayWhereInput
    /**
     * Limit how many RecentPlays to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecentPlayIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RecentPlay upsert
   */
  export type RecentPlayUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentPlay
     */
    select?: RecentPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentPlay
     */
    omit?: RecentPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecentPlayInclude<ExtArgs> | null
    /**
     * The filter to search for the RecentPlay to update in case it exists.
     */
    where: RecentPlayWhereUniqueInput
    /**
     * In case the RecentPlay found by the `where` argument doesn't exist, create a new RecentPlay with this data.
     */
    create: XOR<RecentPlayCreateInput, RecentPlayUncheckedCreateInput>
    /**
     * In case the RecentPlay was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecentPlayUpdateInput, RecentPlayUncheckedUpdateInput>
  }

  /**
   * RecentPlay delete
   */
  export type RecentPlayDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentPlay
     */
    select?: RecentPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentPlay
     */
    omit?: RecentPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecentPlayInclude<ExtArgs> | null
    /**
     * Filter which RecentPlay to delete.
     */
    where: RecentPlayWhereUniqueInput
  }

  /**
   * RecentPlay deleteMany
   */
  export type RecentPlayDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecentPlays to delete
     */
    where?: RecentPlayWhereInput
    /**
     * Limit how many RecentPlays to delete.
     */
    limit?: number
  }

  /**
   * RecentPlay without action
   */
  export type RecentPlayDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentPlay
     */
    select?: RecentPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentPlay
     */
    omit?: RecentPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecentPlayInclude<ExtArgs> | null
  }


  /**
   * Model UserBestGrade
   */

  export type AggregateUserBestGrade = {
    _count: UserBestGradeCountAggregateOutputType | null
    _avg: UserBestGradeAvgAggregateOutputType | null
    _sum: UserBestGradeSumAggregateOutputType | null
    _min: UserBestGradeMinAggregateOutputType | null
    _max: UserBestGradeMaxAggregateOutputType | null
  }

  export type UserBestGradeAvgAggregateOutputType = {
    id: number | null
    grade_basic: number | null
    grade_recital: number | null
    user_id: number | null
  }

  export type UserBestGradeSumAggregateOutputType = {
    id: number | null
    grade_basic: number | null
    grade_recital: number | null
    user_id: number | null
  }

  export type UserBestGradeMinAggregateOutputType = {
    id: number | null
    grade_basic: number | null
    grade_recital: number | null
    besttime: string | null
    created_at: Date | null
    updated_at: Date | null
    user_id: number | null
  }

  export type UserBestGradeMaxAggregateOutputType = {
    id: number | null
    grade_basic: number | null
    grade_recital: number | null
    besttime: string | null
    created_at: Date | null
    updated_at: Date | null
    user_id: number | null
  }

  export type UserBestGradeCountAggregateOutputType = {
    id: number
    grade_basic: number
    grade_recital: number
    besttime: number
    created_at: number
    updated_at: number
    user_id: number
    _all: number
  }


  export type UserBestGradeAvgAggregateInputType = {
    id?: true
    grade_basic?: true
    grade_recital?: true
    user_id?: true
  }

  export type UserBestGradeSumAggregateInputType = {
    id?: true
    grade_basic?: true
    grade_recital?: true
    user_id?: true
  }

  export type UserBestGradeMinAggregateInputType = {
    id?: true
    grade_basic?: true
    grade_recital?: true
    besttime?: true
    created_at?: true
    updated_at?: true
    user_id?: true
  }

  export type UserBestGradeMaxAggregateInputType = {
    id?: true
    grade_basic?: true
    grade_recital?: true
    besttime?: true
    created_at?: true
    updated_at?: true
    user_id?: true
  }

  export type UserBestGradeCountAggregateInputType = {
    id?: true
    grade_basic?: true
    grade_recital?: true
    besttime?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    _all?: true
  }

  export type UserBestGradeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserBestGrade to aggregate.
     */
    where?: UserBestGradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBestGrades to fetch.
     */
    orderBy?: UserBestGradeOrderByWithRelationInput | UserBestGradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserBestGradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBestGrades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBestGrades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserBestGrades
    **/
    _count?: true | UserBestGradeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserBestGradeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserBestGradeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserBestGradeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserBestGradeMaxAggregateInputType
  }

  export type GetUserBestGradeAggregateType<T extends UserBestGradeAggregateArgs> = {
        [P in keyof T & keyof AggregateUserBestGrade]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserBestGrade[P]>
      : GetScalarType<T[P], AggregateUserBestGrade[P]>
  }




  export type UserBestGradeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserBestGradeWhereInput
    orderBy?: UserBestGradeOrderByWithAggregationInput | UserBestGradeOrderByWithAggregationInput[]
    by: UserBestGradeScalarFieldEnum[] | UserBestGradeScalarFieldEnum
    having?: UserBestGradeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserBestGradeCountAggregateInputType | true
    _avg?: UserBestGradeAvgAggregateInputType
    _sum?: UserBestGradeSumAggregateInputType
    _min?: UserBestGradeMinAggregateInputType
    _max?: UserBestGradeMaxAggregateInputType
  }

  export type UserBestGradeGroupByOutputType = {
    id: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at: Date
    updated_at: Date
    user_id: number
    _count: UserBestGradeCountAggregateOutputType | null
    _avg: UserBestGradeAvgAggregateOutputType | null
    _sum: UserBestGradeSumAggregateOutputType | null
    _min: UserBestGradeMinAggregateOutputType | null
    _max: UserBestGradeMaxAggregateOutputType | null
  }

  type GetUserBestGradeGroupByPayload<T extends UserBestGradeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserBestGradeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserBestGradeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserBestGradeGroupByOutputType[P]>
            : GetScalarType<T[P], UserBestGradeGroupByOutputType[P]>
        }
      >
    >


  export type UserBestGradeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    grade_basic?: boolean
    grade_recital?: boolean
    besttime?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userBestGrade"]>

  export type UserBestGradeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    grade_basic?: boolean
    grade_recital?: boolean
    besttime?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userBestGrade"]>

  export type UserBestGradeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    grade_basic?: boolean
    grade_recital?: boolean
    besttime?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userBestGrade"]>

  export type UserBestGradeSelectScalar = {
    id?: boolean
    grade_basic?: boolean
    grade_recital?: boolean
    besttime?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
  }

  export type UserBestGradeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "grade_basic" | "grade_recital" | "besttime" | "created_at" | "updated_at" | "user_id", ExtArgs["result"]["userBestGrade"]>
  export type UserBestGradeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserBestGradeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserBestGradeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserBestGradePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserBestGrade"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      grade_basic: number
      grade_recital: number
      besttime: string
      created_at: Date
      updated_at: Date
      user_id: number
    }, ExtArgs["result"]["userBestGrade"]>
    composites: {}
  }

  type UserBestGradeGetPayload<S extends boolean | null | undefined | UserBestGradeDefaultArgs> = $Result.GetResult<Prisma.$UserBestGradePayload, S>

  type UserBestGradeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserBestGradeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserBestGradeCountAggregateInputType | true
    }

  export interface UserBestGradeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserBestGrade'], meta: { name: 'UserBestGrade' } }
    /**
     * Find zero or one UserBestGrade that matches the filter.
     * @param {UserBestGradeFindUniqueArgs} args - Arguments to find a UserBestGrade
     * @example
     * // Get one UserBestGrade
     * const userBestGrade = await prisma.userBestGrade.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserBestGradeFindUniqueArgs>(args: SelectSubset<T, UserBestGradeFindUniqueArgs<ExtArgs>>): Prisma__UserBestGradeClient<$Result.GetResult<Prisma.$UserBestGradePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserBestGrade that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserBestGradeFindUniqueOrThrowArgs} args - Arguments to find a UserBestGrade
     * @example
     * // Get one UserBestGrade
     * const userBestGrade = await prisma.userBestGrade.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserBestGradeFindUniqueOrThrowArgs>(args: SelectSubset<T, UserBestGradeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserBestGradeClient<$Result.GetResult<Prisma.$UserBestGradePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserBestGrade that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBestGradeFindFirstArgs} args - Arguments to find a UserBestGrade
     * @example
     * // Get one UserBestGrade
     * const userBestGrade = await prisma.userBestGrade.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserBestGradeFindFirstArgs>(args?: SelectSubset<T, UserBestGradeFindFirstArgs<ExtArgs>>): Prisma__UserBestGradeClient<$Result.GetResult<Prisma.$UserBestGradePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserBestGrade that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBestGradeFindFirstOrThrowArgs} args - Arguments to find a UserBestGrade
     * @example
     * // Get one UserBestGrade
     * const userBestGrade = await prisma.userBestGrade.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserBestGradeFindFirstOrThrowArgs>(args?: SelectSubset<T, UserBestGradeFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserBestGradeClient<$Result.GetResult<Prisma.$UserBestGradePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserBestGrades that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBestGradeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserBestGrades
     * const userBestGrades = await prisma.userBestGrade.findMany()
     * 
     * // Get first 10 UserBestGrades
     * const userBestGrades = await prisma.userBestGrade.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userBestGradeWithIdOnly = await prisma.userBestGrade.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserBestGradeFindManyArgs>(args?: SelectSubset<T, UserBestGradeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBestGradePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserBestGrade.
     * @param {UserBestGradeCreateArgs} args - Arguments to create a UserBestGrade.
     * @example
     * // Create one UserBestGrade
     * const UserBestGrade = await prisma.userBestGrade.create({
     *   data: {
     *     // ... data to create a UserBestGrade
     *   }
     * })
     * 
     */
    create<T extends UserBestGradeCreateArgs>(args: SelectSubset<T, UserBestGradeCreateArgs<ExtArgs>>): Prisma__UserBestGradeClient<$Result.GetResult<Prisma.$UserBestGradePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserBestGrades.
     * @param {UserBestGradeCreateManyArgs} args - Arguments to create many UserBestGrades.
     * @example
     * // Create many UserBestGrades
     * const userBestGrade = await prisma.userBestGrade.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserBestGradeCreateManyArgs>(args?: SelectSubset<T, UserBestGradeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserBestGrades and returns the data saved in the database.
     * @param {UserBestGradeCreateManyAndReturnArgs} args - Arguments to create many UserBestGrades.
     * @example
     * // Create many UserBestGrades
     * const userBestGrade = await prisma.userBestGrade.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserBestGrades and only return the `id`
     * const userBestGradeWithIdOnly = await prisma.userBestGrade.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserBestGradeCreateManyAndReturnArgs>(args?: SelectSubset<T, UserBestGradeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBestGradePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserBestGrade.
     * @param {UserBestGradeDeleteArgs} args - Arguments to delete one UserBestGrade.
     * @example
     * // Delete one UserBestGrade
     * const UserBestGrade = await prisma.userBestGrade.delete({
     *   where: {
     *     // ... filter to delete one UserBestGrade
     *   }
     * })
     * 
     */
    delete<T extends UserBestGradeDeleteArgs>(args: SelectSubset<T, UserBestGradeDeleteArgs<ExtArgs>>): Prisma__UserBestGradeClient<$Result.GetResult<Prisma.$UserBestGradePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserBestGrade.
     * @param {UserBestGradeUpdateArgs} args - Arguments to update one UserBestGrade.
     * @example
     * // Update one UserBestGrade
     * const userBestGrade = await prisma.userBestGrade.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserBestGradeUpdateArgs>(args: SelectSubset<T, UserBestGradeUpdateArgs<ExtArgs>>): Prisma__UserBestGradeClient<$Result.GetResult<Prisma.$UserBestGradePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserBestGrades.
     * @param {UserBestGradeDeleteManyArgs} args - Arguments to filter UserBestGrades to delete.
     * @example
     * // Delete a few UserBestGrades
     * const { count } = await prisma.userBestGrade.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserBestGradeDeleteManyArgs>(args?: SelectSubset<T, UserBestGradeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserBestGrades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBestGradeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserBestGrades
     * const userBestGrade = await prisma.userBestGrade.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserBestGradeUpdateManyArgs>(args: SelectSubset<T, UserBestGradeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserBestGrades and returns the data updated in the database.
     * @param {UserBestGradeUpdateManyAndReturnArgs} args - Arguments to update many UserBestGrades.
     * @example
     * // Update many UserBestGrades
     * const userBestGrade = await prisma.userBestGrade.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserBestGrades and only return the `id`
     * const userBestGradeWithIdOnly = await prisma.userBestGrade.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserBestGradeUpdateManyAndReturnArgs>(args: SelectSubset<T, UserBestGradeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBestGradePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserBestGrade.
     * @param {UserBestGradeUpsertArgs} args - Arguments to update or create a UserBestGrade.
     * @example
     * // Update or create a UserBestGrade
     * const userBestGrade = await prisma.userBestGrade.upsert({
     *   create: {
     *     // ... data to create a UserBestGrade
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserBestGrade we want to update
     *   }
     * })
     */
    upsert<T extends UserBestGradeUpsertArgs>(args: SelectSubset<T, UserBestGradeUpsertArgs<ExtArgs>>): Prisma__UserBestGradeClient<$Result.GetResult<Prisma.$UserBestGradePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserBestGrades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBestGradeCountArgs} args - Arguments to filter UserBestGrades to count.
     * @example
     * // Count the number of UserBestGrades
     * const count = await prisma.userBestGrade.count({
     *   where: {
     *     // ... the filter for the UserBestGrades we want to count
     *   }
     * })
    **/
    count<T extends UserBestGradeCountArgs>(
      args?: Subset<T, UserBestGradeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserBestGradeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserBestGrade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBestGradeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserBestGradeAggregateArgs>(args: Subset<T, UserBestGradeAggregateArgs>): Prisma.PrismaPromise<GetUserBestGradeAggregateType<T>>

    /**
     * Group by UserBestGrade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBestGradeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserBestGradeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserBestGradeGroupByArgs['orderBy'] }
        : { orderBy?: UserBestGradeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserBestGradeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserBestGradeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserBestGrade model
   */
  readonly fields: UserBestGradeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserBestGrade.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserBestGradeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserBestGrade model
   */
  interface UserBestGradeFieldRefs {
    readonly id: FieldRef<"UserBestGrade", 'Int'>
    readonly grade_basic: FieldRef<"UserBestGrade", 'Int'>
    readonly grade_recital: FieldRef<"UserBestGrade", 'Int'>
    readonly besttime: FieldRef<"UserBestGrade", 'String'>
    readonly created_at: FieldRef<"UserBestGrade", 'DateTime'>
    readonly updated_at: FieldRef<"UserBestGrade", 'DateTime'>
    readonly user_id: FieldRef<"UserBestGrade", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * UserBestGrade findUnique
   */
  export type UserBestGradeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBestGrade
     */
    select?: UserBestGradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBestGrade
     */
    omit?: UserBestGradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBestGradeInclude<ExtArgs> | null
    /**
     * Filter, which UserBestGrade to fetch.
     */
    where: UserBestGradeWhereUniqueInput
  }

  /**
   * UserBestGrade findUniqueOrThrow
   */
  export type UserBestGradeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBestGrade
     */
    select?: UserBestGradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBestGrade
     */
    omit?: UserBestGradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBestGradeInclude<ExtArgs> | null
    /**
     * Filter, which UserBestGrade to fetch.
     */
    where: UserBestGradeWhereUniqueInput
  }

  /**
   * UserBestGrade findFirst
   */
  export type UserBestGradeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBestGrade
     */
    select?: UserBestGradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBestGrade
     */
    omit?: UserBestGradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBestGradeInclude<ExtArgs> | null
    /**
     * Filter, which UserBestGrade to fetch.
     */
    where?: UserBestGradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBestGrades to fetch.
     */
    orderBy?: UserBestGradeOrderByWithRelationInput | UserBestGradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserBestGrades.
     */
    cursor?: UserBestGradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBestGrades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBestGrades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserBestGrades.
     */
    distinct?: UserBestGradeScalarFieldEnum | UserBestGradeScalarFieldEnum[]
  }

  /**
   * UserBestGrade findFirstOrThrow
   */
  export type UserBestGradeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBestGrade
     */
    select?: UserBestGradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBestGrade
     */
    omit?: UserBestGradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBestGradeInclude<ExtArgs> | null
    /**
     * Filter, which UserBestGrade to fetch.
     */
    where?: UserBestGradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBestGrades to fetch.
     */
    orderBy?: UserBestGradeOrderByWithRelationInput | UserBestGradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserBestGrades.
     */
    cursor?: UserBestGradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBestGrades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBestGrades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserBestGrades.
     */
    distinct?: UserBestGradeScalarFieldEnum | UserBestGradeScalarFieldEnum[]
  }

  /**
   * UserBestGrade findMany
   */
  export type UserBestGradeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBestGrade
     */
    select?: UserBestGradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBestGrade
     */
    omit?: UserBestGradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBestGradeInclude<ExtArgs> | null
    /**
     * Filter, which UserBestGrades to fetch.
     */
    where?: UserBestGradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBestGrades to fetch.
     */
    orderBy?: UserBestGradeOrderByWithRelationInput | UserBestGradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserBestGrades.
     */
    cursor?: UserBestGradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBestGrades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBestGrades.
     */
    skip?: number
    distinct?: UserBestGradeScalarFieldEnum | UserBestGradeScalarFieldEnum[]
  }

  /**
   * UserBestGrade create
   */
  export type UserBestGradeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBestGrade
     */
    select?: UserBestGradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBestGrade
     */
    omit?: UserBestGradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBestGradeInclude<ExtArgs> | null
    /**
     * The data needed to create a UserBestGrade.
     */
    data: XOR<UserBestGradeCreateInput, UserBestGradeUncheckedCreateInput>
  }

  /**
   * UserBestGrade createMany
   */
  export type UserBestGradeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserBestGrades.
     */
    data: UserBestGradeCreateManyInput | UserBestGradeCreateManyInput[]
  }

  /**
   * UserBestGrade createManyAndReturn
   */
  export type UserBestGradeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBestGrade
     */
    select?: UserBestGradeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserBestGrade
     */
    omit?: UserBestGradeOmit<ExtArgs> | null
    /**
     * The data used to create many UserBestGrades.
     */
    data: UserBestGradeCreateManyInput | UserBestGradeCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBestGradeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserBestGrade update
   */
  export type UserBestGradeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBestGrade
     */
    select?: UserBestGradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBestGrade
     */
    omit?: UserBestGradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBestGradeInclude<ExtArgs> | null
    /**
     * The data needed to update a UserBestGrade.
     */
    data: XOR<UserBestGradeUpdateInput, UserBestGradeUncheckedUpdateInput>
    /**
     * Choose, which UserBestGrade to update.
     */
    where: UserBestGradeWhereUniqueInput
  }

  /**
   * UserBestGrade updateMany
   */
  export type UserBestGradeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserBestGrades.
     */
    data: XOR<UserBestGradeUpdateManyMutationInput, UserBestGradeUncheckedUpdateManyInput>
    /**
     * Filter which UserBestGrades to update
     */
    where?: UserBestGradeWhereInput
    /**
     * Limit how many UserBestGrades to update.
     */
    limit?: number
  }

  /**
   * UserBestGrade updateManyAndReturn
   */
  export type UserBestGradeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBestGrade
     */
    select?: UserBestGradeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserBestGrade
     */
    omit?: UserBestGradeOmit<ExtArgs> | null
    /**
     * The data used to update UserBestGrades.
     */
    data: XOR<UserBestGradeUpdateManyMutationInput, UserBestGradeUncheckedUpdateManyInput>
    /**
     * Filter which UserBestGrades to update
     */
    where?: UserBestGradeWhereInput
    /**
     * Limit how many UserBestGrades to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBestGradeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserBestGrade upsert
   */
  export type UserBestGradeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBestGrade
     */
    select?: UserBestGradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBestGrade
     */
    omit?: UserBestGradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBestGradeInclude<ExtArgs> | null
    /**
     * The filter to search for the UserBestGrade to update in case it exists.
     */
    where: UserBestGradeWhereUniqueInput
    /**
     * In case the UserBestGrade found by the `where` argument doesn't exist, create a new UserBestGrade with this data.
     */
    create: XOR<UserBestGradeCreateInput, UserBestGradeUncheckedCreateInput>
    /**
     * In case the UserBestGrade was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserBestGradeUpdateInput, UserBestGradeUncheckedUpdateInput>
  }

  /**
   * UserBestGrade delete
   */
  export type UserBestGradeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBestGrade
     */
    select?: UserBestGradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBestGrade
     */
    omit?: UserBestGradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBestGradeInclude<ExtArgs> | null
    /**
     * Filter which UserBestGrade to delete.
     */
    where: UserBestGradeWhereUniqueInput
  }

  /**
   * UserBestGrade deleteMany
   */
  export type UserBestGradeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserBestGrades to delete
     */
    where?: UserBestGradeWhereInput
    /**
     * Limit how many UserBestGrades to delete.
     */
    limit?: number
  }

  /**
   * UserBestGrade without action
   */
  export type UserBestGradeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBestGrade
     */
    select?: UserBestGradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBestGrade
     */
    omit?: UserBestGradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBestGradeInclude<ExtArgs> | null
  }


  /**
   * Model BasicBestPlay
   */

  export type AggregateBasicBestPlay = {
    _count: BasicBestPlayCountAggregateOutputType | null
    _avg: BasicBestPlayAvgAggregateOutputType | null
    _sum: BasicBestPlaySumAggregateOutputType | null
    _min: BasicBestPlayMinAggregateOutputType | null
    _max: BasicBestPlayMaxAggregateOutputType | null
  }

  export type BasicBestPlayAvgAggregateOutputType = {
    id: number | null
    level: number | null
    score: number | null
    max_combo: number | null
    grade_basic: number | null
    fc_type: number | null
    user_id: number | null
  }

  export type BasicBestPlaySumAggregateOutputType = {
    id: number | null
    level: number | null
    score: number | null
    max_combo: number | null
    grade_basic: number | null
    fc_type: number | null
    user_id: number | null
  }

  export type BasicBestPlayMinAggregateOutputType = {
    id: number | null
    difficulty: string | null
    level: number | null
    score: number | null
    max_combo: number | null
    rank: string | null
    besttime: string | null
    grade_basic: number | null
    fc_type: number | null
    created_at: Date | null
    updated_at: Date | null
    user_id: number | null
    music_idx: string | null
  }

  export type BasicBestPlayMaxAggregateOutputType = {
    id: number | null
    difficulty: string | null
    level: number | null
    score: number | null
    max_combo: number | null
    rank: string | null
    besttime: string | null
    grade_basic: number | null
    fc_type: number | null
    created_at: Date | null
    updated_at: Date | null
    user_id: number | null
    music_idx: string | null
  }

  export type BasicBestPlayCountAggregateOutputType = {
    id: number
    difficulty: number
    level: number
    score: number
    max_combo: number
    rank: number
    besttime: number
    grade_basic: number
    fc_type: number
    created_at: number
    updated_at: number
    user_id: number
    music_idx: number
    _all: number
  }


  export type BasicBestPlayAvgAggregateInputType = {
    id?: true
    level?: true
    score?: true
    max_combo?: true
    grade_basic?: true
    fc_type?: true
    user_id?: true
  }

  export type BasicBestPlaySumAggregateInputType = {
    id?: true
    level?: true
    score?: true
    max_combo?: true
    grade_basic?: true
    fc_type?: true
    user_id?: true
  }

  export type BasicBestPlayMinAggregateInputType = {
    id?: true
    difficulty?: true
    level?: true
    score?: true
    max_combo?: true
    rank?: true
    besttime?: true
    grade_basic?: true
    fc_type?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    music_idx?: true
  }

  export type BasicBestPlayMaxAggregateInputType = {
    id?: true
    difficulty?: true
    level?: true
    score?: true
    max_combo?: true
    rank?: true
    besttime?: true
    grade_basic?: true
    fc_type?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    music_idx?: true
  }

  export type BasicBestPlayCountAggregateInputType = {
    id?: true
    difficulty?: true
    level?: true
    score?: true
    max_combo?: true
    rank?: true
    besttime?: true
    grade_basic?: true
    fc_type?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    music_idx?: true
    _all?: true
  }

  export type BasicBestPlayAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BasicBestPlay to aggregate.
     */
    where?: BasicBestPlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BasicBestPlays to fetch.
     */
    orderBy?: BasicBestPlayOrderByWithRelationInput | BasicBestPlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BasicBestPlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BasicBestPlays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BasicBestPlays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BasicBestPlays
    **/
    _count?: true | BasicBestPlayCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BasicBestPlayAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BasicBestPlaySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BasicBestPlayMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BasicBestPlayMaxAggregateInputType
  }

  export type GetBasicBestPlayAggregateType<T extends BasicBestPlayAggregateArgs> = {
        [P in keyof T & keyof AggregateBasicBestPlay]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBasicBestPlay[P]>
      : GetScalarType<T[P], AggregateBasicBestPlay[P]>
  }




  export type BasicBestPlayGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BasicBestPlayWhereInput
    orderBy?: BasicBestPlayOrderByWithAggregationInput | BasicBestPlayOrderByWithAggregationInput[]
    by: BasicBestPlayScalarFieldEnum[] | BasicBestPlayScalarFieldEnum
    having?: BasicBestPlayScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BasicBestPlayCountAggregateInputType | true
    _avg?: BasicBestPlayAvgAggregateInputType
    _sum?: BasicBestPlaySumAggregateInputType
    _min?: BasicBestPlayMinAggregateInputType
    _max?: BasicBestPlayMaxAggregateInputType
  }

  export type BasicBestPlayGroupByOutputType = {
    id: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_basic: number
    fc_type: number
    created_at: Date
    updated_at: Date
    user_id: number
    music_idx: string
    _count: BasicBestPlayCountAggregateOutputType | null
    _avg: BasicBestPlayAvgAggregateOutputType | null
    _sum: BasicBestPlaySumAggregateOutputType | null
    _min: BasicBestPlayMinAggregateOutputType | null
    _max: BasicBestPlayMaxAggregateOutputType | null
  }

  type GetBasicBestPlayGroupByPayload<T extends BasicBestPlayGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BasicBestPlayGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BasicBestPlayGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BasicBestPlayGroupByOutputType[P]>
            : GetScalarType<T[P], BasicBestPlayGroupByOutputType[P]>
        }
      >
    >


  export type BasicBestPlaySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    difficulty?: boolean
    level?: boolean
    score?: boolean
    max_combo?: boolean
    rank?: boolean
    besttime?: boolean
    grade_basic?: boolean
    fc_type?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["basicBestPlay"]>

  export type BasicBestPlaySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    difficulty?: boolean
    level?: boolean
    score?: boolean
    max_combo?: boolean
    rank?: boolean
    besttime?: boolean
    grade_basic?: boolean
    fc_type?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["basicBestPlay"]>

  export type BasicBestPlaySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    difficulty?: boolean
    level?: boolean
    score?: boolean
    max_combo?: boolean
    rank?: boolean
    besttime?: boolean
    grade_basic?: boolean
    fc_type?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["basicBestPlay"]>

  export type BasicBestPlaySelectScalar = {
    id?: boolean
    difficulty?: boolean
    level?: boolean
    score?: boolean
    max_combo?: boolean
    rank?: boolean
    besttime?: boolean
    grade_basic?: boolean
    fc_type?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
  }

  export type BasicBestPlayOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "difficulty" | "level" | "score" | "max_combo" | "rank" | "besttime" | "grade_basic" | "fc_type" | "created_at" | "updated_at" | "user_id" | "music_idx", ExtArgs["result"]["basicBestPlay"]>
  export type BasicBestPlayInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }
  export type BasicBestPlayIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }
  export type BasicBestPlayIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }

  export type $BasicBestPlayPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BasicBestPlay"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      music: Prisma.$MusicPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      difficulty: string
      level: number
      score: number
      max_combo: number
      rank: string
      besttime: string
      grade_basic: number
      fc_type: number
      created_at: Date
      updated_at: Date
      user_id: number
      music_idx: string
    }, ExtArgs["result"]["basicBestPlay"]>
    composites: {}
  }

  type BasicBestPlayGetPayload<S extends boolean | null | undefined | BasicBestPlayDefaultArgs> = $Result.GetResult<Prisma.$BasicBestPlayPayload, S>

  type BasicBestPlayCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BasicBestPlayFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BasicBestPlayCountAggregateInputType | true
    }

  export interface BasicBestPlayDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BasicBestPlay'], meta: { name: 'BasicBestPlay' } }
    /**
     * Find zero or one BasicBestPlay that matches the filter.
     * @param {BasicBestPlayFindUniqueArgs} args - Arguments to find a BasicBestPlay
     * @example
     * // Get one BasicBestPlay
     * const basicBestPlay = await prisma.basicBestPlay.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BasicBestPlayFindUniqueArgs>(args: SelectSubset<T, BasicBestPlayFindUniqueArgs<ExtArgs>>): Prisma__BasicBestPlayClient<$Result.GetResult<Prisma.$BasicBestPlayPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BasicBestPlay that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BasicBestPlayFindUniqueOrThrowArgs} args - Arguments to find a BasicBestPlay
     * @example
     * // Get one BasicBestPlay
     * const basicBestPlay = await prisma.basicBestPlay.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BasicBestPlayFindUniqueOrThrowArgs>(args: SelectSubset<T, BasicBestPlayFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BasicBestPlayClient<$Result.GetResult<Prisma.$BasicBestPlayPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BasicBestPlay that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BasicBestPlayFindFirstArgs} args - Arguments to find a BasicBestPlay
     * @example
     * // Get one BasicBestPlay
     * const basicBestPlay = await prisma.basicBestPlay.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BasicBestPlayFindFirstArgs>(args?: SelectSubset<T, BasicBestPlayFindFirstArgs<ExtArgs>>): Prisma__BasicBestPlayClient<$Result.GetResult<Prisma.$BasicBestPlayPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BasicBestPlay that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BasicBestPlayFindFirstOrThrowArgs} args - Arguments to find a BasicBestPlay
     * @example
     * // Get one BasicBestPlay
     * const basicBestPlay = await prisma.basicBestPlay.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BasicBestPlayFindFirstOrThrowArgs>(args?: SelectSubset<T, BasicBestPlayFindFirstOrThrowArgs<ExtArgs>>): Prisma__BasicBestPlayClient<$Result.GetResult<Prisma.$BasicBestPlayPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BasicBestPlays that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BasicBestPlayFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BasicBestPlays
     * const basicBestPlays = await prisma.basicBestPlay.findMany()
     * 
     * // Get first 10 BasicBestPlays
     * const basicBestPlays = await prisma.basicBestPlay.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const basicBestPlayWithIdOnly = await prisma.basicBestPlay.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BasicBestPlayFindManyArgs>(args?: SelectSubset<T, BasicBestPlayFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BasicBestPlayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BasicBestPlay.
     * @param {BasicBestPlayCreateArgs} args - Arguments to create a BasicBestPlay.
     * @example
     * // Create one BasicBestPlay
     * const BasicBestPlay = await prisma.basicBestPlay.create({
     *   data: {
     *     // ... data to create a BasicBestPlay
     *   }
     * })
     * 
     */
    create<T extends BasicBestPlayCreateArgs>(args: SelectSubset<T, BasicBestPlayCreateArgs<ExtArgs>>): Prisma__BasicBestPlayClient<$Result.GetResult<Prisma.$BasicBestPlayPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BasicBestPlays.
     * @param {BasicBestPlayCreateManyArgs} args - Arguments to create many BasicBestPlays.
     * @example
     * // Create many BasicBestPlays
     * const basicBestPlay = await prisma.basicBestPlay.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BasicBestPlayCreateManyArgs>(args?: SelectSubset<T, BasicBestPlayCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BasicBestPlays and returns the data saved in the database.
     * @param {BasicBestPlayCreateManyAndReturnArgs} args - Arguments to create many BasicBestPlays.
     * @example
     * // Create many BasicBestPlays
     * const basicBestPlay = await prisma.basicBestPlay.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BasicBestPlays and only return the `id`
     * const basicBestPlayWithIdOnly = await prisma.basicBestPlay.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BasicBestPlayCreateManyAndReturnArgs>(args?: SelectSubset<T, BasicBestPlayCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BasicBestPlayPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BasicBestPlay.
     * @param {BasicBestPlayDeleteArgs} args - Arguments to delete one BasicBestPlay.
     * @example
     * // Delete one BasicBestPlay
     * const BasicBestPlay = await prisma.basicBestPlay.delete({
     *   where: {
     *     // ... filter to delete one BasicBestPlay
     *   }
     * })
     * 
     */
    delete<T extends BasicBestPlayDeleteArgs>(args: SelectSubset<T, BasicBestPlayDeleteArgs<ExtArgs>>): Prisma__BasicBestPlayClient<$Result.GetResult<Prisma.$BasicBestPlayPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BasicBestPlay.
     * @param {BasicBestPlayUpdateArgs} args - Arguments to update one BasicBestPlay.
     * @example
     * // Update one BasicBestPlay
     * const basicBestPlay = await prisma.basicBestPlay.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BasicBestPlayUpdateArgs>(args: SelectSubset<T, BasicBestPlayUpdateArgs<ExtArgs>>): Prisma__BasicBestPlayClient<$Result.GetResult<Prisma.$BasicBestPlayPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BasicBestPlays.
     * @param {BasicBestPlayDeleteManyArgs} args - Arguments to filter BasicBestPlays to delete.
     * @example
     * // Delete a few BasicBestPlays
     * const { count } = await prisma.basicBestPlay.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BasicBestPlayDeleteManyArgs>(args?: SelectSubset<T, BasicBestPlayDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BasicBestPlays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BasicBestPlayUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BasicBestPlays
     * const basicBestPlay = await prisma.basicBestPlay.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BasicBestPlayUpdateManyArgs>(args: SelectSubset<T, BasicBestPlayUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BasicBestPlays and returns the data updated in the database.
     * @param {BasicBestPlayUpdateManyAndReturnArgs} args - Arguments to update many BasicBestPlays.
     * @example
     * // Update many BasicBestPlays
     * const basicBestPlay = await prisma.basicBestPlay.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BasicBestPlays and only return the `id`
     * const basicBestPlayWithIdOnly = await prisma.basicBestPlay.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BasicBestPlayUpdateManyAndReturnArgs>(args: SelectSubset<T, BasicBestPlayUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BasicBestPlayPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BasicBestPlay.
     * @param {BasicBestPlayUpsertArgs} args - Arguments to update or create a BasicBestPlay.
     * @example
     * // Update or create a BasicBestPlay
     * const basicBestPlay = await prisma.basicBestPlay.upsert({
     *   create: {
     *     // ... data to create a BasicBestPlay
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BasicBestPlay we want to update
     *   }
     * })
     */
    upsert<T extends BasicBestPlayUpsertArgs>(args: SelectSubset<T, BasicBestPlayUpsertArgs<ExtArgs>>): Prisma__BasicBestPlayClient<$Result.GetResult<Prisma.$BasicBestPlayPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BasicBestPlays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BasicBestPlayCountArgs} args - Arguments to filter BasicBestPlays to count.
     * @example
     * // Count the number of BasicBestPlays
     * const count = await prisma.basicBestPlay.count({
     *   where: {
     *     // ... the filter for the BasicBestPlays we want to count
     *   }
     * })
    **/
    count<T extends BasicBestPlayCountArgs>(
      args?: Subset<T, BasicBestPlayCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BasicBestPlayCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BasicBestPlay.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BasicBestPlayAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BasicBestPlayAggregateArgs>(args: Subset<T, BasicBestPlayAggregateArgs>): Prisma.PrismaPromise<GetBasicBestPlayAggregateType<T>>

    /**
     * Group by BasicBestPlay.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BasicBestPlayGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BasicBestPlayGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BasicBestPlayGroupByArgs['orderBy'] }
        : { orderBy?: BasicBestPlayGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BasicBestPlayGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBasicBestPlayGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BasicBestPlay model
   */
  readonly fields: BasicBestPlayFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BasicBestPlay.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BasicBestPlayClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    music<T extends MusicDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MusicDefaultArgs<ExtArgs>>): Prisma__MusicClient<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BasicBestPlay model
   */
  interface BasicBestPlayFieldRefs {
    readonly id: FieldRef<"BasicBestPlay", 'Int'>
    readonly difficulty: FieldRef<"BasicBestPlay", 'String'>
    readonly level: FieldRef<"BasicBestPlay", 'Int'>
    readonly score: FieldRef<"BasicBestPlay", 'Int'>
    readonly max_combo: FieldRef<"BasicBestPlay", 'Int'>
    readonly rank: FieldRef<"BasicBestPlay", 'String'>
    readonly besttime: FieldRef<"BasicBestPlay", 'String'>
    readonly grade_basic: FieldRef<"BasicBestPlay", 'Int'>
    readonly fc_type: FieldRef<"BasicBestPlay", 'Int'>
    readonly created_at: FieldRef<"BasicBestPlay", 'DateTime'>
    readonly updated_at: FieldRef<"BasicBestPlay", 'DateTime'>
    readonly user_id: FieldRef<"BasicBestPlay", 'Int'>
    readonly music_idx: FieldRef<"BasicBestPlay", 'String'>
  }
    

  // Custom InputTypes
  /**
   * BasicBestPlay findUnique
   */
  export type BasicBestPlayFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BasicBestPlay
     */
    select?: BasicBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BasicBestPlay
     */
    omit?: BasicBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BasicBestPlayInclude<ExtArgs> | null
    /**
     * Filter, which BasicBestPlay to fetch.
     */
    where: BasicBestPlayWhereUniqueInput
  }

  /**
   * BasicBestPlay findUniqueOrThrow
   */
  export type BasicBestPlayFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BasicBestPlay
     */
    select?: BasicBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BasicBestPlay
     */
    omit?: BasicBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BasicBestPlayInclude<ExtArgs> | null
    /**
     * Filter, which BasicBestPlay to fetch.
     */
    where: BasicBestPlayWhereUniqueInput
  }

  /**
   * BasicBestPlay findFirst
   */
  export type BasicBestPlayFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BasicBestPlay
     */
    select?: BasicBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BasicBestPlay
     */
    omit?: BasicBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BasicBestPlayInclude<ExtArgs> | null
    /**
     * Filter, which BasicBestPlay to fetch.
     */
    where?: BasicBestPlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BasicBestPlays to fetch.
     */
    orderBy?: BasicBestPlayOrderByWithRelationInput | BasicBestPlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BasicBestPlays.
     */
    cursor?: BasicBestPlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BasicBestPlays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BasicBestPlays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BasicBestPlays.
     */
    distinct?: BasicBestPlayScalarFieldEnum | BasicBestPlayScalarFieldEnum[]
  }

  /**
   * BasicBestPlay findFirstOrThrow
   */
  export type BasicBestPlayFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BasicBestPlay
     */
    select?: BasicBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BasicBestPlay
     */
    omit?: BasicBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BasicBestPlayInclude<ExtArgs> | null
    /**
     * Filter, which BasicBestPlay to fetch.
     */
    where?: BasicBestPlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BasicBestPlays to fetch.
     */
    orderBy?: BasicBestPlayOrderByWithRelationInput | BasicBestPlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BasicBestPlays.
     */
    cursor?: BasicBestPlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BasicBestPlays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BasicBestPlays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BasicBestPlays.
     */
    distinct?: BasicBestPlayScalarFieldEnum | BasicBestPlayScalarFieldEnum[]
  }

  /**
   * BasicBestPlay findMany
   */
  export type BasicBestPlayFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BasicBestPlay
     */
    select?: BasicBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BasicBestPlay
     */
    omit?: BasicBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BasicBestPlayInclude<ExtArgs> | null
    /**
     * Filter, which BasicBestPlays to fetch.
     */
    where?: BasicBestPlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BasicBestPlays to fetch.
     */
    orderBy?: BasicBestPlayOrderByWithRelationInput | BasicBestPlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BasicBestPlays.
     */
    cursor?: BasicBestPlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BasicBestPlays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BasicBestPlays.
     */
    skip?: number
    distinct?: BasicBestPlayScalarFieldEnum | BasicBestPlayScalarFieldEnum[]
  }

  /**
   * BasicBestPlay create
   */
  export type BasicBestPlayCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BasicBestPlay
     */
    select?: BasicBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BasicBestPlay
     */
    omit?: BasicBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BasicBestPlayInclude<ExtArgs> | null
    /**
     * The data needed to create a BasicBestPlay.
     */
    data: XOR<BasicBestPlayCreateInput, BasicBestPlayUncheckedCreateInput>
  }

  /**
   * BasicBestPlay createMany
   */
  export type BasicBestPlayCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BasicBestPlays.
     */
    data: BasicBestPlayCreateManyInput | BasicBestPlayCreateManyInput[]
  }

  /**
   * BasicBestPlay createManyAndReturn
   */
  export type BasicBestPlayCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BasicBestPlay
     */
    select?: BasicBestPlaySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BasicBestPlay
     */
    omit?: BasicBestPlayOmit<ExtArgs> | null
    /**
     * The data used to create many BasicBestPlays.
     */
    data: BasicBestPlayCreateManyInput | BasicBestPlayCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BasicBestPlayIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BasicBestPlay update
   */
  export type BasicBestPlayUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BasicBestPlay
     */
    select?: BasicBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BasicBestPlay
     */
    omit?: BasicBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BasicBestPlayInclude<ExtArgs> | null
    /**
     * The data needed to update a BasicBestPlay.
     */
    data: XOR<BasicBestPlayUpdateInput, BasicBestPlayUncheckedUpdateInput>
    /**
     * Choose, which BasicBestPlay to update.
     */
    where: BasicBestPlayWhereUniqueInput
  }

  /**
   * BasicBestPlay updateMany
   */
  export type BasicBestPlayUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BasicBestPlays.
     */
    data: XOR<BasicBestPlayUpdateManyMutationInput, BasicBestPlayUncheckedUpdateManyInput>
    /**
     * Filter which BasicBestPlays to update
     */
    where?: BasicBestPlayWhereInput
    /**
     * Limit how many BasicBestPlays to update.
     */
    limit?: number
  }

  /**
   * BasicBestPlay updateManyAndReturn
   */
  export type BasicBestPlayUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BasicBestPlay
     */
    select?: BasicBestPlaySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BasicBestPlay
     */
    omit?: BasicBestPlayOmit<ExtArgs> | null
    /**
     * The data used to update BasicBestPlays.
     */
    data: XOR<BasicBestPlayUpdateManyMutationInput, BasicBestPlayUncheckedUpdateManyInput>
    /**
     * Filter which BasicBestPlays to update
     */
    where?: BasicBestPlayWhereInput
    /**
     * Limit how many BasicBestPlays to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BasicBestPlayIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BasicBestPlay upsert
   */
  export type BasicBestPlayUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BasicBestPlay
     */
    select?: BasicBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BasicBestPlay
     */
    omit?: BasicBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BasicBestPlayInclude<ExtArgs> | null
    /**
     * The filter to search for the BasicBestPlay to update in case it exists.
     */
    where: BasicBestPlayWhereUniqueInput
    /**
     * In case the BasicBestPlay found by the `where` argument doesn't exist, create a new BasicBestPlay with this data.
     */
    create: XOR<BasicBestPlayCreateInput, BasicBestPlayUncheckedCreateInput>
    /**
     * In case the BasicBestPlay was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BasicBestPlayUpdateInput, BasicBestPlayUncheckedUpdateInput>
  }

  /**
   * BasicBestPlay delete
   */
  export type BasicBestPlayDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BasicBestPlay
     */
    select?: BasicBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BasicBestPlay
     */
    omit?: BasicBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BasicBestPlayInclude<ExtArgs> | null
    /**
     * Filter which BasicBestPlay to delete.
     */
    where: BasicBestPlayWhereUniqueInput
  }

  /**
   * BasicBestPlay deleteMany
   */
  export type BasicBestPlayDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BasicBestPlays to delete
     */
    where?: BasicBestPlayWhereInput
    /**
     * Limit how many BasicBestPlays to delete.
     */
    limit?: number
  }

  /**
   * BasicBestPlay without action
   */
  export type BasicBestPlayDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BasicBestPlay
     */
    select?: BasicBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BasicBestPlay
     */
    omit?: BasicBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BasicBestPlayInclude<ExtArgs> | null
  }


  /**
   * Model RecitalBestPlay
   */

  export type AggregateRecitalBestPlay = {
    _count: RecitalBestPlayCountAggregateOutputType | null
    _avg: RecitalBestPlayAvgAggregateOutputType | null
    _sum: RecitalBestPlaySumAggregateOutputType | null
    _min: RecitalBestPlayMinAggregateOutputType | null
    _max: RecitalBestPlayMaxAggregateOutputType | null
  }

  export type RecitalBestPlayAvgAggregateOutputType = {
    id: number | null
    level: number | null
    score: number | null
    max_combo: number | null
    grade_recital: number | null
    fc_type: number | null
    user_id: number | null
  }

  export type RecitalBestPlaySumAggregateOutputType = {
    id: number | null
    level: number | null
    score: number | null
    max_combo: number | null
    grade_recital: number | null
    fc_type: number | null
    user_id: number | null
  }

  export type RecitalBestPlayMinAggregateOutputType = {
    id: number | null
    difficulty: string | null
    level: number | null
    score: number | null
    max_combo: number | null
    rank: string | null
    besttime: string | null
    grade_recital: number | null
    fc_type: number | null
    created_at: Date | null
    updated_at: Date | null
    user_id: number | null
    music_idx: string | null
  }

  export type RecitalBestPlayMaxAggregateOutputType = {
    id: number | null
    difficulty: string | null
    level: number | null
    score: number | null
    max_combo: number | null
    rank: string | null
    besttime: string | null
    grade_recital: number | null
    fc_type: number | null
    created_at: Date | null
    updated_at: Date | null
    user_id: number | null
    music_idx: string | null
  }

  export type RecitalBestPlayCountAggregateOutputType = {
    id: number
    difficulty: number
    level: number
    score: number
    max_combo: number
    rank: number
    besttime: number
    grade_recital: number
    fc_type: number
    created_at: number
    updated_at: number
    user_id: number
    music_idx: number
    _all: number
  }


  export type RecitalBestPlayAvgAggregateInputType = {
    id?: true
    level?: true
    score?: true
    max_combo?: true
    grade_recital?: true
    fc_type?: true
    user_id?: true
  }

  export type RecitalBestPlaySumAggregateInputType = {
    id?: true
    level?: true
    score?: true
    max_combo?: true
    grade_recital?: true
    fc_type?: true
    user_id?: true
  }

  export type RecitalBestPlayMinAggregateInputType = {
    id?: true
    difficulty?: true
    level?: true
    score?: true
    max_combo?: true
    rank?: true
    besttime?: true
    grade_recital?: true
    fc_type?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    music_idx?: true
  }

  export type RecitalBestPlayMaxAggregateInputType = {
    id?: true
    difficulty?: true
    level?: true
    score?: true
    max_combo?: true
    rank?: true
    besttime?: true
    grade_recital?: true
    fc_type?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    music_idx?: true
  }

  export type RecitalBestPlayCountAggregateInputType = {
    id?: true
    difficulty?: true
    level?: true
    score?: true
    max_combo?: true
    rank?: true
    besttime?: true
    grade_recital?: true
    fc_type?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    music_idx?: true
    _all?: true
  }

  export type RecitalBestPlayAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecitalBestPlay to aggregate.
     */
    where?: RecitalBestPlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecitalBestPlays to fetch.
     */
    orderBy?: RecitalBestPlayOrderByWithRelationInput | RecitalBestPlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecitalBestPlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecitalBestPlays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecitalBestPlays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RecitalBestPlays
    **/
    _count?: true | RecitalBestPlayCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RecitalBestPlayAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RecitalBestPlaySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecitalBestPlayMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecitalBestPlayMaxAggregateInputType
  }

  export type GetRecitalBestPlayAggregateType<T extends RecitalBestPlayAggregateArgs> = {
        [P in keyof T & keyof AggregateRecitalBestPlay]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecitalBestPlay[P]>
      : GetScalarType<T[P], AggregateRecitalBestPlay[P]>
  }




  export type RecitalBestPlayGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecitalBestPlayWhereInput
    orderBy?: RecitalBestPlayOrderByWithAggregationInput | RecitalBestPlayOrderByWithAggregationInput[]
    by: RecitalBestPlayScalarFieldEnum[] | RecitalBestPlayScalarFieldEnum
    having?: RecitalBestPlayScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecitalBestPlayCountAggregateInputType | true
    _avg?: RecitalBestPlayAvgAggregateInputType
    _sum?: RecitalBestPlaySumAggregateInputType
    _min?: RecitalBestPlayMinAggregateInputType
    _max?: RecitalBestPlayMaxAggregateInputType
  }

  export type RecitalBestPlayGroupByOutputType = {
    id: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_recital: number
    fc_type: number
    created_at: Date
    updated_at: Date
    user_id: number
    music_idx: string
    _count: RecitalBestPlayCountAggregateOutputType | null
    _avg: RecitalBestPlayAvgAggregateOutputType | null
    _sum: RecitalBestPlaySumAggregateOutputType | null
    _min: RecitalBestPlayMinAggregateOutputType | null
    _max: RecitalBestPlayMaxAggregateOutputType | null
  }

  type GetRecitalBestPlayGroupByPayload<T extends RecitalBestPlayGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecitalBestPlayGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecitalBestPlayGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecitalBestPlayGroupByOutputType[P]>
            : GetScalarType<T[P], RecitalBestPlayGroupByOutputType[P]>
        }
      >
    >


  export type RecitalBestPlaySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    difficulty?: boolean
    level?: boolean
    score?: boolean
    max_combo?: boolean
    rank?: boolean
    besttime?: boolean
    grade_recital?: boolean
    fc_type?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recitalBestPlay"]>

  export type RecitalBestPlaySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    difficulty?: boolean
    level?: boolean
    score?: boolean
    max_combo?: boolean
    rank?: boolean
    besttime?: boolean
    grade_recital?: boolean
    fc_type?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recitalBestPlay"]>

  export type RecitalBestPlaySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    difficulty?: boolean
    level?: boolean
    score?: boolean
    max_combo?: boolean
    rank?: boolean
    besttime?: boolean
    grade_recital?: boolean
    fc_type?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recitalBestPlay"]>

  export type RecitalBestPlaySelectScalar = {
    id?: boolean
    difficulty?: boolean
    level?: boolean
    score?: boolean
    max_combo?: boolean
    rank?: boolean
    besttime?: boolean
    grade_recital?: boolean
    fc_type?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
  }

  export type RecitalBestPlayOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "difficulty" | "level" | "score" | "max_combo" | "rank" | "besttime" | "grade_recital" | "fc_type" | "created_at" | "updated_at" | "user_id" | "music_idx", ExtArgs["result"]["recitalBestPlay"]>
  export type RecitalBestPlayInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }
  export type RecitalBestPlayIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }
  export type RecitalBestPlayIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }

  export type $RecitalBestPlayPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RecitalBestPlay"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      music: Prisma.$MusicPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      difficulty: string
      level: number
      score: number
      max_combo: number
      rank: string
      besttime: string
      grade_recital: number
      fc_type: number
      created_at: Date
      updated_at: Date
      user_id: number
      music_idx: string
    }, ExtArgs["result"]["recitalBestPlay"]>
    composites: {}
  }

  type RecitalBestPlayGetPayload<S extends boolean | null | undefined | RecitalBestPlayDefaultArgs> = $Result.GetResult<Prisma.$RecitalBestPlayPayload, S>

  type RecitalBestPlayCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RecitalBestPlayFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RecitalBestPlayCountAggregateInputType | true
    }

  export interface RecitalBestPlayDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RecitalBestPlay'], meta: { name: 'RecitalBestPlay' } }
    /**
     * Find zero or one RecitalBestPlay that matches the filter.
     * @param {RecitalBestPlayFindUniqueArgs} args - Arguments to find a RecitalBestPlay
     * @example
     * // Get one RecitalBestPlay
     * const recitalBestPlay = await prisma.recitalBestPlay.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RecitalBestPlayFindUniqueArgs>(args: SelectSubset<T, RecitalBestPlayFindUniqueArgs<ExtArgs>>): Prisma__RecitalBestPlayClient<$Result.GetResult<Prisma.$RecitalBestPlayPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RecitalBestPlay that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RecitalBestPlayFindUniqueOrThrowArgs} args - Arguments to find a RecitalBestPlay
     * @example
     * // Get one RecitalBestPlay
     * const recitalBestPlay = await prisma.recitalBestPlay.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RecitalBestPlayFindUniqueOrThrowArgs>(args: SelectSubset<T, RecitalBestPlayFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RecitalBestPlayClient<$Result.GetResult<Prisma.$RecitalBestPlayPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RecitalBestPlay that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecitalBestPlayFindFirstArgs} args - Arguments to find a RecitalBestPlay
     * @example
     * // Get one RecitalBestPlay
     * const recitalBestPlay = await prisma.recitalBestPlay.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RecitalBestPlayFindFirstArgs>(args?: SelectSubset<T, RecitalBestPlayFindFirstArgs<ExtArgs>>): Prisma__RecitalBestPlayClient<$Result.GetResult<Prisma.$RecitalBestPlayPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RecitalBestPlay that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecitalBestPlayFindFirstOrThrowArgs} args - Arguments to find a RecitalBestPlay
     * @example
     * // Get one RecitalBestPlay
     * const recitalBestPlay = await prisma.recitalBestPlay.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RecitalBestPlayFindFirstOrThrowArgs>(args?: SelectSubset<T, RecitalBestPlayFindFirstOrThrowArgs<ExtArgs>>): Prisma__RecitalBestPlayClient<$Result.GetResult<Prisma.$RecitalBestPlayPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RecitalBestPlays that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecitalBestPlayFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RecitalBestPlays
     * const recitalBestPlays = await prisma.recitalBestPlay.findMany()
     * 
     * // Get first 10 RecitalBestPlays
     * const recitalBestPlays = await prisma.recitalBestPlay.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recitalBestPlayWithIdOnly = await prisma.recitalBestPlay.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RecitalBestPlayFindManyArgs>(args?: SelectSubset<T, RecitalBestPlayFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecitalBestPlayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RecitalBestPlay.
     * @param {RecitalBestPlayCreateArgs} args - Arguments to create a RecitalBestPlay.
     * @example
     * // Create one RecitalBestPlay
     * const RecitalBestPlay = await prisma.recitalBestPlay.create({
     *   data: {
     *     // ... data to create a RecitalBestPlay
     *   }
     * })
     * 
     */
    create<T extends RecitalBestPlayCreateArgs>(args: SelectSubset<T, RecitalBestPlayCreateArgs<ExtArgs>>): Prisma__RecitalBestPlayClient<$Result.GetResult<Prisma.$RecitalBestPlayPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RecitalBestPlays.
     * @param {RecitalBestPlayCreateManyArgs} args - Arguments to create many RecitalBestPlays.
     * @example
     * // Create many RecitalBestPlays
     * const recitalBestPlay = await prisma.recitalBestPlay.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RecitalBestPlayCreateManyArgs>(args?: SelectSubset<T, RecitalBestPlayCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RecitalBestPlays and returns the data saved in the database.
     * @param {RecitalBestPlayCreateManyAndReturnArgs} args - Arguments to create many RecitalBestPlays.
     * @example
     * // Create many RecitalBestPlays
     * const recitalBestPlay = await prisma.recitalBestPlay.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RecitalBestPlays and only return the `id`
     * const recitalBestPlayWithIdOnly = await prisma.recitalBestPlay.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RecitalBestPlayCreateManyAndReturnArgs>(args?: SelectSubset<T, RecitalBestPlayCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecitalBestPlayPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RecitalBestPlay.
     * @param {RecitalBestPlayDeleteArgs} args - Arguments to delete one RecitalBestPlay.
     * @example
     * // Delete one RecitalBestPlay
     * const RecitalBestPlay = await prisma.recitalBestPlay.delete({
     *   where: {
     *     // ... filter to delete one RecitalBestPlay
     *   }
     * })
     * 
     */
    delete<T extends RecitalBestPlayDeleteArgs>(args: SelectSubset<T, RecitalBestPlayDeleteArgs<ExtArgs>>): Prisma__RecitalBestPlayClient<$Result.GetResult<Prisma.$RecitalBestPlayPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RecitalBestPlay.
     * @param {RecitalBestPlayUpdateArgs} args - Arguments to update one RecitalBestPlay.
     * @example
     * // Update one RecitalBestPlay
     * const recitalBestPlay = await prisma.recitalBestPlay.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RecitalBestPlayUpdateArgs>(args: SelectSubset<T, RecitalBestPlayUpdateArgs<ExtArgs>>): Prisma__RecitalBestPlayClient<$Result.GetResult<Prisma.$RecitalBestPlayPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RecitalBestPlays.
     * @param {RecitalBestPlayDeleteManyArgs} args - Arguments to filter RecitalBestPlays to delete.
     * @example
     * // Delete a few RecitalBestPlays
     * const { count } = await prisma.recitalBestPlay.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RecitalBestPlayDeleteManyArgs>(args?: SelectSubset<T, RecitalBestPlayDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecitalBestPlays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecitalBestPlayUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RecitalBestPlays
     * const recitalBestPlay = await prisma.recitalBestPlay.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RecitalBestPlayUpdateManyArgs>(args: SelectSubset<T, RecitalBestPlayUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecitalBestPlays and returns the data updated in the database.
     * @param {RecitalBestPlayUpdateManyAndReturnArgs} args - Arguments to update many RecitalBestPlays.
     * @example
     * // Update many RecitalBestPlays
     * const recitalBestPlay = await prisma.recitalBestPlay.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RecitalBestPlays and only return the `id`
     * const recitalBestPlayWithIdOnly = await prisma.recitalBestPlay.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RecitalBestPlayUpdateManyAndReturnArgs>(args: SelectSubset<T, RecitalBestPlayUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecitalBestPlayPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RecitalBestPlay.
     * @param {RecitalBestPlayUpsertArgs} args - Arguments to update or create a RecitalBestPlay.
     * @example
     * // Update or create a RecitalBestPlay
     * const recitalBestPlay = await prisma.recitalBestPlay.upsert({
     *   create: {
     *     // ... data to create a RecitalBestPlay
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RecitalBestPlay we want to update
     *   }
     * })
     */
    upsert<T extends RecitalBestPlayUpsertArgs>(args: SelectSubset<T, RecitalBestPlayUpsertArgs<ExtArgs>>): Prisma__RecitalBestPlayClient<$Result.GetResult<Prisma.$RecitalBestPlayPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RecitalBestPlays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecitalBestPlayCountArgs} args - Arguments to filter RecitalBestPlays to count.
     * @example
     * // Count the number of RecitalBestPlays
     * const count = await prisma.recitalBestPlay.count({
     *   where: {
     *     // ... the filter for the RecitalBestPlays we want to count
     *   }
     * })
    **/
    count<T extends RecitalBestPlayCountArgs>(
      args?: Subset<T, RecitalBestPlayCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecitalBestPlayCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RecitalBestPlay.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecitalBestPlayAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RecitalBestPlayAggregateArgs>(args: Subset<T, RecitalBestPlayAggregateArgs>): Prisma.PrismaPromise<GetRecitalBestPlayAggregateType<T>>

    /**
     * Group by RecitalBestPlay.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecitalBestPlayGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RecitalBestPlayGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecitalBestPlayGroupByArgs['orderBy'] }
        : { orderBy?: RecitalBestPlayGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RecitalBestPlayGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecitalBestPlayGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RecitalBestPlay model
   */
  readonly fields: RecitalBestPlayFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RecitalBestPlay.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RecitalBestPlayClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    music<T extends MusicDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MusicDefaultArgs<ExtArgs>>): Prisma__MusicClient<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RecitalBestPlay model
   */
  interface RecitalBestPlayFieldRefs {
    readonly id: FieldRef<"RecitalBestPlay", 'Int'>
    readonly difficulty: FieldRef<"RecitalBestPlay", 'String'>
    readonly level: FieldRef<"RecitalBestPlay", 'Int'>
    readonly score: FieldRef<"RecitalBestPlay", 'Int'>
    readonly max_combo: FieldRef<"RecitalBestPlay", 'Int'>
    readonly rank: FieldRef<"RecitalBestPlay", 'String'>
    readonly besttime: FieldRef<"RecitalBestPlay", 'String'>
    readonly grade_recital: FieldRef<"RecitalBestPlay", 'Int'>
    readonly fc_type: FieldRef<"RecitalBestPlay", 'Int'>
    readonly created_at: FieldRef<"RecitalBestPlay", 'DateTime'>
    readonly updated_at: FieldRef<"RecitalBestPlay", 'DateTime'>
    readonly user_id: FieldRef<"RecitalBestPlay", 'Int'>
    readonly music_idx: FieldRef<"RecitalBestPlay", 'String'>
  }
    

  // Custom InputTypes
  /**
   * RecitalBestPlay findUnique
   */
  export type RecitalBestPlayFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecitalBestPlay
     */
    select?: RecitalBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecitalBestPlay
     */
    omit?: RecitalBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecitalBestPlayInclude<ExtArgs> | null
    /**
     * Filter, which RecitalBestPlay to fetch.
     */
    where: RecitalBestPlayWhereUniqueInput
  }

  /**
   * RecitalBestPlay findUniqueOrThrow
   */
  export type RecitalBestPlayFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecitalBestPlay
     */
    select?: RecitalBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecitalBestPlay
     */
    omit?: RecitalBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecitalBestPlayInclude<ExtArgs> | null
    /**
     * Filter, which RecitalBestPlay to fetch.
     */
    where: RecitalBestPlayWhereUniqueInput
  }

  /**
   * RecitalBestPlay findFirst
   */
  export type RecitalBestPlayFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecitalBestPlay
     */
    select?: RecitalBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecitalBestPlay
     */
    omit?: RecitalBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecitalBestPlayInclude<ExtArgs> | null
    /**
     * Filter, which RecitalBestPlay to fetch.
     */
    where?: RecitalBestPlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecitalBestPlays to fetch.
     */
    orderBy?: RecitalBestPlayOrderByWithRelationInput | RecitalBestPlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecitalBestPlays.
     */
    cursor?: RecitalBestPlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecitalBestPlays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecitalBestPlays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecitalBestPlays.
     */
    distinct?: RecitalBestPlayScalarFieldEnum | RecitalBestPlayScalarFieldEnum[]
  }

  /**
   * RecitalBestPlay findFirstOrThrow
   */
  export type RecitalBestPlayFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecitalBestPlay
     */
    select?: RecitalBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecitalBestPlay
     */
    omit?: RecitalBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecitalBestPlayInclude<ExtArgs> | null
    /**
     * Filter, which RecitalBestPlay to fetch.
     */
    where?: RecitalBestPlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecitalBestPlays to fetch.
     */
    orderBy?: RecitalBestPlayOrderByWithRelationInput | RecitalBestPlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecitalBestPlays.
     */
    cursor?: RecitalBestPlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecitalBestPlays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecitalBestPlays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecitalBestPlays.
     */
    distinct?: RecitalBestPlayScalarFieldEnum | RecitalBestPlayScalarFieldEnum[]
  }

  /**
   * RecitalBestPlay findMany
   */
  export type RecitalBestPlayFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecitalBestPlay
     */
    select?: RecitalBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecitalBestPlay
     */
    omit?: RecitalBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecitalBestPlayInclude<ExtArgs> | null
    /**
     * Filter, which RecitalBestPlays to fetch.
     */
    where?: RecitalBestPlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecitalBestPlays to fetch.
     */
    orderBy?: RecitalBestPlayOrderByWithRelationInput | RecitalBestPlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RecitalBestPlays.
     */
    cursor?: RecitalBestPlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecitalBestPlays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecitalBestPlays.
     */
    skip?: number
    distinct?: RecitalBestPlayScalarFieldEnum | RecitalBestPlayScalarFieldEnum[]
  }

  /**
   * RecitalBestPlay create
   */
  export type RecitalBestPlayCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecitalBestPlay
     */
    select?: RecitalBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecitalBestPlay
     */
    omit?: RecitalBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecitalBestPlayInclude<ExtArgs> | null
    /**
     * The data needed to create a RecitalBestPlay.
     */
    data: XOR<RecitalBestPlayCreateInput, RecitalBestPlayUncheckedCreateInput>
  }

  /**
   * RecitalBestPlay createMany
   */
  export type RecitalBestPlayCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RecitalBestPlays.
     */
    data: RecitalBestPlayCreateManyInput | RecitalBestPlayCreateManyInput[]
  }

  /**
   * RecitalBestPlay createManyAndReturn
   */
  export type RecitalBestPlayCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecitalBestPlay
     */
    select?: RecitalBestPlaySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RecitalBestPlay
     */
    omit?: RecitalBestPlayOmit<ExtArgs> | null
    /**
     * The data used to create many RecitalBestPlays.
     */
    data: RecitalBestPlayCreateManyInput | RecitalBestPlayCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecitalBestPlayIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RecitalBestPlay update
   */
  export type RecitalBestPlayUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecitalBestPlay
     */
    select?: RecitalBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecitalBestPlay
     */
    omit?: RecitalBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecitalBestPlayInclude<ExtArgs> | null
    /**
     * The data needed to update a RecitalBestPlay.
     */
    data: XOR<RecitalBestPlayUpdateInput, RecitalBestPlayUncheckedUpdateInput>
    /**
     * Choose, which RecitalBestPlay to update.
     */
    where: RecitalBestPlayWhereUniqueInput
  }

  /**
   * RecitalBestPlay updateMany
   */
  export type RecitalBestPlayUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RecitalBestPlays.
     */
    data: XOR<RecitalBestPlayUpdateManyMutationInput, RecitalBestPlayUncheckedUpdateManyInput>
    /**
     * Filter which RecitalBestPlays to update
     */
    where?: RecitalBestPlayWhereInput
    /**
     * Limit how many RecitalBestPlays to update.
     */
    limit?: number
  }

  /**
   * RecitalBestPlay updateManyAndReturn
   */
  export type RecitalBestPlayUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecitalBestPlay
     */
    select?: RecitalBestPlaySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RecitalBestPlay
     */
    omit?: RecitalBestPlayOmit<ExtArgs> | null
    /**
     * The data used to update RecitalBestPlays.
     */
    data: XOR<RecitalBestPlayUpdateManyMutationInput, RecitalBestPlayUncheckedUpdateManyInput>
    /**
     * Filter which RecitalBestPlays to update
     */
    where?: RecitalBestPlayWhereInput
    /**
     * Limit how many RecitalBestPlays to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecitalBestPlayIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RecitalBestPlay upsert
   */
  export type RecitalBestPlayUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecitalBestPlay
     */
    select?: RecitalBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecitalBestPlay
     */
    omit?: RecitalBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecitalBestPlayInclude<ExtArgs> | null
    /**
     * The filter to search for the RecitalBestPlay to update in case it exists.
     */
    where: RecitalBestPlayWhereUniqueInput
    /**
     * In case the RecitalBestPlay found by the `where` argument doesn't exist, create a new RecitalBestPlay with this data.
     */
    create: XOR<RecitalBestPlayCreateInput, RecitalBestPlayUncheckedCreateInput>
    /**
     * In case the RecitalBestPlay was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecitalBestPlayUpdateInput, RecitalBestPlayUncheckedUpdateInput>
  }

  /**
   * RecitalBestPlay delete
   */
  export type RecitalBestPlayDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecitalBestPlay
     */
    select?: RecitalBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecitalBestPlay
     */
    omit?: RecitalBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecitalBestPlayInclude<ExtArgs> | null
    /**
     * Filter which RecitalBestPlay to delete.
     */
    where: RecitalBestPlayWhereUniqueInput
  }

  /**
   * RecitalBestPlay deleteMany
   */
  export type RecitalBestPlayDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecitalBestPlays to delete
     */
    where?: RecitalBestPlayWhereInput
    /**
     * Limit how many RecitalBestPlays to delete.
     */
    limit?: number
  }

  /**
   * RecitalBestPlay without action
   */
  export type RecitalBestPlayDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecitalBestPlay
     */
    select?: RecitalBestPlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecitalBestPlay
     */
    omit?: RecitalBestPlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecitalBestPlayInclude<ExtArgs> | null
  }


  /**
   * Model PlayData
   */

  export type AggregatePlayData = {
    _count: PlayDataCountAggregateOutputType | null
    _avg: PlayDataAvgAggregateOutputType | null
    _sum: PlayDataSumAggregateOutputType | null
    _min: PlayDataMinAggregateOutputType | null
    _max: PlayDataMaxAggregateOutputType | null
  }

  export type PlayDataAvgAggregateOutputType = {
    id: number | null
    level: number | null
    score: number | null
    fc_type: number | null
    play_count: number | null
    fullcombo_count: number | null
    pianistic_count: number | null
    max_combo: number | null
    grade_basic: number | null
    grade_recital: number | null
    user_id: number | null
  }

  export type PlayDataSumAggregateOutputType = {
    id: number | null
    level: number | null
    score: number | null
    fc_type: number | null
    play_count: number | null
    fullcombo_count: number | null
    pianistic_count: number | null
    max_combo: number | null
    grade_basic: number | null
    grade_recital: number | null
    user_id: number | null
  }

  export type PlayDataMinAggregateOutputType = {
    id: number | null
    level: number | null
    difficulty: string | null
    score: number | null
    rank: string | null
    fc_type: number | null
    play_count: number | null
    fullcombo_count: number | null
    pianistic_count: number | null
    max_combo: number | null
    grade_basic: number | null
    grade_recital: number | null
    besttime: string | null
    created_at: Date | null
    updated_at: Date | null
    user_id: number | null
    music_idx: string | null
  }

  export type PlayDataMaxAggregateOutputType = {
    id: number | null
    level: number | null
    difficulty: string | null
    score: number | null
    rank: string | null
    fc_type: number | null
    play_count: number | null
    fullcombo_count: number | null
    pianistic_count: number | null
    max_combo: number | null
    grade_basic: number | null
    grade_recital: number | null
    besttime: string | null
    created_at: Date | null
    updated_at: Date | null
    user_id: number | null
    music_idx: string | null
  }

  export type PlayDataCountAggregateOutputType = {
    id: number
    level: number
    difficulty: number
    score: number
    rank: number
    fc_type: number
    play_count: number
    fullcombo_count: number
    pianistic_count: number
    max_combo: number
    grade_basic: number
    grade_recital: number
    besttime: number
    created_at: number
    updated_at: number
    user_id: number
    music_idx: number
    _all: number
  }


  export type PlayDataAvgAggregateInputType = {
    id?: true
    level?: true
    score?: true
    fc_type?: true
    play_count?: true
    fullcombo_count?: true
    pianistic_count?: true
    max_combo?: true
    grade_basic?: true
    grade_recital?: true
    user_id?: true
  }

  export type PlayDataSumAggregateInputType = {
    id?: true
    level?: true
    score?: true
    fc_type?: true
    play_count?: true
    fullcombo_count?: true
    pianistic_count?: true
    max_combo?: true
    grade_basic?: true
    grade_recital?: true
    user_id?: true
  }

  export type PlayDataMinAggregateInputType = {
    id?: true
    level?: true
    difficulty?: true
    score?: true
    rank?: true
    fc_type?: true
    play_count?: true
    fullcombo_count?: true
    pianistic_count?: true
    max_combo?: true
    grade_basic?: true
    grade_recital?: true
    besttime?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    music_idx?: true
  }

  export type PlayDataMaxAggregateInputType = {
    id?: true
    level?: true
    difficulty?: true
    score?: true
    rank?: true
    fc_type?: true
    play_count?: true
    fullcombo_count?: true
    pianistic_count?: true
    max_combo?: true
    grade_basic?: true
    grade_recital?: true
    besttime?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    music_idx?: true
  }

  export type PlayDataCountAggregateInputType = {
    id?: true
    level?: true
    difficulty?: true
    score?: true
    rank?: true
    fc_type?: true
    play_count?: true
    fullcombo_count?: true
    pianistic_count?: true
    max_combo?: true
    grade_basic?: true
    grade_recital?: true
    besttime?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    music_idx?: true
    _all?: true
  }

  export type PlayDataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlayData to aggregate.
     */
    where?: PlayDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayData to fetch.
     */
    orderBy?: PlayDataOrderByWithRelationInput | PlayDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlayDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PlayData
    **/
    _count?: true | PlayDataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlayDataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlayDataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlayDataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlayDataMaxAggregateInputType
  }

  export type GetPlayDataAggregateType<T extends PlayDataAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayData]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayData[P]>
      : GetScalarType<T[P], AggregatePlayData[P]>
  }




  export type PlayDataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayDataWhereInput
    orderBy?: PlayDataOrderByWithAggregationInput | PlayDataOrderByWithAggregationInput[]
    by: PlayDataScalarFieldEnum[] | PlayDataScalarFieldEnum
    having?: PlayDataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlayDataCountAggregateInputType | true
    _avg?: PlayDataAvgAggregateInputType
    _sum?: PlayDataSumAggregateInputType
    _min?: PlayDataMinAggregateInputType
    _max?: PlayDataMaxAggregateInputType
  }

  export type PlayDataGroupByOutputType = {
    id: number
    level: number
    difficulty: string
    score: number
    rank: string
    fc_type: number
    play_count: number
    fullcombo_count: number
    pianistic_count: number
    max_combo: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at: Date
    updated_at: Date
    user_id: number
    music_idx: string
    _count: PlayDataCountAggregateOutputType | null
    _avg: PlayDataAvgAggregateOutputType | null
    _sum: PlayDataSumAggregateOutputType | null
    _min: PlayDataMinAggregateOutputType | null
    _max: PlayDataMaxAggregateOutputType | null
  }

  type GetPlayDataGroupByPayload<T extends PlayDataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlayDataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlayDataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlayDataGroupByOutputType[P]>
            : GetScalarType<T[P], PlayDataGroupByOutputType[P]>
        }
      >
    >


  export type PlayDataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    level?: boolean
    difficulty?: boolean
    score?: boolean
    rank?: boolean
    fc_type?: boolean
    play_count?: boolean
    fullcombo_count?: boolean
    pianistic_count?: boolean
    max_combo?: boolean
    grade_basic?: boolean
    grade_recital?: boolean
    besttime?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playData"]>

  export type PlayDataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    level?: boolean
    difficulty?: boolean
    score?: boolean
    rank?: boolean
    fc_type?: boolean
    play_count?: boolean
    fullcombo_count?: boolean
    pianistic_count?: boolean
    max_combo?: boolean
    grade_basic?: boolean
    grade_recital?: boolean
    besttime?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playData"]>

  export type PlayDataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    level?: boolean
    difficulty?: boolean
    score?: boolean
    rank?: boolean
    fc_type?: boolean
    play_count?: boolean
    fullcombo_count?: boolean
    pianistic_count?: boolean
    max_combo?: boolean
    grade_basic?: boolean
    grade_recital?: boolean
    besttime?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playData"]>

  export type PlayDataSelectScalar = {
    id?: boolean
    level?: boolean
    difficulty?: boolean
    score?: boolean
    rank?: boolean
    fc_type?: boolean
    play_count?: boolean
    fullcombo_count?: boolean
    pianistic_count?: boolean
    max_combo?: boolean
    grade_basic?: boolean
    grade_recital?: boolean
    besttime?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    music_idx?: boolean
  }

  export type PlayDataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "level" | "difficulty" | "score" | "rank" | "fc_type" | "play_count" | "fullcombo_count" | "pianistic_count" | "max_combo" | "grade_basic" | "grade_recital" | "besttime" | "created_at" | "updated_at" | "user_id" | "music_idx", ExtArgs["result"]["playData"]>
  export type PlayDataInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }
  export type PlayDataIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }
  export type PlayDataIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    music?: boolean | MusicDefaultArgs<ExtArgs>
  }

  export type $PlayDataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PlayData"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      music: Prisma.$MusicPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      level: number
      difficulty: string
      score: number
      rank: string
      fc_type: number
      play_count: number
      fullcombo_count: number
      pianistic_count: number
      max_combo: number
      grade_basic: number
      grade_recital: number
      besttime: string
      created_at: Date
      updated_at: Date
      user_id: number
      music_idx: string
    }, ExtArgs["result"]["playData"]>
    composites: {}
  }

  type PlayDataGetPayload<S extends boolean | null | undefined | PlayDataDefaultArgs> = $Result.GetResult<Prisma.$PlayDataPayload, S>

  type PlayDataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlayDataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlayDataCountAggregateInputType | true
    }

  export interface PlayDataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PlayData'], meta: { name: 'PlayData' } }
    /**
     * Find zero or one PlayData that matches the filter.
     * @param {PlayDataFindUniqueArgs} args - Arguments to find a PlayData
     * @example
     * // Get one PlayData
     * const playData = await prisma.playData.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlayDataFindUniqueArgs>(args: SelectSubset<T, PlayDataFindUniqueArgs<ExtArgs>>): Prisma__PlayDataClient<$Result.GetResult<Prisma.$PlayDataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PlayData that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlayDataFindUniqueOrThrowArgs} args - Arguments to find a PlayData
     * @example
     * // Get one PlayData
     * const playData = await prisma.playData.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayDataFindUniqueOrThrowArgs>(args: SelectSubset<T, PlayDataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlayDataClient<$Result.GetResult<Prisma.$PlayDataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlayData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayDataFindFirstArgs} args - Arguments to find a PlayData
     * @example
     * // Get one PlayData
     * const playData = await prisma.playData.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlayDataFindFirstArgs>(args?: SelectSubset<T, PlayDataFindFirstArgs<ExtArgs>>): Prisma__PlayDataClient<$Result.GetResult<Prisma.$PlayDataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlayData that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayDataFindFirstOrThrowArgs} args - Arguments to find a PlayData
     * @example
     * // Get one PlayData
     * const playData = await prisma.playData.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayDataFindFirstOrThrowArgs>(args?: SelectSubset<T, PlayDataFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlayDataClient<$Result.GetResult<Prisma.$PlayDataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PlayData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayDataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlayData
     * const playData = await prisma.playData.findMany()
     * 
     * // Get first 10 PlayData
     * const playData = await prisma.playData.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const playDataWithIdOnly = await prisma.playData.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlayDataFindManyArgs>(args?: SelectSubset<T, PlayDataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PlayData.
     * @param {PlayDataCreateArgs} args - Arguments to create a PlayData.
     * @example
     * // Create one PlayData
     * const PlayData = await prisma.playData.create({
     *   data: {
     *     // ... data to create a PlayData
     *   }
     * })
     * 
     */
    create<T extends PlayDataCreateArgs>(args: SelectSubset<T, PlayDataCreateArgs<ExtArgs>>): Prisma__PlayDataClient<$Result.GetResult<Prisma.$PlayDataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PlayData.
     * @param {PlayDataCreateManyArgs} args - Arguments to create many PlayData.
     * @example
     * // Create many PlayData
     * const playData = await prisma.playData.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlayDataCreateManyArgs>(args?: SelectSubset<T, PlayDataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PlayData and returns the data saved in the database.
     * @param {PlayDataCreateManyAndReturnArgs} args - Arguments to create many PlayData.
     * @example
     * // Create many PlayData
     * const playData = await prisma.playData.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PlayData and only return the `id`
     * const playDataWithIdOnly = await prisma.playData.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlayDataCreateManyAndReturnArgs>(args?: SelectSubset<T, PlayDataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayDataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PlayData.
     * @param {PlayDataDeleteArgs} args - Arguments to delete one PlayData.
     * @example
     * // Delete one PlayData
     * const PlayData = await prisma.playData.delete({
     *   where: {
     *     // ... filter to delete one PlayData
     *   }
     * })
     * 
     */
    delete<T extends PlayDataDeleteArgs>(args: SelectSubset<T, PlayDataDeleteArgs<ExtArgs>>): Prisma__PlayDataClient<$Result.GetResult<Prisma.$PlayDataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PlayData.
     * @param {PlayDataUpdateArgs} args - Arguments to update one PlayData.
     * @example
     * // Update one PlayData
     * const playData = await prisma.playData.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlayDataUpdateArgs>(args: SelectSubset<T, PlayDataUpdateArgs<ExtArgs>>): Prisma__PlayDataClient<$Result.GetResult<Prisma.$PlayDataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PlayData.
     * @param {PlayDataDeleteManyArgs} args - Arguments to filter PlayData to delete.
     * @example
     * // Delete a few PlayData
     * const { count } = await prisma.playData.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlayDataDeleteManyArgs>(args?: SelectSubset<T, PlayDataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlayData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayDataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlayData
     * const playData = await prisma.playData.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlayDataUpdateManyArgs>(args: SelectSubset<T, PlayDataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlayData and returns the data updated in the database.
     * @param {PlayDataUpdateManyAndReturnArgs} args - Arguments to update many PlayData.
     * @example
     * // Update many PlayData
     * const playData = await prisma.playData.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PlayData and only return the `id`
     * const playDataWithIdOnly = await prisma.playData.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlayDataUpdateManyAndReturnArgs>(args: SelectSubset<T, PlayDataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayDataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PlayData.
     * @param {PlayDataUpsertArgs} args - Arguments to update or create a PlayData.
     * @example
     * // Update or create a PlayData
     * const playData = await prisma.playData.upsert({
     *   create: {
     *     // ... data to create a PlayData
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlayData we want to update
     *   }
     * })
     */
    upsert<T extends PlayDataUpsertArgs>(args: SelectSubset<T, PlayDataUpsertArgs<ExtArgs>>): Prisma__PlayDataClient<$Result.GetResult<Prisma.$PlayDataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PlayData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayDataCountArgs} args - Arguments to filter PlayData to count.
     * @example
     * // Count the number of PlayData
     * const count = await prisma.playData.count({
     *   where: {
     *     // ... the filter for the PlayData we want to count
     *   }
     * })
    **/
    count<T extends PlayDataCountArgs>(
      args?: Subset<T, PlayDataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlayDataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PlayData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayDataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlayDataAggregateArgs>(args: Subset<T, PlayDataAggregateArgs>): Prisma.PrismaPromise<GetPlayDataAggregateType<T>>

    /**
     * Group by PlayData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayDataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlayDataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlayDataGroupByArgs['orderBy'] }
        : { orderBy?: PlayDataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlayDataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayDataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PlayData model
   */
  readonly fields: PlayDataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PlayData.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlayDataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    music<T extends MusicDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MusicDefaultArgs<ExtArgs>>): Prisma__MusicClient<$Result.GetResult<Prisma.$MusicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PlayData model
   */
  interface PlayDataFieldRefs {
    readonly id: FieldRef<"PlayData", 'Int'>
    readonly level: FieldRef<"PlayData", 'Int'>
    readonly difficulty: FieldRef<"PlayData", 'String'>
    readonly score: FieldRef<"PlayData", 'Int'>
    readonly rank: FieldRef<"PlayData", 'String'>
    readonly fc_type: FieldRef<"PlayData", 'Int'>
    readonly play_count: FieldRef<"PlayData", 'Int'>
    readonly fullcombo_count: FieldRef<"PlayData", 'Int'>
    readonly pianistic_count: FieldRef<"PlayData", 'Int'>
    readonly max_combo: FieldRef<"PlayData", 'Int'>
    readonly grade_basic: FieldRef<"PlayData", 'Int'>
    readonly grade_recital: FieldRef<"PlayData", 'Int'>
    readonly besttime: FieldRef<"PlayData", 'String'>
    readonly created_at: FieldRef<"PlayData", 'DateTime'>
    readonly updated_at: FieldRef<"PlayData", 'DateTime'>
    readonly user_id: FieldRef<"PlayData", 'Int'>
    readonly music_idx: FieldRef<"PlayData", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PlayData findUnique
   */
  export type PlayDataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayData
     */
    select?: PlayDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayData
     */
    omit?: PlayDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayDataInclude<ExtArgs> | null
    /**
     * Filter, which PlayData to fetch.
     */
    where: PlayDataWhereUniqueInput
  }

  /**
   * PlayData findUniqueOrThrow
   */
  export type PlayDataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayData
     */
    select?: PlayDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayData
     */
    omit?: PlayDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayDataInclude<ExtArgs> | null
    /**
     * Filter, which PlayData to fetch.
     */
    where: PlayDataWhereUniqueInput
  }

  /**
   * PlayData findFirst
   */
  export type PlayDataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayData
     */
    select?: PlayDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayData
     */
    omit?: PlayDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayDataInclude<ExtArgs> | null
    /**
     * Filter, which PlayData to fetch.
     */
    where?: PlayDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayData to fetch.
     */
    orderBy?: PlayDataOrderByWithRelationInput | PlayDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlayData.
     */
    cursor?: PlayDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlayData.
     */
    distinct?: PlayDataScalarFieldEnum | PlayDataScalarFieldEnum[]
  }

  /**
   * PlayData findFirstOrThrow
   */
  export type PlayDataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayData
     */
    select?: PlayDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayData
     */
    omit?: PlayDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayDataInclude<ExtArgs> | null
    /**
     * Filter, which PlayData to fetch.
     */
    where?: PlayDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayData to fetch.
     */
    orderBy?: PlayDataOrderByWithRelationInput | PlayDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlayData.
     */
    cursor?: PlayDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlayData.
     */
    distinct?: PlayDataScalarFieldEnum | PlayDataScalarFieldEnum[]
  }

  /**
   * PlayData findMany
   */
  export type PlayDataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayData
     */
    select?: PlayDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayData
     */
    omit?: PlayDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayDataInclude<ExtArgs> | null
    /**
     * Filter, which PlayData to fetch.
     */
    where?: PlayDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayData to fetch.
     */
    orderBy?: PlayDataOrderByWithRelationInput | PlayDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PlayData.
     */
    cursor?: PlayDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayData.
     */
    skip?: number
    distinct?: PlayDataScalarFieldEnum | PlayDataScalarFieldEnum[]
  }

  /**
   * PlayData create
   */
  export type PlayDataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayData
     */
    select?: PlayDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayData
     */
    omit?: PlayDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayDataInclude<ExtArgs> | null
    /**
     * The data needed to create a PlayData.
     */
    data: XOR<PlayDataCreateInput, PlayDataUncheckedCreateInput>
  }

  /**
   * PlayData createMany
   */
  export type PlayDataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlayData.
     */
    data: PlayDataCreateManyInput | PlayDataCreateManyInput[]
  }

  /**
   * PlayData createManyAndReturn
   */
  export type PlayDataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayData
     */
    select?: PlayDataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlayData
     */
    omit?: PlayDataOmit<ExtArgs> | null
    /**
     * The data used to create many PlayData.
     */
    data: PlayDataCreateManyInput | PlayDataCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayDataIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlayData update
   */
  export type PlayDataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayData
     */
    select?: PlayDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayData
     */
    omit?: PlayDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayDataInclude<ExtArgs> | null
    /**
     * The data needed to update a PlayData.
     */
    data: XOR<PlayDataUpdateInput, PlayDataUncheckedUpdateInput>
    /**
     * Choose, which PlayData to update.
     */
    where: PlayDataWhereUniqueInput
  }

  /**
   * PlayData updateMany
   */
  export type PlayDataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PlayData.
     */
    data: XOR<PlayDataUpdateManyMutationInput, PlayDataUncheckedUpdateManyInput>
    /**
     * Filter which PlayData to update
     */
    where?: PlayDataWhereInput
    /**
     * Limit how many PlayData to update.
     */
    limit?: number
  }

  /**
   * PlayData updateManyAndReturn
   */
  export type PlayDataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayData
     */
    select?: PlayDataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlayData
     */
    omit?: PlayDataOmit<ExtArgs> | null
    /**
     * The data used to update PlayData.
     */
    data: XOR<PlayDataUpdateManyMutationInput, PlayDataUncheckedUpdateManyInput>
    /**
     * Filter which PlayData to update
     */
    where?: PlayDataWhereInput
    /**
     * Limit how many PlayData to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayDataIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlayData upsert
   */
  export type PlayDataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayData
     */
    select?: PlayDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayData
     */
    omit?: PlayDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayDataInclude<ExtArgs> | null
    /**
     * The filter to search for the PlayData to update in case it exists.
     */
    where: PlayDataWhereUniqueInput
    /**
     * In case the PlayData found by the `where` argument doesn't exist, create a new PlayData with this data.
     */
    create: XOR<PlayDataCreateInput, PlayDataUncheckedCreateInput>
    /**
     * In case the PlayData was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlayDataUpdateInput, PlayDataUncheckedUpdateInput>
  }

  /**
   * PlayData delete
   */
  export type PlayDataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayData
     */
    select?: PlayDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayData
     */
    omit?: PlayDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayDataInclude<ExtArgs> | null
    /**
     * Filter which PlayData to delete.
     */
    where: PlayDataWhereUniqueInput
  }

  /**
   * PlayData deleteMany
   */
  export type PlayDataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlayData to delete
     */
    where?: PlayDataWhereInput
    /**
     * Limit how many PlayData to delete.
     */
    limit?: number
  }

  /**
   * PlayData without action
   */
  export type PlayDataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayData
     */
    select?: PlayDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayData
     */
    omit?: PlayDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayDataInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    kakao_id: 'kakao_id',
    discord_name: 'discord_name',
    discord_tag: 'discord_tag',
    avatar: 'avatar',
    country: 'country',
    rank_basic: 'rank_basic',
    rank_recital: 'rank_recital',
    rank_basic_country: 'rank_basic_country',
    rank_recital_country: 'rank_recital_country',
    play_count: 'play_count',
    score_p: 'score_p',
    score_f: 'score_f',
    score_s: 'score_s',
    score_a2: 'score_a2',
    score_a: 'score_a',
    score_b2: 'score_b2',
    score_b: 'score_b',
    score_c: 'score_c',
    score_d: 'score_d',
    role: 'role',
    grade_basic: 'grade_basic',
    grade_recital: 'grade_recital',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const BookmarkScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    music_id: 'music_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type BookmarkScalarFieldEnum = (typeof BookmarkScalarFieldEnum)[keyof typeof BookmarkScalarFieldEnum]


  export const MusicScalarFieldEnum: {
    id: 'id',
    index: 'index',
    title: 'title',
    title_kana: 'title_kana',
    artist: 'artist',
    category: 'category',
    category_short: 'category_short',
    description: 'description',
    background: 'background',
    sheet_len: 'sheet_len',
    difficulty_levels: 'difficulty_levels',
    difficulty_name: 'difficulty_name',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type MusicScalarFieldEnum = (typeof MusicScalarFieldEnum)[keyof typeof MusicScalarFieldEnum]


  export const RecentPlayScalarFieldEnum: {
    id: 'id',
    difficulty: 'difficulty',
    level: 'level',
    score: 'score',
    max_combo: 'max_combo',
    rank: 'rank',
    play_time: 'play_time',
    grade_basic: 'grade_basic',
    created_at: 'created_at',
    updated_at: 'updated_at',
    user_id: 'user_id',
    music_idx: 'music_idx'
  };

  export type RecentPlayScalarFieldEnum = (typeof RecentPlayScalarFieldEnum)[keyof typeof RecentPlayScalarFieldEnum]


  export const UserBestGradeScalarFieldEnum: {
    id: 'id',
    grade_basic: 'grade_basic',
    grade_recital: 'grade_recital',
    besttime: 'besttime',
    created_at: 'created_at',
    updated_at: 'updated_at',
    user_id: 'user_id'
  };

  export type UserBestGradeScalarFieldEnum = (typeof UserBestGradeScalarFieldEnum)[keyof typeof UserBestGradeScalarFieldEnum]


  export const BasicBestPlayScalarFieldEnum: {
    id: 'id',
    difficulty: 'difficulty',
    level: 'level',
    score: 'score',
    max_combo: 'max_combo',
    rank: 'rank',
    besttime: 'besttime',
    grade_basic: 'grade_basic',
    fc_type: 'fc_type',
    created_at: 'created_at',
    updated_at: 'updated_at',
    user_id: 'user_id',
    music_idx: 'music_idx'
  };

  export type BasicBestPlayScalarFieldEnum = (typeof BasicBestPlayScalarFieldEnum)[keyof typeof BasicBestPlayScalarFieldEnum]


  export const RecitalBestPlayScalarFieldEnum: {
    id: 'id',
    difficulty: 'difficulty',
    level: 'level',
    score: 'score',
    max_combo: 'max_combo',
    rank: 'rank',
    besttime: 'besttime',
    grade_recital: 'grade_recital',
    fc_type: 'fc_type',
    created_at: 'created_at',
    updated_at: 'updated_at',
    user_id: 'user_id',
    music_idx: 'music_idx'
  };

  export type RecitalBestPlayScalarFieldEnum = (typeof RecitalBestPlayScalarFieldEnum)[keyof typeof RecitalBestPlayScalarFieldEnum]


  export const PlayDataScalarFieldEnum: {
    id: 'id',
    level: 'level',
    difficulty: 'difficulty',
    score: 'score',
    rank: 'rank',
    fc_type: 'fc_type',
    play_count: 'play_count',
    fullcombo_count: 'fullcombo_count',
    pianistic_count: 'pianistic_count',
    max_combo: 'max_combo',
    grade_basic: 'grade_basic',
    grade_recital: 'grade_recital',
    besttime: 'besttime',
    created_at: 'created_at',
    updated_at: 'updated_at',
    user_id: 'user_id',
    music_idx: 'music_idx'
  };

  export type PlayDataScalarFieldEnum = (typeof PlayDataScalarFieldEnum)[keyof typeof PlayDataScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    username?: StringNullableFilter<"User"> | string | null
    kakao_id?: BigIntNullableFilter<"User"> | bigint | number | null
    discord_name?: StringNullableFilter<"User"> | string | null
    discord_tag?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    country?: StringFilter<"User"> | string
    rank_basic?: IntNullableFilter<"User"> | number | null
    rank_recital?: IntNullableFilter<"User"> | number | null
    rank_basic_country?: IntNullableFilter<"User"> | number | null
    rank_recital_country?: IntNullableFilter<"User"> | number | null
    play_count?: IntNullableFilter<"User"> | number | null
    score_p?: IntNullableFilter<"User"> | number | null
    score_f?: IntNullableFilter<"User"> | number | null
    score_s?: IntNullableFilter<"User"> | number | null
    score_a2?: IntNullableFilter<"User"> | number | null
    score_a?: IntNullableFilter<"User"> | number | null
    score_b2?: IntNullableFilter<"User"> | number | null
    score_b?: IntNullableFilter<"User"> | number | null
    score_c?: IntNullableFilter<"User"> | number | null
    score_d?: IntNullableFilter<"User"> | number | null
    role?: StringFilter<"User"> | string
    grade_basic?: IntNullableFilter<"User"> | number | null
    grade_recital?: IntNullableFilter<"User"> | number | null
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    PlayHistory?: RecentPlayListRelationFilter
    PlayData?: PlayDataListRelationFilter
    Bookmark?: BookmarkListRelationFilter
    BasicBestPlay?: BasicBestPlayListRelationFilter
    RecitalBestPlay?: RecitalBestPlayListRelationFilter
    UserBestGrade?: UserBestGradeListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrderInput | SortOrder
    kakao_id?: SortOrderInput | SortOrder
    discord_name?: SortOrderInput | SortOrder
    discord_tag?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    country?: SortOrder
    rank_basic?: SortOrderInput | SortOrder
    rank_recital?: SortOrderInput | SortOrder
    rank_basic_country?: SortOrderInput | SortOrder
    rank_recital_country?: SortOrderInput | SortOrder
    play_count?: SortOrderInput | SortOrder
    score_p?: SortOrderInput | SortOrder
    score_f?: SortOrderInput | SortOrder
    score_s?: SortOrderInput | SortOrder
    score_a2?: SortOrderInput | SortOrder
    score_a?: SortOrderInput | SortOrder
    score_b2?: SortOrderInput | SortOrder
    score_b?: SortOrderInput | SortOrder
    score_c?: SortOrderInput | SortOrder
    score_d?: SortOrderInput | SortOrder
    role?: SortOrder
    grade_basic?: SortOrderInput | SortOrder
    grade_recital?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    PlayHistory?: RecentPlayOrderByRelationAggregateInput
    PlayData?: PlayDataOrderByRelationAggregateInput
    Bookmark?: BookmarkOrderByRelationAggregateInput
    BasicBestPlay?: BasicBestPlayOrderByRelationAggregateInput
    RecitalBestPlay?: RecitalBestPlayOrderByRelationAggregateInput
    UserBestGrade?: UserBestGradeOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    username?: string
    kakao_id?: bigint | number
    discord_name?: string
    discord_tag?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    avatar?: StringNullableFilter<"User"> | string | null
    country?: StringFilter<"User"> | string
    rank_basic?: IntNullableFilter<"User"> | number | null
    rank_recital?: IntNullableFilter<"User"> | number | null
    rank_basic_country?: IntNullableFilter<"User"> | number | null
    rank_recital_country?: IntNullableFilter<"User"> | number | null
    play_count?: IntNullableFilter<"User"> | number | null
    score_p?: IntNullableFilter<"User"> | number | null
    score_f?: IntNullableFilter<"User"> | number | null
    score_s?: IntNullableFilter<"User"> | number | null
    score_a2?: IntNullableFilter<"User"> | number | null
    score_a?: IntNullableFilter<"User"> | number | null
    score_b2?: IntNullableFilter<"User"> | number | null
    score_b?: IntNullableFilter<"User"> | number | null
    score_c?: IntNullableFilter<"User"> | number | null
    score_d?: IntNullableFilter<"User"> | number | null
    role?: StringFilter<"User"> | string
    grade_basic?: IntNullableFilter<"User"> | number | null
    grade_recital?: IntNullableFilter<"User"> | number | null
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    PlayHistory?: RecentPlayListRelationFilter
    PlayData?: PlayDataListRelationFilter
    Bookmark?: BookmarkListRelationFilter
    BasicBestPlay?: BasicBestPlayListRelationFilter
    RecitalBestPlay?: RecitalBestPlayListRelationFilter
    UserBestGrade?: UserBestGradeListRelationFilter
  }, "id" | "username" | "kakao_id" | "discord_name" | "discord_tag">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrderInput | SortOrder
    kakao_id?: SortOrderInput | SortOrder
    discord_name?: SortOrderInput | SortOrder
    discord_tag?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    country?: SortOrder
    rank_basic?: SortOrderInput | SortOrder
    rank_recital?: SortOrderInput | SortOrder
    rank_basic_country?: SortOrderInput | SortOrder
    rank_recital_country?: SortOrderInput | SortOrder
    play_count?: SortOrderInput | SortOrder
    score_p?: SortOrderInput | SortOrder
    score_f?: SortOrderInput | SortOrder
    score_s?: SortOrderInput | SortOrder
    score_a2?: SortOrderInput | SortOrder
    score_a?: SortOrderInput | SortOrder
    score_b2?: SortOrderInput | SortOrder
    score_b?: SortOrderInput | SortOrder
    score_c?: SortOrderInput | SortOrder
    score_d?: SortOrderInput | SortOrder
    role?: SortOrder
    grade_basic?: SortOrderInput | SortOrder
    grade_recital?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    kakao_id?: BigIntNullableWithAggregatesFilter<"User"> | bigint | number | null
    discord_name?: StringNullableWithAggregatesFilter<"User"> | string | null
    discord_tag?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    country?: StringWithAggregatesFilter<"User"> | string
    rank_basic?: IntNullableWithAggregatesFilter<"User"> | number | null
    rank_recital?: IntNullableWithAggregatesFilter<"User"> | number | null
    rank_basic_country?: IntNullableWithAggregatesFilter<"User"> | number | null
    rank_recital_country?: IntNullableWithAggregatesFilter<"User"> | number | null
    play_count?: IntNullableWithAggregatesFilter<"User"> | number | null
    score_p?: IntNullableWithAggregatesFilter<"User"> | number | null
    score_f?: IntNullableWithAggregatesFilter<"User"> | number | null
    score_s?: IntNullableWithAggregatesFilter<"User"> | number | null
    score_a2?: IntNullableWithAggregatesFilter<"User"> | number | null
    score_a?: IntNullableWithAggregatesFilter<"User"> | number | null
    score_b2?: IntNullableWithAggregatesFilter<"User"> | number | null
    score_b?: IntNullableWithAggregatesFilter<"User"> | number | null
    score_c?: IntNullableWithAggregatesFilter<"User"> | number | null
    score_d?: IntNullableWithAggregatesFilter<"User"> | number | null
    role?: StringWithAggregatesFilter<"User"> | string
    grade_basic?: IntNullableWithAggregatesFilter<"User"> | number | null
    grade_recital?: IntNullableWithAggregatesFilter<"User"> | number | null
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type BookmarkWhereInput = {
    AND?: BookmarkWhereInput | BookmarkWhereInput[]
    OR?: BookmarkWhereInput[]
    NOT?: BookmarkWhereInput | BookmarkWhereInput[]
    id?: IntFilter<"Bookmark"> | number
    user_id?: IntFilter<"Bookmark"> | number
    music_id?: IntFilter<"Bookmark"> | number
    created_at?: DateTimeFilter<"Bookmark"> | Date | string
    updated_at?: DateTimeFilter<"Bookmark"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    music?: XOR<MusicScalarRelationFilter, MusicWhereInput>
  }

  export type BookmarkOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    music_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user?: UserOrderByWithRelationInput
    music?: MusicOrderByWithRelationInput
  }

  export type BookmarkWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    user_id_music_id?: BookmarkUser_idMusic_idCompoundUniqueInput
    AND?: BookmarkWhereInput | BookmarkWhereInput[]
    OR?: BookmarkWhereInput[]
    NOT?: BookmarkWhereInput | BookmarkWhereInput[]
    user_id?: IntFilter<"Bookmark"> | number
    music_id?: IntFilter<"Bookmark"> | number
    created_at?: DateTimeFilter<"Bookmark"> | Date | string
    updated_at?: DateTimeFilter<"Bookmark"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    music?: XOR<MusicScalarRelationFilter, MusicWhereInput>
  }, "id" | "user_id_music_id">

  export type BookmarkOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    music_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: BookmarkCountOrderByAggregateInput
    _avg?: BookmarkAvgOrderByAggregateInput
    _max?: BookmarkMaxOrderByAggregateInput
    _min?: BookmarkMinOrderByAggregateInput
    _sum?: BookmarkSumOrderByAggregateInput
  }

  export type BookmarkScalarWhereWithAggregatesInput = {
    AND?: BookmarkScalarWhereWithAggregatesInput | BookmarkScalarWhereWithAggregatesInput[]
    OR?: BookmarkScalarWhereWithAggregatesInput[]
    NOT?: BookmarkScalarWhereWithAggregatesInput | BookmarkScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Bookmark"> | number
    user_id?: IntWithAggregatesFilter<"Bookmark"> | number
    music_id?: IntWithAggregatesFilter<"Bookmark"> | number
    created_at?: DateTimeWithAggregatesFilter<"Bookmark"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Bookmark"> | Date | string
  }

  export type MusicWhereInput = {
    AND?: MusicWhereInput | MusicWhereInput[]
    OR?: MusicWhereInput[]
    NOT?: MusicWhereInput | MusicWhereInput[]
    id?: IntFilter<"Music"> | number
    index?: StringFilter<"Music"> | string
    title?: StringFilter<"Music"> | string
    title_kana?: StringFilter<"Music"> | string
    artist?: StringNullableFilter<"Music"> | string | null
    category?: StringFilter<"Music"> | string
    category_short?: StringFilter<"Music"> | string
    description?: StringNullableFilter<"Music"> | string | null
    background?: StringNullableFilter<"Music"> | string | null
    sheet_len?: IntFilter<"Music"> | number
    difficulty_levels?: StringFilter<"Music"> | string
    difficulty_name?: StringFilter<"Music"> | string
    created_at?: DateTimeFilter<"Music"> | Date | string
    updated_at?: DateTimeFilter<"Music"> | Date | string
    RecentPlay?: RecentPlayListRelationFilter
    PlayData?: PlayDataListRelationFilter
    Bookmark?: BookmarkListRelationFilter
    BasicBestPlay?: BasicBestPlayListRelationFilter
    RecitalBestPlay?: RecitalBestPlayListRelationFilter
  }

  export type MusicOrderByWithRelationInput = {
    id?: SortOrder
    index?: SortOrder
    title?: SortOrder
    title_kana?: SortOrder
    artist?: SortOrderInput | SortOrder
    category?: SortOrder
    category_short?: SortOrder
    description?: SortOrderInput | SortOrder
    background?: SortOrderInput | SortOrder
    sheet_len?: SortOrder
    difficulty_levels?: SortOrder
    difficulty_name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    RecentPlay?: RecentPlayOrderByRelationAggregateInput
    PlayData?: PlayDataOrderByRelationAggregateInput
    Bookmark?: BookmarkOrderByRelationAggregateInput
    BasicBestPlay?: BasicBestPlayOrderByRelationAggregateInput
    RecitalBestPlay?: RecitalBestPlayOrderByRelationAggregateInput
  }

  export type MusicWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    index?: string
    AND?: MusicWhereInput | MusicWhereInput[]
    OR?: MusicWhereInput[]
    NOT?: MusicWhereInput | MusicWhereInput[]
    title?: StringFilter<"Music"> | string
    title_kana?: StringFilter<"Music"> | string
    artist?: StringNullableFilter<"Music"> | string | null
    category?: StringFilter<"Music"> | string
    category_short?: StringFilter<"Music"> | string
    description?: StringNullableFilter<"Music"> | string | null
    background?: StringNullableFilter<"Music"> | string | null
    sheet_len?: IntFilter<"Music"> | number
    difficulty_levels?: StringFilter<"Music"> | string
    difficulty_name?: StringFilter<"Music"> | string
    created_at?: DateTimeFilter<"Music"> | Date | string
    updated_at?: DateTimeFilter<"Music"> | Date | string
    RecentPlay?: RecentPlayListRelationFilter
    PlayData?: PlayDataListRelationFilter
    Bookmark?: BookmarkListRelationFilter
    BasicBestPlay?: BasicBestPlayListRelationFilter
    RecitalBestPlay?: RecitalBestPlayListRelationFilter
  }, "id" | "index">

  export type MusicOrderByWithAggregationInput = {
    id?: SortOrder
    index?: SortOrder
    title?: SortOrder
    title_kana?: SortOrder
    artist?: SortOrderInput | SortOrder
    category?: SortOrder
    category_short?: SortOrder
    description?: SortOrderInput | SortOrder
    background?: SortOrderInput | SortOrder
    sheet_len?: SortOrder
    difficulty_levels?: SortOrder
    difficulty_name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: MusicCountOrderByAggregateInput
    _avg?: MusicAvgOrderByAggregateInput
    _max?: MusicMaxOrderByAggregateInput
    _min?: MusicMinOrderByAggregateInput
    _sum?: MusicSumOrderByAggregateInput
  }

  export type MusicScalarWhereWithAggregatesInput = {
    AND?: MusicScalarWhereWithAggregatesInput | MusicScalarWhereWithAggregatesInput[]
    OR?: MusicScalarWhereWithAggregatesInput[]
    NOT?: MusicScalarWhereWithAggregatesInput | MusicScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Music"> | number
    index?: StringWithAggregatesFilter<"Music"> | string
    title?: StringWithAggregatesFilter<"Music"> | string
    title_kana?: StringWithAggregatesFilter<"Music"> | string
    artist?: StringNullableWithAggregatesFilter<"Music"> | string | null
    category?: StringWithAggregatesFilter<"Music"> | string
    category_short?: StringWithAggregatesFilter<"Music"> | string
    description?: StringNullableWithAggregatesFilter<"Music"> | string | null
    background?: StringNullableWithAggregatesFilter<"Music"> | string | null
    sheet_len?: IntWithAggregatesFilter<"Music"> | number
    difficulty_levels?: StringWithAggregatesFilter<"Music"> | string
    difficulty_name?: StringWithAggregatesFilter<"Music"> | string
    created_at?: DateTimeWithAggregatesFilter<"Music"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Music"> | Date | string
  }

  export type RecentPlayWhereInput = {
    AND?: RecentPlayWhereInput | RecentPlayWhereInput[]
    OR?: RecentPlayWhereInput[]
    NOT?: RecentPlayWhereInput | RecentPlayWhereInput[]
    id?: IntFilter<"RecentPlay"> | number
    difficulty?: StringFilter<"RecentPlay"> | string
    level?: IntFilter<"RecentPlay"> | number
    score?: IntFilter<"RecentPlay"> | number
    max_combo?: IntFilter<"RecentPlay"> | number
    rank?: StringFilter<"RecentPlay"> | string
    play_time?: StringFilter<"RecentPlay"> | string
    grade_basic?: IntFilter<"RecentPlay"> | number
    created_at?: DateTimeFilter<"RecentPlay"> | Date | string
    updated_at?: DateTimeFilter<"RecentPlay"> | Date | string
    user_id?: IntFilter<"RecentPlay"> | number
    music_idx?: StringFilter<"RecentPlay"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    music?: XOR<MusicScalarRelationFilter, MusicWhereInput>
  }

  export type RecentPlayOrderByWithRelationInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    play_time?: SortOrder
    grade_basic?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
    user?: UserOrderByWithRelationInput
    music?: MusicOrderByWithRelationInput
  }

  export type RecentPlayWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RecentPlayWhereInput | RecentPlayWhereInput[]
    OR?: RecentPlayWhereInput[]
    NOT?: RecentPlayWhereInput | RecentPlayWhereInput[]
    difficulty?: StringFilter<"RecentPlay"> | string
    level?: IntFilter<"RecentPlay"> | number
    score?: IntFilter<"RecentPlay"> | number
    max_combo?: IntFilter<"RecentPlay"> | number
    rank?: StringFilter<"RecentPlay"> | string
    play_time?: StringFilter<"RecentPlay"> | string
    grade_basic?: IntFilter<"RecentPlay"> | number
    created_at?: DateTimeFilter<"RecentPlay"> | Date | string
    updated_at?: DateTimeFilter<"RecentPlay"> | Date | string
    user_id?: IntFilter<"RecentPlay"> | number
    music_idx?: StringFilter<"RecentPlay"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    music?: XOR<MusicScalarRelationFilter, MusicWhereInput>
  }, "id">

  export type RecentPlayOrderByWithAggregationInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    play_time?: SortOrder
    grade_basic?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
    _count?: RecentPlayCountOrderByAggregateInput
    _avg?: RecentPlayAvgOrderByAggregateInput
    _max?: RecentPlayMaxOrderByAggregateInput
    _min?: RecentPlayMinOrderByAggregateInput
    _sum?: RecentPlaySumOrderByAggregateInput
  }

  export type RecentPlayScalarWhereWithAggregatesInput = {
    AND?: RecentPlayScalarWhereWithAggregatesInput | RecentPlayScalarWhereWithAggregatesInput[]
    OR?: RecentPlayScalarWhereWithAggregatesInput[]
    NOT?: RecentPlayScalarWhereWithAggregatesInput | RecentPlayScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RecentPlay"> | number
    difficulty?: StringWithAggregatesFilter<"RecentPlay"> | string
    level?: IntWithAggregatesFilter<"RecentPlay"> | number
    score?: IntWithAggregatesFilter<"RecentPlay"> | number
    max_combo?: IntWithAggregatesFilter<"RecentPlay"> | number
    rank?: StringWithAggregatesFilter<"RecentPlay"> | string
    play_time?: StringWithAggregatesFilter<"RecentPlay"> | string
    grade_basic?: IntWithAggregatesFilter<"RecentPlay"> | number
    created_at?: DateTimeWithAggregatesFilter<"RecentPlay"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"RecentPlay"> | Date | string
    user_id?: IntWithAggregatesFilter<"RecentPlay"> | number
    music_idx?: StringWithAggregatesFilter<"RecentPlay"> | string
  }

  export type UserBestGradeWhereInput = {
    AND?: UserBestGradeWhereInput | UserBestGradeWhereInput[]
    OR?: UserBestGradeWhereInput[]
    NOT?: UserBestGradeWhereInput | UserBestGradeWhereInput[]
    id?: IntFilter<"UserBestGrade"> | number
    grade_basic?: IntFilter<"UserBestGrade"> | number
    grade_recital?: IntFilter<"UserBestGrade"> | number
    besttime?: StringFilter<"UserBestGrade"> | string
    created_at?: DateTimeFilter<"UserBestGrade"> | Date | string
    updated_at?: DateTimeFilter<"UserBestGrade"> | Date | string
    user_id?: IntFilter<"UserBestGrade"> | number
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserBestGradeOrderByWithRelationInput = {
    id?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    besttime?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserBestGradeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: UserBestGradeWhereInput | UserBestGradeWhereInput[]
    OR?: UserBestGradeWhereInput[]
    NOT?: UserBestGradeWhereInput | UserBestGradeWhereInput[]
    grade_basic?: IntFilter<"UserBestGrade"> | number
    grade_recital?: IntFilter<"UserBestGrade"> | number
    besttime?: StringFilter<"UserBestGrade"> | string
    created_at?: DateTimeFilter<"UserBestGrade"> | Date | string
    updated_at?: DateTimeFilter<"UserBestGrade"> | Date | string
    user_id?: IntFilter<"UserBestGrade"> | number
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type UserBestGradeOrderByWithAggregationInput = {
    id?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    besttime?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    _count?: UserBestGradeCountOrderByAggregateInput
    _avg?: UserBestGradeAvgOrderByAggregateInput
    _max?: UserBestGradeMaxOrderByAggregateInput
    _min?: UserBestGradeMinOrderByAggregateInput
    _sum?: UserBestGradeSumOrderByAggregateInput
  }

  export type UserBestGradeScalarWhereWithAggregatesInput = {
    AND?: UserBestGradeScalarWhereWithAggregatesInput | UserBestGradeScalarWhereWithAggregatesInput[]
    OR?: UserBestGradeScalarWhereWithAggregatesInput[]
    NOT?: UserBestGradeScalarWhereWithAggregatesInput | UserBestGradeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UserBestGrade"> | number
    grade_basic?: IntWithAggregatesFilter<"UserBestGrade"> | number
    grade_recital?: IntWithAggregatesFilter<"UserBestGrade"> | number
    besttime?: StringWithAggregatesFilter<"UserBestGrade"> | string
    created_at?: DateTimeWithAggregatesFilter<"UserBestGrade"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"UserBestGrade"> | Date | string
    user_id?: IntWithAggregatesFilter<"UserBestGrade"> | number
  }

  export type BasicBestPlayWhereInput = {
    AND?: BasicBestPlayWhereInput | BasicBestPlayWhereInput[]
    OR?: BasicBestPlayWhereInput[]
    NOT?: BasicBestPlayWhereInput | BasicBestPlayWhereInput[]
    id?: IntFilter<"BasicBestPlay"> | number
    difficulty?: StringFilter<"BasicBestPlay"> | string
    level?: IntFilter<"BasicBestPlay"> | number
    score?: IntFilter<"BasicBestPlay"> | number
    max_combo?: IntFilter<"BasicBestPlay"> | number
    rank?: StringFilter<"BasicBestPlay"> | string
    besttime?: StringFilter<"BasicBestPlay"> | string
    grade_basic?: IntFilter<"BasicBestPlay"> | number
    fc_type?: IntFilter<"BasicBestPlay"> | number
    created_at?: DateTimeFilter<"BasicBestPlay"> | Date | string
    updated_at?: DateTimeFilter<"BasicBestPlay"> | Date | string
    user_id?: IntFilter<"BasicBestPlay"> | number
    music_idx?: StringFilter<"BasicBestPlay"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    music?: XOR<MusicScalarRelationFilter, MusicWhereInput>
  }

  export type BasicBestPlayOrderByWithRelationInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    besttime?: SortOrder
    grade_basic?: SortOrder
    fc_type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
    user?: UserOrderByWithRelationInput
    music?: MusicOrderByWithRelationInput
  }

  export type BasicBestPlayWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: BasicBestPlayWhereInput | BasicBestPlayWhereInput[]
    OR?: BasicBestPlayWhereInput[]
    NOT?: BasicBestPlayWhereInput | BasicBestPlayWhereInput[]
    difficulty?: StringFilter<"BasicBestPlay"> | string
    level?: IntFilter<"BasicBestPlay"> | number
    score?: IntFilter<"BasicBestPlay"> | number
    max_combo?: IntFilter<"BasicBestPlay"> | number
    rank?: StringFilter<"BasicBestPlay"> | string
    besttime?: StringFilter<"BasicBestPlay"> | string
    grade_basic?: IntFilter<"BasicBestPlay"> | number
    fc_type?: IntFilter<"BasicBestPlay"> | number
    created_at?: DateTimeFilter<"BasicBestPlay"> | Date | string
    updated_at?: DateTimeFilter<"BasicBestPlay"> | Date | string
    user_id?: IntFilter<"BasicBestPlay"> | number
    music_idx?: StringFilter<"BasicBestPlay"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    music?: XOR<MusicScalarRelationFilter, MusicWhereInput>
  }, "id">

  export type BasicBestPlayOrderByWithAggregationInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    besttime?: SortOrder
    grade_basic?: SortOrder
    fc_type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
    _count?: BasicBestPlayCountOrderByAggregateInput
    _avg?: BasicBestPlayAvgOrderByAggregateInput
    _max?: BasicBestPlayMaxOrderByAggregateInput
    _min?: BasicBestPlayMinOrderByAggregateInput
    _sum?: BasicBestPlaySumOrderByAggregateInput
  }

  export type BasicBestPlayScalarWhereWithAggregatesInput = {
    AND?: BasicBestPlayScalarWhereWithAggregatesInput | BasicBestPlayScalarWhereWithAggregatesInput[]
    OR?: BasicBestPlayScalarWhereWithAggregatesInput[]
    NOT?: BasicBestPlayScalarWhereWithAggregatesInput | BasicBestPlayScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"BasicBestPlay"> | number
    difficulty?: StringWithAggregatesFilter<"BasicBestPlay"> | string
    level?: IntWithAggregatesFilter<"BasicBestPlay"> | number
    score?: IntWithAggregatesFilter<"BasicBestPlay"> | number
    max_combo?: IntWithAggregatesFilter<"BasicBestPlay"> | number
    rank?: StringWithAggregatesFilter<"BasicBestPlay"> | string
    besttime?: StringWithAggregatesFilter<"BasicBestPlay"> | string
    grade_basic?: IntWithAggregatesFilter<"BasicBestPlay"> | number
    fc_type?: IntWithAggregatesFilter<"BasicBestPlay"> | number
    created_at?: DateTimeWithAggregatesFilter<"BasicBestPlay"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"BasicBestPlay"> | Date | string
    user_id?: IntWithAggregatesFilter<"BasicBestPlay"> | number
    music_idx?: StringWithAggregatesFilter<"BasicBestPlay"> | string
  }

  export type RecitalBestPlayWhereInput = {
    AND?: RecitalBestPlayWhereInput | RecitalBestPlayWhereInput[]
    OR?: RecitalBestPlayWhereInput[]
    NOT?: RecitalBestPlayWhereInput | RecitalBestPlayWhereInput[]
    id?: IntFilter<"RecitalBestPlay"> | number
    difficulty?: StringFilter<"RecitalBestPlay"> | string
    level?: IntFilter<"RecitalBestPlay"> | number
    score?: IntFilter<"RecitalBestPlay"> | number
    max_combo?: IntFilter<"RecitalBestPlay"> | number
    rank?: StringFilter<"RecitalBestPlay"> | string
    besttime?: StringFilter<"RecitalBestPlay"> | string
    grade_recital?: IntFilter<"RecitalBestPlay"> | number
    fc_type?: IntFilter<"RecitalBestPlay"> | number
    created_at?: DateTimeFilter<"RecitalBestPlay"> | Date | string
    updated_at?: DateTimeFilter<"RecitalBestPlay"> | Date | string
    user_id?: IntFilter<"RecitalBestPlay"> | number
    music_idx?: StringFilter<"RecitalBestPlay"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    music?: XOR<MusicScalarRelationFilter, MusicWhereInput>
  }

  export type RecitalBestPlayOrderByWithRelationInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    besttime?: SortOrder
    grade_recital?: SortOrder
    fc_type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
    user?: UserOrderByWithRelationInput
    music?: MusicOrderByWithRelationInput
  }

  export type RecitalBestPlayWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RecitalBestPlayWhereInput | RecitalBestPlayWhereInput[]
    OR?: RecitalBestPlayWhereInput[]
    NOT?: RecitalBestPlayWhereInput | RecitalBestPlayWhereInput[]
    difficulty?: StringFilter<"RecitalBestPlay"> | string
    level?: IntFilter<"RecitalBestPlay"> | number
    score?: IntFilter<"RecitalBestPlay"> | number
    max_combo?: IntFilter<"RecitalBestPlay"> | number
    rank?: StringFilter<"RecitalBestPlay"> | string
    besttime?: StringFilter<"RecitalBestPlay"> | string
    grade_recital?: IntFilter<"RecitalBestPlay"> | number
    fc_type?: IntFilter<"RecitalBestPlay"> | number
    created_at?: DateTimeFilter<"RecitalBestPlay"> | Date | string
    updated_at?: DateTimeFilter<"RecitalBestPlay"> | Date | string
    user_id?: IntFilter<"RecitalBestPlay"> | number
    music_idx?: StringFilter<"RecitalBestPlay"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    music?: XOR<MusicScalarRelationFilter, MusicWhereInput>
  }, "id">

  export type RecitalBestPlayOrderByWithAggregationInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    besttime?: SortOrder
    grade_recital?: SortOrder
    fc_type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
    _count?: RecitalBestPlayCountOrderByAggregateInput
    _avg?: RecitalBestPlayAvgOrderByAggregateInput
    _max?: RecitalBestPlayMaxOrderByAggregateInput
    _min?: RecitalBestPlayMinOrderByAggregateInput
    _sum?: RecitalBestPlaySumOrderByAggregateInput
  }

  export type RecitalBestPlayScalarWhereWithAggregatesInput = {
    AND?: RecitalBestPlayScalarWhereWithAggregatesInput | RecitalBestPlayScalarWhereWithAggregatesInput[]
    OR?: RecitalBestPlayScalarWhereWithAggregatesInput[]
    NOT?: RecitalBestPlayScalarWhereWithAggregatesInput | RecitalBestPlayScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RecitalBestPlay"> | number
    difficulty?: StringWithAggregatesFilter<"RecitalBestPlay"> | string
    level?: IntWithAggregatesFilter<"RecitalBestPlay"> | number
    score?: IntWithAggregatesFilter<"RecitalBestPlay"> | number
    max_combo?: IntWithAggregatesFilter<"RecitalBestPlay"> | number
    rank?: StringWithAggregatesFilter<"RecitalBestPlay"> | string
    besttime?: StringWithAggregatesFilter<"RecitalBestPlay"> | string
    grade_recital?: IntWithAggregatesFilter<"RecitalBestPlay"> | number
    fc_type?: IntWithAggregatesFilter<"RecitalBestPlay"> | number
    created_at?: DateTimeWithAggregatesFilter<"RecitalBestPlay"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"RecitalBestPlay"> | Date | string
    user_id?: IntWithAggregatesFilter<"RecitalBestPlay"> | number
    music_idx?: StringWithAggregatesFilter<"RecitalBestPlay"> | string
  }

  export type PlayDataWhereInput = {
    AND?: PlayDataWhereInput | PlayDataWhereInput[]
    OR?: PlayDataWhereInput[]
    NOT?: PlayDataWhereInput | PlayDataWhereInput[]
    id?: IntFilter<"PlayData"> | number
    level?: IntFilter<"PlayData"> | number
    difficulty?: StringFilter<"PlayData"> | string
    score?: IntFilter<"PlayData"> | number
    rank?: StringFilter<"PlayData"> | string
    fc_type?: IntFilter<"PlayData"> | number
    play_count?: IntFilter<"PlayData"> | number
    fullcombo_count?: IntFilter<"PlayData"> | number
    pianistic_count?: IntFilter<"PlayData"> | number
    max_combo?: IntFilter<"PlayData"> | number
    grade_basic?: IntFilter<"PlayData"> | number
    grade_recital?: IntFilter<"PlayData"> | number
    besttime?: StringFilter<"PlayData"> | string
    created_at?: DateTimeFilter<"PlayData"> | Date | string
    updated_at?: DateTimeFilter<"PlayData"> | Date | string
    user_id?: IntFilter<"PlayData"> | number
    music_idx?: StringFilter<"PlayData"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    music?: XOR<MusicScalarRelationFilter, MusicWhereInput>
  }

  export type PlayDataOrderByWithRelationInput = {
    id?: SortOrder
    level?: SortOrder
    difficulty?: SortOrder
    score?: SortOrder
    rank?: SortOrder
    fc_type?: SortOrder
    play_count?: SortOrder
    fullcombo_count?: SortOrder
    pianistic_count?: SortOrder
    max_combo?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    besttime?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
    user?: UserOrderByWithRelationInput
    music?: MusicOrderByWithRelationInput
  }

  export type PlayDataWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PlayDataWhereInput | PlayDataWhereInput[]
    OR?: PlayDataWhereInput[]
    NOT?: PlayDataWhereInput | PlayDataWhereInput[]
    level?: IntFilter<"PlayData"> | number
    difficulty?: StringFilter<"PlayData"> | string
    score?: IntFilter<"PlayData"> | number
    rank?: StringFilter<"PlayData"> | string
    fc_type?: IntFilter<"PlayData"> | number
    play_count?: IntFilter<"PlayData"> | number
    fullcombo_count?: IntFilter<"PlayData"> | number
    pianistic_count?: IntFilter<"PlayData"> | number
    max_combo?: IntFilter<"PlayData"> | number
    grade_basic?: IntFilter<"PlayData"> | number
    grade_recital?: IntFilter<"PlayData"> | number
    besttime?: StringFilter<"PlayData"> | string
    created_at?: DateTimeFilter<"PlayData"> | Date | string
    updated_at?: DateTimeFilter<"PlayData"> | Date | string
    user_id?: IntFilter<"PlayData"> | number
    music_idx?: StringFilter<"PlayData"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    music?: XOR<MusicScalarRelationFilter, MusicWhereInput>
  }, "id">

  export type PlayDataOrderByWithAggregationInput = {
    id?: SortOrder
    level?: SortOrder
    difficulty?: SortOrder
    score?: SortOrder
    rank?: SortOrder
    fc_type?: SortOrder
    play_count?: SortOrder
    fullcombo_count?: SortOrder
    pianistic_count?: SortOrder
    max_combo?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    besttime?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
    _count?: PlayDataCountOrderByAggregateInput
    _avg?: PlayDataAvgOrderByAggregateInput
    _max?: PlayDataMaxOrderByAggregateInput
    _min?: PlayDataMinOrderByAggregateInput
    _sum?: PlayDataSumOrderByAggregateInput
  }

  export type PlayDataScalarWhereWithAggregatesInput = {
    AND?: PlayDataScalarWhereWithAggregatesInput | PlayDataScalarWhereWithAggregatesInput[]
    OR?: PlayDataScalarWhereWithAggregatesInput[]
    NOT?: PlayDataScalarWhereWithAggregatesInput | PlayDataScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PlayData"> | number
    level?: IntWithAggregatesFilter<"PlayData"> | number
    difficulty?: StringWithAggregatesFilter<"PlayData"> | string
    score?: IntWithAggregatesFilter<"PlayData"> | number
    rank?: StringWithAggregatesFilter<"PlayData"> | string
    fc_type?: IntWithAggregatesFilter<"PlayData"> | number
    play_count?: IntWithAggregatesFilter<"PlayData"> | number
    fullcombo_count?: IntWithAggregatesFilter<"PlayData"> | number
    pianistic_count?: IntWithAggregatesFilter<"PlayData"> | number
    max_combo?: IntWithAggregatesFilter<"PlayData"> | number
    grade_basic?: IntWithAggregatesFilter<"PlayData"> | number
    grade_recital?: IntWithAggregatesFilter<"PlayData"> | number
    besttime?: StringWithAggregatesFilter<"PlayData"> | string
    created_at?: DateTimeWithAggregatesFilter<"PlayData"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"PlayData"> | Date | string
    user_id?: IntWithAggregatesFilter<"PlayData"> | number
    music_idx?: StringWithAggregatesFilter<"PlayData"> | string
  }

  export type UserCreateInput = {
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    PlayHistory?: RecentPlayCreateNestedManyWithoutUserInput
    PlayData?: PlayDataCreateNestedManyWithoutUserInput
    Bookmark?: BookmarkCreateNestedManyWithoutUserInput
    BasicBestPlay?: BasicBestPlayCreateNestedManyWithoutUserInput
    RecitalBestPlay?: RecitalBestPlayCreateNestedManyWithoutUserInput
    UserBestGrade?: UserBestGradeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    PlayHistory?: RecentPlayUncheckedCreateNestedManyWithoutUserInput
    PlayData?: PlayDataUncheckedCreateNestedManyWithoutUserInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    BasicBestPlay?: BasicBestPlayUncheckedCreateNestedManyWithoutUserInput
    RecitalBestPlay?: RecitalBestPlayUncheckedCreateNestedManyWithoutUserInput
    UserBestGrade?: UserBestGradeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayHistory?: RecentPlayUpdateManyWithoutUserNestedInput
    PlayData?: PlayDataUpdateManyWithoutUserNestedInput
    Bookmark?: BookmarkUpdateManyWithoutUserNestedInput
    BasicBestPlay?: BasicBestPlayUpdateManyWithoutUserNestedInput
    RecitalBestPlay?: RecitalBestPlayUpdateManyWithoutUserNestedInput
    UserBestGrade?: UserBestGradeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayHistory?: RecentPlayUncheckedUpdateManyWithoutUserNestedInput
    PlayData?: PlayDataUncheckedUpdateManyWithoutUserNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    BasicBestPlay?: BasicBestPlayUncheckedUpdateManyWithoutUserNestedInput
    RecitalBestPlay?: RecitalBestPlayUncheckedUpdateManyWithoutUserNestedInput
    UserBestGrade?: UserBestGradeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkCreateInput = {
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutBookmarkInput
    music: MusicCreateNestedOneWithoutBookmarkInput
  }

  export type BookmarkUncheckedCreateInput = {
    id?: number
    user_id: number
    music_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type BookmarkUpdateInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBookmarkNestedInput
    music?: MusicUpdateOneRequiredWithoutBookmarkNestedInput
  }

  export type BookmarkUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    music_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkCreateManyInput = {
    id?: number
    user_id: number
    music_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type BookmarkUpdateManyMutationInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    music_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MusicCreateInput = {
    index: string
    title: string
    title_kana: string
    artist?: string | null
    category: string
    category_short: string
    description?: string | null
    background?: string | null
    sheet_len: number
    difficulty_levels: string
    difficulty_name: string
    created_at?: Date | string
    updated_at?: Date | string
    RecentPlay?: RecentPlayCreateNestedManyWithoutMusicInput
    PlayData?: PlayDataCreateNestedManyWithoutMusicInput
    Bookmark?: BookmarkCreateNestedManyWithoutMusicInput
    BasicBestPlay?: BasicBestPlayCreateNestedManyWithoutMusicInput
    RecitalBestPlay?: RecitalBestPlayCreateNestedManyWithoutMusicInput
  }

  export type MusicUncheckedCreateInput = {
    id?: number
    index: string
    title: string
    title_kana: string
    artist?: string | null
    category: string
    category_short: string
    description?: string | null
    background?: string | null
    sheet_len: number
    difficulty_levels: string
    difficulty_name: string
    created_at?: Date | string
    updated_at?: Date | string
    RecentPlay?: RecentPlayUncheckedCreateNestedManyWithoutMusicInput
    PlayData?: PlayDataUncheckedCreateNestedManyWithoutMusicInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutMusicInput
    BasicBestPlay?: BasicBestPlayUncheckedCreateNestedManyWithoutMusicInput
    RecitalBestPlay?: RecitalBestPlayUncheckedCreateNestedManyWithoutMusicInput
  }

  export type MusicUpdateInput = {
    index?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    title_kana?: StringFieldUpdateOperationsInput | string
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    category_short?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    sheet_len?: IntFieldUpdateOperationsInput | number
    difficulty_levels?: StringFieldUpdateOperationsInput | string
    difficulty_name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    RecentPlay?: RecentPlayUpdateManyWithoutMusicNestedInput
    PlayData?: PlayDataUpdateManyWithoutMusicNestedInput
    Bookmark?: BookmarkUpdateManyWithoutMusicNestedInput
    BasicBestPlay?: BasicBestPlayUpdateManyWithoutMusicNestedInput
    RecitalBestPlay?: RecitalBestPlayUpdateManyWithoutMusicNestedInput
  }

  export type MusicUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    index?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    title_kana?: StringFieldUpdateOperationsInput | string
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    category_short?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    sheet_len?: IntFieldUpdateOperationsInput | number
    difficulty_levels?: StringFieldUpdateOperationsInput | string
    difficulty_name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    RecentPlay?: RecentPlayUncheckedUpdateManyWithoutMusicNestedInput
    PlayData?: PlayDataUncheckedUpdateManyWithoutMusicNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutMusicNestedInput
    BasicBestPlay?: BasicBestPlayUncheckedUpdateManyWithoutMusicNestedInput
    RecitalBestPlay?: RecitalBestPlayUncheckedUpdateManyWithoutMusicNestedInput
  }

  export type MusicCreateManyInput = {
    id?: number
    index: string
    title: string
    title_kana: string
    artist?: string | null
    category: string
    category_short: string
    description?: string | null
    background?: string | null
    sheet_len: number
    difficulty_levels: string
    difficulty_name: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type MusicUpdateManyMutationInput = {
    index?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    title_kana?: StringFieldUpdateOperationsInput | string
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    category_short?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    sheet_len?: IntFieldUpdateOperationsInput | number
    difficulty_levels?: StringFieldUpdateOperationsInput | string
    difficulty_name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MusicUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    index?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    title_kana?: StringFieldUpdateOperationsInput | string
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    category_short?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    sheet_len?: IntFieldUpdateOperationsInput | number
    difficulty_levels?: StringFieldUpdateOperationsInput | string
    difficulty_name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecentPlayCreateInput = {
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    play_time: string
    grade_basic: number
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutPlayHistoryInput
    music: MusicCreateNestedOneWithoutRecentPlayInput
  }

  export type RecentPlayUncheckedCreateInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    play_time: string
    grade_basic: number
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
    music_idx: string
  }

  export type RecentPlayUpdateInput = {
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    play_time?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayHistoryNestedInput
    music?: MusicUpdateOneRequiredWithoutRecentPlayNestedInput
  }

  export type RecentPlayUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    play_time?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type RecentPlayCreateManyInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    play_time: string
    grade_basic: number
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
    music_idx: string
  }

  export type RecentPlayUpdateManyMutationInput = {
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    play_time?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecentPlayUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    play_time?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type UserBestGradeCreateInput = {
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutUserBestGradeInput
  }

  export type UserBestGradeUncheckedCreateInput = {
    id?: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
  }

  export type UserBestGradeUpdateInput = {
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserBestGradeNestedInput
  }

  export type UserBestGradeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
  }

  export type UserBestGradeCreateManyInput = {
    id?: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
  }

  export type UserBestGradeUpdateManyMutationInput = {
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBestGradeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
  }

  export type BasicBestPlayCreateInput = {
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_basic: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutBasicBestPlayInput
    music: MusicCreateNestedOneWithoutBasicBestPlayInput
  }

  export type BasicBestPlayUncheckedCreateInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_basic: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
    music_idx: string
  }

  export type BasicBestPlayUpdateInput = {
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBasicBestPlayNestedInput
    music?: MusicUpdateOneRequiredWithoutBasicBestPlayNestedInput
  }

  export type BasicBestPlayUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type BasicBestPlayCreateManyInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_basic: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
    music_idx: string
  }

  export type BasicBestPlayUpdateManyMutationInput = {
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BasicBestPlayUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type RecitalBestPlayCreateInput = {
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_recital: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutRecitalBestPlayInput
    music: MusicCreateNestedOneWithoutRecitalBestPlayInput
  }

  export type RecitalBestPlayUncheckedCreateInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_recital: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
    music_idx: string
  }

  export type RecitalBestPlayUpdateInput = {
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_recital?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRecitalBestPlayNestedInput
    music?: MusicUpdateOneRequiredWithoutRecitalBestPlayNestedInput
  }

  export type RecitalBestPlayUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_recital?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type RecitalBestPlayCreateManyInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_recital: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
    music_idx: string
  }

  export type RecitalBestPlayUpdateManyMutationInput = {
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_recital?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecitalBestPlayUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_recital?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type PlayDataCreateInput = {
    level: number
    difficulty: string
    score: number
    rank: string
    fc_type: number
    play_count: number
    fullcombo_count: number
    pianistic_count: number
    max_combo: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutPlayDataInput
    music: MusicCreateNestedOneWithoutPlayDataInput
  }

  export type PlayDataUncheckedCreateInput = {
    id?: number
    level: number
    difficulty: string
    score: number
    rank: string
    fc_type: number
    play_count: number
    fullcombo_count: number
    pianistic_count: number
    max_combo: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
    music_idx: string
  }

  export type PlayDataUpdateInput = {
    level?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    fc_type?: IntFieldUpdateOperationsInput | number
    play_count?: IntFieldUpdateOperationsInput | number
    fullcombo_count?: IntFieldUpdateOperationsInput | number
    pianistic_count?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayDataNestedInput
    music?: MusicUpdateOneRequiredWithoutPlayDataNestedInput
  }

  export type PlayDataUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    fc_type?: IntFieldUpdateOperationsInput | number
    play_count?: IntFieldUpdateOperationsInput | number
    fullcombo_count?: IntFieldUpdateOperationsInput | number
    pianistic_count?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type PlayDataCreateManyInput = {
    id?: number
    level: number
    difficulty: string
    score: number
    rank: string
    fc_type: number
    play_count: number
    fullcombo_count: number
    pianistic_count: number
    max_combo: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
    music_idx: string
  }

  export type PlayDataUpdateManyMutationInput = {
    level?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    fc_type?: IntFieldUpdateOperationsInput | number
    play_count?: IntFieldUpdateOperationsInput | number
    fullcombo_count?: IntFieldUpdateOperationsInput | number
    pianistic_count?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayDataUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    fc_type?: IntFieldUpdateOperationsInput | number
    play_count?: IntFieldUpdateOperationsInput | number
    fullcombo_count?: IntFieldUpdateOperationsInput | number
    pianistic_count?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type RecentPlayListRelationFilter = {
    every?: RecentPlayWhereInput
    some?: RecentPlayWhereInput
    none?: RecentPlayWhereInput
  }

  export type PlayDataListRelationFilter = {
    every?: PlayDataWhereInput
    some?: PlayDataWhereInput
    none?: PlayDataWhereInput
  }

  export type BookmarkListRelationFilter = {
    every?: BookmarkWhereInput
    some?: BookmarkWhereInput
    none?: BookmarkWhereInput
  }

  export type BasicBestPlayListRelationFilter = {
    every?: BasicBestPlayWhereInput
    some?: BasicBestPlayWhereInput
    none?: BasicBestPlayWhereInput
  }

  export type RecitalBestPlayListRelationFilter = {
    every?: RecitalBestPlayWhereInput
    some?: RecitalBestPlayWhereInput
    none?: RecitalBestPlayWhereInput
  }

  export type UserBestGradeListRelationFilter = {
    every?: UserBestGradeWhereInput
    some?: UserBestGradeWhereInput
    none?: UserBestGradeWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RecentPlayOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlayDataOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookmarkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BasicBestPlayOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RecitalBestPlayOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserBestGradeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    kakao_id?: SortOrder
    discord_name?: SortOrder
    discord_tag?: SortOrder
    avatar?: SortOrder
    country?: SortOrder
    rank_basic?: SortOrder
    rank_recital?: SortOrder
    rank_basic_country?: SortOrder
    rank_recital_country?: SortOrder
    play_count?: SortOrder
    score_p?: SortOrder
    score_f?: SortOrder
    score_s?: SortOrder
    score_a2?: SortOrder
    score_a?: SortOrder
    score_b2?: SortOrder
    score_b?: SortOrder
    score_c?: SortOrder
    score_d?: SortOrder
    role?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    kakao_id?: SortOrder
    rank_basic?: SortOrder
    rank_recital?: SortOrder
    rank_basic_country?: SortOrder
    rank_recital_country?: SortOrder
    play_count?: SortOrder
    score_p?: SortOrder
    score_f?: SortOrder
    score_s?: SortOrder
    score_a2?: SortOrder
    score_a?: SortOrder
    score_b2?: SortOrder
    score_b?: SortOrder
    score_c?: SortOrder
    score_d?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    kakao_id?: SortOrder
    discord_name?: SortOrder
    discord_tag?: SortOrder
    avatar?: SortOrder
    country?: SortOrder
    rank_basic?: SortOrder
    rank_recital?: SortOrder
    rank_basic_country?: SortOrder
    rank_recital_country?: SortOrder
    play_count?: SortOrder
    score_p?: SortOrder
    score_f?: SortOrder
    score_s?: SortOrder
    score_a2?: SortOrder
    score_a?: SortOrder
    score_b2?: SortOrder
    score_b?: SortOrder
    score_c?: SortOrder
    score_d?: SortOrder
    role?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    kakao_id?: SortOrder
    discord_name?: SortOrder
    discord_tag?: SortOrder
    avatar?: SortOrder
    country?: SortOrder
    rank_basic?: SortOrder
    rank_recital?: SortOrder
    rank_basic_country?: SortOrder
    rank_recital_country?: SortOrder
    play_count?: SortOrder
    score_p?: SortOrder
    score_f?: SortOrder
    score_s?: SortOrder
    score_a2?: SortOrder
    score_a?: SortOrder
    score_b2?: SortOrder
    score_b?: SortOrder
    score_c?: SortOrder
    score_d?: SortOrder
    role?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    kakao_id?: SortOrder
    rank_basic?: SortOrder
    rank_recital?: SortOrder
    rank_basic_country?: SortOrder
    rank_recital_country?: SortOrder
    play_count?: SortOrder
    score_p?: SortOrder
    score_f?: SortOrder
    score_s?: SortOrder
    score_a2?: SortOrder
    score_a?: SortOrder
    score_b2?: SortOrder
    score_b?: SortOrder
    score_c?: SortOrder
    score_d?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type MusicScalarRelationFilter = {
    is?: MusicWhereInput
    isNot?: MusicWhereInput
  }

  export type BookmarkUser_idMusic_idCompoundUniqueInput = {
    user_id: number
    music_id: number
  }

  export type BookmarkCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    music_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type BookmarkAvgOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    music_id?: SortOrder
  }

  export type BookmarkMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    music_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type BookmarkMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    music_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type BookmarkSumOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    music_id?: SortOrder
  }

  export type MusicCountOrderByAggregateInput = {
    id?: SortOrder
    index?: SortOrder
    title?: SortOrder
    title_kana?: SortOrder
    artist?: SortOrder
    category?: SortOrder
    category_short?: SortOrder
    description?: SortOrder
    background?: SortOrder
    sheet_len?: SortOrder
    difficulty_levels?: SortOrder
    difficulty_name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MusicAvgOrderByAggregateInput = {
    id?: SortOrder
    sheet_len?: SortOrder
  }

  export type MusicMaxOrderByAggregateInput = {
    id?: SortOrder
    index?: SortOrder
    title?: SortOrder
    title_kana?: SortOrder
    artist?: SortOrder
    category?: SortOrder
    category_short?: SortOrder
    description?: SortOrder
    background?: SortOrder
    sheet_len?: SortOrder
    difficulty_levels?: SortOrder
    difficulty_name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MusicMinOrderByAggregateInput = {
    id?: SortOrder
    index?: SortOrder
    title?: SortOrder
    title_kana?: SortOrder
    artist?: SortOrder
    category?: SortOrder
    category_short?: SortOrder
    description?: SortOrder
    background?: SortOrder
    sheet_len?: SortOrder
    difficulty_levels?: SortOrder
    difficulty_name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MusicSumOrderByAggregateInput = {
    id?: SortOrder
    sheet_len?: SortOrder
  }

  export type RecentPlayCountOrderByAggregateInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    play_time?: SortOrder
    grade_basic?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
  }

  export type RecentPlayAvgOrderByAggregateInput = {
    id?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    grade_basic?: SortOrder
    user_id?: SortOrder
  }

  export type RecentPlayMaxOrderByAggregateInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    play_time?: SortOrder
    grade_basic?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
  }

  export type RecentPlayMinOrderByAggregateInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    play_time?: SortOrder
    grade_basic?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
  }

  export type RecentPlaySumOrderByAggregateInput = {
    id?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    grade_basic?: SortOrder
    user_id?: SortOrder
  }

  export type UserBestGradeCountOrderByAggregateInput = {
    id?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    besttime?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type UserBestGradeAvgOrderByAggregateInput = {
    id?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    user_id?: SortOrder
  }

  export type UserBestGradeMaxOrderByAggregateInput = {
    id?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    besttime?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type UserBestGradeMinOrderByAggregateInput = {
    id?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    besttime?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type UserBestGradeSumOrderByAggregateInput = {
    id?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    user_id?: SortOrder
  }

  export type BasicBestPlayCountOrderByAggregateInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    besttime?: SortOrder
    grade_basic?: SortOrder
    fc_type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
  }

  export type BasicBestPlayAvgOrderByAggregateInput = {
    id?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    grade_basic?: SortOrder
    fc_type?: SortOrder
    user_id?: SortOrder
  }

  export type BasicBestPlayMaxOrderByAggregateInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    besttime?: SortOrder
    grade_basic?: SortOrder
    fc_type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
  }

  export type BasicBestPlayMinOrderByAggregateInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    besttime?: SortOrder
    grade_basic?: SortOrder
    fc_type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
  }

  export type BasicBestPlaySumOrderByAggregateInput = {
    id?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    grade_basic?: SortOrder
    fc_type?: SortOrder
    user_id?: SortOrder
  }

  export type RecitalBestPlayCountOrderByAggregateInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    besttime?: SortOrder
    grade_recital?: SortOrder
    fc_type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
  }

  export type RecitalBestPlayAvgOrderByAggregateInput = {
    id?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    grade_recital?: SortOrder
    fc_type?: SortOrder
    user_id?: SortOrder
  }

  export type RecitalBestPlayMaxOrderByAggregateInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    besttime?: SortOrder
    grade_recital?: SortOrder
    fc_type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
  }

  export type RecitalBestPlayMinOrderByAggregateInput = {
    id?: SortOrder
    difficulty?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    rank?: SortOrder
    besttime?: SortOrder
    grade_recital?: SortOrder
    fc_type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
  }

  export type RecitalBestPlaySumOrderByAggregateInput = {
    id?: SortOrder
    level?: SortOrder
    score?: SortOrder
    max_combo?: SortOrder
    grade_recital?: SortOrder
    fc_type?: SortOrder
    user_id?: SortOrder
  }

  export type PlayDataCountOrderByAggregateInput = {
    id?: SortOrder
    level?: SortOrder
    difficulty?: SortOrder
    score?: SortOrder
    rank?: SortOrder
    fc_type?: SortOrder
    play_count?: SortOrder
    fullcombo_count?: SortOrder
    pianistic_count?: SortOrder
    max_combo?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    besttime?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
  }

  export type PlayDataAvgOrderByAggregateInput = {
    id?: SortOrder
    level?: SortOrder
    score?: SortOrder
    fc_type?: SortOrder
    play_count?: SortOrder
    fullcombo_count?: SortOrder
    pianistic_count?: SortOrder
    max_combo?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    user_id?: SortOrder
  }

  export type PlayDataMaxOrderByAggregateInput = {
    id?: SortOrder
    level?: SortOrder
    difficulty?: SortOrder
    score?: SortOrder
    rank?: SortOrder
    fc_type?: SortOrder
    play_count?: SortOrder
    fullcombo_count?: SortOrder
    pianistic_count?: SortOrder
    max_combo?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    besttime?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
  }

  export type PlayDataMinOrderByAggregateInput = {
    id?: SortOrder
    level?: SortOrder
    difficulty?: SortOrder
    score?: SortOrder
    rank?: SortOrder
    fc_type?: SortOrder
    play_count?: SortOrder
    fullcombo_count?: SortOrder
    pianistic_count?: SortOrder
    max_combo?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    besttime?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    music_idx?: SortOrder
  }

  export type PlayDataSumOrderByAggregateInput = {
    id?: SortOrder
    level?: SortOrder
    score?: SortOrder
    fc_type?: SortOrder
    play_count?: SortOrder
    fullcombo_count?: SortOrder
    pianistic_count?: SortOrder
    max_combo?: SortOrder
    grade_basic?: SortOrder
    grade_recital?: SortOrder
    user_id?: SortOrder
  }

  export type RecentPlayCreateNestedManyWithoutUserInput = {
    create?: XOR<RecentPlayCreateWithoutUserInput, RecentPlayUncheckedCreateWithoutUserInput> | RecentPlayCreateWithoutUserInput[] | RecentPlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RecentPlayCreateOrConnectWithoutUserInput | RecentPlayCreateOrConnectWithoutUserInput[]
    createMany?: RecentPlayCreateManyUserInputEnvelope
    connect?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
  }

  export type PlayDataCreateNestedManyWithoutUserInput = {
    create?: XOR<PlayDataCreateWithoutUserInput, PlayDataUncheckedCreateWithoutUserInput> | PlayDataCreateWithoutUserInput[] | PlayDataUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayDataCreateOrConnectWithoutUserInput | PlayDataCreateOrConnectWithoutUserInput[]
    createMany?: PlayDataCreateManyUserInputEnvelope
    connect?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
  }

  export type BookmarkCreateNestedManyWithoutUserInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
  }

  export type BasicBestPlayCreateNestedManyWithoutUserInput = {
    create?: XOR<BasicBestPlayCreateWithoutUserInput, BasicBestPlayUncheckedCreateWithoutUserInput> | BasicBestPlayCreateWithoutUserInput[] | BasicBestPlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BasicBestPlayCreateOrConnectWithoutUserInput | BasicBestPlayCreateOrConnectWithoutUserInput[]
    createMany?: BasicBestPlayCreateManyUserInputEnvelope
    connect?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
  }

  export type RecitalBestPlayCreateNestedManyWithoutUserInput = {
    create?: XOR<RecitalBestPlayCreateWithoutUserInput, RecitalBestPlayUncheckedCreateWithoutUserInput> | RecitalBestPlayCreateWithoutUserInput[] | RecitalBestPlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RecitalBestPlayCreateOrConnectWithoutUserInput | RecitalBestPlayCreateOrConnectWithoutUserInput[]
    createMany?: RecitalBestPlayCreateManyUserInputEnvelope
    connect?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
  }

  export type UserBestGradeCreateNestedManyWithoutUserInput = {
    create?: XOR<UserBestGradeCreateWithoutUserInput, UserBestGradeUncheckedCreateWithoutUserInput> | UserBestGradeCreateWithoutUserInput[] | UserBestGradeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBestGradeCreateOrConnectWithoutUserInput | UserBestGradeCreateOrConnectWithoutUserInput[]
    createMany?: UserBestGradeCreateManyUserInputEnvelope
    connect?: UserBestGradeWhereUniqueInput | UserBestGradeWhereUniqueInput[]
  }

  export type RecentPlayUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RecentPlayCreateWithoutUserInput, RecentPlayUncheckedCreateWithoutUserInput> | RecentPlayCreateWithoutUserInput[] | RecentPlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RecentPlayCreateOrConnectWithoutUserInput | RecentPlayCreateOrConnectWithoutUserInput[]
    createMany?: RecentPlayCreateManyUserInputEnvelope
    connect?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
  }

  export type PlayDataUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PlayDataCreateWithoutUserInput, PlayDataUncheckedCreateWithoutUserInput> | PlayDataCreateWithoutUserInput[] | PlayDataUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayDataCreateOrConnectWithoutUserInput | PlayDataCreateOrConnectWithoutUserInput[]
    createMany?: PlayDataCreateManyUserInputEnvelope
    connect?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
  }

  export type BookmarkUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
  }

  export type BasicBestPlayUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BasicBestPlayCreateWithoutUserInput, BasicBestPlayUncheckedCreateWithoutUserInput> | BasicBestPlayCreateWithoutUserInput[] | BasicBestPlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BasicBestPlayCreateOrConnectWithoutUserInput | BasicBestPlayCreateOrConnectWithoutUserInput[]
    createMany?: BasicBestPlayCreateManyUserInputEnvelope
    connect?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
  }

  export type RecitalBestPlayUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RecitalBestPlayCreateWithoutUserInput, RecitalBestPlayUncheckedCreateWithoutUserInput> | RecitalBestPlayCreateWithoutUserInput[] | RecitalBestPlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RecitalBestPlayCreateOrConnectWithoutUserInput | RecitalBestPlayCreateOrConnectWithoutUserInput[]
    createMany?: RecitalBestPlayCreateManyUserInputEnvelope
    connect?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
  }

  export type UserBestGradeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserBestGradeCreateWithoutUserInput, UserBestGradeUncheckedCreateWithoutUserInput> | UserBestGradeCreateWithoutUserInput[] | UserBestGradeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBestGradeCreateOrConnectWithoutUserInput | UserBestGradeCreateOrConnectWithoutUserInput[]
    createMany?: UserBestGradeCreateManyUserInputEnvelope
    connect?: UserBestGradeWhereUniqueInput | UserBestGradeWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type RecentPlayUpdateManyWithoutUserNestedInput = {
    create?: XOR<RecentPlayCreateWithoutUserInput, RecentPlayUncheckedCreateWithoutUserInput> | RecentPlayCreateWithoutUserInput[] | RecentPlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RecentPlayCreateOrConnectWithoutUserInput | RecentPlayCreateOrConnectWithoutUserInput[]
    upsert?: RecentPlayUpsertWithWhereUniqueWithoutUserInput | RecentPlayUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RecentPlayCreateManyUserInputEnvelope
    set?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    disconnect?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    delete?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    connect?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    update?: RecentPlayUpdateWithWhereUniqueWithoutUserInput | RecentPlayUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RecentPlayUpdateManyWithWhereWithoutUserInput | RecentPlayUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RecentPlayScalarWhereInput | RecentPlayScalarWhereInput[]
  }

  export type PlayDataUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlayDataCreateWithoutUserInput, PlayDataUncheckedCreateWithoutUserInput> | PlayDataCreateWithoutUserInput[] | PlayDataUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayDataCreateOrConnectWithoutUserInput | PlayDataCreateOrConnectWithoutUserInput[]
    upsert?: PlayDataUpsertWithWhereUniqueWithoutUserInput | PlayDataUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlayDataCreateManyUserInputEnvelope
    set?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    disconnect?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    delete?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    connect?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    update?: PlayDataUpdateWithWhereUniqueWithoutUserInput | PlayDataUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlayDataUpdateManyWithWhereWithoutUserInput | PlayDataUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlayDataScalarWhereInput | PlayDataScalarWhereInput[]
  }

  export type BookmarkUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    upsert?: BookmarkUpsertWithWhereUniqueWithoutUserInput | BookmarkUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    set?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    disconnect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    delete?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    update?: BookmarkUpdateWithWhereUniqueWithoutUserInput | BookmarkUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookmarkUpdateManyWithWhereWithoutUserInput | BookmarkUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
  }

  export type BasicBestPlayUpdateManyWithoutUserNestedInput = {
    create?: XOR<BasicBestPlayCreateWithoutUserInput, BasicBestPlayUncheckedCreateWithoutUserInput> | BasicBestPlayCreateWithoutUserInput[] | BasicBestPlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BasicBestPlayCreateOrConnectWithoutUserInput | BasicBestPlayCreateOrConnectWithoutUserInput[]
    upsert?: BasicBestPlayUpsertWithWhereUniqueWithoutUserInput | BasicBestPlayUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BasicBestPlayCreateManyUserInputEnvelope
    set?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    disconnect?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    delete?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    connect?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    update?: BasicBestPlayUpdateWithWhereUniqueWithoutUserInput | BasicBestPlayUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BasicBestPlayUpdateManyWithWhereWithoutUserInput | BasicBestPlayUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BasicBestPlayScalarWhereInput | BasicBestPlayScalarWhereInput[]
  }

  export type RecitalBestPlayUpdateManyWithoutUserNestedInput = {
    create?: XOR<RecitalBestPlayCreateWithoutUserInput, RecitalBestPlayUncheckedCreateWithoutUserInput> | RecitalBestPlayCreateWithoutUserInput[] | RecitalBestPlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RecitalBestPlayCreateOrConnectWithoutUserInput | RecitalBestPlayCreateOrConnectWithoutUserInput[]
    upsert?: RecitalBestPlayUpsertWithWhereUniqueWithoutUserInput | RecitalBestPlayUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RecitalBestPlayCreateManyUserInputEnvelope
    set?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    disconnect?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    delete?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    connect?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    update?: RecitalBestPlayUpdateWithWhereUniqueWithoutUserInput | RecitalBestPlayUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RecitalBestPlayUpdateManyWithWhereWithoutUserInput | RecitalBestPlayUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RecitalBestPlayScalarWhereInput | RecitalBestPlayScalarWhereInput[]
  }

  export type UserBestGradeUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserBestGradeCreateWithoutUserInput, UserBestGradeUncheckedCreateWithoutUserInput> | UserBestGradeCreateWithoutUserInput[] | UserBestGradeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBestGradeCreateOrConnectWithoutUserInput | UserBestGradeCreateOrConnectWithoutUserInput[]
    upsert?: UserBestGradeUpsertWithWhereUniqueWithoutUserInput | UserBestGradeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserBestGradeCreateManyUserInputEnvelope
    set?: UserBestGradeWhereUniqueInput | UserBestGradeWhereUniqueInput[]
    disconnect?: UserBestGradeWhereUniqueInput | UserBestGradeWhereUniqueInput[]
    delete?: UserBestGradeWhereUniqueInput | UserBestGradeWhereUniqueInput[]
    connect?: UserBestGradeWhereUniqueInput | UserBestGradeWhereUniqueInput[]
    update?: UserBestGradeUpdateWithWhereUniqueWithoutUserInput | UserBestGradeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserBestGradeUpdateManyWithWhereWithoutUserInput | UserBestGradeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserBestGradeScalarWhereInput | UserBestGradeScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type RecentPlayUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RecentPlayCreateWithoutUserInput, RecentPlayUncheckedCreateWithoutUserInput> | RecentPlayCreateWithoutUserInput[] | RecentPlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RecentPlayCreateOrConnectWithoutUserInput | RecentPlayCreateOrConnectWithoutUserInput[]
    upsert?: RecentPlayUpsertWithWhereUniqueWithoutUserInput | RecentPlayUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RecentPlayCreateManyUserInputEnvelope
    set?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    disconnect?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    delete?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    connect?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    update?: RecentPlayUpdateWithWhereUniqueWithoutUserInput | RecentPlayUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RecentPlayUpdateManyWithWhereWithoutUserInput | RecentPlayUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RecentPlayScalarWhereInput | RecentPlayScalarWhereInput[]
  }

  export type PlayDataUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlayDataCreateWithoutUserInput, PlayDataUncheckedCreateWithoutUserInput> | PlayDataCreateWithoutUserInput[] | PlayDataUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayDataCreateOrConnectWithoutUserInput | PlayDataCreateOrConnectWithoutUserInput[]
    upsert?: PlayDataUpsertWithWhereUniqueWithoutUserInput | PlayDataUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlayDataCreateManyUserInputEnvelope
    set?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    disconnect?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    delete?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    connect?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    update?: PlayDataUpdateWithWhereUniqueWithoutUserInput | PlayDataUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlayDataUpdateManyWithWhereWithoutUserInput | PlayDataUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlayDataScalarWhereInput | PlayDataScalarWhereInput[]
  }

  export type BookmarkUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    upsert?: BookmarkUpsertWithWhereUniqueWithoutUserInput | BookmarkUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    set?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    disconnect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    delete?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    update?: BookmarkUpdateWithWhereUniqueWithoutUserInput | BookmarkUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookmarkUpdateManyWithWhereWithoutUserInput | BookmarkUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
  }

  export type BasicBestPlayUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BasicBestPlayCreateWithoutUserInput, BasicBestPlayUncheckedCreateWithoutUserInput> | BasicBestPlayCreateWithoutUserInput[] | BasicBestPlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BasicBestPlayCreateOrConnectWithoutUserInput | BasicBestPlayCreateOrConnectWithoutUserInput[]
    upsert?: BasicBestPlayUpsertWithWhereUniqueWithoutUserInput | BasicBestPlayUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BasicBestPlayCreateManyUserInputEnvelope
    set?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    disconnect?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    delete?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    connect?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    update?: BasicBestPlayUpdateWithWhereUniqueWithoutUserInput | BasicBestPlayUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BasicBestPlayUpdateManyWithWhereWithoutUserInput | BasicBestPlayUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BasicBestPlayScalarWhereInput | BasicBestPlayScalarWhereInput[]
  }

  export type RecitalBestPlayUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RecitalBestPlayCreateWithoutUserInput, RecitalBestPlayUncheckedCreateWithoutUserInput> | RecitalBestPlayCreateWithoutUserInput[] | RecitalBestPlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RecitalBestPlayCreateOrConnectWithoutUserInput | RecitalBestPlayCreateOrConnectWithoutUserInput[]
    upsert?: RecitalBestPlayUpsertWithWhereUniqueWithoutUserInput | RecitalBestPlayUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RecitalBestPlayCreateManyUserInputEnvelope
    set?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    disconnect?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    delete?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    connect?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    update?: RecitalBestPlayUpdateWithWhereUniqueWithoutUserInput | RecitalBestPlayUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RecitalBestPlayUpdateManyWithWhereWithoutUserInput | RecitalBestPlayUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RecitalBestPlayScalarWhereInput | RecitalBestPlayScalarWhereInput[]
  }

  export type UserBestGradeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserBestGradeCreateWithoutUserInput, UserBestGradeUncheckedCreateWithoutUserInput> | UserBestGradeCreateWithoutUserInput[] | UserBestGradeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBestGradeCreateOrConnectWithoutUserInput | UserBestGradeCreateOrConnectWithoutUserInput[]
    upsert?: UserBestGradeUpsertWithWhereUniqueWithoutUserInput | UserBestGradeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserBestGradeCreateManyUserInputEnvelope
    set?: UserBestGradeWhereUniqueInput | UserBestGradeWhereUniqueInput[]
    disconnect?: UserBestGradeWhereUniqueInput | UserBestGradeWhereUniqueInput[]
    delete?: UserBestGradeWhereUniqueInput | UserBestGradeWhereUniqueInput[]
    connect?: UserBestGradeWhereUniqueInput | UserBestGradeWhereUniqueInput[]
    update?: UserBestGradeUpdateWithWhereUniqueWithoutUserInput | UserBestGradeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserBestGradeUpdateManyWithWhereWithoutUserInput | UserBestGradeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserBestGradeScalarWhereInput | UserBestGradeScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutBookmarkInput = {
    create?: XOR<UserCreateWithoutBookmarkInput, UserUncheckedCreateWithoutBookmarkInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookmarkInput
    connect?: UserWhereUniqueInput
  }

  export type MusicCreateNestedOneWithoutBookmarkInput = {
    create?: XOR<MusicCreateWithoutBookmarkInput, MusicUncheckedCreateWithoutBookmarkInput>
    connectOrCreate?: MusicCreateOrConnectWithoutBookmarkInput
    connect?: MusicWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutBookmarkNestedInput = {
    create?: XOR<UserCreateWithoutBookmarkInput, UserUncheckedCreateWithoutBookmarkInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookmarkInput
    upsert?: UserUpsertWithoutBookmarkInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBookmarkInput, UserUpdateWithoutBookmarkInput>, UserUncheckedUpdateWithoutBookmarkInput>
  }

  export type MusicUpdateOneRequiredWithoutBookmarkNestedInput = {
    create?: XOR<MusicCreateWithoutBookmarkInput, MusicUncheckedCreateWithoutBookmarkInput>
    connectOrCreate?: MusicCreateOrConnectWithoutBookmarkInput
    upsert?: MusicUpsertWithoutBookmarkInput
    connect?: MusicWhereUniqueInput
    update?: XOR<XOR<MusicUpdateToOneWithWhereWithoutBookmarkInput, MusicUpdateWithoutBookmarkInput>, MusicUncheckedUpdateWithoutBookmarkInput>
  }

  export type RecentPlayCreateNestedManyWithoutMusicInput = {
    create?: XOR<RecentPlayCreateWithoutMusicInput, RecentPlayUncheckedCreateWithoutMusicInput> | RecentPlayCreateWithoutMusicInput[] | RecentPlayUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: RecentPlayCreateOrConnectWithoutMusicInput | RecentPlayCreateOrConnectWithoutMusicInput[]
    createMany?: RecentPlayCreateManyMusicInputEnvelope
    connect?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
  }

  export type PlayDataCreateNestedManyWithoutMusicInput = {
    create?: XOR<PlayDataCreateWithoutMusicInput, PlayDataUncheckedCreateWithoutMusicInput> | PlayDataCreateWithoutMusicInput[] | PlayDataUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: PlayDataCreateOrConnectWithoutMusicInput | PlayDataCreateOrConnectWithoutMusicInput[]
    createMany?: PlayDataCreateManyMusicInputEnvelope
    connect?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
  }

  export type BookmarkCreateNestedManyWithoutMusicInput = {
    create?: XOR<BookmarkCreateWithoutMusicInput, BookmarkUncheckedCreateWithoutMusicInput> | BookmarkCreateWithoutMusicInput[] | BookmarkUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutMusicInput | BookmarkCreateOrConnectWithoutMusicInput[]
    createMany?: BookmarkCreateManyMusicInputEnvelope
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
  }

  export type BasicBestPlayCreateNestedManyWithoutMusicInput = {
    create?: XOR<BasicBestPlayCreateWithoutMusicInput, BasicBestPlayUncheckedCreateWithoutMusicInput> | BasicBestPlayCreateWithoutMusicInput[] | BasicBestPlayUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: BasicBestPlayCreateOrConnectWithoutMusicInput | BasicBestPlayCreateOrConnectWithoutMusicInput[]
    createMany?: BasicBestPlayCreateManyMusicInputEnvelope
    connect?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
  }

  export type RecitalBestPlayCreateNestedManyWithoutMusicInput = {
    create?: XOR<RecitalBestPlayCreateWithoutMusicInput, RecitalBestPlayUncheckedCreateWithoutMusicInput> | RecitalBestPlayCreateWithoutMusicInput[] | RecitalBestPlayUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: RecitalBestPlayCreateOrConnectWithoutMusicInput | RecitalBestPlayCreateOrConnectWithoutMusicInput[]
    createMany?: RecitalBestPlayCreateManyMusicInputEnvelope
    connect?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
  }

  export type RecentPlayUncheckedCreateNestedManyWithoutMusicInput = {
    create?: XOR<RecentPlayCreateWithoutMusicInput, RecentPlayUncheckedCreateWithoutMusicInput> | RecentPlayCreateWithoutMusicInput[] | RecentPlayUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: RecentPlayCreateOrConnectWithoutMusicInput | RecentPlayCreateOrConnectWithoutMusicInput[]
    createMany?: RecentPlayCreateManyMusicInputEnvelope
    connect?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
  }

  export type PlayDataUncheckedCreateNestedManyWithoutMusicInput = {
    create?: XOR<PlayDataCreateWithoutMusicInput, PlayDataUncheckedCreateWithoutMusicInput> | PlayDataCreateWithoutMusicInput[] | PlayDataUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: PlayDataCreateOrConnectWithoutMusicInput | PlayDataCreateOrConnectWithoutMusicInput[]
    createMany?: PlayDataCreateManyMusicInputEnvelope
    connect?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
  }

  export type BookmarkUncheckedCreateNestedManyWithoutMusicInput = {
    create?: XOR<BookmarkCreateWithoutMusicInput, BookmarkUncheckedCreateWithoutMusicInput> | BookmarkCreateWithoutMusicInput[] | BookmarkUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutMusicInput | BookmarkCreateOrConnectWithoutMusicInput[]
    createMany?: BookmarkCreateManyMusicInputEnvelope
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
  }

  export type BasicBestPlayUncheckedCreateNestedManyWithoutMusicInput = {
    create?: XOR<BasicBestPlayCreateWithoutMusicInput, BasicBestPlayUncheckedCreateWithoutMusicInput> | BasicBestPlayCreateWithoutMusicInput[] | BasicBestPlayUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: BasicBestPlayCreateOrConnectWithoutMusicInput | BasicBestPlayCreateOrConnectWithoutMusicInput[]
    createMany?: BasicBestPlayCreateManyMusicInputEnvelope
    connect?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
  }

  export type RecitalBestPlayUncheckedCreateNestedManyWithoutMusicInput = {
    create?: XOR<RecitalBestPlayCreateWithoutMusicInput, RecitalBestPlayUncheckedCreateWithoutMusicInput> | RecitalBestPlayCreateWithoutMusicInput[] | RecitalBestPlayUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: RecitalBestPlayCreateOrConnectWithoutMusicInput | RecitalBestPlayCreateOrConnectWithoutMusicInput[]
    createMany?: RecitalBestPlayCreateManyMusicInputEnvelope
    connect?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
  }

  export type RecentPlayUpdateManyWithoutMusicNestedInput = {
    create?: XOR<RecentPlayCreateWithoutMusicInput, RecentPlayUncheckedCreateWithoutMusicInput> | RecentPlayCreateWithoutMusicInput[] | RecentPlayUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: RecentPlayCreateOrConnectWithoutMusicInput | RecentPlayCreateOrConnectWithoutMusicInput[]
    upsert?: RecentPlayUpsertWithWhereUniqueWithoutMusicInput | RecentPlayUpsertWithWhereUniqueWithoutMusicInput[]
    createMany?: RecentPlayCreateManyMusicInputEnvelope
    set?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    disconnect?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    delete?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    connect?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    update?: RecentPlayUpdateWithWhereUniqueWithoutMusicInput | RecentPlayUpdateWithWhereUniqueWithoutMusicInput[]
    updateMany?: RecentPlayUpdateManyWithWhereWithoutMusicInput | RecentPlayUpdateManyWithWhereWithoutMusicInput[]
    deleteMany?: RecentPlayScalarWhereInput | RecentPlayScalarWhereInput[]
  }

  export type PlayDataUpdateManyWithoutMusicNestedInput = {
    create?: XOR<PlayDataCreateWithoutMusicInput, PlayDataUncheckedCreateWithoutMusicInput> | PlayDataCreateWithoutMusicInput[] | PlayDataUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: PlayDataCreateOrConnectWithoutMusicInput | PlayDataCreateOrConnectWithoutMusicInput[]
    upsert?: PlayDataUpsertWithWhereUniqueWithoutMusicInput | PlayDataUpsertWithWhereUniqueWithoutMusicInput[]
    createMany?: PlayDataCreateManyMusicInputEnvelope
    set?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    disconnect?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    delete?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    connect?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    update?: PlayDataUpdateWithWhereUniqueWithoutMusicInput | PlayDataUpdateWithWhereUniqueWithoutMusicInput[]
    updateMany?: PlayDataUpdateManyWithWhereWithoutMusicInput | PlayDataUpdateManyWithWhereWithoutMusicInput[]
    deleteMany?: PlayDataScalarWhereInput | PlayDataScalarWhereInput[]
  }

  export type BookmarkUpdateManyWithoutMusicNestedInput = {
    create?: XOR<BookmarkCreateWithoutMusicInput, BookmarkUncheckedCreateWithoutMusicInput> | BookmarkCreateWithoutMusicInput[] | BookmarkUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutMusicInput | BookmarkCreateOrConnectWithoutMusicInput[]
    upsert?: BookmarkUpsertWithWhereUniqueWithoutMusicInput | BookmarkUpsertWithWhereUniqueWithoutMusicInput[]
    createMany?: BookmarkCreateManyMusicInputEnvelope
    set?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    disconnect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    delete?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    update?: BookmarkUpdateWithWhereUniqueWithoutMusicInput | BookmarkUpdateWithWhereUniqueWithoutMusicInput[]
    updateMany?: BookmarkUpdateManyWithWhereWithoutMusicInput | BookmarkUpdateManyWithWhereWithoutMusicInput[]
    deleteMany?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
  }

  export type BasicBestPlayUpdateManyWithoutMusicNestedInput = {
    create?: XOR<BasicBestPlayCreateWithoutMusicInput, BasicBestPlayUncheckedCreateWithoutMusicInput> | BasicBestPlayCreateWithoutMusicInput[] | BasicBestPlayUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: BasicBestPlayCreateOrConnectWithoutMusicInput | BasicBestPlayCreateOrConnectWithoutMusicInput[]
    upsert?: BasicBestPlayUpsertWithWhereUniqueWithoutMusicInput | BasicBestPlayUpsertWithWhereUniqueWithoutMusicInput[]
    createMany?: BasicBestPlayCreateManyMusicInputEnvelope
    set?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    disconnect?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    delete?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    connect?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    update?: BasicBestPlayUpdateWithWhereUniqueWithoutMusicInput | BasicBestPlayUpdateWithWhereUniqueWithoutMusicInput[]
    updateMany?: BasicBestPlayUpdateManyWithWhereWithoutMusicInput | BasicBestPlayUpdateManyWithWhereWithoutMusicInput[]
    deleteMany?: BasicBestPlayScalarWhereInput | BasicBestPlayScalarWhereInput[]
  }

  export type RecitalBestPlayUpdateManyWithoutMusicNestedInput = {
    create?: XOR<RecitalBestPlayCreateWithoutMusicInput, RecitalBestPlayUncheckedCreateWithoutMusicInput> | RecitalBestPlayCreateWithoutMusicInput[] | RecitalBestPlayUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: RecitalBestPlayCreateOrConnectWithoutMusicInput | RecitalBestPlayCreateOrConnectWithoutMusicInput[]
    upsert?: RecitalBestPlayUpsertWithWhereUniqueWithoutMusicInput | RecitalBestPlayUpsertWithWhereUniqueWithoutMusicInput[]
    createMany?: RecitalBestPlayCreateManyMusicInputEnvelope
    set?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    disconnect?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    delete?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    connect?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    update?: RecitalBestPlayUpdateWithWhereUniqueWithoutMusicInput | RecitalBestPlayUpdateWithWhereUniqueWithoutMusicInput[]
    updateMany?: RecitalBestPlayUpdateManyWithWhereWithoutMusicInput | RecitalBestPlayUpdateManyWithWhereWithoutMusicInput[]
    deleteMany?: RecitalBestPlayScalarWhereInput | RecitalBestPlayScalarWhereInput[]
  }

  export type RecentPlayUncheckedUpdateManyWithoutMusicNestedInput = {
    create?: XOR<RecentPlayCreateWithoutMusicInput, RecentPlayUncheckedCreateWithoutMusicInput> | RecentPlayCreateWithoutMusicInput[] | RecentPlayUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: RecentPlayCreateOrConnectWithoutMusicInput | RecentPlayCreateOrConnectWithoutMusicInput[]
    upsert?: RecentPlayUpsertWithWhereUniqueWithoutMusicInput | RecentPlayUpsertWithWhereUniqueWithoutMusicInput[]
    createMany?: RecentPlayCreateManyMusicInputEnvelope
    set?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    disconnect?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    delete?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    connect?: RecentPlayWhereUniqueInput | RecentPlayWhereUniqueInput[]
    update?: RecentPlayUpdateWithWhereUniqueWithoutMusicInput | RecentPlayUpdateWithWhereUniqueWithoutMusicInput[]
    updateMany?: RecentPlayUpdateManyWithWhereWithoutMusicInput | RecentPlayUpdateManyWithWhereWithoutMusicInput[]
    deleteMany?: RecentPlayScalarWhereInput | RecentPlayScalarWhereInput[]
  }

  export type PlayDataUncheckedUpdateManyWithoutMusicNestedInput = {
    create?: XOR<PlayDataCreateWithoutMusicInput, PlayDataUncheckedCreateWithoutMusicInput> | PlayDataCreateWithoutMusicInput[] | PlayDataUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: PlayDataCreateOrConnectWithoutMusicInput | PlayDataCreateOrConnectWithoutMusicInput[]
    upsert?: PlayDataUpsertWithWhereUniqueWithoutMusicInput | PlayDataUpsertWithWhereUniqueWithoutMusicInput[]
    createMany?: PlayDataCreateManyMusicInputEnvelope
    set?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    disconnect?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    delete?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    connect?: PlayDataWhereUniqueInput | PlayDataWhereUniqueInput[]
    update?: PlayDataUpdateWithWhereUniqueWithoutMusicInput | PlayDataUpdateWithWhereUniqueWithoutMusicInput[]
    updateMany?: PlayDataUpdateManyWithWhereWithoutMusicInput | PlayDataUpdateManyWithWhereWithoutMusicInput[]
    deleteMany?: PlayDataScalarWhereInput | PlayDataScalarWhereInput[]
  }

  export type BookmarkUncheckedUpdateManyWithoutMusicNestedInput = {
    create?: XOR<BookmarkCreateWithoutMusicInput, BookmarkUncheckedCreateWithoutMusicInput> | BookmarkCreateWithoutMusicInput[] | BookmarkUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutMusicInput | BookmarkCreateOrConnectWithoutMusicInput[]
    upsert?: BookmarkUpsertWithWhereUniqueWithoutMusicInput | BookmarkUpsertWithWhereUniqueWithoutMusicInput[]
    createMany?: BookmarkCreateManyMusicInputEnvelope
    set?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    disconnect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    delete?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    update?: BookmarkUpdateWithWhereUniqueWithoutMusicInput | BookmarkUpdateWithWhereUniqueWithoutMusicInput[]
    updateMany?: BookmarkUpdateManyWithWhereWithoutMusicInput | BookmarkUpdateManyWithWhereWithoutMusicInput[]
    deleteMany?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
  }

  export type BasicBestPlayUncheckedUpdateManyWithoutMusicNestedInput = {
    create?: XOR<BasicBestPlayCreateWithoutMusicInput, BasicBestPlayUncheckedCreateWithoutMusicInput> | BasicBestPlayCreateWithoutMusicInput[] | BasicBestPlayUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: BasicBestPlayCreateOrConnectWithoutMusicInput | BasicBestPlayCreateOrConnectWithoutMusicInput[]
    upsert?: BasicBestPlayUpsertWithWhereUniqueWithoutMusicInput | BasicBestPlayUpsertWithWhereUniqueWithoutMusicInput[]
    createMany?: BasicBestPlayCreateManyMusicInputEnvelope
    set?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    disconnect?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    delete?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    connect?: BasicBestPlayWhereUniqueInput | BasicBestPlayWhereUniqueInput[]
    update?: BasicBestPlayUpdateWithWhereUniqueWithoutMusicInput | BasicBestPlayUpdateWithWhereUniqueWithoutMusicInput[]
    updateMany?: BasicBestPlayUpdateManyWithWhereWithoutMusicInput | BasicBestPlayUpdateManyWithWhereWithoutMusicInput[]
    deleteMany?: BasicBestPlayScalarWhereInput | BasicBestPlayScalarWhereInput[]
  }

  export type RecitalBestPlayUncheckedUpdateManyWithoutMusicNestedInput = {
    create?: XOR<RecitalBestPlayCreateWithoutMusicInput, RecitalBestPlayUncheckedCreateWithoutMusicInput> | RecitalBestPlayCreateWithoutMusicInput[] | RecitalBestPlayUncheckedCreateWithoutMusicInput[]
    connectOrCreate?: RecitalBestPlayCreateOrConnectWithoutMusicInput | RecitalBestPlayCreateOrConnectWithoutMusicInput[]
    upsert?: RecitalBestPlayUpsertWithWhereUniqueWithoutMusicInput | RecitalBestPlayUpsertWithWhereUniqueWithoutMusicInput[]
    createMany?: RecitalBestPlayCreateManyMusicInputEnvelope
    set?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    disconnect?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    delete?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    connect?: RecitalBestPlayWhereUniqueInput | RecitalBestPlayWhereUniqueInput[]
    update?: RecitalBestPlayUpdateWithWhereUniqueWithoutMusicInput | RecitalBestPlayUpdateWithWhereUniqueWithoutMusicInput[]
    updateMany?: RecitalBestPlayUpdateManyWithWhereWithoutMusicInput | RecitalBestPlayUpdateManyWithWhereWithoutMusicInput[]
    deleteMany?: RecitalBestPlayScalarWhereInput | RecitalBestPlayScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPlayHistoryInput = {
    create?: XOR<UserCreateWithoutPlayHistoryInput, UserUncheckedCreateWithoutPlayHistoryInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlayHistoryInput
    connect?: UserWhereUniqueInput
  }

  export type MusicCreateNestedOneWithoutRecentPlayInput = {
    create?: XOR<MusicCreateWithoutRecentPlayInput, MusicUncheckedCreateWithoutRecentPlayInput>
    connectOrCreate?: MusicCreateOrConnectWithoutRecentPlayInput
    connect?: MusicWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPlayHistoryNestedInput = {
    create?: XOR<UserCreateWithoutPlayHistoryInput, UserUncheckedCreateWithoutPlayHistoryInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlayHistoryInput
    upsert?: UserUpsertWithoutPlayHistoryInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPlayHistoryInput, UserUpdateWithoutPlayHistoryInput>, UserUncheckedUpdateWithoutPlayHistoryInput>
  }

  export type MusicUpdateOneRequiredWithoutRecentPlayNestedInput = {
    create?: XOR<MusicCreateWithoutRecentPlayInput, MusicUncheckedCreateWithoutRecentPlayInput>
    connectOrCreate?: MusicCreateOrConnectWithoutRecentPlayInput
    upsert?: MusicUpsertWithoutRecentPlayInput
    connect?: MusicWhereUniqueInput
    update?: XOR<XOR<MusicUpdateToOneWithWhereWithoutRecentPlayInput, MusicUpdateWithoutRecentPlayInput>, MusicUncheckedUpdateWithoutRecentPlayInput>
  }

  export type UserCreateNestedOneWithoutUserBestGradeInput = {
    create?: XOR<UserCreateWithoutUserBestGradeInput, UserUncheckedCreateWithoutUserBestGradeInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserBestGradeInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUserBestGradeNestedInput = {
    create?: XOR<UserCreateWithoutUserBestGradeInput, UserUncheckedCreateWithoutUserBestGradeInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserBestGradeInput
    upsert?: UserUpsertWithoutUserBestGradeInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserBestGradeInput, UserUpdateWithoutUserBestGradeInput>, UserUncheckedUpdateWithoutUserBestGradeInput>
  }

  export type UserCreateNestedOneWithoutBasicBestPlayInput = {
    create?: XOR<UserCreateWithoutBasicBestPlayInput, UserUncheckedCreateWithoutBasicBestPlayInput>
    connectOrCreate?: UserCreateOrConnectWithoutBasicBestPlayInput
    connect?: UserWhereUniqueInput
  }

  export type MusicCreateNestedOneWithoutBasicBestPlayInput = {
    create?: XOR<MusicCreateWithoutBasicBestPlayInput, MusicUncheckedCreateWithoutBasicBestPlayInput>
    connectOrCreate?: MusicCreateOrConnectWithoutBasicBestPlayInput
    connect?: MusicWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutBasicBestPlayNestedInput = {
    create?: XOR<UserCreateWithoutBasicBestPlayInput, UserUncheckedCreateWithoutBasicBestPlayInput>
    connectOrCreate?: UserCreateOrConnectWithoutBasicBestPlayInput
    upsert?: UserUpsertWithoutBasicBestPlayInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBasicBestPlayInput, UserUpdateWithoutBasicBestPlayInput>, UserUncheckedUpdateWithoutBasicBestPlayInput>
  }

  export type MusicUpdateOneRequiredWithoutBasicBestPlayNestedInput = {
    create?: XOR<MusicCreateWithoutBasicBestPlayInput, MusicUncheckedCreateWithoutBasicBestPlayInput>
    connectOrCreate?: MusicCreateOrConnectWithoutBasicBestPlayInput
    upsert?: MusicUpsertWithoutBasicBestPlayInput
    connect?: MusicWhereUniqueInput
    update?: XOR<XOR<MusicUpdateToOneWithWhereWithoutBasicBestPlayInput, MusicUpdateWithoutBasicBestPlayInput>, MusicUncheckedUpdateWithoutBasicBestPlayInput>
  }

  export type UserCreateNestedOneWithoutRecitalBestPlayInput = {
    create?: XOR<UserCreateWithoutRecitalBestPlayInput, UserUncheckedCreateWithoutRecitalBestPlayInput>
    connectOrCreate?: UserCreateOrConnectWithoutRecitalBestPlayInput
    connect?: UserWhereUniqueInput
  }

  export type MusicCreateNestedOneWithoutRecitalBestPlayInput = {
    create?: XOR<MusicCreateWithoutRecitalBestPlayInput, MusicUncheckedCreateWithoutRecitalBestPlayInput>
    connectOrCreate?: MusicCreateOrConnectWithoutRecitalBestPlayInput
    connect?: MusicWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutRecitalBestPlayNestedInput = {
    create?: XOR<UserCreateWithoutRecitalBestPlayInput, UserUncheckedCreateWithoutRecitalBestPlayInput>
    connectOrCreate?: UserCreateOrConnectWithoutRecitalBestPlayInput
    upsert?: UserUpsertWithoutRecitalBestPlayInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRecitalBestPlayInput, UserUpdateWithoutRecitalBestPlayInput>, UserUncheckedUpdateWithoutRecitalBestPlayInput>
  }

  export type MusicUpdateOneRequiredWithoutRecitalBestPlayNestedInput = {
    create?: XOR<MusicCreateWithoutRecitalBestPlayInput, MusicUncheckedCreateWithoutRecitalBestPlayInput>
    connectOrCreate?: MusicCreateOrConnectWithoutRecitalBestPlayInput
    upsert?: MusicUpsertWithoutRecitalBestPlayInput
    connect?: MusicWhereUniqueInput
    update?: XOR<XOR<MusicUpdateToOneWithWhereWithoutRecitalBestPlayInput, MusicUpdateWithoutRecitalBestPlayInput>, MusicUncheckedUpdateWithoutRecitalBestPlayInput>
  }

  export type UserCreateNestedOneWithoutPlayDataInput = {
    create?: XOR<UserCreateWithoutPlayDataInput, UserUncheckedCreateWithoutPlayDataInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlayDataInput
    connect?: UserWhereUniqueInput
  }

  export type MusicCreateNestedOneWithoutPlayDataInput = {
    create?: XOR<MusicCreateWithoutPlayDataInput, MusicUncheckedCreateWithoutPlayDataInput>
    connectOrCreate?: MusicCreateOrConnectWithoutPlayDataInput
    connect?: MusicWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPlayDataNestedInput = {
    create?: XOR<UserCreateWithoutPlayDataInput, UserUncheckedCreateWithoutPlayDataInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlayDataInput
    upsert?: UserUpsertWithoutPlayDataInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPlayDataInput, UserUpdateWithoutPlayDataInput>, UserUncheckedUpdateWithoutPlayDataInput>
  }

  export type MusicUpdateOneRequiredWithoutPlayDataNestedInput = {
    create?: XOR<MusicCreateWithoutPlayDataInput, MusicUncheckedCreateWithoutPlayDataInput>
    connectOrCreate?: MusicCreateOrConnectWithoutPlayDataInput
    upsert?: MusicUpsertWithoutPlayDataInput
    connect?: MusicWhereUniqueInput
    update?: XOR<XOR<MusicUpdateToOneWithWhereWithoutPlayDataInput, MusicUpdateWithoutPlayDataInput>, MusicUncheckedUpdateWithoutPlayDataInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type RecentPlayCreateWithoutUserInput = {
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    play_time: string
    grade_basic: number
    created_at?: Date | string
    updated_at?: Date | string
    music: MusicCreateNestedOneWithoutRecentPlayInput
  }

  export type RecentPlayUncheckedCreateWithoutUserInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    play_time: string
    grade_basic: number
    created_at?: Date | string
    updated_at?: Date | string
    music_idx: string
  }

  export type RecentPlayCreateOrConnectWithoutUserInput = {
    where: RecentPlayWhereUniqueInput
    create: XOR<RecentPlayCreateWithoutUserInput, RecentPlayUncheckedCreateWithoutUserInput>
  }

  export type RecentPlayCreateManyUserInputEnvelope = {
    data: RecentPlayCreateManyUserInput | RecentPlayCreateManyUserInput[]
  }

  export type PlayDataCreateWithoutUserInput = {
    level: number
    difficulty: string
    score: number
    rank: string
    fc_type: number
    play_count: number
    fullcombo_count: number
    pianistic_count: number
    max_combo: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
    music: MusicCreateNestedOneWithoutPlayDataInput
  }

  export type PlayDataUncheckedCreateWithoutUserInput = {
    id?: number
    level: number
    difficulty: string
    score: number
    rank: string
    fc_type: number
    play_count: number
    fullcombo_count: number
    pianistic_count: number
    max_combo: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
    music_idx: string
  }

  export type PlayDataCreateOrConnectWithoutUserInput = {
    where: PlayDataWhereUniqueInput
    create: XOR<PlayDataCreateWithoutUserInput, PlayDataUncheckedCreateWithoutUserInput>
  }

  export type PlayDataCreateManyUserInputEnvelope = {
    data: PlayDataCreateManyUserInput | PlayDataCreateManyUserInput[]
  }

  export type BookmarkCreateWithoutUserInput = {
    created_at?: Date | string
    updated_at?: Date | string
    music: MusicCreateNestedOneWithoutBookmarkInput
  }

  export type BookmarkUncheckedCreateWithoutUserInput = {
    id?: number
    music_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type BookmarkCreateOrConnectWithoutUserInput = {
    where: BookmarkWhereUniqueInput
    create: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput>
  }

  export type BookmarkCreateManyUserInputEnvelope = {
    data: BookmarkCreateManyUserInput | BookmarkCreateManyUserInput[]
  }

  export type BasicBestPlayCreateWithoutUserInput = {
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_basic: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    music: MusicCreateNestedOneWithoutBasicBestPlayInput
  }

  export type BasicBestPlayUncheckedCreateWithoutUserInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_basic: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    music_idx: string
  }

  export type BasicBestPlayCreateOrConnectWithoutUserInput = {
    where: BasicBestPlayWhereUniqueInput
    create: XOR<BasicBestPlayCreateWithoutUserInput, BasicBestPlayUncheckedCreateWithoutUserInput>
  }

  export type BasicBestPlayCreateManyUserInputEnvelope = {
    data: BasicBestPlayCreateManyUserInput | BasicBestPlayCreateManyUserInput[]
  }

  export type RecitalBestPlayCreateWithoutUserInput = {
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_recital: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    music: MusicCreateNestedOneWithoutRecitalBestPlayInput
  }

  export type RecitalBestPlayUncheckedCreateWithoutUserInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_recital: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    music_idx: string
  }

  export type RecitalBestPlayCreateOrConnectWithoutUserInput = {
    where: RecitalBestPlayWhereUniqueInput
    create: XOR<RecitalBestPlayCreateWithoutUserInput, RecitalBestPlayUncheckedCreateWithoutUserInput>
  }

  export type RecitalBestPlayCreateManyUserInputEnvelope = {
    data: RecitalBestPlayCreateManyUserInput | RecitalBestPlayCreateManyUserInput[]
  }

  export type UserBestGradeCreateWithoutUserInput = {
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type UserBestGradeUncheckedCreateWithoutUserInput = {
    id?: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type UserBestGradeCreateOrConnectWithoutUserInput = {
    where: UserBestGradeWhereUniqueInput
    create: XOR<UserBestGradeCreateWithoutUserInput, UserBestGradeUncheckedCreateWithoutUserInput>
  }

  export type UserBestGradeCreateManyUserInputEnvelope = {
    data: UserBestGradeCreateManyUserInput | UserBestGradeCreateManyUserInput[]
  }

  export type RecentPlayUpsertWithWhereUniqueWithoutUserInput = {
    where: RecentPlayWhereUniqueInput
    update: XOR<RecentPlayUpdateWithoutUserInput, RecentPlayUncheckedUpdateWithoutUserInput>
    create: XOR<RecentPlayCreateWithoutUserInput, RecentPlayUncheckedCreateWithoutUserInput>
  }

  export type RecentPlayUpdateWithWhereUniqueWithoutUserInput = {
    where: RecentPlayWhereUniqueInput
    data: XOR<RecentPlayUpdateWithoutUserInput, RecentPlayUncheckedUpdateWithoutUserInput>
  }

  export type RecentPlayUpdateManyWithWhereWithoutUserInput = {
    where: RecentPlayScalarWhereInput
    data: XOR<RecentPlayUpdateManyMutationInput, RecentPlayUncheckedUpdateManyWithoutUserInput>
  }

  export type RecentPlayScalarWhereInput = {
    AND?: RecentPlayScalarWhereInput | RecentPlayScalarWhereInput[]
    OR?: RecentPlayScalarWhereInput[]
    NOT?: RecentPlayScalarWhereInput | RecentPlayScalarWhereInput[]
    id?: IntFilter<"RecentPlay"> | number
    difficulty?: StringFilter<"RecentPlay"> | string
    level?: IntFilter<"RecentPlay"> | number
    score?: IntFilter<"RecentPlay"> | number
    max_combo?: IntFilter<"RecentPlay"> | number
    rank?: StringFilter<"RecentPlay"> | string
    play_time?: StringFilter<"RecentPlay"> | string
    grade_basic?: IntFilter<"RecentPlay"> | number
    created_at?: DateTimeFilter<"RecentPlay"> | Date | string
    updated_at?: DateTimeFilter<"RecentPlay"> | Date | string
    user_id?: IntFilter<"RecentPlay"> | number
    music_idx?: StringFilter<"RecentPlay"> | string
  }

  export type PlayDataUpsertWithWhereUniqueWithoutUserInput = {
    where: PlayDataWhereUniqueInput
    update: XOR<PlayDataUpdateWithoutUserInput, PlayDataUncheckedUpdateWithoutUserInput>
    create: XOR<PlayDataCreateWithoutUserInput, PlayDataUncheckedCreateWithoutUserInput>
  }

  export type PlayDataUpdateWithWhereUniqueWithoutUserInput = {
    where: PlayDataWhereUniqueInput
    data: XOR<PlayDataUpdateWithoutUserInput, PlayDataUncheckedUpdateWithoutUserInput>
  }

  export type PlayDataUpdateManyWithWhereWithoutUserInput = {
    where: PlayDataScalarWhereInput
    data: XOR<PlayDataUpdateManyMutationInput, PlayDataUncheckedUpdateManyWithoutUserInput>
  }

  export type PlayDataScalarWhereInput = {
    AND?: PlayDataScalarWhereInput | PlayDataScalarWhereInput[]
    OR?: PlayDataScalarWhereInput[]
    NOT?: PlayDataScalarWhereInput | PlayDataScalarWhereInput[]
    id?: IntFilter<"PlayData"> | number
    level?: IntFilter<"PlayData"> | number
    difficulty?: StringFilter<"PlayData"> | string
    score?: IntFilter<"PlayData"> | number
    rank?: StringFilter<"PlayData"> | string
    fc_type?: IntFilter<"PlayData"> | number
    play_count?: IntFilter<"PlayData"> | number
    fullcombo_count?: IntFilter<"PlayData"> | number
    pianistic_count?: IntFilter<"PlayData"> | number
    max_combo?: IntFilter<"PlayData"> | number
    grade_basic?: IntFilter<"PlayData"> | number
    grade_recital?: IntFilter<"PlayData"> | number
    besttime?: StringFilter<"PlayData"> | string
    created_at?: DateTimeFilter<"PlayData"> | Date | string
    updated_at?: DateTimeFilter<"PlayData"> | Date | string
    user_id?: IntFilter<"PlayData"> | number
    music_idx?: StringFilter<"PlayData"> | string
  }

  export type BookmarkUpsertWithWhereUniqueWithoutUserInput = {
    where: BookmarkWhereUniqueInput
    update: XOR<BookmarkUpdateWithoutUserInput, BookmarkUncheckedUpdateWithoutUserInput>
    create: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput>
  }

  export type BookmarkUpdateWithWhereUniqueWithoutUserInput = {
    where: BookmarkWhereUniqueInput
    data: XOR<BookmarkUpdateWithoutUserInput, BookmarkUncheckedUpdateWithoutUserInput>
  }

  export type BookmarkUpdateManyWithWhereWithoutUserInput = {
    where: BookmarkScalarWhereInput
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyWithoutUserInput>
  }

  export type BookmarkScalarWhereInput = {
    AND?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
    OR?: BookmarkScalarWhereInput[]
    NOT?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
    id?: IntFilter<"Bookmark"> | number
    user_id?: IntFilter<"Bookmark"> | number
    music_id?: IntFilter<"Bookmark"> | number
    created_at?: DateTimeFilter<"Bookmark"> | Date | string
    updated_at?: DateTimeFilter<"Bookmark"> | Date | string
  }

  export type BasicBestPlayUpsertWithWhereUniqueWithoutUserInput = {
    where: BasicBestPlayWhereUniqueInput
    update: XOR<BasicBestPlayUpdateWithoutUserInput, BasicBestPlayUncheckedUpdateWithoutUserInput>
    create: XOR<BasicBestPlayCreateWithoutUserInput, BasicBestPlayUncheckedCreateWithoutUserInput>
  }

  export type BasicBestPlayUpdateWithWhereUniqueWithoutUserInput = {
    where: BasicBestPlayWhereUniqueInput
    data: XOR<BasicBestPlayUpdateWithoutUserInput, BasicBestPlayUncheckedUpdateWithoutUserInput>
  }

  export type BasicBestPlayUpdateManyWithWhereWithoutUserInput = {
    where: BasicBestPlayScalarWhereInput
    data: XOR<BasicBestPlayUpdateManyMutationInput, BasicBestPlayUncheckedUpdateManyWithoutUserInput>
  }

  export type BasicBestPlayScalarWhereInput = {
    AND?: BasicBestPlayScalarWhereInput | BasicBestPlayScalarWhereInput[]
    OR?: BasicBestPlayScalarWhereInput[]
    NOT?: BasicBestPlayScalarWhereInput | BasicBestPlayScalarWhereInput[]
    id?: IntFilter<"BasicBestPlay"> | number
    difficulty?: StringFilter<"BasicBestPlay"> | string
    level?: IntFilter<"BasicBestPlay"> | number
    score?: IntFilter<"BasicBestPlay"> | number
    max_combo?: IntFilter<"BasicBestPlay"> | number
    rank?: StringFilter<"BasicBestPlay"> | string
    besttime?: StringFilter<"BasicBestPlay"> | string
    grade_basic?: IntFilter<"BasicBestPlay"> | number
    fc_type?: IntFilter<"BasicBestPlay"> | number
    created_at?: DateTimeFilter<"BasicBestPlay"> | Date | string
    updated_at?: DateTimeFilter<"BasicBestPlay"> | Date | string
    user_id?: IntFilter<"BasicBestPlay"> | number
    music_idx?: StringFilter<"BasicBestPlay"> | string
  }

  export type RecitalBestPlayUpsertWithWhereUniqueWithoutUserInput = {
    where: RecitalBestPlayWhereUniqueInput
    update: XOR<RecitalBestPlayUpdateWithoutUserInput, RecitalBestPlayUncheckedUpdateWithoutUserInput>
    create: XOR<RecitalBestPlayCreateWithoutUserInput, RecitalBestPlayUncheckedCreateWithoutUserInput>
  }

  export type RecitalBestPlayUpdateWithWhereUniqueWithoutUserInput = {
    where: RecitalBestPlayWhereUniqueInput
    data: XOR<RecitalBestPlayUpdateWithoutUserInput, RecitalBestPlayUncheckedUpdateWithoutUserInput>
  }

  export type RecitalBestPlayUpdateManyWithWhereWithoutUserInput = {
    where: RecitalBestPlayScalarWhereInput
    data: XOR<RecitalBestPlayUpdateManyMutationInput, RecitalBestPlayUncheckedUpdateManyWithoutUserInput>
  }

  export type RecitalBestPlayScalarWhereInput = {
    AND?: RecitalBestPlayScalarWhereInput | RecitalBestPlayScalarWhereInput[]
    OR?: RecitalBestPlayScalarWhereInput[]
    NOT?: RecitalBestPlayScalarWhereInput | RecitalBestPlayScalarWhereInput[]
    id?: IntFilter<"RecitalBestPlay"> | number
    difficulty?: StringFilter<"RecitalBestPlay"> | string
    level?: IntFilter<"RecitalBestPlay"> | number
    score?: IntFilter<"RecitalBestPlay"> | number
    max_combo?: IntFilter<"RecitalBestPlay"> | number
    rank?: StringFilter<"RecitalBestPlay"> | string
    besttime?: StringFilter<"RecitalBestPlay"> | string
    grade_recital?: IntFilter<"RecitalBestPlay"> | number
    fc_type?: IntFilter<"RecitalBestPlay"> | number
    created_at?: DateTimeFilter<"RecitalBestPlay"> | Date | string
    updated_at?: DateTimeFilter<"RecitalBestPlay"> | Date | string
    user_id?: IntFilter<"RecitalBestPlay"> | number
    music_idx?: StringFilter<"RecitalBestPlay"> | string
  }

  export type UserBestGradeUpsertWithWhereUniqueWithoutUserInput = {
    where: UserBestGradeWhereUniqueInput
    update: XOR<UserBestGradeUpdateWithoutUserInput, UserBestGradeUncheckedUpdateWithoutUserInput>
    create: XOR<UserBestGradeCreateWithoutUserInput, UserBestGradeUncheckedCreateWithoutUserInput>
  }

  export type UserBestGradeUpdateWithWhereUniqueWithoutUserInput = {
    where: UserBestGradeWhereUniqueInput
    data: XOR<UserBestGradeUpdateWithoutUserInput, UserBestGradeUncheckedUpdateWithoutUserInput>
  }

  export type UserBestGradeUpdateManyWithWhereWithoutUserInput = {
    where: UserBestGradeScalarWhereInput
    data: XOR<UserBestGradeUpdateManyMutationInput, UserBestGradeUncheckedUpdateManyWithoutUserInput>
  }

  export type UserBestGradeScalarWhereInput = {
    AND?: UserBestGradeScalarWhereInput | UserBestGradeScalarWhereInput[]
    OR?: UserBestGradeScalarWhereInput[]
    NOT?: UserBestGradeScalarWhereInput | UserBestGradeScalarWhereInput[]
    id?: IntFilter<"UserBestGrade"> | number
    grade_basic?: IntFilter<"UserBestGrade"> | number
    grade_recital?: IntFilter<"UserBestGrade"> | number
    besttime?: StringFilter<"UserBestGrade"> | string
    created_at?: DateTimeFilter<"UserBestGrade"> | Date | string
    updated_at?: DateTimeFilter<"UserBestGrade"> | Date | string
    user_id?: IntFilter<"UserBestGrade"> | number
  }

  export type UserCreateWithoutBookmarkInput = {
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    PlayHistory?: RecentPlayCreateNestedManyWithoutUserInput
    PlayData?: PlayDataCreateNestedManyWithoutUserInput
    BasicBestPlay?: BasicBestPlayCreateNestedManyWithoutUserInput
    RecitalBestPlay?: RecitalBestPlayCreateNestedManyWithoutUserInput
    UserBestGrade?: UserBestGradeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBookmarkInput = {
    id?: number
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    PlayHistory?: RecentPlayUncheckedCreateNestedManyWithoutUserInput
    PlayData?: PlayDataUncheckedCreateNestedManyWithoutUserInput
    BasicBestPlay?: BasicBestPlayUncheckedCreateNestedManyWithoutUserInput
    RecitalBestPlay?: RecitalBestPlayUncheckedCreateNestedManyWithoutUserInput
    UserBestGrade?: UserBestGradeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBookmarkInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBookmarkInput, UserUncheckedCreateWithoutBookmarkInput>
  }

  export type MusicCreateWithoutBookmarkInput = {
    index: string
    title: string
    title_kana: string
    artist?: string | null
    category: string
    category_short: string
    description?: string | null
    background?: string | null
    sheet_len: number
    difficulty_levels: string
    difficulty_name: string
    created_at?: Date | string
    updated_at?: Date | string
    RecentPlay?: RecentPlayCreateNestedManyWithoutMusicInput
    PlayData?: PlayDataCreateNestedManyWithoutMusicInput
    BasicBestPlay?: BasicBestPlayCreateNestedManyWithoutMusicInput
    RecitalBestPlay?: RecitalBestPlayCreateNestedManyWithoutMusicInput
  }

  export type MusicUncheckedCreateWithoutBookmarkInput = {
    id?: number
    index: string
    title: string
    title_kana: string
    artist?: string | null
    category: string
    category_short: string
    description?: string | null
    background?: string | null
    sheet_len: number
    difficulty_levels: string
    difficulty_name: string
    created_at?: Date | string
    updated_at?: Date | string
    RecentPlay?: RecentPlayUncheckedCreateNestedManyWithoutMusicInput
    PlayData?: PlayDataUncheckedCreateNestedManyWithoutMusicInput
    BasicBestPlay?: BasicBestPlayUncheckedCreateNestedManyWithoutMusicInput
    RecitalBestPlay?: RecitalBestPlayUncheckedCreateNestedManyWithoutMusicInput
  }

  export type MusicCreateOrConnectWithoutBookmarkInput = {
    where: MusicWhereUniqueInput
    create: XOR<MusicCreateWithoutBookmarkInput, MusicUncheckedCreateWithoutBookmarkInput>
  }

  export type UserUpsertWithoutBookmarkInput = {
    update: XOR<UserUpdateWithoutBookmarkInput, UserUncheckedUpdateWithoutBookmarkInput>
    create: XOR<UserCreateWithoutBookmarkInput, UserUncheckedCreateWithoutBookmarkInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBookmarkInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBookmarkInput, UserUncheckedUpdateWithoutBookmarkInput>
  }

  export type UserUpdateWithoutBookmarkInput = {
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayHistory?: RecentPlayUpdateManyWithoutUserNestedInput
    PlayData?: PlayDataUpdateManyWithoutUserNestedInput
    BasicBestPlay?: BasicBestPlayUpdateManyWithoutUserNestedInput
    RecitalBestPlay?: RecitalBestPlayUpdateManyWithoutUserNestedInput
    UserBestGrade?: UserBestGradeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBookmarkInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayHistory?: RecentPlayUncheckedUpdateManyWithoutUserNestedInput
    PlayData?: PlayDataUncheckedUpdateManyWithoutUserNestedInput
    BasicBestPlay?: BasicBestPlayUncheckedUpdateManyWithoutUserNestedInput
    RecitalBestPlay?: RecitalBestPlayUncheckedUpdateManyWithoutUserNestedInput
    UserBestGrade?: UserBestGradeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MusicUpsertWithoutBookmarkInput = {
    update: XOR<MusicUpdateWithoutBookmarkInput, MusicUncheckedUpdateWithoutBookmarkInput>
    create: XOR<MusicCreateWithoutBookmarkInput, MusicUncheckedCreateWithoutBookmarkInput>
    where?: MusicWhereInput
  }

  export type MusicUpdateToOneWithWhereWithoutBookmarkInput = {
    where?: MusicWhereInput
    data: XOR<MusicUpdateWithoutBookmarkInput, MusicUncheckedUpdateWithoutBookmarkInput>
  }

  export type MusicUpdateWithoutBookmarkInput = {
    index?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    title_kana?: StringFieldUpdateOperationsInput | string
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    category_short?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    sheet_len?: IntFieldUpdateOperationsInput | number
    difficulty_levels?: StringFieldUpdateOperationsInput | string
    difficulty_name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    RecentPlay?: RecentPlayUpdateManyWithoutMusicNestedInput
    PlayData?: PlayDataUpdateManyWithoutMusicNestedInput
    BasicBestPlay?: BasicBestPlayUpdateManyWithoutMusicNestedInput
    RecitalBestPlay?: RecitalBestPlayUpdateManyWithoutMusicNestedInput
  }

  export type MusicUncheckedUpdateWithoutBookmarkInput = {
    id?: IntFieldUpdateOperationsInput | number
    index?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    title_kana?: StringFieldUpdateOperationsInput | string
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    category_short?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    sheet_len?: IntFieldUpdateOperationsInput | number
    difficulty_levels?: StringFieldUpdateOperationsInput | string
    difficulty_name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    RecentPlay?: RecentPlayUncheckedUpdateManyWithoutMusicNestedInput
    PlayData?: PlayDataUncheckedUpdateManyWithoutMusicNestedInput
    BasicBestPlay?: BasicBestPlayUncheckedUpdateManyWithoutMusicNestedInput
    RecitalBestPlay?: RecitalBestPlayUncheckedUpdateManyWithoutMusicNestedInput
  }

  export type RecentPlayCreateWithoutMusicInput = {
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    play_time: string
    grade_basic: number
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutPlayHistoryInput
  }

  export type RecentPlayUncheckedCreateWithoutMusicInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    play_time: string
    grade_basic: number
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
  }

  export type RecentPlayCreateOrConnectWithoutMusicInput = {
    where: RecentPlayWhereUniqueInput
    create: XOR<RecentPlayCreateWithoutMusicInput, RecentPlayUncheckedCreateWithoutMusicInput>
  }

  export type RecentPlayCreateManyMusicInputEnvelope = {
    data: RecentPlayCreateManyMusicInput | RecentPlayCreateManyMusicInput[]
  }

  export type PlayDataCreateWithoutMusicInput = {
    level: number
    difficulty: string
    score: number
    rank: string
    fc_type: number
    play_count: number
    fullcombo_count: number
    pianistic_count: number
    max_combo: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutPlayDataInput
  }

  export type PlayDataUncheckedCreateWithoutMusicInput = {
    id?: number
    level: number
    difficulty: string
    score: number
    rank: string
    fc_type: number
    play_count: number
    fullcombo_count: number
    pianistic_count: number
    max_combo: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
  }

  export type PlayDataCreateOrConnectWithoutMusicInput = {
    where: PlayDataWhereUniqueInput
    create: XOR<PlayDataCreateWithoutMusicInput, PlayDataUncheckedCreateWithoutMusicInput>
  }

  export type PlayDataCreateManyMusicInputEnvelope = {
    data: PlayDataCreateManyMusicInput | PlayDataCreateManyMusicInput[]
  }

  export type BookmarkCreateWithoutMusicInput = {
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutBookmarkInput
  }

  export type BookmarkUncheckedCreateWithoutMusicInput = {
    id?: number
    user_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type BookmarkCreateOrConnectWithoutMusicInput = {
    where: BookmarkWhereUniqueInput
    create: XOR<BookmarkCreateWithoutMusicInput, BookmarkUncheckedCreateWithoutMusicInput>
  }

  export type BookmarkCreateManyMusicInputEnvelope = {
    data: BookmarkCreateManyMusicInput | BookmarkCreateManyMusicInput[]
  }

  export type BasicBestPlayCreateWithoutMusicInput = {
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_basic: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutBasicBestPlayInput
  }

  export type BasicBestPlayUncheckedCreateWithoutMusicInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_basic: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
  }

  export type BasicBestPlayCreateOrConnectWithoutMusicInput = {
    where: BasicBestPlayWhereUniqueInput
    create: XOR<BasicBestPlayCreateWithoutMusicInput, BasicBestPlayUncheckedCreateWithoutMusicInput>
  }

  export type BasicBestPlayCreateManyMusicInputEnvelope = {
    data: BasicBestPlayCreateManyMusicInput | BasicBestPlayCreateManyMusicInput[]
  }

  export type RecitalBestPlayCreateWithoutMusicInput = {
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_recital: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutRecitalBestPlayInput
  }

  export type RecitalBestPlayUncheckedCreateWithoutMusicInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_recital: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
  }

  export type RecitalBestPlayCreateOrConnectWithoutMusicInput = {
    where: RecitalBestPlayWhereUniqueInput
    create: XOR<RecitalBestPlayCreateWithoutMusicInput, RecitalBestPlayUncheckedCreateWithoutMusicInput>
  }

  export type RecitalBestPlayCreateManyMusicInputEnvelope = {
    data: RecitalBestPlayCreateManyMusicInput | RecitalBestPlayCreateManyMusicInput[]
  }

  export type RecentPlayUpsertWithWhereUniqueWithoutMusicInput = {
    where: RecentPlayWhereUniqueInput
    update: XOR<RecentPlayUpdateWithoutMusicInput, RecentPlayUncheckedUpdateWithoutMusicInput>
    create: XOR<RecentPlayCreateWithoutMusicInput, RecentPlayUncheckedCreateWithoutMusicInput>
  }

  export type RecentPlayUpdateWithWhereUniqueWithoutMusicInput = {
    where: RecentPlayWhereUniqueInput
    data: XOR<RecentPlayUpdateWithoutMusicInput, RecentPlayUncheckedUpdateWithoutMusicInput>
  }

  export type RecentPlayUpdateManyWithWhereWithoutMusicInput = {
    where: RecentPlayScalarWhereInput
    data: XOR<RecentPlayUpdateManyMutationInput, RecentPlayUncheckedUpdateManyWithoutMusicInput>
  }

  export type PlayDataUpsertWithWhereUniqueWithoutMusicInput = {
    where: PlayDataWhereUniqueInput
    update: XOR<PlayDataUpdateWithoutMusicInput, PlayDataUncheckedUpdateWithoutMusicInput>
    create: XOR<PlayDataCreateWithoutMusicInput, PlayDataUncheckedCreateWithoutMusicInput>
  }

  export type PlayDataUpdateWithWhereUniqueWithoutMusicInput = {
    where: PlayDataWhereUniqueInput
    data: XOR<PlayDataUpdateWithoutMusicInput, PlayDataUncheckedUpdateWithoutMusicInput>
  }

  export type PlayDataUpdateManyWithWhereWithoutMusicInput = {
    where: PlayDataScalarWhereInput
    data: XOR<PlayDataUpdateManyMutationInput, PlayDataUncheckedUpdateManyWithoutMusicInput>
  }

  export type BookmarkUpsertWithWhereUniqueWithoutMusicInput = {
    where: BookmarkWhereUniqueInput
    update: XOR<BookmarkUpdateWithoutMusicInput, BookmarkUncheckedUpdateWithoutMusicInput>
    create: XOR<BookmarkCreateWithoutMusicInput, BookmarkUncheckedCreateWithoutMusicInput>
  }

  export type BookmarkUpdateWithWhereUniqueWithoutMusicInput = {
    where: BookmarkWhereUniqueInput
    data: XOR<BookmarkUpdateWithoutMusicInput, BookmarkUncheckedUpdateWithoutMusicInput>
  }

  export type BookmarkUpdateManyWithWhereWithoutMusicInput = {
    where: BookmarkScalarWhereInput
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyWithoutMusicInput>
  }

  export type BasicBestPlayUpsertWithWhereUniqueWithoutMusicInput = {
    where: BasicBestPlayWhereUniqueInput
    update: XOR<BasicBestPlayUpdateWithoutMusicInput, BasicBestPlayUncheckedUpdateWithoutMusicInput>
    create: XOR<BasicBestPlayCreateWithoutMusicInput, BasicBestPlayUncheckedCreateWithoutMusicInput>
  }

  export type BasicBestPlayUpdateWithWhereUniqueWithoutMusicInput = {
    where: BasicBestPlayWhereUniqueInput
    data: XOR<BasicBestPlayUpdateWithoutMusicInput, BasicBestPlayUncheckedUpdateWithoutMusicInput>
  }

  export type BasicBestPlayUpdateManyWithWhereWithoutMusicInput = {
    where: BasicBestPlayScalarWhereInput
    data: XOR<BasicBestPlayUpdateManyMutationInput, BasicBestPlayUncheckedUpdateManyWithoutMusicInput>
  }

  export type RecitalBestPlayUpsertWithWhereUniqueWithoutMusicInput = {
    where: RecitalBestPlayWhereUniqueInput
    update: XOR<RecitalBestPlayUpdateWithoutMusicInput, RecitalBestPlayUncheckedUpdateWithoutMusicInput>
    create: XOR<RecitalBestPlayCreateWithoutMusicInput, RecitalBestPlayUncheckedCreateWithoutMusicInput>
  }

  export type RecitalBestPlayUpdateWithWhereUniqueWithoutMusicInput = {
    where: RecitalBestPlayWhereUniqueInput
    data: XOR<RecitalBestPlayUpdateWithoutMusicInput, RecitalBestPlayUncheckedUpdateWithoutMusicInput>
  }

  export type RecitalBestPlayUpdateManyWithWhereWithoutMusicInput = {
    where: RecitalBestPlayScalarWhereInput
    data: XOR<RecitalBestPlayUpdateManyMutationInput, RecitalBestPlayUncheckedUpdateManyWithoutMusicInput>
  }

  export type UserCreateWithoutPlayHistoryInput = {
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    PlayData?: PlayDataCreateNestedManyWithoutUserInput
    Bookmark?: BookmarkCreateNestedManyWithoutUserInput
    BasicBestPlay?: BasicBestPlayCreateNestedManyWithoutUserInput
    RecitalBestPlay?: RecitalBestPlayCreateNestedManyWithoutUserInput
    UserBestGrade?: UserBestGradeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPlayHistoryInput = {
    id?: number
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    PlayData?: PlayDataUncheckedCreateNestedManyWithoutUserInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    BasicBestPlay?: BasicBestPlayUncheckedCreateNestedManyWithoutUserInput
    RecitalBestPlay?: RecitalBestPlayUncheckedCreateNestedManyWithoutUserInput
    UserBestGrade?: UserBestGradeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPlayHistoryInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPlayHistoryInput, UserUncheckedCreateWithoutPlayHistoryInput>
  }

  export type MusicCreateWithoutRecentPlayInput = {
    index: string
    title: string
    title_kana: string
    artist?: string | null
    category: string
    category_short: string
    description?: string | null
    background?: string | null
    sheet_len: number
    difficulty_levels: string
    difficulty_name: string
    created_at?: Date | string
    updated_at?: Date | string
    PlayData?: PlayDataCreateNestedManyWithoutMusicInput
    Bookmark?: BookmarkCreateNestedManyWithoutMusicInput
    BasicBestPlay?: BasicBestPlayCreateNestedManyWithoutMusicInput
    RecitalBestPlay?: RecitalBestPlayCreateNestedManyWithoutMusicInput
  }

  export type MusicUncheckedCreateWithoutRecentPlayInput = {
    id?: number
    index: string
    title: string
    title_kana: string
    artist?: string | null
    category: string
    category_short: string
    description?: string | null
    background?: string | null
    sheet_len: number
    difficulty_levels: string
    difficulty_name: string
    created_at?: Date | string
    updated_at?: Date | string
    PlayData?: PlayDataUncheckedCreateNestedManyWithoutMusicInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutMusicInput
    BasicBestPlay?: BasicBestPlayUncheckedCreateNestedManyWithoutMusicInput
    RecitalBestPlay?: RecitalBestPlayUncheckedCreateNestedManyWithoutMusicInput
  }

  export type MusicCreateOrConnectWithoutRecentPlayInput = {
    where: MusicWhereUniqueInput
    create: XOR<MusicCreateWithoutRecentPlayInput, MusicUncheckedCreateWithoutRecentPlayInput>
  }

  export type UserUpsertWithoutPlayHistoryInput = {
    update: XOR<UserUpdateWithoutPlayHistoryInput, UserUncheckedUpdateWithoutPlayHistoryInput>
    create: XOR<UserCreateWithoutPlayHistoryInput, UserUncheckedCreateWithoutPlayHistoryInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPlayHistoryInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPlayHistoryInput, UserUncheckedUpdateWithoutPlayHistoryInput>
  }

  export type UserUpdateWithoutPlayHistoryInput = {
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayData?: PlayDataUpdateManyWithoutUserNestedInput
    Bookmark?: BookmarkUpdateManyWithoutUserNestedInput
    BasicBestPlay?: BasicBestPlayUpdateManyWithoutUserNestedInput
    RecitalBestPlay?: RecitalBestPlayUpdateManyWithoutUserNestedInput
    UserBestGrade?: UserBestGradeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPlayHistoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayData?: PlayDataUncheckedUpdateManyWithoutUserNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    BasicBestPlay?: BasicBestPlayUncheckedUpdateManyWithoutUserNestedInput
    RecitalBestPlay?: RecitalBestPlayUncheckedUpdateManyWithoutUserNestedInput
    UserBestGrade?: UserBestGradeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MusicUpsertWithoutRecentPlayInput = {
    update: XOR<MusicUpdateWithoutRecentPlayInput, MusicUncheckedUpdateWithoutRecentPlayInput>
    create: XOR<MusicCreateWithoutRecentPlayInput, MusicUncheckedCreateWithoutRecentPlayInput>
    where?: MusicWhereInput
  }

  export type MusicUpdateToOneWithWhereWithoutRecentPlayInput = {
    where?: MusicWhereInput
    data: XOR<MusicUpdateWithoutRecentPlayInput, MusicUncheckedUpdateWithoutRecentPlayInput>
  }

  export type MusicUpdateWithoutRecentPlayInput = {
    index?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    title_kana?: StringFieldUpdateOperationsInput | string
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    category_short?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    sheet_len?: IntFieldUpdateOperationsInput | number
    difficulty_levels?: StringFieldUpdateOperationsInput | string
    difficulty_name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayData?: PlayDataUpdateManyWithoutMusicNestedInput
    Bookmark?: BookmarkUpdateManyWithoutMusicNestedInput
    BasicBestPlay?: BasicBestPlayUpdateManyWithoutMusicNestedInput
    RecitalBestPlay?: RecitalBestPlayUpdateManyWithoutMusicNestedInput
  }

  export type MusicUncheckedUpdateWithoutRecentPlayInput = {
    id?: IntFieldUpdateOperationsInput | number
    index?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    title_kana?: StringFieldUpdateOperationsInput | string
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    category_short?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    sheet_len?: IntFieldUpdateOperationsInput | number
    difficulty_levels?: StringFieldUpdateOperationsInput | string
    difficulty_name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayData?: PlayDataUncheckedUpdateManyWithoutMusicNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutMusicNestedInput
    BasicBestPlay?: BasicBestPlayUncheckedUpdateManyWithoutMusicNestedInput
    RecitalBestPlay?: RecitalBestPlayUncheckedUpdateManyWithoutMusicNestedInput
  }

  export type UserCreateWithoutUserBestGradeInput = {
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    PlayHistory?: RecentPlayCreateNestedManyWithoutUserInput
    PlayData?: PlayDataCreateNestedManyWithoutUserInput
    Bookmark?: BookmarkCreateNestedManyWithoutUserInput
    BasicBestPlay?: BasicBestPlayCreateNestedManyWithoutUserInput
    RecitalBestPlay?: RecitalBestPlayCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserBestGradeInput = {
    id?: number
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    PlayHistory?: RecentPlayUncheckedCreateNestedManyWithoutUserInput
    PlayData?: PlayDataUncheckedCreateNestedManyWithoutUserInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    BasicBestPlay?: BasicBestPlayUncheckedCreateNestedManyWithoutUserInput
    RecitalBestPlay?: RecitalBestPlayUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUserBestGradeInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserBestGradeInput, UserUncheckedCreateWithoutUserBestGradeInput>
  }

  export type UserUpsertWithoutUserBestGradeInput = {
    update: XOR<UserUpdateWithoutUserBestGradeInput, UserUncheckedUpdateWithoutUserBestGradeInput>
    create: XOR<UserCreateWithoutUserBestGradeInput, UserUncheckedCreateWithoutUserBestGradeInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserBestGradeInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserBestGradeInput, UserUncheckedUpdateWithoutUserBestGradeInput>
  }

  export type UserUpdateWithoutUserBestGradeInput = {
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayHistory?: RecentPlayUpdateManyWithoutUserNestedInput
    PlayData?: PlayDataUpdateManyWithoutUserNestedInput
    Bookmark?: BookmarkUpdateManyWithoutUserNestedInput
    BasicBestPlay?: BasicBestPlayUpdateManyWithoutUserNestedInput
    RecitalBestPlay?: RecitalBestPlayUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserBestGradeInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayHistory?: RecentPlayUncheckedUpdateManyWithoutUserNestedInput
    PlayData?: PlayDataUncheckedUpdateManyWithoutUserNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    BasicBestPlay?: BasicBestPlayUncheckedUpdateManyWithoutUserNestedInput
    RecitalBestPlay?: RecitalBestPlayUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutBasicBestPlayInput = {
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    PlayHistory?: RecentPlayCreateNestedManyWithoutUserInput
    PlayData?: PlayDataCreateNestedManyWithoutUserInput
    Bookmark?: BookmarkCreateNestedManyWithoutUserInput
    RecitalBestPlay?: RecitalBestPlayCreateNestedManyWithoutUserInput
    UserBestGrade?: UserBestGradeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBasicBestPlayInput = {
    id?: number
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    PlayHistory?: RecentPlayUncheckedCreateNestedManyWithoutUserInput
    PlayData?: PlayDataUncheckedCreateNestedManyWithoutUserInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    RecitalBestPlay?: RecitalBestPlayUncheckedCreateNestedManyWithoutUserInput
    UserBestGrade?: UserBestGradeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBasicBestPlayInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBasicBestPlayInput, UserUncheckedCreateWithoutBasicBestPlayInput>
  }

  export type MusicCreateWithoutBasicBestPlayInput = {
    index: string
    title: string
    title_kana: string
    artist?: string | null
    category: string
    category_short: string
    description?: string | null
    background?: string | null
    sheet_len: number
    difficulty_levels: string
    difficulty_name: string
    created_at?: Date | string
    updated_at?: Date | string
    RecentPlay?: RecentPlayCreateNestedManyWithoutMusicInput
    PlayData?: PlayDataCreateNestedManyWithoutMusicInput
    Bookmark?: BookmarkCreateNestedManyWithoutMusicInput
    RecitalBestPlay?: RecitalBestPlayCreateNestedManyWithoutMusicInput
  }

  export type MusicUncheckedCreateWithoutBasicBestPlayInput = {
    id?: number
    index: string
    title: string
    title_kana: string
    artist?: string | null
    category: string
    category_short: string
    description?: string | null
    background?: string | null
    sheet_len: number
    difficulty_levels: string
    difficulty_name: string
    created_at?: Date | string
    updated_at?: Date | string
    RecentPlay?: RecentPlayUncheckedCreateNestedManyWithoutMusicInput
    PlayData?: PlayDataUncheckedCreateNestedManyWithoutMusicInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutMusicInput
    RecitalBestPlay?: RecitalBestPlayUncheckedCreateNestedManyWithoutMusicInput
  }

  export type MusicCreateOrConnectWithoutBasicBestPlayInput = {
    where: MusicWhereUniqueInput
    create: XOR<MusicCreateWithoutBasicBestPlayInput, MusicUncheckedCreateWithoutBasicBestPlayInput>
  }

  export type UserUpsertWithoutBasicBestPlayInput = {
    update: XOR<UserUpdateWithoutBasicBestPlayInput, UserUncheckedUpdateWithoutBasicBestPlayInput>
    create: XOR<UserCreateWithoutBasicBestPlayInput, UserUncheckedCreateWithoutBasicBestPlayInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBasicBestPlayInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBasicBestPlayInput, UserUncheckedUpdateWithoutBasicBestPlayInput>
  }

  export type UserUpdateWithoutBasicBestPlayInput = {
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayHistory?: RecentPlayUpdateManyWithoutUserNestedInput
    PlayData?: PlayDataUpdateManyWithoutUserNestedInput
    Bookmark?: BookmarkUpdateManyWithoutUserNestedInput
    RecitalBestPlay?: RecitalBestPlayUpdateManyWithoutUserNestedInput
    UserBestGrade?: UserBestGradeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBasicBestPlayInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayHistory?: RecentPlayUncheckedUpdateManyWithoutUserNestedInput
    PlayData?: PlayDataUncheckedUpdateManyWithoutUserNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    RecitalBestPlay?: RecitalBestPlayUncheckedUpdateManyWithoutUserNestedInput
    UserBestGrade?: UserBestGradeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MusicUpsertWithoutBasicBestPlayInput = {
    update: XOR<MusicUpdateWithoutBasicBestPlayInput, MusicUncheckedUpdateWithoutBasicBestPlayInput>
    create: XOR<MusicCreateWithoutBasicBestPlayInput, MusicUncheckedCreateWithoutBasicBestPlayInput>
    where?: MusicWhereInput
  }

  export type MusicUpdateToOneWithWhereWithoutBasicBestPlayInput = {
    where?: MusicWhereInput
    data: XOR<MusicUpdateWithoutBasicBestPlayInput, MusicUncheckedUpdateWithoutBasicBestPlayInput>
  }

  export type MusicUpdateWithoutBasicBestPlayInput = {
    index?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    title_kana?: StringFieldUpdateOperationsInput | string
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    category_short?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    sheet_len?: IntFieldUpdateOperationsInput | number
    difficulty_levels?: StringFieldUpdateOperationsInput | string
    difficulty_name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    RecentPlay?: RecentPlayUpdateManyWithoutMusicNestedInput
    PlayData?: PlayDataUpdateManyWithoutMusicNestedInput
    Bookmark?: BookmarkUpdateManyWithoutMusicNestedInput
    RecitalBestPlay?: RecitalBestPlayUpdateManyWithoutMusicNestedInput
  }

  export type MusicUncheckedUpdateWithoutBasicBestPlayInput = {
    id?: IntFieldUpdateOperationsInput | number
    index?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    title_kana?: StringFieldUpdateOperationsInput | string
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    category_short?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    sheet_len?: IntFieldUpdateOperationsInput | number
    difficulty_levels?: StringFieldUpdateOperationsInput | string
    difficulty_name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    RecentPlay?: RecentPlayUncheckedUpdateManyWithoutMusicNestedInput
    PlayData?: PlayDataUncheckedUpdateManyWithoutMusicNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutMusicNestedInput
    RecitalBestPlay?: RecitalBestPlayUncheckedUpdateManyWithoutMusicNestedInput
  }

  export type UserCreateWithoutRecitalBestPlayInput = {
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    PlayHistory?: RecentPlayCreateNestedManyWithoutUserInput
    PlayData?: PlayDataCreateNestedManyWithoutUserInput
    Bookmark?: BookmarkCreateNestedManyWithoutUserInput
    BasicBestPlay?: BasicBestPlayCreateNestedManyWithoutUserInput
    UserBestGrade?: UserBestGradeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRecitalBestPlayInput = {
    id?: number
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    PlayHistory?: RecentPlayUncheckedCreateNestedManyWithoutUserInput
    PlayData?: PlayDataUncheckedCreateNestedManyWithoutUserInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    BasicBestPlay?: BasicBestPlayUncheckedCreateNestedManyWithoutUserInput
    UserBestGrade?: UserBestGradeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRecitalBestPlayInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRecitalBestPlayInput, UserUncheckedCreateWithoutRecitalBestPlayInput>
  }

  export type MusicCreateWithoutRecitalBestPlayInput = {
    index: string
    title: string
    title_kana: string
    artist?: string | null
    category: string
    category_short: string
    description?: string | null
    background?: string | null
    sheet_len: number
    difficulty_levels: string
    difficulty_name: string
    created_at?: Date | string
    updated_at?: Date | string
    RecentPlay?: RecentPlayCreateNestedManyWithoutMusicInput
    PlayData?: PlayDataCreateNestedManyWithoutMusicInput
    Bookmark?: BookmarkCreateNestedManyWithoutMusicInput
    BasicBestPlay?: BasicBestPlayCreateNestedManyWithoutMusicInput
  }

  export type MusicUncheckedCreateWithoutRecitalBestPlayInput = {
    id?: number
    index: string
    title: string
    title_kana: string
    artist?: string | null
    category: string
    category_short: string
    description?: string | null
    background?: string | null
    sheet_len: number
    difficulty_levels: string
    difficulty_name: string
    created_at?: Date | string
    updated_at?: Date | string
    RecentPlay?: RecentPlayUncheckedCreateNestedManyWithoutMusicInput
    PlayData?: PlayDataUncheckedCreateNestedManyWithoutMusicInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutMusicInput
    BasicBestPlay?: BasicBestPlayUncheckedCreateNestedManyWithoutMusicInput
  }

  export type MusicCreateOrConnectWithoutRecitalBestPlayInput = {
    where: MusicWhereUniqueInput
    create: XOR<MusicCreateWithoutRecitalBestPlayInput, MusicUncheckedCreateWithoutRecitalBestPlayInput>
  }

  export type UserUpsertWithoutRecitalBestPlayInput = {
    update: XOR<UserUpdateWithoutRecitalBestPlayInput, UserUncheckedUpdateWithoutRecitalBestPlayInput>
    create: XOR<UserCreateWithoutRecitalBestPlayInput, UserUncheckedCreateWithoutRecitalBestPlayInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRecitalBestPlayInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRecitalBestPlayInput, UserUncheckedUpdateWithoutRecitalBestPlayInput>
  }

  export type UserUpdateWithoutRecitalBestPlayInput = {
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayHistory?: RecentPlayUpdateManyWithoutUserNestedInput
    PlayData?: PlayDataUpdateManyWithoutUserNestedInput
    Bookmark?: BookmarkUpdateManyWithoutUserNestedInput
    BasicBestPlay?: BasicBestPlayUpdateManyWithoutUserNestedInput
    UserBestGrade?: UserBestGradeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRecitalBestPlayInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayHistory?: RecentPlayUncheckedUpdateManyWithoutUserNestedInput
    PlayData?: PlayDataUncheckedUpdateManyWithoutUserNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    BasicBestPlay?: BasicBestPlayUncheckedUpdateManyWithoutUserNestedInput
    UserBestGrade?: UserBestGradeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MusicUpsertWithoutRecitalBestPlayInput = {
    update: XOR<MusicUpdateWithoutRecitalBestPlayInput, MusicUncheckedUpdateWithoutRecitalBestPlayInput>
    create: XOR<MusicCreateWithoutRecitalBestPlayInput, MusicUncheckedCreateWithoutRecitalBestPlayInput>
    where?: MusicWhereInput
  }

  export type MusicUpdateToOneWithWhereWithoutRecitalBestPlayInput = {
    where?: MusicWhereInput
    data: XOR<MusicUpdateWithoutRecitalBestPlayInput, MusicUncheckedUpdateWithoutRecitalBestPlayInput>
  }

  export type MusicUpdateWithoutRecitalBestPlayInput = {
    index?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    title_kana?: StringFieldUpdateOperationsInput | string
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    category_short?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    sheet_len?: IntFieldUpdateOperationsInput | number
    difficulty_levels?: StringFieldUpdateOperationsInput | string
    difficulty_name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    RecentPlay?: RecentPlayUpdateManyWithoutMusicNestedInput
    PlayData?: PlayDataUpdateManyWithoutMusicNestedInput
    Bookmark?: BookmarkUpdateManyWithoutMusicNestedInput
    BasicBestPlay?: BasicBestPlayUpdateManyWithoutMusicNestedInput
  }

  export type MusicUncheckedUpdateWithoutRecitalBestPlayInput = {
    id?: IntFieldUpdateOperationsInput | number
    index?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    title_kana?: StringFieldUpdateOperationsInput | string
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    category_short?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    sheet_len?: IntFieldUpdateOperationsInput | number
    difficulty_levels?: StringFieldUpdateOperationsInput | string
    difficulty_name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    RecentPlay?: RecentPlayUncheckedUpdateManyWithoutMusicNestedInput
    PlayData?: PlayDataUncheckedUpdateManyWithoutMusicNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutMusicNestedInput
    BasicBestPlay?: BasicBestPlayUncheckedUpdateManyWithoutMusicNestedInput
  }

  export type UserCreateWithoutPlayDataInput = {
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    PlayHistory?: RecentPlayCreateNestedManyWithoutUserInput
    Bookmark?: BookmarkCreateNestedManyWithoutUserInput
    BasicBestPlay?: BasicBestPlayCreateNestedManyWithoutUserInput
    RecitalBestPlay?: RecitalBestPlayCreateNestedManyWithoutUserInput
    UserBestGrade?: UserBestGradeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPlayDataInput = {
    id?: number
    username?: string | null
    kakao_id?: bigint | number | null
    discord_name?: string | null
    discord_tag?: string | null
    avatar?: string | null
    country?: string
    rank_basic?: number | null
    rank_recital?: number | null
    rank_basic_country?: number | null
    rank_recital_country?: number | null
    play_count?: number | null
    score_p?: number | null
    score_f?: number | null
    score_s?: number | null
    score_a2?: number | null
    score_a?: number | null
    score_b2?: number | null
    score_b?: number | null
    score_c?: number | null
    score_d?: number | null
    role?: string
    grade_basic?: number | null
    grade_recital?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    PlayHistory?: RecentPlayUncheckedCreateNestedManyWithoutUserInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    BasicBestPlay?: BasicBestPlayUncheckedCreateNestedManyWithoutUserInput
    RecitalBestPlay?: RecitalBestPlayUncheckedCreateNestedManyWithoutUserInput
    UserBestGrade?: UserBestGradeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPlayDataInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPlayDataInput, UserUncheckedCreateWithoutPlayDataInput>
  }

  export type MusicCreateWithoutPlayDataInput = {
    index: string
    title: string
    title_kana: string
    artist?: string | null
    category: string
    category_short: string
    description?: string | null
    background?: string | null
    sheet_len: number
    difficulty_levels: string
    difficulty_name: string
    created_at?: Date | string
    updated_at?: Date | string
    RecentPlay?: RecentPlayCreateNestedManyWithoutMusicInput
    Bookmark?: BookmarkCreateNestedManyWithoutMusicInput
    BasicBestPlay?: BasicBestPlayCreateNestedManyWithoutMusicInput
    RecitalBestPlay?: RecitalBestPlayCreateNestedManyWithoutMusicInput
  }

  export type MusicUncheckedCreateWithoutPlayDataInput = {
    id?: number
    index: string
    title: string
    title_kana: string
    artist?: string | null
    category: string
    category_short: string
    description?: string | null
    background?: string | null
    sheet_len: number
    difficulty_levels: string
    difficulty_name: string
    created_at?: Date | string
    updated_at?: Date | string
    RecentPlay?: RecentPlayUncheckedCreateNestedManyWithoutMusicInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutMusicInput
    BasicBestPlay?: BasicBestPlayUncheckedCreateNestedManyWithoutMusicInput
    RecitalBestPlay?: RecitalBestPlayUncheckedCreateNestedManyWithoutMusicInput
  }

  export type MusicCreateOrConnectWithoutPlayDataInput = {
    where: MusicWhereUniqueInput
    create: XOR<MusicCreateWithoutPlayDataInput, MusicUncheckedCreateWithoutPlayDataInput>
  }

  export type UserUpsertWithoutPlayDataInput = {
    update: XOR<UserUpdateWithoutPlayDataInput, UserUncheckedUpdateWithoutPlayDataInput>
    create: XOR<UserCreateWithoutPlayDataInput, UserUncheckedCreateWithoutPlayDataInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPlayDataInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPlayDataInput, UserUncheckedUpdateWithoutPlayDataInput>
  }

  export type UserUpdateWithoutPlayDataInput = {
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayHistory?: RecentPlayUpdateManyWithoutUserNestedInput
    Bookmark?: BookmarkUpdateManyWithoutUserNestedInput
    BasicBestPlay?: BasicBestPlayUpdateManyWithoutUserNestedInput
    RecitalBestPlay?: RecitalBestPlayUpdateManyWithoutUserNestedInput
    UserBestGrade?: UserBestGradeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPlayDataInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    kakao_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    discord_name?: NullableStringFieldUpdateOperationsInput | string | null
    discord_tag?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    rank_basic?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital?: NullableIntFieldUpdateOperationsInput | number | null
    rank_basic_country?: NullableIntFieldUpdateOperationsInput | number | null
    rank_recital_country?: NullableIntFieldUpdateOperationsInput | number | null
    play_count?: NullableIntFieldUpdateOperationsInput | number | null
    score_p?: NullableIntFieldUpdateOperationsInput | number | null
    score_f?: NullableIntFieldUpdateOperationsInput | number | null
    score_s?: NullableIntFieldUpdateOperationsInput | number | null
    score_a2?: NullableIntFieldUpdateOperationsInput | number | null
    score_a?: NullableIntFieldUpdateOperationsInput | number | null
    score_b2?: NullableIntFieldUpdateOperationsInput | number | null
    score_b?: NullableIntFieldUpdateOperationsInput | number | null
    score_c?: NullableIntFieldUpdateOperationsInput | number | null
    score_d?: NullableIntFieldUpdateOperationsInput | number | null
    role?: StringFieldUpdateOperationsInput | string
    grade_basic?: NullableIntFieldUpdateOperationsInput | number | null
    grade_recital?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    PlayHistory?: RecentPlayUncheckedUpdateManyWithoutUserNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    BasicBestPlay?: BasicBestPlayUncheckedUpdateManyWithoutUserNestedInput
    RecitalBestPlay?: RecitalBestPlayUncheckedUpdateManyWithoutUserNestedInput
    UserBestGrade?: UserBestGradeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MusicUpsertWithoutPlayDataInput = {
    update: XOR<MusicUpdateWithoutPlayDataInput, MusicUncheckedUpdateWithoutPlayDataInput>
    create: XOR<MusicCreateWithoutPlayDataInput, MusicUncheckedCreateWithoutPlayDataInput>
    where?: MusicWhereInput
  }

  export type MusicUpdateToOneWithWhereWithoutPlayDataInput = {
    where?: MusicWhereInput
    data: XOR<MusicUpdateWithoutPlayDataInput, MusicUncheckedUpdateWithoutPlayDataInput>
  }

  export type MusicUpdateWithoutPlayDataInput = {
    index?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    title_kana?: StringFieldUpdateOperationsInput | string
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    category_short?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    sheet_len?: IntFieldUpdateOperationsInput | number
    difficulty_levels?: StringFieldUpdateOperationsInput | string
    difficulty_name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    RecentPlay?: RecentPlayUpdateManyWithoutMusicNestedInput
    Bookmark?: BookmarkUpdateManyWithoutMusicNestedInput
    BasicBestPlay?: BasicBestPlayUpdateManyWithoutMusicNestedInput
    RecitalBestPlay?: RecitalBestPlayUpdateManyWithoutMusicNestedInput
  }

  export type MusicUncheckedUpdateWithoutPlayDataInput = {
    id?: IntFieldUpdateOperationsInput | number
    index?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    title_kana?: StringFieldUpdateOperationsInput | string
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    category_short?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    sheet_len?: IntFieldUpdateOperationsInput | number
    difficulty_levels?: StringFieldUpdateOperationsInput | string
    difficulty_name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    RecentPlay?: RecentPlayUncheckedUpdateManyWithoutMusicNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutMusicNestedInput
    BasicBestPlay?: BasicBestPlayUncheckedUpdateManyWithoutMusicNestedInput
    RecitalBestPlay?: RecitalBestPlayUncheckedUpdateManyWithoutMusicNestedInput
  }

  export type RecentPlayCreateManyUserInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    play_time: string
    grade_basic: number
    created_at?: Date | string
    updated_at?: Date | string
    music_idx: string
  }

  export type PlayDataCreateManyUserInput = {
    id?: number
    level: number
    difficulty: string
    score: number
    rank: string
    fc_type: number
    play_count: number
    fullcombo_count: number
    pianistic_count: number
    max_combo: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
    music_idx: string
  }

  export type BookmarkCreateManyUserInput = {
    id?: number
    music_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type BasicBestPlayCreateManyUserInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_basic: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    music_idx: string
  }

  export type RecitalBestPlayCreateManyUserInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_recital: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    music_idx: string
  }

  export type UserBestGradeCreateManyUserInput = {
    id?: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type RecentPlayUpdateWithoutUserInput = {
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    play_time?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    music?: MusicUpdateOneRequiredWithoutRecentPlayNestedInput
  }

  export type RecentPlayUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    play_time?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type RecentPlayUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    play_time?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type PlayDataUpdateWithoutUserInput = {
    level?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    fc_type?: IntFieldUpdateOperationsInput | number
    play_count?: IntFieldUpdateOperationsInput | number
    fullcombo_count?: IntFieldUpdateOperationsInput | number
    pianistic_count?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    music?: MusicUpdateOneRequiredWithoutPlayDataNestedInput
  }

  export type PlayDataUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    fc_type?: IntFieldUpdateOperationsInput | number
    play_count?: IntFieldUpdateOperationsInput | number
    fullcombo_count?: IntFieldUpdateOperationsInput | number
    pianistic_count?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type PlayDataUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    fc_type?: IntFieldUpdateOperationsInput | number
    play_count?: IntFieldUpdateOperationsInput | number
    fullcombo_count?: IntFieldUpdateOperationsInput | number
    pianistic_count?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type BookmarkUpdateWithoutUserInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    music?: MusicUpdateOneRequiredWithoutBookmarkNestedInput
  }

  export type BookmarkUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    music_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    music_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BasicBestPlayUpdateWithoutUserInput = {
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    music?: MusicUpdateOneRequiredWithoutBasicBestPlayNestedInput
  }

  export type BasicBestPlayUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type BasicBestPlayUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type RecitalBestPlayUpdateWithoutUserInput = {
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_recital?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    music?: MusicUpdateOneRequiredWithoutRecitalBestPlayNestedInput
  }

  export type RecitalBestPlayUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_recital?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type RecitalBestPlayUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_recital?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    music_idx?: StringFieldUpdateOperationsInput | string
  }

  export type UserBestGradeUpdateWithoutUserInput = {
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBestGradeUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBestGradeUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecentPlayCreateManyMusicInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    play_time: string
    grade_basic: number
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
  }

  export type PlayDataCreateManyMusicInput = {
    id?: number
    level: number
    difficulty: string
    score: number
    rank: string
    fc_type: number
    play_count: number
    fullcombo_count: number
    pianistic_count: number
    max_combo: number
    grade_basic: number
    grade_recital: number
    besttime: string
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
  }

  export type BookmarkCreateManyMusicInput = {
    id?: number
    user_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type BasicBestPlayCreateManyMusicInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_basic: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
  }

  export type RecitalBestPlayCreateManyMusicInput = {
    id?: number
    difficulty: string
    level: number
    score: number
    max_combo: number
    rank: string
    besttime: string
    grade_recital: number
    fc_type: number
    created_at?: Date | string
    updated_at?: Date | string
    user_id: number
  }

  export type RecentPlayUpdateWithoutMusicInput = {
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    play_time?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayHistoryNestedInput
  }

  export type RecentPlayUncheckedUpdateWithoutMusicInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    play_time?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
  }

  export type RecentPlayUncheckedUpdateManyWithoutMusicInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    play_time?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
  }

  export type PlayDataUpdateWithoutMusicInput = {
    level?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    fc_type?: IntFieldUpdateOperationsInput | number
    play_count?: IntFieldUpdateOperationsInput | number
    fullcombo_count?: IntFieldUpdateOperationsInput | number
    pianistic_count?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayDataNestedInput
  }

  export type PlayDataUncheckedUpdateWithoutMusicInput = {
    id?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    fc_type?: IntFieldUpdateOperationsInput | number
    play_count?: IntFieldUpdateOperationsInput | number
    fullcombo_count?: IntFieldUpdateOperationsInput | number
    pianistic_count?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
  }

  export type PlayDataUncheckedUpdateManyWithoutMusicInput = {
    id?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    fc_type?: IntFieldUpdateOperationsInput | number
    play_count?: IntFieldUpdateOperationsInput | number
    fullcombo_count?: IntFieldUpdateOperationsInput | number
    pianistic_count?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    grade_basic?: IntFieldUpdateOperationsInput | number
    grade_recital?: IntFieldUpdateOperationsInput | number
    besttime?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
  }

  export type BookmarkUpdateWithoutMusicInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBookmarkNestedInput
  }

  export type BookmarkUncheckedUpdateWithoutMusicInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkUncheckedUpdateManyWithoutMusicInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BasicBestPlayUpdateWithoutMusicInput = {
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBasicBestPlayNestedInput
  }

  export type BasicBestPlayUncheckedUpdateWithoutMusicInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
  }

  export type BasicBestPlayUncheckedUpdateManyWithoutMusicInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_basic?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
  }

  export type RecitalBestPlayUpdateWithoutMusicInput = {
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_recital?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRecitalBestPlayNestedInput
  }

  export type RecitalBestPlayUncheckedUpdateWithoutMusicInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_recital?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
  }

  export type RecitalBestPlayUncheckedUpdateManyWithoutMusicInput = {
    id?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    max_combo?: IntFieldUpdateOperationsInput | number
    rank?: StringFieldUpdateOperationsInput | string
    besttime?: StringFieldUpdateOperationsInput | string
    grade_recital?: IntFieldUpdateOperationsInput | number
    fc_type?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}