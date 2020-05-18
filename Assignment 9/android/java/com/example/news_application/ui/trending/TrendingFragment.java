package com.example.news_application.ui.trending;

import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.news_application.R;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class TrendingFragment extends Fragment {

    LineChart linechart;
    RequestQueue mQueue;
    ArrayList<Entry> dataSet;
    EditText editText;


    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_trending, container, false);

        linechart =root.findViewById(R.id.line_chart);
        mQueue = Volley.newRequestQueue(getActivity().getApplicationContext());
        LineChartDataset("77Null77");
        editText=root.findViewById(R.id.edit_text);
        editText.setOnEditorActionListener(new EditText.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {

                if (actionId == EditorInfo.IME_ACTION_SEND || (event != null && (event.getKeyCode() == KeyEvent.KEYCODE_ENTER))){

                    LineChartDataset(editText.getText().toString());
                    return true;
                }
                return false;
            }
        });

        return root;
    }

    private void LineChartDataset(String key){

        if(key=="77Null77"){
            key="coronavirus";
        }

        String url= "https://newsapp-backend.appspot.com/android/trends?key="+key;
//        String url ="http://10.0.2.2:9000/android/trends?key="+key;

        final String finalKey = key;
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {

                        try {
                            JSONArray master = response.getJSONArray("Ans");
                            dataSet= new ArrayList<>();
                            for(int i=0;i<master.length();i++){
                                dataSet.add(new Entry(i,Integer.parseInt(master.getString(i))));
                            }

                            addM(finalKey);

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

        void addM(String key){
            LineDataSet lineDataSet = new LineDataSet(dataSet,"Trending Chart for "+key);
            ArrayList<ILineDataSet> iLineDataSets = new ArrayList<>();
            iLineDataSets.add(lineDataSet);

            LineData lineData = new LineData(iLineDataSets);

            int color = ContextCompat.getColor(getContext(), R.color.colorPrimaryDark);

            lineDataSet.setColor(color);
            lineDataSet.setCircleColor(color);
            lineDataSet.setCircleHoleColor(color);
            Legend l = linechart.getLegend();
            l.setTextSize(18f);
            l.setFormSize(16f);
            linechart.getAxisLeft().setDrawGridLines(false);
            linechart.getXAxis().setDrawGridLines(false);
            linechart.getAxisRight().setDrawGridLines(false);
            YAxis left = linechart.getAxisLeft();
            left.setDrawAxisLine(false);
            linechart.setData(lineData);
            linechart.invalidate();


        }


}
