
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";

import MergeSchema from 'merge-graphql-schemas';

import fs from "fs";

import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { createWriteStream, unlinkSync } = fs;

const { fileLoader, mergeTypes } = MergeSchema

import { resolvers } from "./external/mc.js/server/src/resolvers";

// console.log("resolvers", resolvers);

export class McJsProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "McJs";
  }


  async create(method, args, info) {

    if (args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.create(method, args, info);
  }


  async update(method, args, info) {

    if (args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.update(method, args, info);
  }


  async mutate(method, args, info) {

    if (args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.mutate(method, args);
  }



  async delete(method, args, info) {

    return super.delete(method, args);
  }
}


export default class McJsModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }



  getSchema(types = []) {


    let schema = fileLoader(__dirname + '/external/mc.js/server/prisma/', {
      recursive: true,
    });


    if (schema) {
      types = types.concat(schema);
    }


    let typesArray = super.getSchema(types);

    // console.log("typesArray", JSON.stringify(typesArray, true, 2));

    return typesArray;

  }



  // getApiSchema(types = []) {


  //   let baseSchema = [];

  //   let schemaFile = __dirname + "/external/mc.js/server/src/schema.graphql";

  //   if (fs.existsSync(schemaFile)) {
  //     baseSchema = fs.readFileSync(schemaFile, "utf-8");
  //   }

  //   // let apiSchema = super.getApiSchema(types.concat(baseSchema), []);

  //   // let schema = fileLoader(__dirname + '/schema/api/', {
  //   //   recursive: true,
  //   // });

  //   // apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });

  //   // console.log("baseSchema", JSON.stringify(baseSchema, true, 2));

  //   return baseSchema;

  // }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return McJsProcessor;
  }


  getResolvers() {

    const {
      Mutation: {
        login,
        ...Mutation
      },
      ...other
    } = resolvers;

    return {
      Mutation,
      ...other
    };

  }

}