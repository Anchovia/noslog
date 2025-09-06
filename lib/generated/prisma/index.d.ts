/**
 * Client
 **/

import * as runtime from "./runtime/library.js";
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;
/**
 * Model PlayHistory
 *
 */
export type PlayHistory = $Result.DefaultSelection<Prisma.$PlayHistoryPayload>;

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
    const U = "log" extends keyof ClientOptions
        ? ClientOptions["log"] extends Array<
              Prisma.LogLevel | Prisma.LogDefinition
          >
            ? Prisma.GetEvents<ClientOptions["log"]>
            : never
        : never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>["other"] };

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

    constructor(
        optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>
    );
    $on<V extends U>(
        eventType: V,
        callback: (
            event: V extends "query" ? Prisma.QueryEvent : Prisma.LogEvent
        ) => void
    ): PrismaClient;

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
    $executeRaw<T = unknown>(
        query: TemplateStringsArray | Prisma.Sql,
        ...values: any[]
    ): Prisma.PrismaPromise<number>;

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
    $executeRawUnsafe<T = unknown>(
        query: string,
        ...values: any[]
    ): Prisma.PrismaPromise<number>;

    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
     */
    $queryRaw<T = unknown>(
        query: TemplateStringsArray | Prisma.Sql,
        ...values: any[]
    ): Prisma.PrismaPromise<T>;

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
    $queryRawUnsafe<T = unknown>(
        query: string,
        ...values: any[]
    ): Prisma.PrismaPromise<T>;

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
    $transaction<P extends Prisma.PrismaPromise<any>[]>(
        arg: [...P],
        options?: { isolationLevel?: Prisma.TransactionIsolationLevel }
    ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

    $transaction<R>(
        fn: (
            prisma: Omit<PrismaClient, runtime.ITXClientDenyList>
        ) => $Utils.JsPromise<R>,
        options?: {
            maxWait?: number;
            timeout?: number;
            isolationLevel?: Prisma.TransactionIsolationLevel;
        }
    ): $Utils.JsPromise<R>;

    $extends: $Extensions.ExtendsHook<
        "extends",
        Prisma.TypeMapCb<ClientOptions>,
        ExtArgs,
        $Utils.Call<
            Prisma.TypeMapCb<ClientOptions>,
            {
                extArgs: ExtArgs;
            }
        >
    >;

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
     * `prisma.playHistory`: Exposes CRUD operations for the **PlayHistory** model.
     * Example usage:
     * ```ts
     * // Fetch zero or more PlayHistories
     * const playHistories = await prisma.playHistory.findMany()
     * ```
     */
    get playHistory(): Prisma.PlayHistoryDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
    export import DMMF = runtime.DMMF;

    export type PrismaPromise<T> = $Public.PrismaPromise<T>;

    /**
     * Validator
     */
    export import validator = runtime.Public.validator;

    /**
     * Prisma Errors
     */
    export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
    export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
    export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
    export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
    export import PrismaClientValidationError = runtime.PrismaClientValidationError;

    /**
     * Re-export of sql-template-tag
     */
    export import sql = runtime.sqltag;
    export import empty = runtime.empty;
    export import join = runtime.join;
    export import raw = runtime.raw;
    export import Sql = runtime.Sql;

    /**
     * Decimal.js
     */
    export import Decimal = runtime.Decimal;

    export type DecimalJsLike = runtime.DecimalJsLike;

    /**
     * Metrics
     */
    export type Metrics = runtime.Metrics;
    export type Metric<T> = runtime.Metric<T>;
    export type MetricHistogram = runtime.MetricHistogram;
    export type MetricHistogramBucket = runtime.MetricHistogramBucket;

    /**
     * Extensions
     */
    export import Extension = $Extensions.UserArgs;
    export import getExtensionContext = runtime.Extensions.getExtensionContext;
    export import Args = $Public.Args;
    export import Payload = $Public.Payload;
    export import Result = $Public.Result;
    export import Exact = $Public.Exact;

    /**
     * Prisma Client JS version: 6.15.0
     * Query Engine version: 85179d7826409ee107a6ba334b5e305ae3fba9fb
     */
    export type PrismaVersion = {
        client: string;
    };

    export const prismaVersion: PrismaVersion;

    /**
     * Utility Types
     */

    export import JsonObject = runtime.JsonObject;
    export import JsonArray = runtime.JsonArray;
    export import JsonValue = runtime.JsonValue;
    export import InputJsonObject = runtime.InputJsonObject;
    export import InputJsonArray = runtime.InputJsonArray;
    export import InputJsonValue = runtime.InputJsonValue;

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
            private DbNull: never;
            private constructor();
        }

        /**
         * Type of `Prisma.JsonNull`.
         *
         * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
         *
         * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
         */
        class JsonNull {
            private JsonNull: never;
            private constructor();
        }

        /**
         * Type of `Prisma.AnyNull`.
         *
         * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
         *
         * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
         */
        class AnyNull {
            private AnyNull: never;
            private constructor();
        }
    }

    /**
     * Helper for filtering JSON entries that have `null` on the database (empty on the db)
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    export const DbNull: NullTypes.DbNull;

    /**
     * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    export const JsonNull: NullTypes.JsonNull;

    /**
     * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    export const AnyNull: NullTypes.AnyNull;

    type SelectAndInclude = {
        select: any;
        include: any;
    };

    type SelectAndOmit = {
        select: any;
        omit: any;
    };

    /**
     * Get the type of the value, that the Promise holds.
     */
    export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<
        infer U
    >
        ? U
        : T;

    /**
     * Get the return type of a function which returns a Promise.
     */
    export type PromiseReturnType<
        T extends (...args: any) => $Utils.JsPromise<any>
    > = PromiseType<ReturnType<T>>;

    /**
     * From T, pick a set of properties whose keys are in the union K
     */
    type Prisma__Pick<T, K extends keyof T> = {
        [P in K]: T[P];
    };

    export type Enumerable<T> = T | Array<T>;

    export type RequiredKeys<T> = {
        [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
    }[keyof T];

    export type TruthyKeys<T> = keyof {
        [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
    };

    export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

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
        [key in keyof T]: key extends keyof U ? T[key] : never;
    } & (T extends SelectAndInclude
        ? "Please either choose `select` or `include`."
        : T extends SelectAndOmit
        ? "Please either choose `select` or `omit`."
        : {});

    /**
     * Subset + Intersection
     * @desc From `T` pick properties that exist in `U` and intersect `K`
     */
    export type SubsetIntersection<T, U, K> = {
        [key in keyof T]: key extends keyof U ? T[key] : never;
    } & K;

    type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

    /**
     * XOR is needed to have a real mutually exclusive union type
     * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
     */
    type XOR<T, U> = T extends object
        ? U extends object
            ? (Without<T, U> & U) | (Without<U, T> & T)
            : U
        : T;

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
        : False;

    /**
     * If it's T[], return T
     */
    export type UnEnumerate<T extends unknown> = T extends Array<infer U>
        ? U
        : T;

    /**
     * From ts-toolbelt
     */

    type __Either<O extends object, K extends Key> = Omit<O, K> &
        {
            // Merge all but K
            [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
        }[K];

    type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

    type EitherLoose<O extends object, K extends Key> = ComputeRaw<
        __Either<O, K>
    >;

    type _Either<O extends object, K extends Key, strict extends Boolean> = {
        1: EitherStrict<O, K>;
        0: EitherLoose<O, K>;
    }[strict];

    type Either<
        O extends object,
        K extends Key,
        strict extends Boolean = 1
    > = O extends unknown ? _Either<O, K, strict> : never;

    export type Union = any;

    type PatchUndefined<O extends object, O1 extends object> = {
        [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
    } & {};

    /** Helper Types for "Merge" **/
    export type IntersectOf<U extends Union> = (
        U extends unknown ? (k: U) => void : never
    ) extends (k: infer I) => void
        ? I
        : never;

    export type Overwrite<O extends object, O1 extends object> = {
        [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
    } & {};

    type _Merge<U extends object> = IntersectOf<
        Overwrite<
            U,
            {
                [K in keyof U]-?: At<U, K>;
            }
        >
    >;

    type Key = string | number | symbol;
    type AtBasic<O extends object, K extends Key> = K extends keyof O
        ? O[K]
        : never;
    type AtStrict<O extends object, K extends Key> = O[K & keyof O];
    type AtLoose<O extends object, K extends Key> = O extends unknown
        ? AtStrict<O, K>
        : never;
    export type At<
        O extends object,
        K extends Key,
        strict extends Boolean = 1
    > = {
        1: AtStrict<O, K>;
        0: AtLoose<O, K>;
    }[strict];

    export type ComputeRaw<A extends any> = A extends Function
        ? A
        : {
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
            ?
                  | (K extends keyof O ? { [P in K]: O[P] } & O : O)
                  | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
            : never
    >;

    type _Strict<U, _U = U> = U extends unknown
        ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
        : never;

    export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
    /** End Helper Types for "Merge" **/

    export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

    /**
  A [[Boolean]]
  */
    export type Boolean = True | False;

    // /**
    // 1
    // */
    export type True = 1;

    /**
  0
  */
    export type False = 0;

    export type Not<B extends Boolean> = {
        0: 1;
        1: 0;
    }[B];

    export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
        ? 0 // anything `never` is false
        : A1 extends A2
        ? 1
        : 0;

    export type Has<U extends Union, U1 extends Union> = Not<
        Extends<Exclude<U1, U>, U1>
    >;

    export type Or<B1 extends Boolean, B2 extends Boolean> = {
        0: {
            0: 0;
            1: 1;
        };
        1: {
            0: 1;
            1: 1;
        };
    }[B1][B2];

    export type Keys<U extends Union> = U extends unknown ? keyof U : never;

    type Cast<A, B> = A extends B ? A : B;

    export const type: unique symbol;

    /**
     * Used by group by
     */

    export type GetScalarType<T, O> = O extends object
        ? {
              [P in keyof T]: P extends keyof O ? O[P] : never;
          }
        : never;

    type FieldPaths<
        T,
        U = Omit<T, "_avg" | "_sum" | "_count" | "_min" | "_max">
    > = IsObject<T> extends True ? U : T;

    type GetHavingFields<T> = {
        [K in keyof T]: Or<
            Or<Extends<"OR", K>, Extends<"AND", K>>,
            Extends<"NOT", K>
        > extends True
            ? // infer is only needed to not hit TS limit
              // based on the brilliant idea of Pierre-Antoine Mills
              // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
              T[K] extends infer TK
                ? GetHavingFields<
                      UnEnumerate<TK> extends object
                          ? Merge<UnEnumerate<TK>>
                          : never
                  >
                : never
            : {} extends FieldPaths<T[K]>
            ? never
            : K;
    }[keyof T];

    /**
     * Convert tuple to union
     */
    type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
    type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
    type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

    /**
     * Like `Pick`, but additionally can also accept an array of keys
     */
    type PickEnumerable<
        T,
        K extends Enumerable<keyof T> | keyof T
    > = Prisma__Pick<T, MaybeTupleToUnion<K>>;

    /**
     * Exclude all keys with underscores
     */
    type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
        ? never
        : T;

    export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

    type FieldRefInputType<Model, FieldType> = Model extends never
        ? never
        : FieldRef<Model, FieldType>;

    export const ModelName: {
        User: "User";
        PlayHistory: "PlayHistory";
    };

    export type ModelName = (typeof ModelName)[keyof typeof ModelName];

    export type Datasources = {
        db?: Datasource;
    };

    interface TypeMapCb<ClientOptions = {}>
        extends $Utils.Fn<
            { extArgs: $Extensions.InternalArgs },
            $Utils.Record<string, any>
        > {
        returns: Prisma.TypeMap<
            this["params"]["extArgs"],
            ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
        >;
    }

    export type TypeMap<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {}
    > = {
        globalOmitOptions: {
            omit: GlobalOmitOptions;
        };
        meta: {
            modelProps: "user" | "playHistory";
            txIsolationLevel: Prisma.TransactionIsolationLevel;
        };
        model: {
            User: {
                payload: Prisma.$UserPayload<ExtArgs>;
                fields: Prisma.UserFieldRefs;
                operations: {
                    findUnique: {
                        args: Prisma.UserFindUniqueArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
                    };
                    findUniqueOrThrow: {
                        args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>;
                    };
                    findFirst: {
                        args: Prisma.UserFindFirstArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
                    };
                    findFirstOrThrow: {
                        args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>;
                    };
                    findMany: {
                        args: Prisma.UserFindManyArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
                    };
                    create: {
                        args: Prisma.UserCreateArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>;
                    };
                    createMany: {
                        args: Prisma.UserCreateManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    createManyAndReturn: {
                        args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
                    };
                    delete: {
                        args: Prisma.UserDeleteArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>;
                    };
                    update: {
                        args: Prisma.UserUpdateArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>;
                    };
                    deleteMany: {
                        args: Prisma.UserDeleteManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    updateMany: {
                        args: Prisma.UserUpdateManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    updateManyAndReturn: {
                        args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
                    };
                    upsert: {
                        args: Prisma.UserUpsertArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>;
                    };
                    aggregate: {
                        args: Prisma.UserAggregateArgs<ExtArgs>;
                        result: $Utils.Optional<AggregateUser>;
                    };
                    groupBy: {
                        args: Prisma.UserGroupByArgs<ExtArgs>;
                        result: $Utils.Optional<UserGroupByOutputType>[];
                    };
                    count: {
                        args: Prisma.UserCountArgs<ExtArgs>;
                        result:
                            | $Utils.Optional<UserCountAggregateOutputType>
                            | number;
                    };
                };
            };
            PlayHistory: {
                payload: Prisma.$PlayHistoryPayload<ExtArgs>;
                fields: Prisma.PlayHistoryFieldRefs;
                operations: {
                    findUnique: {
                        args: Prisma.PlayHistoryFindUniqueArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$PlayHistoryPayload> | null;
                    };
                    findUniqueOrThrow: {
                        args: Prisma.PlayHistoryFindUniqueOrThrowArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$PlayHistoryPayload>;
                    };
                    findFirst: {
                        args: Prisma.PlayHistoryFindFirstArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$PlayHistoryPayload> | null;
                    };
                    findFirstOrThrow: {
                        args: Prisma.PlayHistoryFindFirstOrThrowArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$PlayHistoryPayload>;
                    };
                    findMany: {
                        args: Prisma.PlayHistoryFindManyArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$PlayHistoryPayload>[];
                    };
                    create: {
                        args: Prisma.PlayHistoryCreateArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$PlayHistoryPayload>;
                    };
                    createMany: {
                        args: Prisma.PlayHistoryCreateManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    createManyAndReturn: {
                        args: Prisma.PlayHistoryCreateManyAndReturnArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$PlayHistoryPayload>[];
                    };
                    delete: {
                        args: Prisma.PlayHistoryDeleteArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$PlayHistoryPayload>;
                    };
                    update: {
                        args: Prisma.PlayHistoryUpdateArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$PlayHistoryPayload>;
                    };
                    deleteMany: {
                        args: Prisma.PlayHistoryDeleteManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    updateMany: {
                        args: Prisma.PlayHistoryUpdateManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    updateManyAndReturn: {
                        args: Prisma.PlayHistoryUpdateManyAndReturnArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$PlayHistoryPayload>[];
                    };
                    upsert: {
                        args: Prisma.PlayHistoryUpsertArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$PlayHistoryPayload>;
                    };
                    aggregate: {
                        args: Prisma.PlayHistoryAggregateArgs<ExtArgs>;
                        result: $Utils.Optional<AggregatePlayHistory>;
                    };
                    groupBy: {
                        args: Prisma.PlayHistoryGroupByArgs<ExtArgs>;
                        result: $Utils.Optional<PlayHistoryGroupByOutputType>[];
                    };
                    count: {
                        args: Prisma.PlayHistoryCountArgs<ExtArgs>;
                        result:
                            | $Utils.Optional<PlayHistoryCountAggregateOutputType>
                            | number;
                    };
                };
            };
        };
    } & {
        other: {
            payload: any;
            operations: {
                $executeRaw: {
                    args: [
                        query: TemplateStringsArray | Prisma.Sql,
                        ...values: any[]
                    ];
                    result: any;
                };
                $executeRawUnsafe: {
                    args: [query: string, ...values: any[]];
                    result: any;
                };
                $queryRaw: {
                    args: [
                        query: TemplateStringsArray | Prisma.Sql,
                        ...values: any[]
                    ];
                    result: any;
                };
                $queryRawUnsafe: {
                    args: [query: string, ...values: any[]];
                    result: any;
                };
            };
        };
    };
    export const defineExtension: $Extensions.ExtendsHook<
        "define",
        Prisma.TypeMapCb,
        $Extensions.DefaultArgs
    >;
    export type DefaultPrismaClient = PrismaClient;
    export type ErrorFormat = "pretty" | "colorless" | "minimal";
    export interface PrismaClientOptions {
        /**
         * Overwrites the datasource url from your schema.prisma file
         */
        datasources?: Datasources;
        /**
         * Overwrites the datasource url from your schema.prisma file
         */
        datasourceUrl?: string;
        /**
         * @default "colorless"
         */
        errorFormat?: ErrorFormat;
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
        log?: (LogLevel | LogDefinition)[];
        /**
         * The default values for transactionOptions
         * maxWait ?= 2000
         * timeout ?= 5000
         */
        transactionOptions?: {
            maxWait?: number;
            timeout?: number;
            isolationLevel?: Prisma.TransactionIsolationLevel;
        };
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
        omit?: Prisma.GlobalOmitConfig;
    }
    export type GlobalOmitConfig = {
        user?: UserOmit;
        playHistory?: PlayHistoryOmit;
    };

    /* Types for Logging */
    export type LogLevel = "info" | "query" | "warn" | "error";
    export type LogDefinition = {
        level: LogLevel;
        emit: "stdout" | "event";
    };

    export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

    export type GetLogType<T> = CheckIsLogLevel<
        T extends LogDefinition ? T["level"] : T
    >;

    export type GetEvents<T extends any[]> = T extends Array<
        LogLevel | LogDefinition
    >
        ? GetLogType<T[number]>
        : never;

    export type QueryEvent = {
        timestamp: Date;
        query: string;
        params: string;
        duration: number;
        target: string;
    };

    export type LogEvent = {
        timestamp: Date;
        message: string;
        target: string;
    };
    /* End Types for Logging */

    export type PrismaAction =
        | "findUnique"
        | "findUniqueOrThrow"
        | "findMany"
        | "findFirst"
        | "findFirstOrThrow"
        | "create"
        | "createMany"
        | "createManyAndReturn"
        | "update"
        | "updateMany"
        | "updateManyAndReturn"
        | "upsert"
        | "delete"
        | "deleteMany"
        | "executeRaw"
        | "queryRaw"
        | "aggregate"
        | "count"
        | "runCommandRaw"
        | "findRaw"
        | "groupBy";

    // tested in getLogLevel.test.ts
    export function getLogLevel(
        log: Array<LogLevel | LogDefinition>
    ): LogLevel | undefined;

    /**
     * `PrismaClient` proxy available in interactive transactions.
     */
    export type TransactionClient = Omit<
        Prisma.DefaultPrismaClient,
        runtime.ITXClientDenyList
    >;

    export type Datasource = {
        url?: string;
    };

    /**
     * Count Types
     */

    /**
     * Count Type UserCountOutputType
     */

    export type UserCountOutputType = {
        PlayHistory: number;
    };

    export type UserCountOutputTypeSelect<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        PlayHistory?: boolean | UserCountOutputTypeCountPlayHistoryArgs;
    };

    // Custom InputTypes
    /**
     * UserCountOutputType without action
     */
    export type UserCountOutputTypeDefaultArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the UserCountOutputType
         */
        select?: UserCountOutputTypeSelect<ExtArgs> | null;
    };

    /**
     * UserCountOutputType without action
     */
    export type UserCountOutputTypeCountPlayHistoryArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        where?: PlayHistoryWhereInput;
    };

    /**
     * Models
     */

    /**
     * Model User
     */

    export type AggregateUser = {
        _count: UserCountAggregateOutputType | null;
        _avg: UserAvgAggregateOutputType | null;
        _sum: UserSumAggregateOutputType | null;
        _min: UserMinAggregateOutputType | null;
        _max: UserMaxAggregateOutputType | null;
    };

    export type UserAvgAggregateOutputType = {
        id: number | null;
        play_count: number | null;
    };

    export type UserSumAggregateOutputType = {
        id: number | null;
        play_count: number | null;
    };

    export type UserMinAggregateOutputType = {
        id: number | null;
        name: string | null;
        play_count: number | null;
        created_at: Date | null;
        updated_at: Date | null;
    };

    export type UserMaxAggregateOutputType = {
        id: number | null;
        name: string | null;
        play_count: number | null;
        created_at: Date | null;
        updated_at: Date | null;
    };

    export type UserCountAggregateOutputType = {
        id: number;
        name: number;
        play_count: number;
        created_at: number;
        updated_at: number;
        _all: number;
    };

    export type UserAvgAggregateInputType = {
        id?: true;
        play_count?: true;
    };

    export type UserSumAggregateInputType = {
        id?: true;
        play_count?: true;
    };

    export type UserMinAggregateInputType = {
        id?: true;
        name?: true;
        play_count?: true;
        created_at?: true;
        updated_at?: true;
    };

    export type UserMaxAggregateInputType = {
        id?: true;
        name?: true;
        play_count?: true;
        created_at?: true;
        updated_at?: true;
    };

    export type UserCountAggregateInputType = {
        id?: true;
        name?: true;
        play_count?: true;
        created_at?: true;
        updated_at?: true;
        _all?: true;
    };

    export type UserAggregateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Filter which User to aggregate.
         */
        where?: UserWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Users to fetch.
         */
        orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the start position
         */
        cursor?: UserWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Users from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Users.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Count returned Users
         **/
        _count?: true | UserCountAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to average
         **/
        _avg?: UserAvgAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to sum
         **/
        _sum?: UserSumAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to find the minimum value
         **/
        _min?: UserMinAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to find the maximum value
         **/
        _max?: UserMaxAggregateInputType;
    };

    export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends "_count" | "count"
            ? T[P] extends true
                ? number
                : GetScalarType<T[P], AggregateUser[P]>
            : GetScalarType<T[P], AggregateUser[P]>;
    };

    export type UserGroupByArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        where?: UserWhereInput;
        orderBy?:
            | UserOrderByWithAggregationInput
            | UserOrderByWithAggregationInput[];
        by: UserScalarFieldEnum[] | UserScalarFieldEnum;
        having?: UserScalarWhereWithAggregatesInput;
        take?: number;
        skip?: number;
        _count?: UserCountAggregateInputType | true;
        _avg?: UserAvgAggregateInputType;
        _sum?: UserSumAggregateInputType;
        _min?: UserMinAggregateInputType;
        _max?: UserMaxAggregateInputType;
    };

    export type UserGroupByOutputType = {
        id: number;
        name: string;
        play_count: number;
        created_at: Date;
        updated_at: Date;
        _count: UserCountAggregateOutputType | null;
        _avg: UserAvgAggregateOutputType | null;
        _sum: UserSumAggregateOutputType | null;
        _min: UserMinAggregateOutputType | null;
        _max: UserMaxAggregateOutputType | null;
    };

    type GetUserGroupByPayload<T extends UserGroupByArgs> =
        Prisma.PrismaPromise<
            Array<
                PickEnumerable<UserGroupByOutputType, T["by"]> & {
                    [P in keyof T &
                        keyof UserGroupByOutputType]: P extends "_count"
                        ? T[P] extends boolean
                            ? number
                            : GetScalarType<T[P], UserGroupByOutputType[P]>
                        : GetScalarType<T[P], UserGroupByOutputType[P]>;
                }
            >
        >;

    export type UserSelect<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            name?: boolean;
            play_count?: boolean;
            created_at?: boolean;
            updated_at?: boolean;
            PlayHistory?: boolean | User$PlayHistoryArgs<ExtArgs>;
            _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
        },
        ExtArgs["result"]["user"]
    >;

    export type UserSelectCreateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            name?: boolean;
            play_count?: boolean;
            created_at?: boolean;
            updated_at?: boolean;
        },
        ExtArgs["result"]["user"]
    >;

    export type UserSelectUpdateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            name?: boolean;
            play_count?: boolean;
            created_at?: boolean;
            updated_at?: boolean;
        },
        ExtArgs["result"]["user"]
    >;

    export type UserSelectScalar = {
        id?: boolean;
        name?: boolean;
        play_count?: boolean;
        created_at?: boolean;
        updated_at?: boolean;
    };

    export type UserOmit<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = $Extensions.GetOmit<
        "id" | "name" | "play_count" | "created_at" | "updated_at",
        ExtArgs["result"]["user"]
    >;
    export type UserInclude<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        PlayHistory?: boolean | User$PlayHistoryArgs<ExtArgs>;
        _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
    };
    export type UserIncludeCreateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {};
    export type UserIncludeUpdateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {};

    export type $UserPayload<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        name: "User";
        objects: {
            PlayHistory: Prisma.$PlayHistoryPayload<ExtArgs>[];
        };
        scalars: $Extensions.GetPayloadResult<
            {
                id: number;
                name: string;
                play_count: number;
                created_at: Date;
                updated_at: Date;
            },
            ExtArgs["result"]["user"]
        >;
        composites: {};
    };

    type UserGetPayload<
        S extends boolean | null | undefined | UserDefaultArgs
    > = $Result.GetResult<Prisma.$UserPayload, S>;

    type UserCountArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = Omit<UserFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
        select?: UserCountAggregateInputType | true;
    };

    export interface UserDelegate<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {}
    > {
        [K: symbol]: {
            types: Prisma.TypeMap<ExtArgs>["model"]["User"];
            meta: { name: "User" };
        };
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
        findUnique<T extends UserFindUniqueArgs>(
            args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                "findUnique",
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;

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
        findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
            args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                "findUniqueOrThrow",
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

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
        findFirst<T extends UserFindFirstArgs>(
            args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                "findFirst",
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;

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
        findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
            args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                "findFirstOrThrow",
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

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
        findMany<T extends UserFindManyArgs>(
            args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                "findMany",
                GlobalOmitOptions
            >
        >;

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
        create<T extends UserCreateArgs>(
            args: SelectSubset<T, UserCreateArgs<ExtArgs>>
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                "create",
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

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
        createMany<T extends UserCreateManyArgs>(
            args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>
        ): Prisma.PrismaPromise<BatchPayload>;

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
        createManyAndReturn<T extends UserCreateManyAndReturnArgs>(
            args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                "createManyAndReturn",
                GlobalOmitOptions
            >
        >;

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
        delete<T extends UserDeleteArgs>(
            args: SelectSubset<T, UserDeleteArgs<ExtArgs>>
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                "delete",
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

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
        update<T extends UserUpdateArgs>(
            args: SelectSubset<T, UserUpdateArgs<ExtArgs>>
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                "update",
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

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
        deleteMany<T extends UserDeleteManyArgs>(
            args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>
        ): Prisma.PrismaPromise<BatchPayload>;

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
        updateMany<T extends UserUpdateManyArgs>(
            args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>
        ): Prisma.PrismaPromise<BatchPayload>;

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
        updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(
            args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                "updateManyAndReturn",
                GlobalOmitOptions
            >
        >;

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
        upsert<T extends UserUpsertArgs>(
            args: SelectSubset<T, UserUpsertArgs<ExtArgs>>
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                "upsert",
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

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
            args?: Subset<T, UserCountArgs>
        ): Prisma.PrismaPromise<
            T extends $Utils.Record<"select", any>
                ? T["select"] extends true
                    ? number
                    : GetScalarType<T["select"], UserCountAggregateOutputType>
                : number
        >;

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
        aggregate<T extends UserAggregateArgs>(
            args: Subset<T, UserAggregateArgs>
        ): Prisma.PrismaPromise<GetUserAggregateType<T>>;

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
                Extends<"skip", Keys<T>>,
                Extends<"take", Keys<T>>
            >,
            OrderByArg extends True extends HasSelectOrTake
                ? { orderBy: UserGroupByArgs["orderBy"] }
                : { orderBy?: UserGroupByArgs["orderBy"] },
            OrderFields extends ExcludeUnderscoreKeys<
                Keys<MaybeTupleToUnion<T["orderBy"]>>
            >,
            ByFields extends MaybeTupleToUnion<T["by"]>,
            ByValid extends Has<ByFields, OrderFields>,
            HavingFields extends GetHavingFields<T["having"]>,
            HavingValid extends Has<ByFields, HavingFields>,
            ByEmpty extends T["by"] extends never[] ? True : False,
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
                                "Field ",
                                P,
                                ` in "having" needs to be provided in "by"`
                            ];
                  }[HavingFields]
                : "take" extends Keys<T>
                ? "orderBy" extends Keys<T>
                    ? ByValid extends True
                        ? {}
                        : {
                              [P in OrderFields]: P extends ByFields
                                  ? never
                                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                          }[OrderFields]
                    : 'Error: If you provide "take", you also need to provide "orderBy"'
                : "skip" extends Keys<T>
                ? "orderBy" extends Keys<T>
                    ? ByValid extends True
                        ? {}
                        : {
                              [P in OrderFields]: P extends ByFields
                                  ? never
                                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                          }[OrderFields]
                    : 'Error: If you provide "skip", you also need to provide "orderBy"'
                : ByValid extends True
                ? {}
                : {
                      [P in OrderFields]: P extends ByFields
                          ? never
                          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
        >(
            args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> &
                InputErrors
        ): {} extends InputErrors
            ? GetUserGroupByPayload<T>
            : Prisma.PrismaPromise<InputErrors>;
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
    export interface Prisma__UserClient<
        T,
        Null = never,
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {}
    > extends Prisma.PrismaPromise<T> {
        readonly [Symbol.toStringTag]: "PrismaPromise";
        PlayHistory<T extends User$PlayHistoryArgs<ExtArgs> = {}>(
            args?: Subset<T, User$PlayHistoryArgs<ExtArgs>>
        ): Prisma.PrismaPromise<
            | $Result.GetResult<
                  Prisma.$PlayHistoryPayload<ExtArgs>,
                  T,
                  "findMany",
                  GlobalOmitOptions
              >
            | Null
        >;
        /**
         * Attaches callbacks for the resolution and/or rejection of the Promise.
         * @param onfulfilled The callback to execute when the Promise is resolved.
         * @param onrejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of which ever callback is executed.
         */
        then<TResult1 = T, TResult2 = never>(
            onfulfilled?:
                | ((value: T) => TResult1 | PromiseLike<TResult1>)
                | undefined
                | null,
            onrejected?:
                | ((reason: any) => TResult2 | PromiseLike<TResult2>)
                | undefined
                | null
        ): $Utils.JsPromise<TResult1 | TResult2>;
        /**
         * Attaches a callback for only the rejection of the Promise.
         * @param onrejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of the callback.
         */
        catch<TResult = never>(
            onrejected?:
                | ((reason: any) => TResult | PromiseLike<TResult>)
                | undefined
                | null
        ): $Utils.JsPromise<T | TResult>;
        /**
         * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
         * resolved value cannot be modified from the callback.
         * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
         * @returns A Promise for the completion of the callback.
         */
        finally(
            onfinally?: (() => void) | undefined | null
        ): $Utils.JsPromise<T>;
    }

    /**
     * Fields of the User model
     */
    interface UserFieldRefs {
        readonly id: FieldRef<"User", "Int">;
        readonly name: FieldRef<"User", "String">;
        readonly play_count: FieldRef<"User", "Int">;
        readonly created_at: FieldRef<"User", "DateTime">;
        readonly updated_at: FieldRef<"User", "DateTime">;
    }

    // Custom InputTypes
    /**
     * User findUnique
     */
    export type UserFindUniqueArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: UserInclude<ExtArgs> | null;
        /**
         * Filter, which User to fetch.
         */
        where: UserWhereUniqueInput;
    };

    /**
     * User findUniqueOrThrow
     */
    export type UserFindUniqueOrThrowArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: UserInclude<ExtArgs> | null;
        /**
         * Filter, which User to fetch.
         */
        where: UserWhereUniqueInput;
    };

    /**
     * User findFirst
     */
    export type UserFindFirstArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: UserInclude<ExtArgs> | null;
        /**
         * Filter, which User to fetch.
         */
        where?: UserWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Users to fetch.
         */
        orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for searching for Users.
         */
        cursor?: UserWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Users from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Users.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of Users.
         */
        distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
    };

    /**
     * User findFirstOrThrow
     */
    export type UserFindFirstOrThrowArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: UserInclude<ExtArgs> | null;
        /**
         * Filter, which User to fetch.
         */
        where?: UserWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Users to fetch.
         */
        orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for searching for Users.
         */
        cursor?: UserWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Users from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Users.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of Users.
         */
        distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
    };

    /**
     * User findMany
     */
    export type UserFindManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: UserInclude<ExtArgs> | null;
        /**
         * Filter, which Users to fetch.
         */
        where?: UserWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Users to fetch.
         */
        orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for listing Users.
         */
        cursor?: UserWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Users from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Users.
         */
        skip?: number;
        distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
    };

    /**
     * User create
     */
    export type UserCreateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: UserInclude<ExtArgs> | null;
        /**
         * The data needed to create a User.
         */
        data: XOR<UserCreateInput, UserUncheckedCreateInput>;
    };

    /**
     * User createMany
     */
    export type UserCreateManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * The data used to create many Users.
         */
        data: UserCreateManyInput | UserCreateManyInput[];
    };

    /**
     * User createManyAndReturn
     */
    export type UserCreateManyAndReturnArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelectCreateManyAndReturn<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * The data used to create many Users.
         */
        data: UserCreateManyInput | UserCreateManyInput[];
    };

    /**
     * User update
     */
    export type UserUpdateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: UserInclude<ExtArgs> | null;
        /**
         * The data needed to update a User.
         */
        data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
        /**
         * Choose, which User to update.
         */
        where: UserWhereUniqueInput;
    };

    /**
     * User updateMany
     */
    export type UserUpdateManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * The data used to update Users.
         */
        data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
        /**
         * Filter which Users to update
         */
        where?: UserWhereInput;
        /**
         * Limit how many Users to update.
         */
        limit?: number;
    };

    /**
     * User updateManyAndReturn
     */
    export type UserUpdateManyAndReturnArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelectUpdateManyAndReturn<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * The data used to update Users.
         */
        data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
        /**
         * Filter which Users to update
         */
        where?: UserWhereInput;
        /**
         * Limit how many Users to update.
         */
        limit?: number;
    };

    /**
     * User upsert
     */
    export type UserUpsertArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: UserInclude<ExtArgs> | null;
        /**
         * The filter to search for the User to update in case it exists.
         */
        where: UserWhereUniqueInput;
        /**
         * In case the User found by the `where` argument doesn't exist, create a new User with this data.
         */
        create: XOR<UserCreateInput, UserUncheckedCreateInput>;
        /**
         * In case the User was found with the provided `where` argument, update it with this data.
         */
        update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
    };

    /**
     * User delete
     */
    export type UserDeleteArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: UserInclude<ExtArgs> | null;
        /**
         * Filter which User to delete.
         */
        where: UserWhereUniqueInput;
    };

    /**
     * User deleteMany
     */
    export type UserDeleteManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Filter which Users to delete
         */
        where?: UserWhereInput;
        /**
         * Limit how many Users to delete.
         */
        limit?: number;
    };

    /**
     * User.PlayHistory
     */
    export type User$PlayHistoryArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the PlayHistory
         */
        select?: PlayHistorySelect<ExtArgs> | null;
        /**
         * Omit specific fields from the PlayHistory
         */
        omit?: PlayHistoryOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: PlayHistoryInclude<ExtArgs> | null;
        where?: PlayHistoryWhereInput;
        orderBy?:
            | PlayHistoryOrderByWithRelationInput
            | PlayHistoryOrderByWithRelationInput[];
        cursor?: PlayHistoryWhereUniqueInput;
        take?: number;
        skip?: number;
        distinct?: PlayHistoryScalarFieldEnum | PlayHistoryScalarFieldEnum[];
    };

    /**
     * User without action
     */
    export type UserDefaultArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: UserInclude<ExtArgs> | null;
    };

    /**
     * Model PlayHistory
     */

    export type AggregatePlayHistory = {
        _count: PlayHistoryCountAggregateOutputType | null;
        _avg: PlayHistoryAvgAggregateOutputType | null;
        _sum: PlayHistorySumAggregateOutputType | null;
        _min: PlayHistoryMinAggregateOutputType | null;
        _max: PlayHistoryMaxAggregateOutputType | null;
    };

    export type PlayHistoryAvgAggregateOutputType = {
        id: number | null;
        level: number | null;
        score: number | null;
        max_combo: number | null;
        user_id: number | null;
    };

    export type PlayHistorySumAggregateOutputType = {
        id: number | null;
        level: number | null;
        score: number | null;
        max_combo: number | null;
        user_id: number | null;
    };

    export type PlayHistoryMinAggregateOutputType = {
        id: number | null;
        title: string | null;
        artist: string | null;
        difficulty: string | null;
        level: number | null;
        score: number | null;
        max_combo: number | null;
        rank: string | null;
        play_time: string | null;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
    };

    export type PlayHistoryMaxAggregateOutputType = {
        id: number | null;
        title: string | null;
        artist: string | null;
        difficulty: string | null;
        level: number | null;
        score: number | null;
        max_combo: number | null;
        rank: string | null;
        play_time: string | null;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
    };

    export type PlayHistoryCountAggregateOutputType = {
        id: number;
        title: number;
        artist: number;
        difficulty: number;
        level: number;
        score: number;
        max_combo: number;
        rank: number;
        play_time: number;
        created_at: number;
        updated_at: number;
        user_id: number;
        _all: number;
    };

    export type PlayHistoryAvgAggregateInputType = {
        id?: true;
        level?: true;
        score?: true;
        max_combo?: true;
        user_id?: true;
    };

    export type PlayHistorySumAggregateInputType = {
        id?: true;
        level?: true;
        score?: true;
        max_combo?: true;
        user_id?: true;
    };

    export type PlayHistoryMinAggregateInputType = {
        id?: true;
        title?: true;
        artist?: true;
        difficulty?: true;
        level?: true;
        score?: true;
        max_combo?: true;
        rank?: true;
        play_time?: true;
        created_at?: true;
        updated_at?: true;
        user_id?: true;
    };

    export type PlayHistoryMaxAggregateInputType = {
        id?: true;
        title?: true;
        artist?: true;
        difficulty?: true;
        level?: true;
        score?: true;
        max_combo?: true;
        rank?: true;
        play_time?: true;
        created_at?: true;
        updated_at?: true;
        user_id?: true;
    };

    export type PlayHistoryCountAggregateInputType = {
        id?: true;
        title?: true;
        artist?: true;
        difficulty?: true;
        level?: true;
        score?: true;
        max_combo?: true;
        rank?: true;
        play_time?: true;
        created_at?: true;
        updated_at?: true;
        user_id?: true;
        _all?: true;
    };

    export type PlayHistoryAggregateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Filter which PlayHistory to aggregate.
         */
        where?: PlayHistoryWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of PlayHistories to fetch.
         */
        orderBy?:
            | PlayHistoryOrderByWithRelationInput
            | PlayHistoryOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the start position
         */
        cursor?: PlayHistoryWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` PlayHistories from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` PlayHistories.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Count returned PlayHistories
         **/
        _count?: true | PlayHistoryCountAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to average
         **/
        _avg?: PlayHistoryAvgAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to sum
         **/
        _sum?: PlayHistorySumAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to find the minimum value
         **/
        _min?: PlayHistoryMinAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to find the maximum value
         **/
        _max?: PlayHistoryMaxAggregateInputType;
    };

    export type GetPlayHistoryAggregateType<
        T extends PlayHistoryAggregateArgs
    > = {
        [P in keyof T & keyof AggregatePlayHistory]: P extends
            | "_count"
            | "count"
            ? T[P] extends true
                ? number
                : GetScalarType<T[P], AggregatePlayHistory[P]>
            : GetScalarType<T[P], AggregatePlayHistory[P]>;
    };

    export type PlayHistoryGroupByArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        where?: PlayHistoryWhereInput;
        orderBy?:
            | PlayHistoryOrderByWithAggregationInput
            | PlayHistoryOrderByWithAggregationInput[];
        by: PlayHistoryScalarFieldEnum[] | PlayHistoryScalarFieldEnum;
        having?: PlayHistoryScalarWhereWithAggregatesInput;
        take?: number;
        skip?: number;
        _count?: PlayHistoryCountAggregateInputType | true;
        _avg?: PlayHistoryAvgAggregateInputType;
        _sum?: PlayHistorySumAggregateInputType;
        _min?: PlayHistoryMinAggregateInputType;
        _max?: PlayHistoryMaxAggregateInputType;
    };

    export type PlayHistoryGroupByOutputType = {
        id: number;
        title: string;
        artist: string;
        difficulty: string;
        level: number;
        score: number;
        max_combo: number;
        rank: string;
        play_time: string;
        created_at: Date;
        updated_at: Date;
        user_id: number;
        _count: PlayHistoryCountAggregateOutputType | null;
        _avg: PlayHistoryAvgAggregateOutputType | null;
        _sum: PlayHistorySumAggregateOutputType | null;
        _min: PlayHistoryMinAggregateOutputType | null;
        _max: PlayHistoryMaxAggregateOutputType | null;
    };

    type GetPlayHistoryGroupByPayload<T extends PlayHistoryGroupByArgs> =
        Prisma.PrismaPromise<
            Array<
                PickEnumerable<PlayHistoryGroupByOutputType, T["by"]> & {
                    [P in keyof T &
                        keyof PlayHistoryGroupByOutputType]: P extends "_count"
                        ? T[P] extends boolean
                            ? number
                            : GetScalarType<
                                  T[P],
                                  PlayHistoryGroupByOutputType[P]
                              >
                        : GetScalarType<T[P], PlayHistoryGroupByOutputType[P]>;
                }
            >
        >;

    export type PlayHistorySelect<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            title?: boolean;
            artist?: boolean;
            difficulty?: boolean;
            level?: boolean;
            score?: boolean;
            max_combo?: boolean;
            rank?: boolean;
            play_time?: boolean;
            created_at?: boolean;
            updated_at?: boolean;
            user_id?: boolean;
            user?: boolean | UserDefaultArgs<ExtArgs>;
        },
        ExtArgs["result"]["playHistory"]
    >;

    export type PlayHistorySelectCreateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            title?: boolean;
            artist?: boolean;
            difficulty?: boolean;
            level?: boolean;
            score?: boolean;
            max_combo?: boolean;
            rank?: boolean;
            play_time?: boolean;
            created_at?: boolean;
            updated_at?: boolean;
            user_id?: boolean;
            user?: boolean | UserDefaultArgs<ExtArgs>;
        },
        ExtArgs["result"]["playHistory"]
    >;

    export type PlayHistorySelectUpdateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            title?: boolean;
            artist?: boolean;
            difficulty?: boolean;
            level?: boolean;
            score?: boolean;
            max_combo?: boolean;
            rank?: boolean;
            play_time?: boolean;
            created_at?: boolean;
            updated_at?: boolean;
            user_id?: boolean;
            user?: boolean | UserDefaultArgs<ExtArgs>;
        },
        ExtArgs["result"]["playHistory"]
    >;

    export type PlayHistorySelectScalar = {
        id?: boolean;
        title?: boolean;
        artist?: boolean;
        difficulty?: boolean;
        level?: boolean;
        score?: boolean;
        max_combo?: boolean;
        rank?: boolean;
        play_time?: boolean;
        created_at?: boolean;
        updated_at?: boolean;
        user_id?: boolean;
    };

    export type PlayHistoryOmit<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = $Extensions.GetOmit<
        | "id"
        | "title"
        | "artist"
        | "difficulty"
        | "level"
        | "score"
        | "max_combo"
        | "rank"
        | "play_time"
        | "created_at"
        | "updated_at"
        | "user_id",
        ExtArgs["result"]["playHistory"]
    >;
    export type PlayHistoryInclude<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        user?: boolean | UserDefaultArgs<ExtArgs>;
    };
    export type PlayHistoryIncludeCreateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        user?: boolean | UserDefaultArgs<ExtArgs>;
    };
    export type PlayHistoryIncludeUpdateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        user?: boolean | UserDefaultArgs<ExtArgs>;
    };

    export type $PlayHistoryPayload<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        name: "PlayHistory";
        objects: {
            user: Prisma.$UserPayload<ExtArgs>;
        };
        scalars: $Extensions.GetPayloadResult<
            {
                id: number;
                title: string;
                artist: string;
                difficulty: string;
                level: number;
                score: number;
                max_combo: number;
                rank: string;
                play_time: string;
                created_at: Date;
                updated_at: Date;
                user_id: number;
            },
            ExtArgs["result"]["playHistory"]
        >;
        composites: {};
    };

    type PlayHistoryGetPayload<
        S extends boolean | null | undefined | PlayHistoryDefaultArgs
    > = $Result.GetResult<Prisma.$PlayHistoryPayload, S>;

    type PlayHistoryCountArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = Omit<
        PlayHistoryFindManyArgs,
        "select" | "include" | "distinct" | "omit"
    > & {
        select?: PlayHistoryCountAggregateInputType | true;
    };

    export interface PlayHistoryDelegate<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {}
    > {
        [K: symbol]: {
            types: Prisma.TypeMap<ExtArgs>["model"]["PlayHistory"];
            meta: { name: "PlayHistory" };
        };
        /**
         * Find zero or one PlayHistory that matches the filter.
         * @param {PlayHistoryFindUniqueArgs} args - Arguments to find a PlayHistory
         * @example
         * // Get one PlayHistory
         * const playHistory = await prisma.playHistory.findUnique({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findUnique<T extends PlayHistoryFindUniqueArgs>(
            args: SelectSubset<T, PlayHistoryFindUniqueArgs<ExtArgs>>
        ): Prisma__PlayHistoryClient<
            $Result.GetResult<
                Prisma.$PlayHistoryPayload<ExtArgs>,
                T,
                "findUnique",
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find one PlayHistory that matches the filter or throw an error with `error.code='P2025'`
         * if no matches were found.
         * @param {PlayHistoryFindUniqueOrThrowArgs} args - Arguments to find a PlayHistory
         * @example
         * // Get one PlayHistory
         * const playHistory = await prisma.playHistory.findUniqueOrThrow({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findUniqueOrThrow<T extends PlayHistoryFindUniqueOrThrowArgs>(
            args: SelectSubset<T, PlayHistoryFindUniqueOrThrowArgs<ExtArgs>>
        ): Prisma__PlayHistoryClient<
            $Result.GetResult<
                Prisma.$PlayHistoryPayload<ExtArgs>,
                T,
                "findUniqueOrThrow",
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find the first PlayHistory that matches the filter.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {PlayHistoryFindFirstArgs} args - Arguments to find a PlayHistory
         * @example
         * // Get one PlayHistory
         * const playHistory = await prisma.playHistory.findFirst({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findFirst<T extends PlayHistoryFindFirstArgs>(
            args?: SelectSubset<T, PlayHistoryFindFirstArgs<ExtArgs>>
        ): Prisma__PlayHistoryClient<
            $Result.GetResult<
                Prisma.$PlayHistoryPayload<ExtArgs>,
                T,
                "findFirst",
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find the first PlayHistory that matches the filter or
         * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {PlayHistoryFindFirstOrThrowArgs} args - Arguments to find a PlayHistory
         * @example
         * // Get one PlayHistory
         * const playHistory = await prisma.playHistory.findFirstOrThrow({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findFirstOrThrow<T extends PlayHistoryFindFirstOrThrowArgs>(
            args?: SelectSubset<T, PlayHistoryFindFirstOrThrowArgs<ExtArgs>>
        ): Prisma__PlayHistoryClient<
            $Result.GetResult<
                Prisma.$PlayHistoryPayload<ExtArgs>,
                T,
                "findFirstOrThrow",
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find zero or more PlayHistories that matches the filter.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {PlayHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
         * @example
         * // Get all PlayHistories
         * const playHistories = await prisma.playHistory.findMany()
         *
         * // Get first 10 PlayHistories
         * const playHistories = await prisma.playHistory.findMany({ take: 10 })
         *
         * // Only select the `id`
         * const playHistoryWithIdOnly = await prisma.playHistory.findMany({ select: { id: true } })
         *
         */
        findMany<T extends PlayHistoryFindManyArgs>(
            args?: SelectSubset<T, PlayHistoryFindManyArgs<ExtArgs>>
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$PlayHistoryPayload<ExtArgs>,
                T,
                "findMany",
                GlobalOmitOptions
            >
        >;

        /**
         * Create a PlayHistory.
         * @param {PlayHistoryCreateArgs} args - Arguments to create a PlayHistory.
         * @example
         * // Create one PlayHistory
         * const PlayHistory = await prisma.playHistory.create({
         *   data: {
         *     // ... data to create a PlayHistory
         *   }
         * })
         *
         */
        create<T extends PlayHistoryCreateArgs>(
            args: SelectSubset<T, PlayHistoryCreateArgs<ExtArgs>>
        ): Prisma__PlayHistoryClient<
            $Result.GetResult<
                Prisma.$PlayHistoryPayload<ExtArgs>,
                T,
                "create",
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Create many PlayHistories.
         * @param {PlayHistoryCreateManyArgs} args - Arguments to create many PlayHistories.
         * @example
         * // Create many PlayHistories
         * const playHistory = await prisma.playHistory.createMany({
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         */
        createMany<T extends PlayHistoryCreateManyArgs>(
            args?: SelectSubset<T, PlayHistoryCreateManyArgs<ExtArgs>>
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Create many PlayHistories and returns the data saved in the database.
         * @param {PlayHistoryCreateManyAndReturnArgs} args - Arguments to create many PlayHistories.
         * @example
         * // Create many PlayHistories
         * const playHistory = await prisma.playHistory.createManyAndReturn({
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         * // Create many PlayHistories and only return the `id`
         * const playHistoryWithIdOnly = await prisma.playHistory.createManyAndReturn({
         *   select: { id: true },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         *
         */
        createManyAndReturn<T extends PlayHistoryCreateManyAndReturnArgs>(
            args?: SelectSubset<T, PlayHistoryCreateManyAndReturnArgs<ExtArgs>>
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$PlayHistoryPayload<ExtArgs>,
                T,
                "createManyAndReturn",
                GlobalOmitOptions
            >
        >;

        /**
         * Delete a PlayHistory.
         * @param {PlayHistoryDeleteArgs} args - Arguments to delete one PlayHistory.
         * @example
         * // Delete one PlayHistory
         * const PlayHistory = await prisma.playHistory.delete({
         *   where: {
         *     // ... filter to delete one PlayHistory
         *   }
         * })
         *
         */
        delete<T extends PlayHistoryDeleteArgs>(
            args: SelectSubset<T, PlayHistoryDeleteArgs<ExtArgs>>
        ): Prisma__PlayHistoryClient<
            $Result.GetResult<
                Prisma.$PlayHistoryPayload<ExtArgs>,
                T,
                "delete",
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Update one PlayHistory.
         * @param {PlayHistoryUpdateArgs} args - Arguments to update one PlayHistory.
         * @example
         * // Update one PlayHistory
         * const playHistory = await prisma.playHistory.update({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: {
         *     // ... provide data here
         *   }
         * })
         *
         */
        update<T extends PlayHistoryUpdateArgs>(
            args: SelectSubset<T, PlayHistoryUpdateArgs<ExtArgs>>
        ): Prisma__PlayHistoryClient<
            $Result.GetResult<
                Prisma.$PlayHistoryPayload<ExtArgs>,
                T,
                "update",
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Delete zero or more PlayHistories.
         * @param {PlayHistoryDeleteManyArgs} args - Arguments to filter PlayHistories to delete.
         * @example
         * // Delete a few PlayHistories
         * const { count } = await prisma.playHistory.deleteMany({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         *
         */
        deleteMany<T extends PlayHistoryDeleteManyArgs>(
            args?: SelectSubset<T, PlayHistoryDeleteManyArgs<ExtArgs>>
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Update zero or more PlayHistories.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {PlayHistoryUpdateManyArgs} args - Arguments to update one or more rows.
         * @example
         * // Update many PlayHistories
         * const playHistory = await prisma.playHistory.updateMany({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: {
         *     // ... provide data here
         *   }
         * })
         *
         */
        updateMany<T extends PlayHistoryUpdateManyArgs>(
            args: SelectSubset<T, PlayHistoryUpdateManyArgs<ExtArgs>>
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Update zero or more PlayHistories and returns the data updated in the database.
         * @param {PlayHistoryUpdateManyAndReturnArgs} args - Arguments to update many PlayHistories.
         * @example
         * // Update many PlayHistories
         * const playHistory = await prisma.playHistory.updateManyAndReturn({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         * // Update zero or more PlayHistories and only return the `id`
         * const playHistoryWithIdOnly = await prisma.playHistory.updateManyAndReturn({
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
        updateManyAndReturn<T extends PlayHistoryUpdateManyAndReturnArgs>(
            args: SelectSubset<T, PlayHistoryUpdateManyAndReturnArgs<ExtArgs>>
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$PlayHistoryPayload<ExtArgs>,
                T,
                "updateManyAndReturn",
                GlobalOmitOptions
            >
        >;

        /**
         * Create or update one PlayHistory.
         * @param {PlayHistoryUpsertArgs} args - Arguments to update or create a PlayHistory.
         * @example
         * // Update or create a PlayHistory
         * const playHistory = await prisma.playHistory.upsert({
         *   create: {
         *     // ... data to create a PlayHistory
         *   },
         *   update: {
         *     // ... in case it already exists, update
         *   },
         *   where: {
         *     // ... the filter for the PlayHistory we want to update
         *   }
         * })
         */
        upsert<T extends PlayHistoryUpsertArgs>(
            args: SelectSubset<T, PlayHistoryUpsertArgs<ExtArgs>>
        ): Prisma__PlayHistoryClient<
            $Result.GetResult<
                Prisma.$PlayHistoryPayload<ExtArgs>,
                T,
                "upsert",
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Count the number of PlayHistories.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {PlayHistoryCountArgs} args - Arguments to filter PlayHistories to count.
         * @example
         * // Count the number of PlayHistories
         * const count = await prisma.playHistory.count({
         *   where: {
         *     // ... the filter for the PlayHistories we want to count
         *   }
         * })
         **/
        count<T extends PlayHistoryCountArgs>(
            args?: Subset<T, PlayHistoryCountArgs>
        ): Prisma.PrismaPromise<
            T extends $Utils.Record<"select", any>
                ? T["select"] extends true
                    ? number
                    : GetScalarType<
                          T["select"],
                          PlayHistoryCountAggregateOutputType
                      >
                : number
        >;

        /**
         * Allows you to perform aggregations operations on a PlayHistory.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {PlayHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
        aggregate<T extends PlayHistoryAggregateArgs>(
            args: Subset<T, PlayHistoryAggregateArgs>
        ): Prisma.PrismaPromise<GetPlayHistoryAggregateType<T>>;

        /**
         * Group by PlayHistory.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {PlayHistoryGroupByArgs} args - Group by arguments.
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
            T extends PlayHistoryGroupByArgs,
            HasSelectOrTake extends Or<
                Extends<"skip", Keys<T>>,
                Extends<"take", Keys<T>>
            >,
            OrderByArg extends True extends HasSelectOrTake
                ? { orderBy: PlayHistoryGroupByArgs["orderBy"] }
                : { orderBy?: PlayHistoryGroupByArgs["orderBy"] },
            OrderFields extends ExcludeUnderscoreKeys<
                Keys<MaybeTupleToUnion<T["orderBy"]>>
            >,
            ByFields extends MaybeTupleToUnion<T["by"]>,
            ByValid extends Has<ByFields, OrderFields>,
            HavingFields extends GetHavingFields<T["having"]>,
            HavingValid extends Has<ByFields, HavingFields>,
            ByEmpty extends T["by"] extends never[] ? True : False,
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
                                "Field ",
                                P,
                                ` in "having" needs to be provided in "by"`
                            ];
                  }[HavingFields]
                : "take" extends Keys<T>
                ? "orderBy" extends Keys<T>
                    ? ByValid extends True
                        ? {}
                        : {
                              [P in OrderFields]: P extends ByFields
                                  ? never
                                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                          }[OrderFields]
                    : 'Error: If you provide "take", you also need to provide "orderBy"'
                : "skip" extends Keys<T>
                ? "orderBy" extends Keys<T>
                    ? ByValid extends True
                        ? {}
                        : {
                              [P in OrderFields]: P extends ByFields
                                  ? never
                                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                          }[OrderFields]
                    : 'Error: If you provide "skip", you also need to provide "orderBy"'
                : ByValid extends True
                ? {}
                : {
                      [P in OrderFields]: P extends ByFields
                          ? never
                          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
        >(
            args: SubsetIntersection<T, PlayHistoryGroupByArgs, OrderByArg> &
                InputErrors
        ): {} extends InputErrors
            ? GetPlayHistoryGroupByPayload<T>
            : Prisma.PrismaPromise<InputErrors>;
        /**
         * Fields of the PlayHistory model
         */
        readonly fields: PlayHistoryFieldRefs;
    }

    /**
     * The delegate class that acts as a "Promise-like" for PlayHistory.
     * Why is this prefixed with `Prisma__`?
     * Because we want to prevent naming conflicts as mentioned in
     * https://github.com/prisma/prisma-client-js/issues/707
     */
    export interface Prisma__PlayHistoryClient<
        T,
        Null = never,
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {}
    > extends Prisma.PrismaPromise<T> {
        readonly [Symbol.toStringTag]: "PrismaPromise";
        user<T extends UserDefaultArgs<ExtArgs> = {}>(
            args?: Subset<T, UserDefaultArgs<ExtArgs>>
        ): Prisma__UserClient<
            | $Result.GetResult<
                  Prisma.$UserPayload<ExtArgs>,
                  T,
                  "findUniqueOrThrow",
                  GlobalOmitOptions
              >
            | Null,
            Null,
            ExtArgs,
            GlobalOmitOptions
        >;
        /**
         * Attaches callbacks for the resolution and/or rejection of the Promise.
         * @param onfulfilled The callback to execute when the Promise is resolved.
         * @param onrejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of which ever callback is executed.
         */
        then<TResult1 = T, TResult2 = never>(
            onfulfilled?:
                | ((value: T) => TResult1 | PromiseLike<TResult1>)
                | undefined
                | null,
            onrejected?:
                | ((reason: any) => TResult2 | PromiseLike<TResult2>)
                | undefined
                | null
        ): $Utils.JsPromise<TResult1 | TResult2>;
        /**
         * Attaches a callback for only the rejection of the Promise.
         * @param onrejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of the callback.
         */
        catch<TResult = never>(
            onrejected?:
                | ((reason: any) => TResult | PromiseLike<TResult>)
                | undefined
                | null
        ): $Utils.JsPromise<T | TResult>;
        /**
         * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
         * resolved value cannot be modified from the callback.
         * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
         * @returns A Promise for the completion of the callback.
         */
        finally(
            onfinally?: (() => void) | undefined | null
        ): $Utils.JsPromise<T>;
    }

    /**
     * Fields of the PlayHistory model
     */
    interface PlayHistoryFieldRefs {
        readonly id: FieldRef<"PlayHistory", "Int">;
        readonly title: FieldRef<"PlayHistory", "String">;
        readonly artist: FieldRef<"PlayHistory", "String">;
        readonly difficulty: FieldRef<"PlayHistory", "String">;
        readonly level: FieldRef<"PlayHistory", "Int">;
        readonly score: FieldRef<"PlayHistory", "Int">;
        readonly max_combo: FieldRef<"PlayHistory", "Int">;
        readonly rank: FieldRef<"PlayHistory", "String">;
        readonly play_time: FieldRef<"PlayHistory", "String">;
        readonly created_at: FieldRef<"PlayHistory", "DateTime">;
        readonly updated_at: FieldRef<"PlayHistory", "DateTime">;
        readonly user_id: FieldRef<"PlayHistory", "Int">;
    }

    // Custom InputTypes
    /**
     * PlayHistory findUnique
     */
    export type PlayHistoryFindUniqueArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the PlayHistory
         */
        select?: PlayHistorySelect<ExtArgs> | null;
        /**
         * Omit specific fields from the PlayHistory
         */
        omit?: PlayHistoryOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: PlayHistoryInclude<ExtArgs> | null;
        /**
         * Filter, which PlayHistory to fetch.
         */
        where: PlayHistoryWhereUniqueInput;
    };

    /**
     * PlayHistory findUniqueOrThrow
     */
    export type PlayHistoryFindUniqueOrThrowArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the PlayHistory
         */
        select?: PlayHistorySelect<ExtArgs> | null;
        /**
         * Omit specific fields from the PlayHistory
         */
        omit?: PlayHistoryOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: PlayHistoryInclude<ExtArgs> | null;
        /**
         * Filter, which PlayHistory to fetch.
         */
        where: PlayHistoryWhereUniqueInput;
    };

    /**
     * PlayHistory findFirst
     */
    export type PlayHistoryFindFirstArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the PlayHistory
         */
        select?: PlayHistorySelect<ExtArgs> | null;
        /**
         * Omit specific fields from the PlayHistory
         */
        omit?: PlayHistoryOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: PlayHistoryInclude<ExtArgs> | null;
        /**
         * Filter, which PlayHistory to fetch.
         */
        where?: PlayHistoryWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of PlayHistories to fetch.
         */
        orderBy?:
            | PlayHistoryOrderByWithRelationInput
            | PlayHistoryOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for searching for PlayHistories.
         */
        cursor?: PlayHistoryWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` PlayHistories from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` PlayHistories.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of PlayHistories.
         */
        distinct?: PlayHistoryScalarFieldEnum | PlayHistoryScalarFieldEnum[];
    };

    /**
     * PlayHistory findFirstOrThrow
     */
    export type PlayHistoryFindFirstOrThrowArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the PlayHistory
         */
        select?: PlayHistorySelect<ExtArgs> | null;
        /**
         * Omit specific fields from the PlayHistory
         */
        omit?: PlayHistoryOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: PlayHistoryInclude<ExtArgs> | null;
        /**
         * Filter, which PlayHistory to fetch.
         */
        where?: PlayHistoryWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of PlayHistories to fetch.
         */
        orderBy?:
            | PlayHistoryOrderByWithRelationInput
            | PlayHistoryOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for searching for PlayHistories.
         */
        cursor?: PlayHistoryWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` PlayHistories from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` PlayHistories.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of PlayHistories.
         */
        distinct?: PlayHistoryScalarFieldEnum | PlayHistoryScalarFieldEnum[];
    };

    /**
     * PlayHistory findMany
     */
    export type PlayHistoryFindManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the PlayHistory
         */
        select?: PlayHistorySelect<ExtArgs> | null;
        /**
         * Omit specific fields from the PlayHistory
         */
        omit?: PlayHistoryOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: PlayHistoryInclude<ExtArgs> | null;
        /**
         * Filter, which PlayHistories to fetch.
         */
        where?: PlayHistoryWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of PlayHistories to fetch.
         */
        orderBy?:
            | PlayHistoryOrderByWithRelationInput
            | PlayHistoryOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for listing PlayHistories.
         */
        cursor?: PlayHistoryWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` PlayHistories from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` PlayHistories.
         */
        skip?: number;
        distinct?: PlayHistoryScalarFieldEnum | PlayHistoryScalarFieldEnum[];
    };

    /**
     * PlayHistory create
     */
    export type PlayHistoryCreateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the PlayHistory
         */
        select?: PlayHistorySelect<ExtArgs> | null;
        /**
         * Omit specific fields from the PlayHistory
         */
        omit?: PlayHistoryOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: PlayHistoryInclude<ExtArgs> | null;
        /**
         * The data needed to create a PlayHistory.
         */
        data: XOR<PlayHistoryCreateInput, PlayHistoryUncheckedCreateInput>;
    };

    /**
     * PlayHistory createMany
     */
    export type PlayHistoryCreateManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * The data used to create many PlayHistories.
         */
        data: PlayHistoryCreateManyInput | PlayHistoryCreateManyInput[];
    };

    /**
     * PlayHistory createManyAndReturn
     */
    export type PlayHistoryCreateManyAndReturnArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the PlayHistory
         */
        select?: PlayHistorySelectCreateManyAndReturn<ExtArgs> | null;
        /**
         * Omit specific fields from the PlayHistory
         */
        omit?: PlayHistoryOmit<ExtArgs> | null;
        /**
         * The data used to create many PlayHistories.
         */
        data: PlayHistoryCreateManyInput | PlayHistoryCreateManyInput[];
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: PlayHistoryIncludeCreateManyAndReturn<ExtArgs> | null;
    };

    /**
     * PlayHistory update
     */
    export type PlayHistoryUpdateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the PlayHistory
         */
        select?: PlayHistorySelect<ExtArgs> | null;
        /**
         * Omit specific fields from the PlayHistory
         */
        omit?: PlayHistoryOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: PlayHistoryInclude<ExtArgs> | null;
        /**
         * The data needed to update a PlayHistory.
         */
        data: XOR<PlayHistoryUpdateInput, PlayHistoryUncheckedUpdateInput>;
        /**
         * Choose, which PlayHistory to update.
         */
        where: PlayHistoryWhereUniqueInput;
    };

    /**
     * PlayHistory updateMany
     */
    export type PlayHistoryUpdateManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * The data used to update PlayHistories.
         */
        data: XOR<
            PlayHistoryUpdateManyMutationInput,
            PlayHistoryUncheckedUpdateManyInput
        >;
        /**
         * Filter which PlayHistories to update
         */
        where?: PlayHistoryWhereInput;
        /**
         * Limit how many PlayHistories to update.
         */
        limit?: number;
    };

    /**
     * PlayHistory updateManyAndReturn
     */
    export type PlayHistoryUpdateManyAndReturnArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the PlayHistory
         */
        select?: PlayHistorySelectUpdateManyAndReturn<ExtArgs> | null;
        /**
         * Omit specific fields from the PlayHistory
         */
        omit?: PlayHistoryOmit<ExtArgs> | null;
        /**
         * The data used to update PlayHistories.
         */
        data: XOR<
            PlayHistoryUpdateManyMutationInput,
            PlayHistoryUncheckedUpdateManyInput
        >;
        /**
         * Filter which PlayHistories to update
         */
        where?: PlayHistoryWhereInput;
        /**
         * Limit how many PlayHistories to update.
         */
        limit?: number;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: PlayHistoryIncludeUpdateManyAndReturn<ExtArgs> | null;
    };

    /**
     * PlayHistory upsert
     */
    export type PlayHistoryUpsertArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the PlayHistory
         */
        select?: PlayHistorySelect<ExtArgs> | null;
        /**
         * Omit specific fields from the PlayHistory
         */
        omit?: PlayHistoryOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: PlayHistoryInclude<ExtArgs> | null;
        /**
         * The filter to search for the PlayHistory to update in case it exists.
         */
        where: PlayHistoryWhereUniqueInput;
        /**
         * In case the PlayHistory found by the `where` argument doesn't exist, create a new PlayHistory with this data.
         */
        create: XOR<PlayHistoryCreateInput, PlayHistoryUncheckedCreateInput>;
        /**
         * In case the PlayHistory was found with the provided `where` argument, update it with this data.
         */
        update: XOR<PlayHistoryUpdateInput, PlayHistoryUncheckedUpdateInput>;
    };

    /**
     * PlayHistory delete
     */
    export type PlayHistoryDeleteArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the PlayHistory
         */
        select?: PlayHistorySelect<ExtArgs> | null;
        /**
         * Omit specific fields from the PlayHistory
         */
        omit?: PlayHistoryOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: PlayHistoryInclude<ExtArgs> | null;
        /**
         * Filter which PlayHistory to delete.
         */
        where: PlayHistoryWhereUniqueInput;
    };

    /**
     * PlayHistory deleteMany
     */
    export type PlayHistoryDeleteManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Filter which PlayHistories to delete
         */
        where?: PlayHistoryWhereInput;
        /**
         * Limit how many PlayHistories to delete.
         */
        limit?: number;
    };

    /**
     * PlayHistory without action
     */
    export type PlayHistoryDefaultArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
    > = {
        /**
         * Select specific fields to fetch from the PlayHistory
         */
        select?: PlayHistorySelect<ExtArgs> | null;
        /**
         * Omit specific fields from the PlayHistory
         */
        omit?: PlayHistoryOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: PlayHistoryInclude<ExtArgs> | null;
    };

    /**
     * Enums
     */

    export const TransactionIsolationLevel: {
        Serializable: "Serializable";
    };

    export type TransactionIsolationLevel =
        (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

    export const UserScalarFieldEnum: {
        id: "id";
        name: "name";
        play_count: "play_count";
        created_at: "created_at";
        updated_at: "updated_at";
    };

    export type UserScalarFieldEnum =
        (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

    export const PlayHistoryScalarFieldEnum: {
        id: "id";
        title: "title";
        artist: "artist";
        difficulty: "difficulty";
        level: "level";
        score: "score";
        max_combo: "max_combo";
        rank: "rank";
        play_time: "play_time";
        created_at: "created_at";
        updated_at: "updated_at";
        user_id: "user_id";
    };

    export type PlayHistoryScalarFieldEnum =
        (typeof PlayHistoryScalarFieldEnum)[keyof typeof PlayHistoryScalarFieldEnum];

    export const SortOrder: {
        asc: "asc";
        desc: "desc";
    };

    export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

    /**
     * Field references
     */

    /**
     * Reference to a field of type 'Int'
     */
    export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        "Int"
    >;

    /**
     * Reference to a field of type 'String'
     */
    export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        "String"
    >;

    /**
     * Reference to a field of type 'DateTime'
     */
    export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        "DateTime"
    >;

    /**
     * Reference to a field of type 'Float'
     */
    export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        "Float"
    >;

    /**
     * Deep Input Types
     */

    export type UserWhereInput = {
        AND?: UserWhereInput | UserWhereInput[];
        OR?: UserWhereInput[];
        NOT?: UserWhereInput | UserWhereInput[];
        id?: IntFilter<"User"> | number;
        name?: StringFilter<"User"> | string;
        play_count?: IntFilter<"User"> | number;
        created_at?: DateTimeFilter<"User"> | Date | string;
        updated_at?: DateTimeFilter<"User"> | Date | string;
        PlayHistory?: PlayHistoryListRelationFilter;
    };

    export type UserOrderByWithRelationInput = {
        id?: SortOrder;
        name?: SortOrder;
        play_count?: SortOrder;
        created_at?: SortOrder;
        updated_at?: SortOrder;
        PlayHistory?: PlayHistoryOrderByRelationAggregateInput;
    };

    export type UserWhereUniqueInput = Prisma.AtLeast<
        {
            id?: number;
            name?: string;
            AND?: UserWhereInput | UserWhereInput[];
            OR?: UserWhereInput[];
            NOT?: UserWhereInput | UserWhereInput[];
            play_count?: IntFilter<"User"> | number;
            created_at?: DateTimeFilter<"User"> | Date | string;
            updated_at?: DateTimeFilter<"User"> | Date | string;
            PlayHistory?: PlayHistoryListRelationFilter;
        },
        "id" | "name"
    >;

    export type UserOrderByWithAggregationInput = {
        id?: SortOrder;
        name?: SortOrder;
        play_count?: SortOrder;
        created_at?: SortOrder;
        updated_at?: SortOrder;
        _count?: UserCountOrderByAggregateInput;
        _avg?: UserAvgOrderByAggregateInput;
        _max?: UserMaxOrderByAggregateInput;
        _min?: UserMinOrderByAggregateInput;
        _sum?: UserSumOrderByAggregateInput;
    };

    export type UserScalarWhereWithAggregatesInput = {
        AND?:
            | UserScalarWhereWithAggregatesInput
            | UserScalarWhereWithAggregatesInput[];
        OR?: UserScalarWhereWithAggregatesInput[];
        NOT?:
            | UserScalarWhereWithAggregatesInput
            | UserScalarWhereWithAggregatesInput[];
        id?: IntWithAggregatesFilter<"User"> | number;
        name?: StringWithAggregatesFilter<"User"> | string;
        play_count?: IntWithAggregatesFilter<"User"> | number;
        created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string;
        updated_at?: DateTimeWithAggregatesFilter<"User"> | Date | string;
    };

    export type PlayHistoryWhereInput = {
        AND?: PlayHistoryWhereInput | PlayHistoryWhereInput[];
        OR?: PlayHistoryWhereInput[];
        NOT?: PlayHistoryWhereInput | PlayHistoryWhereInput[];
        id?: IntFilter<"PlayHistory"> | number;
        title?: StringFilter<"PlayHistory"> | string;
        artist?: StringFilter<"PlayHistory"> | string;
        difficulty?: StringFilter<"PlayHistory"> | string;
        level?: IntFilter<"PlayHistory"> | number;
        score?: IntFilter<"PlayHistory"> | number;
        max_combo?: IntFilter<"PlayHistory"> | number;
        rank?: StringFilter<"PlayHistory"> | string;
        play_time?: StringFilter<"PlayHistory"> | string;
        created_at?: DateTimeFilter<"PlayHistory"> | Date | string;
        updated_at?: DateTimeFilter<"PlayHistory"> | Date | string;
        user_id?: IntFilter<"PlayHistory"> | number;
        user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    };

    export type PlayHistoryOrderByWithRelationInput = {
        id?: SortOrder;
        title?: SortOrder;
        artist?: SortOrder;
        difficulty?: SortOrder;
        level?: SortOrder;
        score?: SortOrder;
        max_combo?: SortOrder;
        rank?: SortOrder;
        play_time?: SortOrder;
        created_at?: SortOrder;
        updated_at?: SortOrder;
        user_id?: SortOrder;
        user?: UserOrderByWithRelationInput;
    };

    export type PlayHistoryWhereUniqueInput = Prisma.AtLeast<
        {
            id?: number;
            AND?: PlayHistoryWhereInput | PlayHistoryWhereInput[];
            OR?: PlayHistoryWhereInput[];
            NOT?: PlayHistoryWhereInput | PlayHistoryWhereInput[];
            title?: StringFilter<"PlayHistory"> | string;
            artist?: StringFilter<"PlayHistory"> | string;
            difficulty?: StringFilter<"PlayHistory"> | string;
            level?: IntFilter<"PlayHistory"> | number;
            score?: IntFilter<"PlayHistory"> | number;
            max_combo?: IntFilter<"PlayHistory"> | number;
            rank?: StringFilter<"PlayHistory"> | string;
            play_time?: StringFilter<"PlayHistory"> | string;
            created_at?: DateTimeFilter<"PlayHistory"> | Date | string;
            updated_at?: DateTimeFilter<"PlayHistory"> | Date | string;
            user_id?: IntFilter<"PlayHistory"> | number;
            user?: XOR<UserScalarRelationFilter, UserWhereInput>;
        },
        "id"
    >;

    export type PlayHistoryOrderByWithAggregationInput = {
        id?: SortOrder;
        title?: SortOrder;
        artist?: SortOrder;
        difficulty?: SortOrder;
        level?: SortOrder;
        score?: SortOrder;
        max_combo?: SortOrder;
        rank?: SortOrder;
        play_time?: SortOrder;
        created_at?: SortOrder;
        updated_at?: SortOrder;
        user_id?: SortOrder;
        _count?: PlayHistoryCountOrderByAggregateInput;
        _avg?: PlayHistoryAvgOrderByAggregateInput;
        _max?: PlayHistoryMaxOrderByAggregateInput;
        _min?: PlayHistoryMinOrderByAggregateInput;
        _sum?: PlayHistorySumOrderByAggregateInput;
    };

    export type PlayHistoryScalarWhereWithAggregatesInput = {
        AND?:
            | PlayHistoryScalarWhereWithAggregatesInput
            | PlayHistoryScalarWhereWithAggregatesInput[];
        OR?: PlayHistoryScalarWhereWithAggregatesInput[];
        NOT?:
            | PlayHistoryScalarWhereWithAggregatesInput
            | PlayHistoryScalarWhereWithAggregatesInput[];
        id?: IntWithAggregatesFilter<"PlayHistory"> | number;
        title?: StringWithAggregatesFilter<"PlayHistory"> | string;
        artist?: StringWithAggregatesFilter<"PlayHistory"> | string;
        difficulty?: StringWithAggregatesFilter<"PlayHistory"> | string;
        level?: IntWithAggregatesFilter<"PlayHistory"> | number;
        score?: IntWithAggregatesFilter<"PlayHistory"> | number;
        max_combo?: IntWithAggregatesFilter<"PlayHistory"> | number;
        rank?: StringWithAggregatesFilter<"PlayHistory"> | string;
        play_time?: StringWithAggregatesFilter<"PlayHistory"> | string;
        created_at?:
            | DateTimeWithAggregatesFilter<"PlayHistory">
            | Date
            | string;
        updated_at?:
            | DateTimeWithAggregatesFilter<"PlayHistory">
            | Date
            | string;
        user_id?: IntWithAggregatesFilter<"PlayHistory"> | number;
    };

    export type UserCreateInput = {
        name: string;
        play_count: number;
        created_at?: Date | string;
        updated_at?: Date | string;
        PlayHistory?: PlayHistoryCreateNestedManyWithoutUserInput;
    };

    export type UserUncheckedCreateInput = {
        id?: number;
        name: string;
        play_count: number;
        created_at?: Date | string;
        updated_at?: Date | string;
        PlayHistory?: PlayHistoryUncheckedCreateNestedManyWithoutUserInput;
    };

    export type UserUpdateInput = {
        name?: StringFieldUpdateOperationsInput | string;
        play_count?: IntFieldUpdateOperationsInput | number;
        created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        PlayHistory?: PlayHistoryUpdateManyWithoutUserNestedInput;
    };

    export type UserUncheckedUpdateInput = {
        id?: IntFieldUpdateOperationsInput | number;
        name?: StringFieldUpdateOperationsInput | string;
        play_count?: IntFieldUpdateOperationsInput | number;
        created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        PlayHistory?: PlayHistoryUncheckedUpdateManyWithoutUserNestedInput;
    };

    export type UserCreateManyInput = {
        id?: number;
        name: string;
        play_count: number;
        created_at?: Date | string;
        updated_at?: Date | string;
    };

    export type UserUpdateManyMutationInput = {
        name?: StringFieldUpdateOperationsInput | string;
        play_count?: IntFieldUpdateOperationsInput | number;
        created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    };

    export type UserUncheckedUpdateManyInput = {
        id?: IntFieldUpdateOperationsInput | number;
        name?: StringFieldUpdateOperationsInput | string;
        play_count?: IntFieldUpdateOperationsInput | number;
        created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    };

    export type PlayHistoryCreateInput = {
        title: string;
        artist: string;
        difficulty: string;
        level: number;
        score: number;
        max_combo: number;
        rank: string;
        play_time: string;
        created_at?: Date | string;
        updated_at?: Date | string;
        user: UserCreateNestedOneWithoutPlayHistoryInput;
    };

    export type PlayHistoryUncheckedCreateInput = {
        id?: number;
        title: string;
        artist: string;
        difficulty: string;
        level: number;
        score: number;
        max_combo: number;
        rank: string;
        play_time: string;
        created_at?: Date | string;
        updated_at?: Date | string;
        user_id: number;
    };

    export type PlayHistoryUpdateInput = {
        title?: StringFieldUpdateOperationsInput | string;
        artist?: StringFieldUpdateOperationsInput | string;
        difficulty?: StringFieldUpdateOperationsInput | string;
        level?: IntFieldUpdateOperationsInput | number;
        score?: IntFieldUpdateOperationsInput | number;
        max_combo?: IntFieldUpdateOperationsInput | number;
        rank?: StringFieldUpdateOperationsInput | string;
        play_time?: StringFieldUpdateOperationsInput | string;
        created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        user?: UserUpdateOneRequiredWithoutPlayHistoryNestedInput;
    };

    export type PlayHistoryUncheckedUpdateInput = {
        id?: IntFieldUpdateOperationsInput | number;
        title?: StringFieldUpdateOperationsInput | string;
        artist?: StringFieldUpdateOperationsInput | string;
        difficulty?: StringFieldUpdateOperationsInput | string;
        level?: IntFieldUpdateOperationsInput | number;
        score?: IntFieldUpdateOperationsInput | number;
        max_combo?: IntFieldUpdateOperationsInput | number;
        rank?: StringFieldUpdateOperationsInput | string;
        play_time?: StringFieldUpdateOperationsInput | string;
        created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        user_id?: IntFieldUpdateOperationsInput | number;
    };

    export type PlayHistoryCreateManyInput = {
        id?: number;
        title: string;
        artist: string;
        difficulty: string;
        level: number;
        score: number;
        max_combo: number;
        rank: string;
        play_time: string;
        created_at?: Date | string;
        updated_at?: Date | string;
        user_id: number;
    };

    export type PlayHistoryUpdateManyMutationInput = {
        title?: StringFieldUpdateOperationsInput | string;
        artist?: StringFieldUpdateOperationsInput | string;
        difficulty?: StringFieldUpdateOperationsInput | string;
        level?: IntFieldUpdateOperationsInput | number;
        score?: IntFieldUpdateOperationsInput | number;
        max_combo?: IntFieldUpdateOperationsInput | number;
        rank?: StringFieldUpdateOperationsInput | string;
        play_time?: StringFieldUpdateOperationsInput | string;
        created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    };

    export type PlayHistoryUncheckedUpdateManyInput = {
        id?: IntFieldUpdateOperationsInput | number;
        title?: StringFieldUpdateOperationsInput | string;
        artist?: StringFieldUpdateOperationsInput | string;
        difficulty?: StringFieldUpdateOperationsInput | string;
        level?: IntFieldUpdateOperationsInput | number;
        score?: IntFieldUpdateOperationsInput | number;
        max_combo?: IntFieldUpdateOperationsInput | number;
        rank?: StringFieldUpdateOperationsInput | string;
        play_time?: StringFieldUpdateOperationsInput | string;
        created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        user_id?: IntFieldUpdateOperationsInput | number;
    };

    export type IntFilter<$PrismaModel = never> = {
        equals?: number | IntFieldRefInput<$PrismaModel>;
        in?: number[];
        notIn?: number[];
        lt?: number | IntFieldRefInput<$PrismaModel>;
        lte?: number | IntFieldRefInput<$PrismaModel>;
        gt?: number | IntFieldRefInput<$PrismaModel>;
        gte?: number | IntFieldRefInput<$PrismaModel>;
        not?: NestedIntFilter<$PrismaModel> | number;
    };

    export type StringFilter<$PrismaModel = never> = {
        equals?: string | StringFieldRefInput<$PrismaModel>;
        in?: string[];
        notIn?: string[];
        lt?: string | StringFieldRefInput<$PrismaModel>;
        lte?: string | StringFieldRefInput<$PrismaModel>;
        gt?: string | StringFieldRefInput<$PrismaModel>;
        gte?: string | StringFieldRefInput<$PrismaModel>;
        contains?: string | StringFieldRefInput<$PrismaModel>;
        startsWith?: string | StringFieldRefInput<$PrismaModel>;
        endsWith?: string | StringFieldRefInput<$PrismaModel>;
        not?: NestedStringFilter<$PrismaModel> | string;
    };

    export type DateTimeFilter<$PrismaModel = never> = {
        equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        in?: Date[] | string[];
        notIn?: Date[] | string[];
        lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
    };

    export type PlayHistoryListRelationFilter = {
        every?: PlayHistoryWhereInput;
        some?: PlayHistoryWhereInput;
        none?: PlayHistoryWhereInput;
    };

    export type PlayHistoryOrderByRelationAggregateInput = {
        _count?: SortOrder;
    };

    export type UserCountOrderByAggregateInput = {
        id?: SortOrder;
        name?: SortOrder;
        play_count?: SortOrder;
        created_at?: SortOrder;
        updated_at?: SortOrder;
    };

    export type UserAvgOrderByAggregateInput = {
        id?: SortOrder;
        play_count?: SortOrder;
    };

    export type UserMaxOrderByAggregateInput = {
        id?: SortOrder;
        name?: SortOrder;
        play_count?: SortOrder;
        created_at?: SortOrder;
        updated_at?: SortOrder;
    };

    export type UserMinOrderByAggregateInput = {
        id?: SortOrder;
        name?: SortOrder;
        play_count?: SortOrder;
        created_at?: SortOrder;
        updated_at?: SortOrder;
    };

    export type UserSumOrderByAggregateInput = {
        id?: SortOrder;
        play_count?: SortOrder;
    };

    export type IntWithAggregatesFilter<$PrismaModel = never> = {
        equals?: number | IntFieldRefInput<$PrismaModel>;
        in?: number[];
        notIn?: number[];
        lt?: number | IntFieldRefInput<$PrismaModel>;
        lte?: number | IntFieldRefInput<$PrismaModel>;
        gt?: number | IntFieldRefInput<$PrismaModel>;
        gte?: number | IntFieldRefInput<$PrismaModel>;
        not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
        _count?: NestedIntFilter<$PrismaModel>;
        _avg?: NestedFloatFilter<$PrismaModel>;
        _sum?: NestedIntFilter<$PrismaModel>;
        _min?: NestedIntFilter<$PrismaModel>;
        _max?: NestedIntFilter<$PrismaModel>;
    };

    export type StringWithAggregatesFilter<$PrismaModel = never> = {
        equals?: string | StringFieldRefInput<$PrismaModel>;
        in?: string[];
        notIn?: string[];
        lt?: string | StringFieldRefInput<$PrismaModel>;
        lte?: string | StringFieldRefInput<$PrismaModel>;
        gt?: string | StringFieldRefInput<$PrismaModel>;
        gte?: string | StringFieldRefInput<$PrismaModel>;
        contains?: string | StringFieldRefInput<$PrismaModel>;
        startsWith?: string | StringFieldRefInput<$PrismaModel>;
        endsWith?: string | StringFieldRefInput<$PrismaModel>;
        not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
        _count?: NestedIntFilter<$PrismaModel>;
        _min?: NestedStringFilter<$PrismaModel>;
        _max?: NestedStringFilter<$PrismaModel>;
    };

    export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
        equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        in?: Date[] | string[];
        notIn?: Date[] | string[];
        lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
        _count?: NestedIntFilter<$PrismaModel>;
        _min?: NestedDateTimeFilter<$PrismaModel>;
        _max?: NestedDateTimeFilter<$PrismaModel>;
    };

    export type UserScalarRelationFilter = {
        is?: UserWhereInput;
        isNot?: UserWhereInput;
    };

    export type PlayHistoryCountOrderByAggregateInput = {
        id?: SortOrder;
        title?: SortOrder;
        artist?: SortOrder;
        difficulty?: SortOrder;
        level?: SortOrder;
        score?: SortOrder;
        max_combo?: SortOrder;
        rank?: SortOrder;
        play_time?: SortOrder;
        created_at?: SortOrder;
        updated_at?: SortOrder;
        user_id?: SortOrder;
    };

    export type PlayHistoryAvgOrderByAggregateInput = {
        id?: SortOrder;
        level?: SortOrder;
        score?: SortOrder;
        max_combo?: SortOrder;
        user_id?: SortOrder;
    };

    export type PlayHistoryMaxOrderByAggregateInput = {
        id?: SortOrder;
        title?: SortOrder;
        artist?: SortOrder;
        difficulty?: SortOrder;
        level?: SortOrder;
        score?: SortOrder;
        max_combo?: SortOrder;
        rank?: SortOrder;
        play_time?: SortOrder;
        created_at?: SortOrder;
        updated_at?: SortOrder;
        user_id?: SortOrder;
    };

    export type PlayHistoryMinOrderByAggregateInput = {
        id?: SortOrder;
        title?: SortOrder;
        artist?: SortOrder;
        difficulty?: SortOrder;
        level?: SortOrder;
        score?: SortOrder;
        max_combo?: SortOrder;
        rank?: SortOrder;
        play_time?: SortOrder;
        created_at?: SortOrder;
        updated_at?: SortOrder;
        user_id?: SortOrder;
    };

    export type PlayHistorySumOrderByAggregateInput = {
        id?: SortOrder;
        level?: SortOrder;
        score?: SortOrder;
        max_combo?: SortOrder;
        user_id?: SortOrder;
    };

    export type PlayHistoryCreateNestedManyWithoutUserInput = {
        create?:
            | XOR<
                  PlayHistoryCreateWithoutUserInput,
                  PlayHistoryUncheckedCreateWithoutUserInput
              >
            | PlayHistoryCreateWithoutUserInput[]
            | PlayHistoryUncheckedCreateWithoutUserInput[];
        connectOrCreate?:
            | PlayHistoryCreateOrConnectWithoutUserInput
            | PlayHistoryCreateOrConnectWithoutUserInput[];
        createMany?: PlayHistoryCreateManyUserInputEnvelope;
        connect?: PlayHistoryWhereUniqueInput | PlayHistoryWhereUniqueInput[];
    };

    export type PlayHistoryUncheckedCreateNestedManyWithoutUserInput = {
        create?:
            | XOR<
                  PlayHistoryCreateWithoutUserInput,
                  PlayHistoryUncheckedCreateWithoutUserInput
              >
            | PlayHistoryCreateWithoutUserInput[]
            | PlayHistoryUncheckedCreateWithoutUserInput[];
        connectOrCreate?:
            | PlayHistoryCreateOrConnectWithoutUserInput
            | PlayHistoryCreateOrConnectWithoutUserInput[];
        createMany?: PlayHistoryCreateManyUserInputEnvelope;
        connect?: PlayHistoryWhereUniqueInput | PlayHistoryWhereUniqueInput[];
    };

    export type StringFieldUpdateOperationsInput = {
        set?: string;
    };

    export type IntFieldUpdateOperationsInput = {
        set?: number;
        increment?: number;
        decrement?: number;
        multiply?: number;
        divide?: number;
    };

    export type DateTimeFieldUpdateOperationsInput = {
        set?: Date | string;
    };

    export type PlayHistoryUpdateManyWithoutUserNestedInput = {
        create?:
            | XOR<
                  PlayHistoryCreateWithoutUserInput,
                  PlayHistoryUncheckedCreateWithoutUserInput
              >
            | PlayHistoryCreateWithoutUserInput[]
            | PlayHistoryUncheckedCreateWithoutUserInput[];
        connectOrCreate?:
            | PlayHistoryCreateOrConnectWithoutUserInput
            | PlayHistoryCreateOrConnectWithoutUserInput[];
        upsert?:
            | PlayHistoryUpsertWithWhereUniqueWithoutUserInput
            | PlayHistoryUpsertWithWhereUniqueWithoutUserInput[];
        createMany?: PlayHistoryCreateManyUserInputEnvelope;
        set?: PlayHistoryWhereUniqueInput | PlayHistoryWhereUniqueInput[];
        disconnect?:
            | PlayHistoryWhereUniqueInput
            | PlayHistoryWhereUniqueInput[];
        delete?: PlayHistoryWhereUniqueInput | PlayHistoryWhereUniqueInput[];
        connect?: PlayHistoryWhereUniqueInput | PlayHistoryWhereUniqueInput[];
        update?:
            | PlayHistoryUpdateWithWhereUniqueWithoutUserInput
            | PlayHistoryUpdateWithWhereUniqueWithoutUserInput[];
        updateMany?:
            | PlayHistoryUpdateManyWithWhereWithoutUserInput
            | PlayHistoryUpdateManyWithWhereWithoutUserInput[];
        deleteMany?:
            | PlayHistoryScalarWhereInput
            | PlayHistoryScalarWhereInput[];
    };

    export type PlayHistoryUncheckedUpdateManyWithoutUserNestedInput = {
        create?:
            | XOR<
                  PlayHistoryCreateWithoutUserInput,
                  PlayHistoryUncheckedCreateWithoutUserInput
              >
            | PlayHistoryCreateWithoutUserInput[]
            | PlayHistoryUncheckedCreateWithoutUserInput[];
        connectOrCreate?:
            | PlayHistoryCreateOrConnectWithoutUserInput
            | PlayHistoryCreateOrConnectWithoutUserInput[];
        upsert?:
            | PlayHistoryUpsertWithWhereUniqueWithoutUserInput
            | PlayHistoryUpsertWithWhereUniqueWithoutUserInput[];
        createMany?: PlayHistoryCreateManyUserInputEnvelope;
        set?: PlayHistoryWhereUniqueInput | PlayHistoryWhereUniqueInput[];
        disconnect?:
            | PlayHistoryWhereUniqueInput
            | PlayHistoryWhereUniqueInput[];
        delete?: PlayHistoryWhereUniqueInput | PlayHistoryWhereUniqueInput[];
        connect?: PlayHistoryWhereUniqueInput | PlayHistoryWhereUniqueInput[];
        update?:
            | PlayHistoryUpdateWithWhereUniqueWithoutUserInput
            | PlayHistoryUpdateWithWhereUniqueWithoutUserInput[];
        updateMany?:
            | PlayHistoryUpdateManyWithWhereWithoutUserInput
            | PlayHistoryUpdateManyWithWhereWithoutUserInput[];
        deleteMany?:
            | PlayHistoryScalarWhereInput
            | PlayHistoryScalarWhereInput[];
    };

    export type UserCreateNestedOneWithoutPlayHistoryInput = {
        create?: XOR<
            UserCreateWithoutPlayHistoryInput,
            UserUncheckedCreateWithoutPlayHistoryInput
        >;
        connectOrCreate?: UserCreateOrConnectWithoutPlayHistoryInput;
        connect?: UserWhereUniqueInput;
    };

    export type UserUpdateOneRequiredWithoutPlayHistoryNestedInput = {
        create?: XOR<
            UserCreateWithoutPlayHistoryInput,
            UserUncheckedCreateWithoutPlayHistoryInput
        >;
        connectOrCreate?: UserCreateOrConnectWithoutPlayHistoryInput;
        upsert?: UserUpsertWithoutPlayHistoryInput;
        connect?: UserWhereUniqueInput;
        update?: XOR<
            XOR<
                UserUpdateToOneWithWhereWithoutPlayHistoryInput,
                UserUpdateWithoutPlayHistoryInput
            >,
            UserUncheckedUpdateWithoutPlayHistoryInput
        >;
    };

    export type NestedIntFilter<$PrismaModel = never> = {
        equals?: number | IntFieldRefInput<$PrismaModel>;
        in?: number[];
        notIn?: number[];
        lt?: number | IntFieldRefInput<$PrismaModel>;
        lte?: number | IntFieldRefInput<$PrismaModel>;
        gt?: number | IntFieldRefInput<$PrismaModel>;
        gte?: number | IntFieldRefInput<$PrismaModel>;
        not?: NestedIntFilter<$PrismaModel> | number;
    };

    export type NestedStringFilter<$PrismaModel = never> = {
        equals?: string | StringFieldRefInput<$PrismaModel>;
        in?: string[];
        notIn?: string[];
        lt?: string | StringFieldRefInput<$PrismaModel>;
        lte?: string | StringFieldRefInput<$PrismaModel>;
        gt?: string | StringFieldRefInput<$PrismaModel>;
        gte?: string | StringFieldRefInput<$PrismaModel>;
        contains?: string | StringFieldRefInput<$PrismaModel>;
        startsWith?: string | StringFieldRefInput<$PrismaModel>;
        endsWith?: string | StringFieldRefInput<$PrismaModel>;
        not?: NestedStringFilter<$PrismaModel> | string;
    };

    export type NestedDateTimeFilter<$PrismaModel = never> = {
        equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        in?: Date[] | string[];
        notIn?: Date[] | string[];
        lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
    };

    export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
        equals?: number | IntFieldRefInput<$PrismaModel>;
        in?: number[];
        notIn?: number[];
        lt?: number | IntFieldRefInput<$PrismaModel>;
        lte?: number | IntFieldRefInput<$PrismaModel>;
        gt?: number | IntFieldRefInput<$PrismaModel>;
        gte?: number | IntFieldRefInput<$PrismaModel>;
        not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
        _count?: NestedIntFilter<$PrismaModel>;
        _avg?: NestedFloatFilter<$PrismaModel>;
        _sum?: NestedIntFilter<$PrismaModel>;
        _min?: NestedIntFilter<$PrismaModel>;
        _max?: NestedIntFilter<$PrismaModel>;
    };

    export type NestedFloatFilter<$PrismaModel = never> = {
        equals?: number | FloatFieldRefInput<$PrismaModel>;
        in?: number[];
        notIn?: number[];
        lt?: number | FloatFieldRefInput<$PrismaModel>;
        lte?: number | FloatFieldRefInput<$PrismaModel>;
        gt?: number | FloatFieldRefInput<$PrismaModel>;
        gte?: number | FloatFieldRefInput<$PrismaModel>;
        not?: NestedFloatFilter<$PrismaModel> | number;
    };

    export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
        equals?: string | StringFieldRefInput<$PrismaModel>;
        in?: string[];
        notIn?: string[];
        lt?: string | StringFieldRefInput<$PrismaModel>;
        lte?: string | StringFieldRefInput<$PrismaModel>;
        gt?: string | StringFieldRefInput<$PrismaModel>;
        gte?: string | StringFieldRefInput<$PrismaModel>;
        contains?: string | StringFieldRefInput<$PrismaModel>;
        startsWith?: string | StringFieldRefInput<$PrismaModel>;
        endsWith?: string | StringFieldRefInput<$PrismaModel>;
        not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
        _count?: NestedIntFilter<$PrismaModel>;
        _min?: NestedStringFilter<$PrismaModel>;
        _max?: NestedStringFilter<$PrismaModel>;
    };

    export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
        equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        in?: Date[] | string[];
        notIn?: Date[] | string[];
        lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
        _count?: NestedIntFilter<$PrismaModel>;
        _min?: NestedDateTimeFilter<$PrismaModel>;
        _max?: NestedDateTimeFilter<$PrismaModel>;
    };

    export type PlayHistoryCreateWithoutUserInput = {
        title: string;
        artist: string;
        difficulty: string;
        level: number;
        score: number;
        max_combo: number;
        rank: string;
        play_time: string;
        created_at?: Date | string;
        updated_at?: Date | string;
    };

    export type PlayHistoryUncheckedCreateWithoutUserInput = {
        id?: number;
        title: string;
        artist: string;
        difficulty: string;
        level: number;
        score: number;
        max_combo: number;
        rank: string;
        play_time: string;
        created_at?: Date | string;
        updated_at?: Date | string;
    };

    export type PlayHistoryCreateOrConnectWithoutUserInput = {
        where: PlayHistoryWhereUniqueInput;
        create: XOR<
            PlayHistoryCreateWithoutUserInput,
            PlayHistoryUncheckedCreateWithoutUserInput
        >;
    };

    export type PlayHistoryCreateManyUserInputEnvelope = {
        data: PlayHistoryCreateManyUserInput | PlayHistoryCreateManyUserInput[];
    };

    export type PlayHistoryUpsertWithWhereUniqueWithoutUserInput = {
        where: PlayHistoryWhereUniqueInput;
        update: XOR<
            PlayHistoryUpdateWithoutUserInput,
            PlayHistoryUncheckedUpdateWithoutUserInput
        >;
        create: XOR<
            PlayHistoryCreateWithoutUserInput,
            PlayHistoryUncheckedCreateWithoutUserInput
        >;
    };

    export type PlayHistoryUpdateWithWhereUniqueWithoutUserInput = {
        where: PlayHistoryWhereUniqueInput;
        data: XOR<
            PlayHistoryUpdateWithoutUserInput,
            PlayHistoryUncheckedUpdateWithoutUserInput
        >;
    };

    export type PlayHistoryUpdateManyWithWhereWithoutUserInput = {
        where: PlayHistoryScalarWhereInput;
        data: XOR<
            PlayHistoryUpdateManyMutationInput,
            PlayHistoryUncheckedUpdateManyWithoutUserInput
        >;
    };

    export type PlayHistoryScalarWhereInput = {
        AND?: PlayHistoryScalarWhereInput | PlayHistoryScalarWhereInput[];
        OR?: PlayHistoryScalarWhereInput[];
        NOT?: PlayHistoryScalarWhereInput | PlayHistoryScalarWhereInput[];
        id?: IntFilter<"PlayHistory"> | number;
        title?: StringFilter<"PlayHistory"> | string;
        artist?: StringFilter<"PlayHistory"> | string;
        difficulty?: StringFilter<"PlayHistory"> | string;
        level?: IntFilter<"PlayHistory"> | number;
        score?: IntFilter<"PlayHistory"> | number;
        max_combo?: IntFilter<"PlayHistory"> | number;
        rank?: StringFilter<"PlayHistory"> | string;
        play_time?: StringFilter<"PlayHistory"> | string;
        created_at?: DateTimeFilter<"PlayHistory"> | Date | string;
        updated_at?: DateTimeFilter<"PlayHistory"> | Date | string;
        user_id?: IntFilter<"PlayHistory"> | number;
    };

    export type UserCreateWithoutPlayHistoryInput = {
        name: string;
        play_count: number;
        created_at?: Date | string;
        updated_at?: Date | string;
    };

    export type UserUncheckedCreateWithoutPlayHistoryInput = {
        id?: number;
        name: string;
        play_count: number;
        created_at?: Date | string;
        updated_at?: Date | string;
    };

    export type UserCreateOrConnectWithoutPlayHistoryInput = {
        where: UserWhereUniqueInput;
        create: XOR<
            UserCreateWithoutPlayHistoryInput,
            UserUncheckedCreateWithoutPlayHistoryInput
        >;
    };

    export type UserUpsertWithoutPlayHistoryInput = {
        update: XOR<
            UserUpdateWithoutPlayHistoryInput,
            UserUncheckedUpdateWithoutPlayHistoryInput
        >;
        create: XOR<
            UserCreateWithoutPlayHistoryInput,
            UserUncheckedCreateWithoutPlayHistoryInput
        >;
        where?: UserWhereInput;
    };

    export type UserUpdateToOneWithWhereWithoutPlayHistoryInput = {
        where?: UserWhereInput;
        data: XOR<
            UserUpdateWithoutPlayHistoryInput,
            UserUncheckedUpdateWithoutPlayHistoryInput
        >;
    };

    export type UserUpdateWithoutPlayHistoryInput = {
        name?: StringFieldUpdateOperationsInput | string;
        play_count?: IntFieldUpdateOperationsInput | number;
        created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    };

    export type UserUncheckedUpdateWithoutPlayHistoryInput = {
        id?: IntFieldUpdateOperationsInput | number;
        name?: StringFieldUpdateOperationsInput | string;
        play_count?: IntFieldUpdateOperationsInput | number;
        created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    };

    export type PlayHistoryCreateManyUserInput = {
        id?: number;
        title: string;
        artist: string;
        difficulty: string;
        level: number;
        score: number;
        max_combo: number;
        rank: string;
        play_time: string;
        created_at?: Date | string;
        updated_at?: Date | string;
    };

    export type PlayHistoryUpdateWithoutUserInput = {
        title?: StringFieldUpdateOperationsInput | string;
        artist?: StringFieldUpdateOperationsInput | string;
        difficulty?: StringFieldUpdateOperationsInput | string;
        level?: IntFieldUpdateOperationsInput | number;
        score?: IntFieldUpdateOperationsInput | number;
        max_combo?: IntFieldUpdateOperationsInput | number;
        rank?: StringFieldUpdateOperationsInput | string;
        play_time?: StringFieldUpdateOperationsInput | string;
        created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    };

    export type PlayHistoryUncheckedUpdateWithoutUserInput = {
        id?: IntFieldUpdateOperationsInput | number;
        title?: StringFieldUpdateOperationsInput | string;
        artist?: StringFieldUpdateOperationsInput | string;
        difficulty?: StringFieldUpdateOperationsInput | string;
        level?: IntFieldUpdateOperationsInput | number;
        score?: IntFieldUpdateOperationsInput | number;
        max_combo?: IntFieldUpdateOperationsInput | number;
        rank?: StringFieldUpdateOperationsInput | string;
        play_time?: StringFieldUpdateOperationsInput | string;
        created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    };

    export type PlayHistoryUncheckedUpdateManyWithoutUserInput = {
        id?: IntFieldUpdateOperationsInput | number;
        title?: StringFieldUpdateOperationsInput | string;
        artist?: StringFieldUpdateOperationsInput | string;
        difficulty?: StringFieldUpdateOperationsInput | string;
        level?: IntFieldUpdateOperationsInput | number;
        score?: IntFieldUpdateOperationsInput | number;
        max_combo?: IntFieldUpdateOperationsInput | number;
        rank?: StringFieldUpdateOperationsInput | string;
        play_time?: StringFieldUpdateOperationsInput | string;
        created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
        updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    };

    /**
     * Batch Payload for updateMany & deleteMany & createMany
     */

    export type BatchPayload = {
        count: number;
    };

    /**
     * DMMF
     */
    export const dmmf: runtime.BaseDMMF;
}
