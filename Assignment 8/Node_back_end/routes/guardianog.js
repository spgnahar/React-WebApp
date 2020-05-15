


//change name back to guardian.js


const express= require('express');
const router = express.Router();
//const request = require('request');
//const fetch = require('node-fetch');
const axios = require('axios');
var guardApi,guardApiworld,guardCard,guardSearch;


router.get('/', function(req, res, next) {
  var temp=[];
  console.log('guardian me aaya');
  const url = 'https://content.guardianapis.com/search?api-key=4ce11350-5ab5-4d34-9b01-d28690ea82db&section=(sport|business|technology|politics)&show-blocks=all';

  axios.get(url)
    .then(response => {
      guardApi=response.data.response;
      console.log(response.status);
      Array.prototype.forEach.call(guardApi.results, child => {
        var temp1={};
        temp1["webTitle"]=child.webTitle
        temp1["sectionId"]=child.sectionId
        temp1["Date"]=child.webPublicationDate
        temp1["Description"]=child.blocks.body[0].bodyTextSummary
        temp1["URL"]=child.webUrl
        temp1["id"]=child.id
        try{
          temp1["Image"]=child.blocks.main.elements[0].assets[child.blocks.main.elements[0].assets.length-1].file
        }
        catch(err){
          temp1["Image"]="https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
        }
        temp.push(temp1)
      });
      guardApi.results=temp
      res.send(guardApi);
    })
    .catch(error => {
      console.log('areeeeee rererereerere**********************');
      console.log(error);
    });


});

router.get('/section',function(req,res,next){
  console.log('Dusra Guardian')
  console.log(req.query.sec)
    
    var url1 = 'https://content.guardianapis.com/'+req.query.sec.toString()+'?api-key=4ce11350-5ab5-4d34-9b01-d28690ea82db&show-blocks=all';
    var tempw=[]
    axios.get(url1)
    .then(response => {
      guardApiworld=response.data.response;
      console.log(response.status);
      Array.prototype.forEach.call(guardApiworld.results, child => {
        var temp1w={}
        console.log("              ")
        temp1w["webTitle"]=child.webTitle
        temp1w["sectionId"]=child.sectionId
        temp1w["Date"]=child.webPublicationDate
        temp1w["Description"]=child.blocks.body[0].bodyTextSummary
        temp1w["URL"]=child.webUrl
        temp1w["id"]=child.id
        try{
          temp1w["Image"]=child.blocks.main.elements[0].assets[child.blocks.main.elements[0].assets.length-1].file
        }
        catch(err){
          temp1w["Image"]="https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
        }
        tempw.push(temp1w)
      });
      guardApiworld.results=tempw
      console.log(guardApiworld)
      res.send(guardApiworld)
    })
    .catch(error => {
      console.log('areeeeee rererereerere**********************');
      console.log(error);
    });

    
  
});



router.get('/detail',function(req,res,next){
  console.log('Detail Guardian')
  console.log(req.query.url)
    
    const url3 = 'https://content.guardianapis.com/'+req.query.url+'?api-key=4ce11350-5ab5-4d34-9b01-d28690ea82db&show-blocks=all';
    
    axios.get(url3)
    .then(response => {
      guardCard=response.data.response.content;
      //console.log(guardCard)
      console.log(response.status);
        var temp1d={},temporary,smallText="",bigText=""
        temp1d["webTitle"]=guardCard.webTitle
        temp1d["Date"]=guardCard.webPublicationDate.split('T')[0]
        temporary=guardCard.blocks.body[0].bodyTextSummary.split('. ')
        for(var j=0;j<temporary.length;j++){
          //console.log(temporary[j])
          if(j<4)
            smallText+=temporary[j]+". "
          else
            bigText+=temporary[j]+". "
        }
        
        if(bigText.length!==0){
          temp1d["small"]=smallText
          temp1d["big"]=bigText.substring(0,bigText.length-2)
        }
          
        else{
          temp1d["small"]=smallText.substring(0,smallText.length-2)
          temp1d["big"]=""
        }
          
        
        temp1d["Description"]=guardCard.blocks.body[0].bodyTextSummary
        temp1d["URL"]=guardCard.webUrl
        temp1d["sectionId"]=guardCard.sectionId
        temp1d["name"]="GUARDIAN"
        temp1d["id"]=guardCard.id
        //temp1d["id"]=child.id
        try{
          temp1d["Image"]=guardCard.blocks.main.elements[0].assets[guardCard.blocks.main.elements[0].assets.length-1].file
        }
        catch(err){
          temp1d["Image"]="https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
        }
       
      //console.log(temp1d)
      res.send(temp1d)
    })
    .catch(error => {
      console.log('areeeeee rererereerere**********************');
      console.log(error);
    });

    
  
});


router.get('/search',function(req,res,next){
  console.log('Search Guardian')
  console.log(req.query.ids)

  //https://content.guardianapis.com/search?q=%5bQUERY_KEYWORD%5d&api-key=%5bYOUR_API_KEY%5d&show-blocks=all
    
    const url4 = 'https://content.guardianapis.com/search?q='+req.query.ids+'&api-key=4ce11350-5ab5-4d34-9b01-d28690ea82db&show-blocks=all';
    var temps=[]

    axios.get(url4)
    .then(response => {
      guardSearch=response.data.response.results;
      //console.log(response.status);
      //console.log(guardSearch);
      //Array.prototype.forEach.call(guardSearch.results, child => {
        for(var r=0;r<guardSearch.length;r++){
        var temp1s={};
        temp1s["webTitle"]=guardSearch[r].webTitle
        temp1s["sectionId"]=guardSearch[r].sectionId
        temp1s["Date"]=guardSearch[r].webPublicationDate.split('T')[0]
        temp1s["Description"]=guardSearch[r].blocks.body[0].bodyTextSummary
        temp1s["URL"]=guardSearch[r].webUrl
        temp1s["id"]=guardSearch[r].id
        temp1s["name"]="GUARDIAN"
        try{
          temp1s["Image"]=guardSearch[r].blocks.main.elements[0].assets[guardSearch[r].blocks.main.elements[0].assets.length-1].file
        }
        catch(err){
          temp1s["Image"]="https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
        }
        temps.push(temp1s)
        if(r==4){
          break
        }
      };
      // guardSearch.results=temps
      res.send(temps);
      //console.log(guardSearch)
    })
    .catch(error => {
      console.log('areeeeee rererereerere**********************');
      console.log(error);
    });

    
  
});



module.exports = router;    