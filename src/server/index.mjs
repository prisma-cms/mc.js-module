
import {
  PrismaCmsServer,
} from "@prisma-cms/server";

import Module from "../";


import socketIO from '../modules/external/mc.js/server/src/lib/server/socketIO';

// console.log("socketIO", socketIO);

const module = new Module({
});

const resolvers = module.getResolvers();


// startServer({
//   typeDefs: 'src/schema/generated/api.graphql',
//   resolvers,
// });


class Server extends PrismaCmsServer {


  async beforeStart() {
    
    // console.log("this.db", this.db);

    socketIO(this.db);
    
    await super.beforeStart();
    
  }

}



const startServer = async function () {

  const server = new Server({
    typeDefs: 'src/schema/generated/api.graphql',
    resolvers,
  });

  await server.startServer();

}

startServer();
