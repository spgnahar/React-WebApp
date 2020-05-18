package com.example.news_application;

import android.app.Activity;
import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.news_application.ui.DetailedCard;
import com.example.news_application.ui.SearchPage;
import com.example.news_application.ui.trending.TrendingFragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import androidx.appcompat.app.AppCompatActivity;
//import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.MenuItemCompat;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends AppCompatActivity {
    ArrayAdapter<String> arrayAdapter;
    TextView t1;
    JSONArray suggestionsData;

    public void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Toolbar toolbar = findViewById(R.id.plaintext_toolbar);
        setSupportActionBar(toolbar);


        BottomNavigationView navView = findViewById(R.id.nav_view);
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        AppBarConfiguration appBarConfiguration = new AppBarConfiguration.Builder(
                R.id.navigation_home, R.id.navigation_headlines, R.id.navigation_trending, R.id.navigation_bookmarks)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);
//        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);
        NavigationUI.setupWithNavController(navView, navController);



//       
    }


    @Override
    public boolean onCreateOptionsMenu (Menu menu) {

        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.search_menu, menu);
        SearchManager searchManager = (SearchManager) getSystemService(Context.SEARCH_SERVICE);
        MenuItem searchMenuItem = menu.findItem(R.id.action_search);
        final androidx.appcompat.widget.SearchView searchView = (androidx.appcompat.widget.SearchView) searchMenuItem.getActionView();
        final androidx.appcompat.widget.SearchView.SearchAutoComplete suggestions = searchView.findViewById(androidx.appcompat.R.id.search_src_text);

        searchView.setIconified(true);
        searchView.setIconifiedByDefault(true);
        searchView.setSearchableInfo(searchManager.getSearchableInfo(getComponentName()));
        suggestions.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View viz, int posi, long id) {
                //Intent send_intent = new Intent(viz.getContext(), SearchActivity.class);
                String search_keyw = (String) parent.getItemAtPosition(posi);
                searchView.setQuery(search_keyw, false);
                //send_intent.putExtra(Extra_query, search_keyw);
                //startActivity(send_intent);
            }
        });



        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                Log.e("search", query);
                Intent intent = new Intent(getApplicationContext(),SearchPage.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

                intent.putExtra("query",query);


                getApplicationContext().startActivity(intent);
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                if(newText.length() < 3) {
                    ArrayAdapter<String> newsempty = null;
                    suggestions.setAdapter(newsempty);
                    return true;
                }
                getSuggestionList(newText, suggestions);
                Log.i("query",newText);

//                arrayAdapter.getFilter().filter(newText);
                return true;
            }
        });
        return true;
    }

    private void getSuggestionList(String query, final androidx.appcompat.widget.SearchView.SearchAutoComplete suggestions) {
        String url = "https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q="+query;
        RequestQueue bingReqQueue = Volley.newRequestQueue(getBaseContext());
        JsonObjectRequest bingJsonReq = new JsonObjectRequest(Request.Method.GET, url,
                null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    suggestionsData = response.getJSONArray("suggestionGroups").getJSONObject(0).getJSONArray("searchSuggestions");
                    String[] suggested = new String[5];
                    int limit = Math.min(suggestionsData.length(), 5);
                    for (int i = 0; i<limit; i++) {
                        try {
                            suggested[i] = suggestionsData.getJSONObject(i).getString("displayText");
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                    ArrayAdapter<String> newsAdapter = new ArrayAdapter<String>(MainActivity.this, android.R.layout.simple_dropdown_item_1line, suggested);
                    suggestions.setAdapter(newsAdapter);
                    suggestions.showDropDown();
                } catch (JSONException err) {
                    err.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
            }
        }){
            @Override
            public Map<String, String> getHeaders() {
                Map <String, String> bingKey = new HashMap<>();
                bingKey.put("Ocp-Apim-Subscription-Key", "YOUR-KEY");
                return bingKey;
            }
        };
        bingReqQueue.add(bingJsonReq);
    }



}
