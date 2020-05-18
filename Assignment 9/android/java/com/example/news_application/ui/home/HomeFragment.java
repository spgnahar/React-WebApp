package com.example.news_application.ui.home;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;
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
import com.example.news_application.ui.MyAdapter;
import com.example.news_application.ui.small_card;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import static android.content.Context.LOCATION_SERVICE;

public class HomeFragment extends Fragment {

    private RecyclerView recyclerView;
    private MyAdapter mAdapter;
    private RecyclerView.LayoutManager layoutManager;
    RequestQueue mQueue,weatherQueue;
    ArrayList<small_card> myDataset ;
    private ProgressBar spinner;
    View root;
    TextView t1;
    Double lon,lat;
    SwipeRefreshLayout refreshLayout;
    private LocationManager locationManager;
    private LocationListener locationListener;
    final int REQUEST_LOCATION=1;


    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        root = inflater.inflate(R.layout.fragment_home, container, false);

        ActivityCompat.requestPermissions(getActivity(),
               new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, REQUEST_LOCATION);
        location();

        recyclerView = (RecyclerView) root.findViewById(R.id.my_recycle_view);
        recyclerView.setHasFixedSize(true);

        // use a linear layout manager
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getActivity().getApplicationContext());
        recyclerView.setLayoutManager(layoutManager);


        spinner=(ProgressBar)root.findViewById(R.id.progressBar1);
        mQueue = Volley.newRequestQueue(getActivity().getApplicationContext());
        jsonparse();

        refreshLayout =root.findViewById(R.id.swip_refresh);
        refreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {

                recyclerView = (RecyclerView) root.findViewById(R.id.my_recycle_view);
                recyclerView.setHasFixedSize(true);

                // use a linear layout manager
                RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getActivity().getApplicationContext());
                recyclerView.setLayoutManager(layoutManager);


                spinner=(ProgressBar)root.findViewById(R.id.progressBar1);
                location();

                mQueue = Volley.newRequestQueue(getActivity().getApplicationContext());
                jsonparse();
                refreshLayout.setRefreshing(false);
            }
        });

        return root;
    }

    public  void location(){
        locationManager = (LocationManager)getActivity().getSystemService(LOCATION_SERVICE);
        locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                String text = "" + location.getLongitude() + ";" + location.getLatitude();
                weatherQueue=Volley.newRequestQueue(getActivity().getApplicationContext());
                weatherparse(text);
                locationManager.removeUpdates(locationListener);
                locationManager = null;

            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {

            }

            @Override
            public void onProviderEnabled(String provider) {

            }

            @Override
            public void onProviderDisabled(String provider) {

            }

        };

        configure_button();
    }
    private void weatherparse(String text) {

        lon = Double.parseDouble(text.split(";")[0]);
        lat = Double.parseDouble(text.split(";")[1]);
        Geocoder geocoder = new Geocoder(getActivity().getApplicationContext(), Locale.getDefault());
        List<Address> addresses = null;
        try {
            addresses = geocoder.getFromLocation((double)lat, (double)lon, 1);
        } catch (IOException e) {
            e.printStackTrace();
        }
        String cityName = addresses.get(0).getLocality();
        String stateName = addresses.get(0).getAdminArea();
        TextView t3 = root.findViewById(R.id.weather_city);
        t3.setText(cityName);
        TextView t4 =root.findViewById(R.id.weather_state);
        t4.setText(stateName);
        final String weatherurl="https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=metric&appid=b6d61e05a49fbf1a2d9465cf75f1dd67";

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, weatherurl, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {

                            JSONObject master = response.getJSONObject("main");
                            JSONObject weather1 =response.getJSONArray("weather").getJSONObject(0);

                            String weather_desc = weather1.getString("main");

                            Double temp = (double) master.getDouble("temp");
                            TextView t = root.findViewById(R.id.weather_temprature);
                            t.setText(""+Math.round(temp) +" "+ "\u2103");

                            TextView t2 = root.findViewById(R.id.weather_sunshine);
                            t2.setText(weather_desc);

                            ImageView weatherImage = root.findViewById(R.id.weather_image);
                            switch (weather_desc){
                                case "Clouds":
                                    weatherImage.setImageResource(R.drawable.cloudy_weather);
                                    break;
                                case "Clear":
                                    weatherImage.setImageResource(R.drawable.clear_weather);
                                    break;
                                case "Snow":
                                    weatherImage.setImageResource(R.drawable.snowy_weather);
                                    break;
                                case "Rain":
                                case "Drizzle":
                                    weatherImage.setImageResource(R.drawable.rainy_weather);
                                    break;
                                case "Thunderstorm":
                                    weatherImage.setImageResource(R.drawable.thunder_weather);
                                    break;
                                default:
                                    weatherImage.setImageResource(R.drawable.sunny_weather);
                            }


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

        weatherQueue.add(request);
    }

    private void jsonparse(){

        myDataset = new ArrayList<>();

        String url= "https://newsapp-backend.appspot.com/android";
//        String url ="http://10.0.2.2:9000/android";


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
                                t1= (TextView) root.findViewById(R.id.load);
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


    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch (requestCode) {
            case 10:
                configure_button();
                break;
            default:
                break;
        }
    }

    void configure_button() {
        if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {

            return;
        }

        if (ActivityCompat.checkSelfPermission(getActivity().getApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION) !=
                PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(getActivity().getApplicationContext(), Manifest.permission.ACCESS_COARSE_LOCATION)
                        != PackageManager.PERMISSION_GRANTED) {

            return;
        }
        locationManager.requestLocationUpdates("gps", 5000, 0, locationListener);

    }



}


