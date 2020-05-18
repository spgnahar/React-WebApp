package com.example.news_application.ui;

import android.app.Activity;
import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.news_application.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;

public class SearchPage extends Activity {

    private RecyclerView recyclerView;
    private MyAdapter mAdapter;
    private RecyclerView.LayoutManager layoutManager;
    RequestQueue mQueue;
    ArrayList<small_card> myDataset ;
    private ProgressBar spinner;
    View root;
    TextView t1;
    String query;
    SwipeRefreshLayout refreshLayout;


    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        overridePendingTransition(R.xml.slide_in_up, R.xml.slide_out_up);
        setTheme(R.style.AppTheme);
        Intent i = getIntent();
        query= i.getStringExtra("query");
        setContentView(R.layout.search);

        if (Intent.ACTION_SEARCH.equals(i.getAction())) {
            String query1 = i.getStringExtra(SearchManager.QUERY);
        }

        recyclerView = (RecyclerView) findViewById(R.id.my_recycle_view);
        recyclerView.setHasFixedSize(true);

        // use a linear layout manager
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(this);
        recyclerView.setLayoutManager(layoutManager);

        TextView head = findViewById(R.id.edittext_heading_appbar);
        head.setText("Search results for "+query);


//        mAdapter = new MyAdapter(myDataset);
        spinner=(ProgressBar)findViewById(R.id.progressBar1);

        mQueue = Volley.newRequestQueue(this);
        jsonparse();

        refreshLayout =findViewById(R.id.swip_refresh);
        refreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {

                recyclerView = (RecyclerView) findViewById(R.id.my_recycle_view);
                recyclerView.setHasFixedSize(true);

                RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getApplicationContext());
                recyclerView.setLayoutManager(layoutManager);

                spinner=(ProgressBar)findViewById(R.id.progressBar1);
                mQueue = Volley.newRequestQueue(getApplicationContext());
                jsonparse();
                refreshLayout.setRefreshing(false);
            }
        });

    }

    private void jsonparse(){

        myDataset = new ArrayList<>();

        String url= "https://newsapp-backend.appspot.com/android/search?ids="+query;
//        String url ="http://10.0.2.2:9000/android/search?ids="+query;



        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @RequiresApi(api = Build.VERSION_CODES.O)
                    @Override
                    public void onResponse(JSONObject response) {

                        try {
                            if((response.getJSONArray("results").length() ==0)){

                                spinner.setVisibility(View.VISIBLE);
                            }
                            JSONArray master = response.getJSONArray("results");
                            String title;
                            String date;
                            String image;
                            String section_name;
                            String id;
                            String url;
                            spinner.setVisibility(View.GONE);
                            t1= (TextView) findViewById(R.id.load);
                            t1.setVisibility(View.GONE);


                            for(int i=0; i<master.length();i++){
                                JSONObject results = (master.getJSONObject(i));

                                title =results.getString("webTitle");

                                date = results.getString("Date");

                                image = results.getString("Image");
                                section_name =results.getString("sectionId");
                                id=results.getString("id");
                                url=results.getString("URL");
                                myDataset.add(new small_card( image, title ,date,section_name,id,url )) ;
                            }
                            mAdapter = new MyAdapter(SearchPage.this ,myDataset);
                            recyclerView.setAdapter(mAdapter);

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

    @Override
    public void onResume() {
        super.onResume();


        mQueue = Volley.newRequestQueue(getApplicationContext());
        jsonparse();


    }

    @Override
    protected void onPause() {
        super.onPause();

        overridePendingTransition(R.xml.fade_in, R.xml.slide_out_up);
    }
}
