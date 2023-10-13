import 'package:plugin_platform_interface/plugin_platform_interface.dart';
import 'nsruntime_method_channel.dart';

abstract class NSRuntimePlatform extends PlatformInterface {
  /// Constructs a NsflutterembedPlatform.
  NSRuntimePlatform() : super(token: _token);

  static final Object _token = Object();

  static NSRuntimePlatform _instance = MethodChannelNSRuntime();

  /// The default instance of [NSRuntimePlatform] to use.
  ///
  /// Defaults to [MethodChannelNSRuntime].
  static NSRuntimePlatform get instance => _instance;

  /// Platform-specific implementations should set this with their own
  /// platform-specific class that extends [NSRuntimePlatform] when
  /// they register themselves.
  static set instance(NSRuntimePlatform instance) {
    PlatformInterface.verifyToken(instance, _token);
    _instance = instance;
  }

  Future<String?> loadEmbeddedNS() {
    throw UnimplementedError('loadEmbeddedNS() has not been implemented.');
  }
}
