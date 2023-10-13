package com.example.fluttertest

import android.content.Context;
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import androidx.annotation.NonNull
import com.tns.Runtime
import com.tns.RuntimeHelper
import java.io.File
import android.util.Log
import android.content.Intent

class MainActivity : FlutterActivity() {
    private val CHANNEL = "com.runtime.nsruntime"

    override fun configureFlutterEngine(@NonNull flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler {
                call,
                result ->
            // This method is invoked on the main thread.
            // TODO
            if (call.method == "loadEmbeddedNS") {
                val ctx : Context = getApplicationContext()
                var appDir = ctx.getFilesDir()
                appDir = appDir.getCanonicalFile()

                var rt : com.tns.Runtime = RuntimeHelper.initRuntime(ctx)
                Log.v("HELLO", "Attempting To start file")
                Log.v("HELLO", appDir.toString())

                if (rt != null) {

                    val file = File(appDir, "/public/app/bundle.js")
                    Log.v("HELLO", file.exists().toString())

                    if (file.exists()) {
                        rt.runModule(file)
                    }
                }
                val intent: android.content.Intent = Intent(
                    this@MainActivity,
                    com.tns.NativeScriptActivity::class.java
                )
                intent.setAction(android.content.Intent.ACTION_DEFAULT)
                startActivity(intent)

                result.success("Android " + android.os.Build.VERSION.RELEASE);
            }
        }
    }

}
