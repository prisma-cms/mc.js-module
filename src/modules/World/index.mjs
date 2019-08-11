
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class WorldProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "World";
  }


  async create(method, args, info) {

    if(args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.create(method, args, info);
  }


  async update(method, args, info) {

    if(args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.update(method, args, info);
  }


  async mutate(method, args, info) {

    if(args.data) {

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


export default class WorldModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return WorldProcessor;
  }


  getResolvers() {

    const {
      Query: {
        ...Query
      },
      Subscription: {
        ...Subscription
      },
      Mutation: {
        ...Mutation
      },
      ...other
    } = super.getResolvers();

    return {
      ...other,
      Query: {
        ...Query,
        world: (source, args, ctx, info) => {
          return ctx.db.query.world(args, info);
        },
        worlds: (source, args, ctx, info) => {
          return ctx.db.query.worlds(args, info);
        },
        worldsConnection: (source, args, ctx, info) => {
          return ctx.db.query.worldsConnection(args, info);
        },
      },
      Mutation: {
        ...Mutation,
        // createWorldProcessor: (source, args, ctx, info) => {
        //   return this.getProcessor(ctx).createWithResponse("World", args, info);
        // },
        // updateWorldProcessor: (source, args, ctx, info) => {
        //   return this.getProcessor(ctx).updateWithResponse("World", args, info);
        // },
        // deleteWorld: (source, args, ctx, info) => {
        //   return this.getProcessor(ctx).delete("World", args, info);
        // },
      },
      Subscription: {
        ...Subscription,
        world: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.world({}, info);
          },
        },
      },
      // WorldResponse: {
      //   data: (source, args, ctx, info) => {

      //     const {
      //       id,
      //     } = source.data || {};

      //     return id ? ctx.db.query.world({
      //       where: {
      //         id,
      //       },
      //     }, info) : null;
      //   },
      // },
    }

  }

}