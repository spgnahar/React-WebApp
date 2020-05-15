

//change name back to newyork.js

const express= require('express');
const router = express.Router();

const axios = require('axios');
var newyorkApi, newyorkApiSec, newyorkCard,newyorkSearch;
console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^6")
console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^6")
console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^6")
console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^6")


router.get('/', function(req, res, next) {
  
    var temp=[];
  
    console.log('New York mehi aaya');
    const url = 'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=taIIUI93uuAAudAkckMTkRF7B1AHm4QK';
  
    axios.get(url)
      .then(response => {
        newyorkApi=response.data;
        console.log(response.status);
        Array.prototype.forEach.call(newyorkApi.results, child => {
            var temp1={};
            temp1["webTitle"]=child.title
            temp1["sectionId"]=child.section
            temp1["Date"]=child.published_date
            temp1["Description"]=child.abstract
            temp1["URL"]=child.url
            temp1["id"]=child.url
            try{
                temp1["Image"]=child.multimedia[0].url
            }
            catch(err){
                temp1["Image"]="https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
            }
            temp.push(temp1)
        });
        newyorkApi.results=temp
        res.send(newyorkApi);
      })
      .catch(error => {
        console.log('areeeeee rererereerere********************** new york');
        console.log(error);
      });
  
  });



router.get('/section',function(req,res,next){
  console.log('Dusra New York')
  console.log(req.query.sec)
    var url1 = 'https://api.nytimes.com/svc/topstories/v2/'+req.query.sec+'.json?api-key=taIIUI93uuAAudAkckMTkRF7B1AHm4QK';
    var tempw=[]
    axios.get(url1)
    .then(response => {
        newyorkApiSec=response.data;
        console.log(response.status);
        var cnt=0;
        for(var r=0;r<newyorkApiSec.results.length;r++){
            cnt++;
            var temp1w={}
            temp1w["webTitle"]=newyorkApiSec.results[r].title
            temp1w["sectionId"]=newyorkApiSec.results[r].section
            temp1w["Date"]=newyorkApiSec.results[r].published_date
            temp1w["Description"]=newyorkApiSec.results[r].abstract
            temp1w["URL"]=newyorkApiSec.results[r].url
            temp1w["id"]=newyorkApiSec.results[r].url
            try{
                if(newyorkApiSec.results[r].multimedia[0].width>=2000)
                    temp1w["Image"]=newyorkApiSec.results[r].multimedia[0].url
                else
                    temp1w["Image"]="https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
            }
            catch(err){
                temp1w["Image"]="https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
            }
            tempw.push(temp1w)
            if(cnt==10)
                break;
        }
    
        newyorkApiSec.results=tempw
        console.log(newyorkApiSec.results)
        res.send(newyorkApiSec)
    })
    .catch(error => {
      console.log('areeeeee rererereerere**********************');
      console.log(error);
    });

});


router.get('/detail',function(req,res,next){
    console.log('Detailed New York')
    console.log(req.query.url)
      var url3='https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("' + req.query.url + '")&api-key=taIIUI93uuAAudAkckMTkRF7B1AHm4QK'
    
      axios.get(url3)
      .then(response => {
          newyorkCard=response.data.response.docs[0];
        //   console.log(newyorkCard)
        console.log(response.status);
          var temp1d={},temporary,smallText="",bigText=""
          temp1d["webTitle"]=newyorkCard.headline.main
          temp1d["Date"]=newyorkCard.pub_date.split('T')[0]
          temporary=newyorkCard.abstract.split('. ')
          for(var j=0;j<temporary.length;j++){
                if(j<4)
                    smallText+=temporary[j]+". "
                else
                    bigText+=temporary[j]+". "
          }
        //   if(j===1)
        //     temp1d["small"]=smallText.substring(0,smallText.length-1)
        //   else
        //     temp1d["small"]=smallText
          if(bigText.length!==0){
              temp1d["small"]=smallText
              temp1d["big"]=bigText.substring(0,bigText.length-2)
          }
            
          else{
            temp1d["small"]=smallText.substring(0,smallText.length-2)
            temp1d["big"]=""
          }
            


          temp1d["Description"]=newyorkCard.abstract
          temp1d["URL"]=newyorkCard.web_url
          temp1d["id"]=newyorkCard.web_url
          temp1d["name"]="NYTIMES"
          temp1d["sectionId"]=newyorkCard.section_name
        //   temp1w["id"]=child.url
          try{
              for(var j=0;j<newyorkCard.multimedia.length;j++){
                    if(newyorkCard.multimedia[j].width>=2000)
                        temp1d["Image"]="https://www.nytimes.com/"+newyorkCard.multimedia[j].url
                    else
                        continue;
              }
              if(!temp1d["Image"])
              temp1d["Image"]="https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
          }
          catch(err){
              temp1d["Image"]="https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
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
    console.log('Search New York')
    console.log(req.query.ids)
    //https://api.nytimes.com/svc/search/v2/articlesearch.json?q=%5bQUERY_KEYWORD%5d&api-key=%5bYOUR_API_KEY%5d
    var url4='https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + req.query.ids + '&api-key=taIIUI93uuAAudAkckMTkRF7B1AHm4QK'
        var temps=[],cnt=0
      axios.get(url4)
      .then(response => {
        

        newyorkSearch=response.data.response.docs;
        //console.log(newyorkSearch[0])
        console.log(response.status);
        for(var r=0;r<newyorkSearch.length;r++){
            cnt++
            var temp1s={}
            temp1s["webTitle"]=newyorkSearch[r].headline.main
            temp1s["Date"]=newyorkSearch[r].pub_date.split('T')[0]
            temp1s["Description"]=newyorkSearch[r].abstract
            temp1s["URL"]=newyorkSearch[r].web_url
            temp1s["id"]=newyorkSearch[r].web_url
            temp1s["name"]="NYTIMES"
            temp1s["sectionId"]=newyorkSearch[r].section_name
            try{
                // console.log('Idhar aaya')
                for(var j=0;j<newyorkSearch[r].multimedia.length;j++){
                    //console.log(newyorkSearch[r].multimedia[j])
                    if(newyorkSearch[r].multimedia[j].width>=2000){
                        // console.log('FounDDD')
                        temp1s["Image"]="https://www.nytimes.com/"+newyorkSearch[r].multimedia[j].url
                    }
                        
                    else
                        continue;
              }
              if(!temp1s["Image"])
                temp1s["Image"]="https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
          }
          catch(err){
              temp1s["Image"]="https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
          }
          temps.push(temp1s)
            if(cnt==5)
                break;

        }
        //newyorkCard.results=temps
        //console.log(temps)
        res.send(temps)
      })
      .catch(error => {
        console.log('areeeeee rererereerere**********************');
        console.log(error);
      });
  
  });


  module.exports = router;   
