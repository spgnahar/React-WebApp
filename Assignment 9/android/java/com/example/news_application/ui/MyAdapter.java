package com.example.news_application.ui;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.Image;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.DrawableRes;
import androidx.annotation.RequiresApi;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.RequestQueue;
import com.example.news_application.R;
import com.google.gson.Gson;
import com.squareup.picasso.Picasso;

import org.json.JSONObject;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class MyAdapter extends RecyclerView.Adapter<MyAdapter.MyViewHolder> {
    private ArrayList<small_card> mDataset = new ArrayList<>();
    private Context mContext;
    RequestQueue mQueue;
    private ProgressBar spinner;

    Map<String,small_card> localStorage = new HashMap<>();
    SharedPreferences pref;
    Map<String,?> keys;
    SharedPreferences.Editor editor;


    public class MyViewHolder extends RecyclerView.ViewHolder {
        public TextView textViewHeading;
        public ImageView imageViewMain;
        public  TextView textViewDate;
        public ImageView BookmarkImage;
        public TextView textViewSection;
        public ImageView imageViewDialog;
        CardView cardView;


        public MyViewHolder(View view){
            super(view);
            imageViewMain =(ImageView) view.findViewById(R.id.smallcard_image);
            textViewHeading = (TextView) view.findViewById(R.id.text_smallcard_heading);
            textViewDate =(TextView) view.findViewById(R.id.text_smallcard_date);
            cardView= view.findViewById(R.id.small_card);
            BookmarkImage=view.findViewById(R.id.bookmark_image);
            textViewSection=view.findViewById(R.id.text_smallcard_section);

        }
    }

    public MyAdapter(Context context , ArrayList<small_card> myDataset) {
        mContext =context;
        mDataset = myDataset;
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent,
                                           int viewType) {

        View v = LayoutInflater.from(mContext)
                .inflate(R.layout.small_card,parent,false);


        return new MyViewHolder(v);
    }


    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onBindViewHolder(final MyViewHolder holder, int position) {


        final small_card currentCard = mDataset.get(position);
        Picasso.get().load(currentCard.getmImageResource()).fit().centerInside().into(holder.imageViewMain);
        holder.textViewHeading.setText(currentCard.getmTextHeading());

        String date = mDataset.get(holder.getAdapterPosition()).getmTextDate();;
        ZonedDateTime time_in_zone_format = ZonedDateTime.parse(date);
        ZonedDateTime time_zone_LA = time_in_zone_format.withZoneSameInstant( ZoneId.of( "America/Los_Angeles" ));
        LocalDateTime news_time_local =  time_zone_LA.toLocalDateTime();
        LocalDateTime current_time_local = LocalDateTime.now();
        long time_difference;
        String time;
        time_difference = ChronoUnit.DAYS.between(news_time_local,current_time_local);
        if(time_difference < 1)
        {
            time_difference = ChronoUnit.HOURS.between(news_time_local,current_time_local);
            if(time_difference < 1)
            {
                time_difference = ChronoUnit.MINUTES.between(news_time_local, current_time_local);
                if(time_difference < 1)
                {
                    time_difference = ChronoUnit.SECONDS.between(news_time_local,current_time_local);
                    time = String.valueOf(time_difference)+"s ago";
                }
                else
                {
                    time = String.valueOf(time_difference)+"m ago";
                }
            }
            else
            {
                time = String.valueOf(time_difference)+"h ago";
            }
        }
        else
        {
            time = String.valueOf(time_difference)+"d ago";
        }

        holder.textViewDate.setText(time);
        holder.textViewSection.setText(currentCard.getmSectionName());


        pref = mContext.getSharedPreferences("favorites",0);
        editor = pref.edit();
          keys = pref.getAll();

        for(Map.Entry<String,?> entry : keys.entrySet()) {
            if(currentCard.getmid().toString().equals(entry.getKey().toString())){
                holder.BookmarkImage.setImageResource(R.drawable.ic_bookmark_single);

            }
        }


        final String title = mDataset.get(holder.getAdapterPosition()).getmTextHeading();
        final String id= mDataset.get(holder.getAdapterPosition()).getmid();
        final String img = mDataset.get(holder.getAdapterPosition()).getmImageResource();
        final String url = mDataset.get(holder.getAdapterPosition()).getmurl();
        date = mDataset.get(holder.getAdapterPosition()).getmTextDate();
        final String section = mDataset.get(holder.getAdapterPosition()).getmSectionName();


        holder.BookmarkImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                editor = pref.edit();
                keys = pref.getAll();

                if(!keys.containsKey(id)){

                    Gson gson = new Gson();
                    String json = gson.toJson(currentCard);
                    editor.putString(id, json);
                    editor.commit();
//                    editor.clear();
//                    editor.commit();

                    holder.BookmarkImage.setImageResource(R.drawable.ic_bookmark_single);
                    Toast.makeText(mContext.getApplicationContext(),"'"+title+"' was added to bookmarks",Toast.LENGTH_SHORT).show();
                }
                else{
                    editor.remove(id);
                    editor.commit();
                    holder.BookmarkImage.setImageResource(R.drawable.ic_bookmark_single_border);
                    Toast.makeText(mContext.getApplicationContext(),"'"+title+"' was removed from bookmarks",Toast.LENGTH_SHORT).show();
                }
            }
        });



        holder.cardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(mContext.getApplicationContext(),DetailedCard.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.putExtra("article_id",id);
                mContext.getApplicationContext().startActivity(intent);
            }
        });


        holder.cardView.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {

                keys = pref.getAll();
                Dialog dialog = new Dialog(mContext);
                dialog.setContentView(R.layout.dialog);

               ImageView imageViewDialog =(ImageView)dialog.findViewById(R.id.dialog_image);

                TextView text = (TextView) dialog.findViewById(R.id.dialog_heading);
                text.setText(title);

                Picasso.get().load(img).fit().centerInside().into(imageViewDialog);
                ImageView bookmark =(ImageView) dialog.findViewById(R.id.dialog_bookmark_image);
                for(Map.Entry<String,?> entry : keys.entrySet()) {

                    if(id.equals(entry.getKey())){
                        bookmark.setImageResource(R.drawable.ic_bookmark_single);

                    }
                }


                bookmark.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        editor = pref.edit();
                        keys = pref.getAll();
                        ImageView image = v.findViewById(R.id.dialog_bookmark_image);
                        ImageView BookmarkImage = v.findViewById(R.id.bookmark_image);
                        if(!keys.containsKey(id)){
                            Gson gson = new Gson();
                            String json = gson.toJson(currentCard);
                            editor.putString(id, json);
                            editor.commit();

                            image.setImageResource(R.drawable.ic_bookmark_single);
                            holder.BookmarkImage.setImageResource(R.drawable.ic_bookmark_single);

                            Toast.makeText(mContext.getApplicationContext(),"'"+title+"' was added to bookmarks",Toast.LENGTH_SHORT).show();
                        }
                        else{
                            editor.remove(id);
                            editor.commit();
                            image.setImageResource(R.drawable.ic_bookmark_single_border);
                            holder.BookmarkImage.setImageResource(R.drawable.ic_bookmark_single_border);
                            Toast.makeText(mContext.getApplicationContext(),"'"+title+"' was removed from bookmarks",Toast.LENGTH_SHORT).show();
                        }

                    }
                });
                ImageView tweet =(ImageView) dialog.findViewById(R.id.dialog_twitter_image);
                tweet.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        String tweet_url = "https://twitter.com/intent/tweet?text=Check out this Link:&url="+url+"&hashtags="+"CSCI571NewsSearch";
                        Intent i = new Intent(Intent.ACTION_VIEW);
                        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        i.setData(Uri.parse(tweet_url));
                        mContext.getApplicationContext().startActivity(i);
                    }
                });

                dialog.show();
                return false;
            }
        });

    }



    @Override
    public int getItemCount()
    {
        if(mDataset.size() > 10){
            return 10;
        }
        else
        {
            return mDataset.size();
        }
    }
}
