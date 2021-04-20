'use strict'
// Environment variables
require('dotenv').config();

// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
// const cors = require('cors');



// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;


// Express middleware
app.use((express.urlencoded({extended:true})))
// Utilize ExpressJS functionality to parse the body of the request


// Specify a directory for static resources
app.use(express.static('./public'))
// define our method-override reference
app.use(methodOverride('method'))
// Set the view engine for server-side templating
app.set('view engine','ejs')
// Use app cors
// app.use(cors());

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error',err=>console.log(err));
// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/home',getqoutesfromapi)
app.post('/addtodb',saveqoutes)
app.get('/myfav',renderfavqoutes)
app.get('/detals/:id',renderdetal)
app.delete('/delete/:id',deleteitem)
app.put('/update/:id',updatedata)


// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --

function updatedata(req,res) {
    const id=req.params.id
    const {character,quote,characterDirection,image_url}=req.body;
    const sql =`update quote set charactere=$1,quote=$2,characterDirection=$3,image_url=$4 where id=${id};`
    const safeValues=[character,quote,characterDirection,image_url];
    client.query(sql,safeValues).then(()=>{
        res.redirect(`/detals/${id}`)
    })
}


function deleteitem(req,res) {
    const id=req.params.id
    
    const sql=`delete from quote where id=${id}`
    client.query(sql).then(()=>{
        res.redirect('/myfav')
    }) 
}


function renderdetal(req,res) {
    const id=req.params.id
    const sql=`select * from quote where id=${id}`
    client.query(sql).then(data=>{
        res.render('pages/detail',{data:data.rows})
    })   
}

function renderfavqoutes(req,res) {
    const sql='select * from quote;'
    client.query(sql).then(data=>{
        console.log(data.rows)
        res.render('pages/fav',{data:data.rows})
    })
}

function saveqoutes(req,res) {
    const {character,quote,characterDirection,image_url}=req.body;
    // console.log(req.body);
    const sql ='insert into quote(charactere,quote,characterDirection,image_url) values($1,$2,$3,$4);'
    const safeValues=[character,quote,characterDirection,image_url];
    client.query(sql,safeValues).then(()=>{
        res.redirect('/myfav')
    })
}


function getqoutesfromapi(req,res) {
    const url='https://thesimpsonsquoteapi.glitch.me/quotes?count=10';
  
    superagent.get(url).set('User-Agent','1.0').then(data=>{
        // console.log(data.body);
        let dataArr=data.body.map(data=>{
            return data;
        })
        res.render('pages/index',{data:dataArr})
    })
}


// helper functions

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
