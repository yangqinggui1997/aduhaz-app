package vn.aduhaz.app;
import com.zing.zalo.zalosdk.oauth.ZaloSDK;
import android.content.Intent;

import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity {
    // override method below (create it if not exist)
 @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    ZaloSDK.Instance.onActivityResult(this, requestCode, resultCode, data);
  }
  
}
