const express = require('express')
const cors=require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express()

app.use(cors())
app.use(bodyParser.json())

const db_User=process.env.DB_USER;
const db_PASS=process.env.DB_PASS;


const uri = `mongodb+srv://${db_User}:${db_PASS}@cluster0-7seng.mongodb.net/test?retryWrites=true&w=majority`

//database connection

let client = new MongoClient(uri, { useNewUrlParser: true });


const users=["Asad","Moin","Susmita","Sohana","Rubana","Jubayer"];
app.get('/products',(req,res)=>{
    client=new MongoClient(uri,{useNewUrlParser:true})
    client.connect(err=>{
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object
        collection.find().limit(10).toArray((err,documents)=>{
            if(err){
                console.log(err)      
                res.status(500).send({message:err})
            }
            else{
                res.send(documents);
            }
        });
        client.close();
      });
})

app.get('/users/:id',(req,res)=>{
    const id=req.params.id
    const name=users[id];
    res.send({id,name});
    
})

app.post('/addProduct',(req,res)=>{
    client=new MongoClient(uri,{useNewUrlParser:true});
    const product=req.body;
    console.log(product);

    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object
        collection.insertOne(product,(err,result)=>{
            if(err){
                console.log(err)      
                res.status(500).send({message:err})
            }
            else{
                res.send(result.ops[0]);
            }
        });
        client.close();
      });
      
});
const port=process.env.PORT;
app.listen(port,()=>{
    console.log('Listening to Port 3000');
});