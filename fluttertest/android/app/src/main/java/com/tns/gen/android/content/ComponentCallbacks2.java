/* AUTO-GENERATED FILE. DO NOT MODIFY.
 * This class was automatically generated by the
 * static binding generator from the resources it found.
 * Please do not modify by hand.
 */
package com.tns.gen.android.content;

public class ComponentCallbacks2 extends java.lang.Object
    implements com.tns.NativeScriptHashCodeProvider, android.content.ComponentCallbacks2 {
  public ComponentCallbacks2() {
    super();
    com.tns.Runtime.initInstance(this);
  }

  public void onTrimMemory(int param_0) {
    java.lang.Object[] args = new java.lang.Object[1];
    args[0] = param_0;
    com.tns.Runtime.callJSMethod(this, "onTrimMemory", void.class, args);
  }

  public void onConfigurationChanged(android.content.res.Configuration param_0) {
    java.lang.Object[] args = new java.lang.Object[1];
    args[0] = param_0;
    com.tns.Runtime.callJSMethod(this, "onConfigurationChanged", void.class, args);
  }

  public void onLowMemory() {
    java.lang.Object[] args = new java.lang.Object[0];
    com.tns.Runtime.callJSMethod(this, "onLowMemory", void.class, args);
  }

  public int hashCode__super() {
    return super.hashCode();
  }

  public boolean equals__super(java.lang.Object other) {
    return super.equals(other);
  }
}