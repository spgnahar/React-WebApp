package com.example.news_application.ui.headlines;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProviders;


import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import androidx.viewpager.widget.ViewPager;

import com.example.news_application.PagerAdapter;
import com.example.news_application.R;
import com.example.news_application.ui.WorldFragment;
import com.google.android.material.tabs.TabLayout;

public class HeadlinesFragment extends Fragment {

    private PagerAdapter mpageradapter;
    private ViewPager mviewpager;
    View root;
    PagerAdapter adapter;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
         root = inflater.inflate(R.layout.fragment_headlines, container, false);

        mpageradapter = new PagerAdapter(getActivity().getSupportFragmentManager());
        mviewpager = (ViewPager) root.findViewById(R.id.pager);
        setupViewPager(mviewpager);

        final TabLayout tabLayout =(TabLayout) root.findViewById(R.id.tablayout);
        tabLayout.setupWithViewPager(mviewpager);

        return root;
    }

    private void setupViewPager(ViewPager viewpager){
        adapter = new PagerAdapter(getActivity().getSupportFragmentManager());
        adapter.addFragment(new WorldFragment("world") , "WORLD");
        adapter.addFragment(new WorldFragment("business"), "BUSINESS");
        adapter.addFragment(new WorldFragment("politics"), "POLITICS");
        adapter.addFragment(new WorldFragment("sport"), "SPORTS");
        adapter.addFragment(new WorldFragment("technology"), "TECHNOLOGY");
        adapter.addFragment(new WorldFragment("science"), "SCIENCE");

        viewpager.setAdapter(adapter);
    }
}
