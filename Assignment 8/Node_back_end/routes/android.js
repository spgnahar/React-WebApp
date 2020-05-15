const express= require('express');
const router = express.Router();
//const request = require('request');
//const fetch = require('node-fetch');
const axios = require('axios');
const googleTrends = require('google-trends-api');
var guardApi,guardApiworld,guardCard,guardSearch;


router.get('/', function(req, res, next) {
  var temp=[];
  console.log('guardian me aaya');
  const url='https://content.guardianapis.com/search?order-by=newest&show-fields=starRating,headline,thumbnail,short-url&api-key=your-key';

  axios.get(url)
    .then(response => {
      guardApi=response.data.response;
      console.log(response.status);
    // console.log(guardApi)
      Array.prototype.forEach.call(guardApi.results, child => {
        var temp1={};
        // console.log(child.fields)
        // console.log(" ")
        temp1["webTitle"]=child.webTitle
        temp1["sectionId"]=child.sectionName
        temp1["Date"]=child.webPublicationDate
        // temp1["Description"]=child.blocks.body[0].bodyTextSummary
        temp1["URL"]=child.webUrl
        temp1["id"]=child.id
        try{
            // console.log('try')
            if(child.fields.thumbnail){
                temp1["Image"]=child.fields.thumbnail
            }
            else{
                temp1["Image"]="https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
            }
          
        }
        catch(err){
            // console.log('catch')
          temp1["Image"]="https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
        }
        temp.push(temp1)
      });
      guardApi.results=temp
      console.log(guardApi)
      res.send(guardApi);
    })
    .catch(error => {
      console.log(error);
    });


});

router.get('/section',function(req,res,next){
    console.log('Dusra Guardian')
    console.log(req.query.sec)
      
      var url1 = 'https://content.guardianapis.com/'+req.query.sec.toString()+'?api-key=your-key&show-blocks=all';
      var tempw=[]
      axios.get(url1)
      .then(response => {
        guardApiworld=response.data.response;
        console.log(response.status);
        // console.log(guardApiworld)
        Array.prototype.forEach.call(guardApiworld.results, child => {
          var temp1w={}
          console.log("              ")
          temp1w["webTitle"]=child.webTitle
          temp1w["sectionId"]=child.sectionName
          temp1w["Date"]=child.webPublicationDate
        //   temp1w["Description"]=child.blocks.body[0].bodyTextSummary
          temp1w["URL"]=child.webUrl
          temp1w["id"]=child.id
          try{
            temp1w["Image"]=child.blocks.main.elements[0].assets[0].file
          }
          catch(err){
            temp1w["Image"]="https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
          }
          tempw.push(temp1w)
        });
        guardApiworld.results=tempw
        // console.log(guardApiworld)
        res.send(guardApiworld)
      })
      .catch(error => {
        console.log(error);
      });
  
      
    
  });

  router.get('/detail',function(req,res,next){
    console.log('Detail Guardian')
    console.log(req.query.url)
    ans={}
      
      const url3 = 'https://content.guardianapis.com/'+req.query.url+'?api-key=your-key&show-blocks=all';
      
      axios.get(url3)
      .then(response => {
        guardCard=response.data.response.content;
        console.log(response.data.response);
        // console.log(guardCard.blocks)
        console.log(response.status);
          var temp1d={},temporary,smallText="",bigText=""
          temp1d["webTitle"]=guardCard.webTitle
          temp1d["Date"]=guardCard.webPublicationDate
          temporary=guardCard.blocks.body[0].bodyTextSummary.split('. ')
        var desc=""
        for(var r=0;r<guardCard.blocks.body.length;r++){
            desc+=guardCard.blocks.body[r].bodyHtml
        }
          
          temp1d["Description"]=desc
          temp1d["URL"]=guardCard.webUrl
          temp1d["sectionId"]=guardCard.sectionName
          temp1d["name"]="GUARDIAN"
          temp1d["id"]=guardCard.id
          //temp1d["id"]=child.id
          try{
            temp1d["Image"]=guardCard.blocks.main.elements[0].assets[0].file
          }
          catch(err){
            temp1d["Image"]="https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
          }
         
        //console.log(temp1d)
        ans["results"]=temp1d
        res.send(ans)
      })
      .catch(error => {
        console.log(error);
      });
  
      
    
  });


  router.get('/trends',function(req,res,next){
    console.log('trends')
    console.log(req.query.key)

    

    var datetime = new Date(2019,5,1);
    console.log(datetime.toISOString().slice(0,10));

    var temp1t={}
    let ans={}
    temp1t["keyword"]=req.query.key.toString()
    temp1t["startTime"]=datetime

    console.log(temp1t)
    
    googleTrends.interestOverTime(temp1t)
    .then( function (results) {
       var google_results = JSON.parse(results);
       var w= google_results.default.timelineData;
       var value=[]
       for (let z=0;z<w.length;z++){
        value[z]=w[z].value[0];
       }
      
        ans["Ans"]=value
        res.send(ans)
        
      })
      .catch(function(err) {
        console.error(err);
      })
   
    
   });


   router.get('/search',function(req,res,next){
    console.log('Search Guardian')
    console.log(req.query.ids)
  
      
      const url4 = 'https://content.guardianapis.com/search?q='+req.query.ids+'&api-key=your-key&show-blocks=all';
      
      var temps=[]
      var answ={}
  
      axios.get(url4)
      .then(response => {
        guardSearch=response.data.response.results;
          for(var r=0;r<guardSearch.length;r++){
          var temp1s={};
          temp1s["webTitle"]=guardSearch[r].webTitle
          temp1s["sectionId"]=guardSearch[r].sectionId
          temp1s["Date"]=guardSearch[r].webPublicationDate
          temp1s["Description"]=guardSearch[r].blocks.body[0].bodyTextSummary
          temp1s["URL"]=guardSearch[r].webUrl
          temp1s["id"]=guardSearch[r].id
          // temp1s["name"]="GUARDIAN"
          try{
            temp1s["Image"]=guardSearch[r].blocks.main.elements[0].assets[0].file
          }
          catch(err){
            temp1s["Image"]="https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
          }
          temps.push(temp1s)
        };
        console.log(temps)
        answ["results"]=temps
        res.send(answ);
      })
      .catch(error => {
        console.log(error);
      });
  
      
    
  });


module.exports = router;    