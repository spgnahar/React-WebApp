
package com.example.news_application.ui.bookmarks;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.RequestQueue;
import com.example.news_application.R;
import com.example.news_application.ui.MyAdapter;
import com.example.news_application.ui.small_card;
import com.google.gson.Gson;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Map;

public class BookmarksFragment extends Fragment {

    private RecyclerView recyclerView;
    private FavoriteAdapter mAdapter;
    private RecyclerView.LayoutManager layoutManager;
    ArrayList<small_card> myDataset;
    private ProgressBar spinner;
    Map<String,?> keys;
    SharedPreferences pref;
    SharedPreferences.Editor editor;
    View root;

    @RequiresApi(api = Build.VERSION_CODES.O)
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
         root = inflater.inflate(R.layout.fragment_bookmarks, container, false);

        recyclerView = (RecyclerView) root.findViewById(R.id.my_recycle_view);
        recyclerView.setHasFixedSize(true);
        RecyclerView.LayoutManager layoutManager = new GridLayoutManager(getActivity().getApplicationContext(),2);
        recyclerView.setLayoutManager(layoutManager);

        find_favorite();

        return root;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public void find_favorite() {

        pref=getActivity().getApplicationContext().getSharedPreferences("favorites",0);
        editor =pref.edit();
        small_card currentCard ;
        Gson gson = new Gson();
        keys = pref.getAll();

        String title;
        String date;
        String image;
        String section_name;
        String id;
        String url;

        TextView t1 = root.findViewById(R.id.favorite_text);
        t1.setVisibility(View.GONE);

        t1 = root.findViewById(R.id.favorite_text);

        if(keys.size()==0){
            t1.setVisibility(View.VISIBLE);
        }
        else
        {
            t1.setVisibility(View.GONE);
        }
        myDataset = new ArrayList<>();
        for(Map.Entry<String,?> entry : keys.entrySet()){

            String json = pref.getString(entry.getKey(), "");
            currentCard= gson.fromJson(json, small_card.class);
            title=currentCard.getmTextHeading();
            date=currentCard.getmTextDate();
            image=currentCard.getmImageResource();
            section_name=currentCard.getmSectionName();
            id=currentCard.getmid();
            url= currentCard.getmurl();

            myDataset.add(new small_card( image, title ,date,section_name,id,url )) ;
        }

        mAdapter = new FavoriteAdapter((Context) getActivity() ,myDataset , BookmarksFragment.this);
        recyclerView.setAdapter(mAdapter);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onResume() {
        super.onResume();
        find_favorite();
    }
}
