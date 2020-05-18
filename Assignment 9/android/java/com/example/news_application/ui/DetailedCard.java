package com.example.news_application.ui;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.text.Html;
import android.text.method.LinkMovementMethod;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.core.text.HtmlCompat;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.news_application.R;
import com.example.news_application.ui.home.HomeFragment;
import com.google.gson.Gson;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.Map;

public class DetailedCard extends AppCompatActivity {
    RequestQueue mQueue;
    ProgressBar spinner;
    TextView t1;
    SharedPreferences pref;
    Map<String,?> keys;
    SharedPreferences.Editor editor;
    small_card currentCard;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        overridePendingTransition(R.xml.slide_in_up, R.xml.slide_out_up);
        Intent i = getIntent();
        setContentView(R.layout.detail_card);
        String old_id= i.getStringExtra("article_id");
        mQueue = Volley.newRequestQueue(getApplicationContext());
        pref = getSharedPreferences("favorites",0);
        jsonparse(old_id);
        TextView trial = findViewById(R.id.detail_heading);
        spinner=(ProgressBar)findViewById(R.id.progressBar1);

    }

    private void jsonparse(String old_id){
        String url= "https://newsapp-backend.appspot.com/android/detail?url="+old_id;
//        String url ="http://10.0.2.2:9000/android/detail?url="+old_id;



        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @RequiresApi(api = Build.VERSION_CODES.O)
                    @Override
                    public void onResponse(JSONObject response) {

                        try {

                            spinner.setVisibility(View.GONE);
                            t1= (TextView) findViewById(R.id.load);
                            t1.setVisibility(View.GONE);
                            final JSONObject master = response.getJSONObject("results");
                            final String title=master.getString("webTitle");


                            String date=master.getString("Date");
                            ZonedDateTime time_in_zone_format = ZonedDateTime.parse(date);
                            ZonedDateTime time_zone_LA = time_in_zone_format.withZoneSameInstant( ZoneId.of( "America/Los_Angeles" ));
                            LocalDateTime news_time_local =  time_zone_LA.toLocalDateTime();
                            LocalDate localDate = news_time_local.toLocalDate();
                            int day = localDate.getDayOfMonth();
                            String month = localDate.getMonth().getDisplayName(TextStyle.SHORT, Locale.US);
                            int year = localDate.getYear();
                            String time_to_display = ""+day+" "+month+" "+year;


                            final String image=master.getString(("Image"));
                            String section_name=master.getString("sectionId");
                            String description= master.getString("Description");
                            final String url=master.getString("URL");
                            final String id = master.getString("id");
                            final ImageView bookmark = findViewById(R.id.bookmark_toolbar);

                            currentCard = new small_card( image, title ,date,section_name,id,url );
                            editor = pref.edit();
                            keys = pref.getAll();

                            for(Map.Entry<String,?> entry : keys.entrySet()) {
                                if(currentCard.getmid().toString().equals(entry.getKey().toString())){
                                    bookmark.setImageResource(R.drawable.ic_bookmark_single);

                                }
                            }


                            ImageView imageViewDetail =(ImageView)findViewById(R.id.detail_image);
                            Picasso.get().load(image).fit().centerInside().into(imageViewDetail);

                            TextView text_heading = (TextView) findViewById(R.id.detail_heading);
                            text_heading.setText(title);

                            TextView text_date = (TextView) findViewById(R.id.detail_date);
                            text_date.setText(time_to_display);

                            TextView text_toolbar = findViewById(R.id.detail_text_title_toolbar);
                            text_toolbar.setText(title);

                            TextView text_section = (TextView) findViewById(R.id.detail_section);
                            text_section.setText(section_name);

                            TextView text_description = (TextView) findViewById(R.id.detail_description);
                            text_description.setText(HtmlCompat.fromHtml(description, 0));

                            TextView Text1 = (TextView) findViewById(R.id.detail_url);
                            Text1.setText(
                                    Html.fromHtml(
                                            "<a href='"+url+"'>google</a> "));
                            Text1.setMovementMethod(LinkMovementMethod.getInstance());

                            TextView Text2= (TextView) findViewById(R.id.detail_url);
                            Text2.setText(
                                    Html.fromHtml(
                                            "<a href="+url+">View Full Article</a> "));
                            Text2.setMovementMethod(LinkMovementMethod.getInstance());


                            ImageView tweet =findViewById(R.id.twitter_toolbar);
                            tweet.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    String tweet_url = "https://twitter.com/intent/tweet?text=Check out this Link:&url="+url+"&hashtags="+"CSCI571NewsSearch";
                                    Intent i = new Intent(Intent.ACTION_VIEW);
                                    i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                    i.setData(Uri.parse(tweet_url));
                                    getApplicationContext().startActivity(i);
                                }
                            });



                            bookmark.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    editor = pref.edit();
                                    keys = pref.getAll();
                                    if(!keys.containsKey(id)){

                                        Gson gson = new Gson();
                                        String json = gson.toJson(currentCard);
                                        editor.putString(id, json);
                                        editor.commit();

                                        bookmark.setImageResource(R.drawable.ic_bookmark_single);
                                        Toast.makeText(getApplicationContext(),"'"+title+"' was added to bookmarks",Toast.LENGTH_SHORT).show();
                                    }
                                    else{
                                        editor.remove(id);
                                        editor.commit();
                                        bookmark.setImageResource(R.drawable.ic_bookmark_single_border);
                                        Toast.makeText(getApplicationContext(),"'"+title+"' was removed from bookmarks",Toast.LENGTH_SHORT).show();
                                    }

                                }
                            });

                            ImageView back_button = findViewById(R.id.back_toolbar);
                            back_button.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
//                                    finish();
                                   onBackPressed();
                                }
                            });


                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
            }
        });
        mQueue.add(request);

    }

    protected void onPause()
    {
        super.onPause();
        overridePendingTransition(R.xml.fade_in, R.xml.slide_out_up);
    }
}
