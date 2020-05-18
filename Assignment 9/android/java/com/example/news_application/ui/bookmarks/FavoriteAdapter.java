package com.example.news_application.ui.bookmarks;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
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

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.cardview.widget.CardView;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.RequestQueue;
import com.example.news_application.R;
import com.example.news_application.ui.DetailedCard;
import com.example.news_application.ui.small_card;
import com.google.gson.Gson;
import com.squareup.picasso.Picasso;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class FavoriteAdapter extends RecyclerView.Adapter<FavoriteAdapter.MyViewHolder>{

    private final BookmarksFragment bookmarksFragment;
    private ArrayList<small_card> mDataset = new ArrayList<>();
    private Context mContext;
    RequestQueue mQueue;
    private ProgressBar spinner;
    SharedPreferences pref;
    Map<String,?> keys;
    SharedPreferences.Editor editor;

    public class MyViewHolder extends RecyclerView.ViewHolder {
        public TextView textViewHeading;
        public ImageView imageViewMain;
        public  TextView textViewDate;
        public ImageView BookmarkImage;
        public ImageView imageViewDialog;
        public TextView favoriteText;
        View view1;
        CardView cardView;

        public MyViewHolder(View view){
            super(view);
            view1=view;
            imageViewMain = view.findViewById(R.id.favorite_image);
            textViewHeading = view.findViewById(R.id.text_favorite_heading);
            textViewDate = view.findViewById(R.id.text_favorite_date);
            cardView= view.findViewById(R.id.favorite_card);
            BookmarkImage=view.findViewById(R.id.favourite_bookmark_image);
            favoriteText = view.findViewById(R.id.favorite_text);
        }
    }

    public FavoriteAdapter(Context context, ArrayList<small_card> myDataset, BookmarksFragment bookmarksFragment) {
        mContext =context;
        mDataset = myDataset;
        this.bookmarksFragment  = bookmarksFragment;
    }

    @NonNull
    @Override
    public FavoriteAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View v = LayoutInflater.from(mContext)
                .inflate(R.layout.favorite_card,parent,false);
        pref = mContext.getSharedPreferences("favorites",0);
        editor = pref.edit();
        keys = pref.getAll();
        return new MyViewHolder(v);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onBindViewHolder(@NonNull final FavoriteAdapter.MyViewHolder holder, int position) {
        pref = mContext.getSharedPreferences("favorites",0);
        editor = pref.edit();
        keys = pref.getAll();


        final small_card currentCard = mDataset.get(position);
        final String title = mDataset.get(holder.getAdapterPosition()).getmTextHeading();
        final String id= mDataset.get(holder.getAdapterPosition()).getmid();
        final String img = mDataset.get(holder.getAdapterPosition()).getmImageResource();
        final String url = mDataset.get(holder.getAdapterPosition()).getmurl();
        final String date = mDataset.get(holder.getAdapterPosition()).getmTextDate();
        final String section = mDataset.get(holder.getAdapterPosition()).getmSectionName();

        ZonedDateTime time_in_zone_format = ZonedDateTime.parse(date);
        ZonedDateTime time_zone_LA = time_in_zone_format.withZoneSameInstant( ZoneId.of( "America/Los_Angeles" ));
        LocalDateTime news_time_local =  time_zone_LA.toLocalDateTime();
        LocalDate localDate = news_time_local.toLocalDate();

        int day = localDate.getDayOfMonth();
        String month = localDate.getMonth().getDisplayName(TextStyle.SHORT, Locale.US);
        String time_to_display;
        time_to_display = ""+day+" "+month;


        Picasso.get().load(currentCard.getmImageResource()).fit().centerInside().into(holder.imageViewMain);
        holder.textViewHeading.setText(currentCard.getmTextHeading());
        holder.textViewDate.setText(time_to_display + " | " + currentCard.getmSectionName());


        holder.BookmarkImage.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.O)
            @Override
            public void onClick(View v) {
                editor = pref.edit();
                editor.remove(id);
                editor.commit();
                Toast.makeText(mContext.getApplicationContext(),"'"+title+"' was removed from bookmarks",Toast.LENGTH_SHORT).show();
                bookmarksFragment.find_favorite();

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
                final Dialog dialog = new Dialog(mContext);
                dialog.setContentView(R.layout.dialog);

                ImageView imageViewDialog =(ImageView)dialog.findViewById(R.id.dialog_image);
                TextView text = (TextView) dialog.findViewById(R.id.dialog_heading);
                text.setText(title);

                Picasso.get().load(img).fit().centerInside().into(imageViewDialog);
                ImageView bookmark =(ImageView) dialog.findViewById(R.id.dialog_bookmark_image);
                bookmark.setImageResource(R.drawable.ic_bookmark_single);

                bookmark.setOnClickListener(new View.OnClickListener() {
                    @RequiresApi(api = Build.VERSION_CODES.O)
                    @Override
                    public void onClick(View v) {
                        ImageView image = v.findViewById(R.id.dialog_bookmark_image);
                        editor = pref.edit();
                        keys = pref.getAll();
                        editor.remove(id);
                        editor.commit();
                        image.setImageResource(R.drawable.ic_bookmark_single_border);
                        Toast.makeText(mContext.getApplicationContext(),"'"+title+"' was removed from bookmarks",Toast.LENGTH_SHORT).show();
                        bookmarksFragment.find_favorite();

                        dialog.dismiss();

                    }
                });
                ImageView tweet =dialog.findViewById(R.id.dialog_twitter_image);
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
    public int getItemCount() {
//        pref = mContext.getSharedPreferences("favorites",0);
//        editor = pref.edit();
//        keys=pref.getAll();
//        return keys.size();
        return mDataset.size();
    }


}