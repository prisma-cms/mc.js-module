
import fs from "fs";

import chalk from "chalk";

import PrismaModule from "@prisma-cms/prisma-module";
import UserModule from "@prisma-cms/user-module";
import UploadModule from "@prisma-cms/upload-module";

import MergeSchema from 'merge-graphql-schemas';

import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { createWriteStream, unlinkSync } = fs;

const { fileLoader, mergeTypes } = MergeSchema

import { parse, print } from "graphql";

import { resolvers as mcResolvers } from "./external/mc.js/server/src/resolvers";

import World from "./World";

class Module extends PrismaModule {


  constructor(props = {}) {

    super(props);

    Object.assign(this, {
    });

    this.mergeModules([
      UploadModule,
      UserModule,
      World,
    ]);

  }


  getSchema(types = []) {


    let schema = fileLoader(__dirname + '/schema/database/', {
      recursive: true,
    });

    if (schema) {
      types = types.concat(schema);
    }

    let mcSchema = fileLoader(__dirname + '/external/mc.js/server/prisma/', {
      recursive: true,
    });

    if (mcSchema) {
      types = types.concat(mcSchema);
    }

    let typesArray = super.getSchema(types);

    return typesArray;

  }




  getApiSchema(types = []) {

    let baseSchema = [];

    let schemaFile = __dirname + "/../schema/generated/prisma.graphql";

    if (fs.existsSync(schemaFile)) {
      baseSchema = fs.readFileSync(schemaFile, "utf-8");

      baseSchema = this.cleanupApiSchema(baseSchema, [
      ]);

    }
    else {
      console.error(chalk.red(`Schema file ${schemaFile} did not loaded`));
    }


    let apiSchema = super.getApiSchema(types.concat(baseSchema), [

      // "UserCreateInput",
      // "UserUpdateInput",

      "PlayerCreateInput",

    ]);


    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    apiSchema = mergeTypes(schema.concat(apiSchema), { all: true });

    // console.log(chalk.green("apiSchema"), apiSchema);


    /**
     * Фильтруем все резолверы, коих нет в текущем классе
     */
    const resolvers = this.getResolvers();

    const parsed = parse(apiSchema);

    let operations = parsed.definitions.filter(
      n => n.kind === "ObjectTypeDefinition"
        && ["Query", "Mutation", "Subscription"].indexOf(n.name.value) !== -1
      // && !resolvers[n.name.value][]
    );

    operations.map(n => {

      let {
        name: {
          value: operationName,
        },
        fields,
      } = n;

      n.fields = fields.filter(field => {
        // console.log(chalk.green("field"), field);
        return resolvers[operationName][field.name.value] ? true : false;
      });

    });

    apiSchema = print(parsed);


    return apiSchema;

  }


  getResolvers() {


    let {
      Query: {
        me,
        users,
        usersConnection,
        myWorlds,
        ...McQuery
      },
      Mutation: {
        login,
        ...McMutation
      },
      Subscription: McSubscription,
      ...otherMcResolvers
    } = mcResolvers;



    const {
      Query,
      Mutation: {
        signin,
        ...Mutation
      },
      Subscription,
      ...other
    } = super.getResolvers();


    return {
      Query: {
        ...Query,
        ...McQuery,
        ...this.Query,
        myWorlds: async (source, args, ctx, info) => {

          const {
            currentUser,
            db,
          } = ctx;

          const {
            id: currentUserId,
          } = currentUser || {};

          return currentUserId ? db.query.user({
            where: {
              id: currentUserId,
            },
          }, info) : null;

        },
      },
      Mutation: {
        signin,
        login: async (source, args, ctx, info) => {

          let {
            data: {
              email,
              password,
            },
          } = args;

          let result = await signin(source, {
            where: {
              email,
            },
            data: {
              password,
            },
          }, ctx, info);

          let {
            success,
            message,
            errors,
            token,
            data: user,
          } = result;

          // console.log("result", JSON.stringify(result, true, 2));


          if (!success) {

            if (errors && errors.length) {
              message = errors[0].message;
            }

            throw new Error(message);

          }


          return {
            token,
            user,
          };

        },
        ...Mutation,
        ...McMutation,
        ...this.Mutation,
      },
      Subscription: {
        ...Subscription,
        ...McSubscription,
        ...this.Subscription,
      },
      ...otherMcResolvers,
      ...other
    };

  }


}


export default Module;