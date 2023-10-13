
import 'nsruntime_platform_interface.dart';

class NSRuntime {
  Future<String?> loadEmbeddedNS() {
    return NSRuntimePlatform.instance.loadEmbeddedNS();
  }
}
