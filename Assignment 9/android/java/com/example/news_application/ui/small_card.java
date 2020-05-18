package com.example.news_application.ui;

import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Calendar;
import java.util.TimeZone;

public class small_card {
    private String mImageResource;
    private String mTextHeading;
    private String mTextDate;
    private String mSectionName;
    private String mid;
    private String murl;

    public small_card(String ImageResource, String TextHeading, String TextDate, String SectionName, String id, String url){
        mImageResource=ImageResource;
        mTextHeading=TextHeading;
        mTextDate=TextDate;
        mSectionName=SectionName;
        mid=id;
        murl=url;
    }

    public String getmImageResource(){
        return mImageResource;
    }

    public String getmTextHeading(){
        return mTextHeading;
    }
    @RequiresApi(api = Build.VERSION_CODES.O)
    public String getmTextDate(){

        return mTextDate;
    }
    public  String getmSectionName(){ return mSectionName;}
    public  String getmid(){ return mid;}
    public  String getmurl(){ return murl;}
}
