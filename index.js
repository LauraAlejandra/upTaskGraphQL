const {ApolloServer, gql} = require('apollo-server');

const jwt = require('jsonwebtoken');
require('dotenv').config('variables.env');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');

const conectarDB = require('./config/db');


//conectar a la BD
conectarDB();

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({req}) =>{
        const token = req.headers['authorization'] || '';
        if(token){
            try{
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA);
                return{
                    usuario
                }
            } catch{

            }
        }
    }
});

//para que heroku asigne un puerto, sino pues agarra el 4000
server.listen({port: process.env.PORT || 4000}).then( ({url}) => {
    console.log(`Servidor listo en la URL ${url}`);
})