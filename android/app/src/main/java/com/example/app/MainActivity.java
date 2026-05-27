package com.example.app;

import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    getBridge().getWebView().setWebChromeClient(new WebChromeClient() {
      public void onPermissionRequest(final PermissionRequest request) {
        request.grant(request.getResources());
      }
    });
  }
}
