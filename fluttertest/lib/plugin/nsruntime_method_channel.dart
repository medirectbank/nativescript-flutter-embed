import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import 'nsruntime_platform_interface.dart';

/// An implementation of [NSRuntimePlatform] that uses method channels.
class MethodChannelNSRuntime extends NSRuntimePlatform {
  /// The method channel used to interact with the native platform.
  @visibleForTesting
  final methodChannel = const MethodChannel('com.runtime.nsruntime');

  @override
  Future<String?> loadEmbeddedNS() async {
    final version = await methodChannel.invokeMethod<String>('loadEmbeddedNS');
    return version;
  }
}
