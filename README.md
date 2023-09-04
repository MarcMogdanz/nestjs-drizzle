# nestjs-drizzle

A basic NestJS setup using [drizzle](https://orm.drizzle.team/) and PostgreSQL with migrations included.

## Getting started

1. Run `pnpm install` (or use whatever your preferred package manager today is)
2. Copy `.env.example` to `.env`, no changes needed if you run the database via the included docker-compose file
3. Run `docker-compose up -d` to start the database in the background
4. Run `pnpm start:dev` to start the server in dev mode
5. Use the included Insomnia workspace to try out the API (`GET /messages` and `POST /messages`)

## How it works

This setup is purely a NestJS-style wrapper around drizzle.

Inside of the `DatabaseService` the `getDB()` function sets up the database connection using the [Postgres.js](https://github.com/porsager/postgres) client and passes it to drizzle. It's also possible to use other clients or databases, see the [drizzle docs](https://orm.drizzle.team/docs/installation-and-db-connection) for what's supported.

In order to be able to easily get access to your database you can use the `@InjectDatabase()` decorator to inject the database into your services. The `DatabaseModule` is global which means you can simply use the decorator everywhere we you can inject dependencies without worrying about module/service imports.
As the return type of the decorator you can either use `PostgresJsDatabase` or `PostgresJsDatabase<typeof schema>`. The latter allows you to use the `Relational queries` extension of drizzle with your typed schema, see the [docs](https://orm.drizzle.team/docs/rqb) for more on that.

Migrations will be run on startup before the Nest app starts. Depending on your setup you can also remove the logic from the `main.ts` and run migrations within your CI/CD pipeline using [`drizzle-kit`](https://orm.drizzle.team/kit-docs/overview) for example.

## Migrations

Migrations are stored in `database/migrations`. They are run automatically on startup before the Nest app starts.

You can generate a new migration using `pnpm run db:generate` which will use `drizzle-kit` under the hood.

If you're still developing and sync your schema to your local database you can use `pnpm run db:push` to sync your schema without involving migrations.

## Pitfalls

In case you're just copy pasting some parts of the code here, there are a few things that need to be considered.

**Error: `TypeError: (0 , postgres_1.default) is not a function`**

Set `esModuleInterop` to `true` in your `tsconfig.json`, see [docs](https://typescriptlang.org/tsconfig#esModuleInterop).

**Can't find the `meta/_journal.json` file**

By default the `src/` directory is the main folder from where the project is being built. This means the `dist/` and `src/` folders should have the same structure. Because we add the `drizzle.config.ts` config to our root it now may shifts the `src/` folder to `dist/src/` when building the project as it considers the `drizzle.config.ts` file as part of the source code. Basically instead of `dist/database/migrations/...` you now end up with `dist/src/database/migrations/...`.

This can be fixed by adding the `drizzle.config.ts` to the `exclude` array of your tsconfig which is being used for building, usually `tsconfig.build.json`.

**The `database/migrations` folder is not showing up in the `dist` output**

By default NestJs only copies all files which have been compiled and ignores all other files. Because the migrations are stored as `*.sql` and drizzle metadata as `*.json` files they won't be copied to the `dist/` folder.

This can be fixed by adding the path for the migrations folder as an asset to the `nest-cli.json` file. Assets are just non-code files that should be copied to the `dist/` folder, more [here](https://docs.nestjs.com/cli/monorepo#assets).

By adding the following to the `nest-cli.json` all migration related files will be copied and also trigger a reload on changes if you're using the dev server:

```javascript
{
  // other stuff...
  "compilerOptions": {
    "assets": [
      {
        "include": "**/database/migrations/**/*.{json,sql}",
        "watchAssets": true
      }
    ]
  }
}
```
