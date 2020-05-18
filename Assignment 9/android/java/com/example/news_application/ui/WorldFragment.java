package com.example.news_application.ui;

import android.content.Context;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

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

import java.util.ArrayList;


public class WorldFragment extends Fragment {
    private static final String TAG ="World";
    private RecyclerView recyclerView;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager layoutManager;
    RequestQueue mQueue;
    ArrayList<small_card> myDataset = new ArrayList<>();
    private ProgressBar spinner;
    View root;
    TextView t1;
    String msection;
    SwipeRefreshLayout refreshLayout;

    public WorldFragment(String section) {
        msection=section;
       
    }



    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        root = inflater.inflate(R.layout.fragment_world, container, false);

        recyclerView = (RecyclerView) root.findViewById(R.id.my_recycle_view);
        recyclerView.setHasFixedSize(true);

        // use a linear layout manager
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getActivity().getApplicationContext());
        recyclerView.setLayoutManager(layoutManager);

        spinner=(ProgressBar)root.findViewById(R.id.progressBar1);

        mQueue = Volley.newRequestQueue(getActivity().getApplicationContext());
        jsonparse();

        refreshLayout= root.findViewById(R.id.swip_refresh);
        refreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                recyclerView = (RecyclerView) root.findViewById(R.id.my_recycle_view);
                recyclerView.setHasFixedSize(true);

                // use a linear layout manager
                RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getActivity().getApplicationContext());
                recyclerView.setLayoutManager(layoutManager);

                spinner=(ProgressBar)root.findViewById(R.id.progressBar1);

                mQueue = Volley.newRequestQueue(getActivity().getApplicationContext());
                jsonparse();
                refreshLayout.setRefreshing(false);
            }
        });

        return root;

    }


    private void jsonparse(){
        String url= "https://newsapp-backend.appspot.com/android/section?sec="+msection;
        myDataset = new ArrayList<>();
        //String url ="http://10.0.2.2:9000/android/section?sec="+msection;


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
                            Log.i("ans",""+master);
                            String title;
                            String date;
                            String image;
                            String section_name;
                            String id;
                            String url;
                            spinner.setVisibility(View.GONE);
                            t1= (TextView) root.findViewById(R.id.load);
                            t1.setVisibility(View.GONE);

                            for(int i=0; i<master.length();i++){
                                JSONObject results = (master.getJSONObject(i));

                                title =results.getString("webTitle");
                                date = results.getString("Date");

                                image = results.getString("Image");
                                section_name =results.getString("sectionId");
                                id =results.getString("id");
                                url=results.getString("URL");
                                myDataset.add(new small_card( image, title ,date,section_name,id,url )) ;
                            }
                            mAdapter = new MyAdapter((Context) getActivity() ,myDataset);
                            recyclerView.setAdapter(mAdapter);
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
        mQueue = Volley.newRequestQueue(getActivity().getApplicationContext());
        jsonparse();
    }
}
