const express = require('express');
const graphHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// allow cross origin request
app.use(cors());

require('dotenv').config()

// connect to mongodb database
mongoose.connect(`mongodb+srv://root:${process.env.MONGO_ATLAS_PW}@cluster0-3s0ia.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('connected to database')
});

app.use('/graphql', graphHTTP({
    schema,
    graphiql: true
}));


app.listen(4000, () => {
    console.log('listening on 4000 port');
})