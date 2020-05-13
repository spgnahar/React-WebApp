route

from flask import Flask, jsonify,render_template,request
import json
import re

application = Flask(__name__)
application.config["DEBUG"] = True


@application.route('/')
def homepage():
    return application.send_static_file("false.html")



@application.route('/api',methods=['GET','POST'])
def api_m():
    a={}
    word=[]
    words={}
    abc=[]
    abc1=[]
    abc2=[]
    j=0
    newsapi = NewsApiClient(api_key='YOUR_KEY')

    stop=set(line.strip() for line in open('stopwords_en.txt'))
    top_headlines_general = newsapi.get_top_headlines(language='en',page_size=30)
    i=0
    for ele in top_headlines_general["articles"]:
        w=ele["title"].split()
        for we in w:
            we=we.lower()
            if we not in stop:
                words[we] = words.get(we, 0) + 1 
    for ele in top_headlines_general["articles"]:
        if((ele["source"]!=None) and (ele["author"]!=None) and (ele["title"]!=None) and (ele["description"]!=None) and (ele["url"]!=None) and (ele["urlToImage"]!=None) and (ele["publishedAt"]!=None) and (ele["content"]!=None)):
            i+=1
            abc.append(ele)
            if(i==5):
                break
    top_headlines_general["articles"]=abc
    a['general']=top_headlines_general
    p=sorted(words.items(), key=lambda x: x[1], reverse=True)
    
    for elem in p:
        j+=1
        word.append(elem[0])
        if(j==30):
            break
    a["word"]=word

    top_headlines_cnn = newsapi.get_top_headlines(sources='cnn',language='en', page_size=30)
    i=0
    for ele in top_headlines_cnn["articles"]:
        if((ele["source"]!=None) and (ele["source"]["id"]!=None) and (ele["source"]["name"]!=None) and (ele["author"]!=None) and (ele["title"]!=None) and (ele["description"]!=None) and (ele["url"]!=None) and (ele["urlToImage"]!=None) and (ele["publishedAt"]!=None) and (ele["content"]!=None)):
            i+=1
            abc1.append(ele)
            if(i==4):
                break
    top_headlines_cnn["articles"]=abc1
    a['cnn']=top_headlines_cnn

    top_headlines_fox = newsapi.get_top_headlines(sources='fox-news',language='en', page_size=30)
    i=0
    for ele in top_headlines_fox["articles"]:
        if((ele["source"]!=None) and (ele["author"]!=None) and (ele["title"]!=None) and (ele["description"]!=None) and (ele["url"]!=None) and (ele["urlToImage"]!=None) and (ele["publishedAt"]!=None) and (ele["content"]!=None)):
            i+=1
            abc2.append(ele)
            if(i==4):
                break
    top_headlines_fox["articles"]=abc2
    a['fox']=top_headlines_fox
    return a

@application.route('/formed',methods=['GET','POST'])
def form():
    abc3=[]
    
    newsapi = NewsApiClient(api_key='YOUR_KEY')
    try:

        if(request.args.get('category')=='all' and request.args.get('sour')=='all'):
            all_articles = newsapi.get_everything(q=request.args.get('keyword'),
                                          # sources=request.args.get('source'),
                                          # domains=request.args.get('category'),
                                          from_param=request.args.get('from'),
                                          to=request.args.get('to'),
                                          language='en',
                                          sort_by='publishedAt',
                                          page_size=30)
        elif(request.args.get('category')=='all' and request.args.get('sour')!='all'):
            all_articles = newsapi.get_everything(q=request.args.get('keyword'),
                                          sources=request.args.get('sour'),
                                          # domains=request.args.get('category'),
                                          from_param=request.args.get('from'),
                                          to=request.args.get('to'),
                                          language='en',
                                          sort_by='publishedAt',
                                          page_size=30)
        elif(request.args.get('category')!='all' and request.args.get('sour')=='all'):
            cate=request.args.get('category')
            out=""
            text = newsapi.get_sources(category=cate,language='en',country='us')
            for ele in text['sources']:
                out+=ele['id']+","
            all_articles = newsapi.get_everything(q=request.args.get('keyword'),sources=out[:len(out)],
                                          #sources=request.args.get('source'),
                                          # domains=request.args.get('category'),
                                          from_param=request.args.get('from'),
                                          to=request.args.get('to'),
                                          language='en',
                                          sort_by='publishedAt',
                                          page_size=30)
        else:
            all_articles = newsapi.get_everything(q=request.args.get('keyword'),#sources=out[:len(out)],
                                          sources=request.args.get('sour'),
                                          # domains=request.args.get('category'),
                                          from_param=request.args.get('from'),
                                          to=request.args.get('to'),
                                          language='en',
                                          sort_by='publishedAt',
                                          page_size=30)

        for ele in all_articles["articles"]:
            if((ele["source"]!=None) and (ele["source"]["name"]!=None) and (ele["author"]!=None) and (ele["title"]!=None) and (ele["description"]!=None) and (ele["url"]!=None) and (ele["urlToImage"]!=None) and (ele["publishedAt"]!=None) and (ele["content"]!=None)):
                abc3.append(ele)
        all_articles["articles"]=abc3
       
        file1=open("output.txt","w")
        file1.write(json.dumps(all_articles))

        return all_articles

    except Exception as inst:
        msg=inst['message']
        abc3['message']=msg
    return abc3


@application.route('/catego',methods=['GET','POST'])
def inp():
    newsapi = NewsApiClient(api_key='YOUR_KEY')
    b={}
    text=request.args.get('category')
    if(text=='all'):
        source = newsapi.get_sources()
    else:
        source = newsapi.get_sources(category=text.lower(),language='en',country='us')
    out=list()
    for ele in source['sources']:
        out.append(ele['id'])
    b['keys']=out
    return b


    


if __name__ == '__main__':
    application.run(debug=True)
    