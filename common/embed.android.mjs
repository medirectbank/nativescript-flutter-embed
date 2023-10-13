import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import { spawn } from 'child_process';
import yargs from 'yargs/yargs';
// import stripJsonComments from 'strip-json-comments';
import { hideBin } from 'yargs/helpers';
const argv = yargs(hideBin(process.argv)).argv;

const rootPath = argv.projectPath || '../'
/**
 * ANDROID EMBED
 */
const defaultApplicationName = 'com.tns.NativeScriptApplication';
import xmldom from 'xmldom';
const parser = new xmldom.DOMParser();
const serializer = new xmldom.XMLSerializer();
function installAndroid() {
  return new Promise((resolve) => {
    const exampleApplicationContent = `
    package my.capacitor.app;

    import android.app.Application;
    import com.tns.Runtime;
    import com.tns.RuntimeHelper;
    import java.io.File;

    public class MyCapacitorApplication extends Application {
        Runtime rt;
        private static MyCapacitorApplication thiz;

        public MyCapacitorApplication() {
            thiz = this;
        }

        public void onCreate() {
            super.onCreate();
            rt = RuntimeHelper.initRuntime(this);
            if(rt != null){
              File file = new File(getFilesDir(), "public/nativescript.js");
              rt.runScript(file);
            }
        }

        public static Application getInstance() {
            return thiz;
        }
    }`;

    fse.copySync('./embed/android/app-gradle-helpers', path.join(rootPath, 'android/app/gradle-helpers'));
    fse.copySync('./embed/android/build-tools', path.join(rootPath, 'android/build-tools'));
    fse.copySync('./embed/android/debug', path.join(rootPath, 'android/app/src/debug'));
    fse.copySync('./embed/android/gradle-helpers', path.join(rootPath, 'android/gradle-helpers'));
    fse.copySync('./embed/android/internal', path.join(rootPath, 'android/app/src/main/assets/public/internal'));
    fse.copySync('./embed/android/libs/runtime-libs', path.join(rootPath, 'android/app/libs/runtime-libs'));
    fse.copySync('./embed/android/libs/core', path.join(rootPath, 'android/app/libs/core'));
    fse.copySync('./embed/android/libs/core', path.join(rootPath, 'android/app/libs/runtime-libs'));
    fse.copySync('./embed/android/main', path.join(rootPath, 'android/app/src/main'));
    fse.copyFileSync(
      './embed/android/nativescript.build.gradle',
      path.join(rootPath, 'android/nativescript.build.gradle')
    );
    fse.copyFileSync(
      './embed/android/nativescript.buildscript.gradle',
      path.join(rootPath, 'android/nativescript.buildscript.gradle')
    );
    fse.copyFileSync(
      './embed/android/dependencies.json',
      path.join(rootPath, 'android/dependencies.json')
    );
    fse.copyFileSync(
      './embed/android/additional_gradle.properties',
      path.join(rootPath, 'android/additional_gradle.properties')
    );

    const appGradlePath = path.join(rootPath, 'android/app/build.gradle');

    const appGradle = fs.readFileSync(appGradlePath);
    if (appGradle) {
      let appGradleContent = appGradle.toString();
      const apply = `\napply from: '../nativescript.build.gradle'`;
      if (appGradleContent.indexOf(apply) === -1) {
        console.log('Fixing app.gradle...');
        appGradleContent = appGradleContent + apply;
        fs.writeFileSync(appGradlePath, appGradleContent);
      }
    }

    const projectGradlePath = path.join(rootPath, 'android/build.gradle');
    const projectGradle = fs.readFileSync(projectGradlePath);
    if (projectGradle) {
      let projectGradleContent = projectGradle.toString();

      if (projectGradleContent.indexOf('org.jetbrains.kotlin:kotlin-gradle-plugin') === -1) {
        const dependencies =
          'dependencies {\n' +
          'def computeKotlinVersion = { -> project.hasProperty("kotlinVersion") ? kotlinVersion : "1.4.21"}\n' +
          'def kotlinVersion = computeKotlinVersion()\n' +
          'classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion"\n';
        projectGradleContent = projectGradleContent.replace(/(dependencies(\s{)?({)?)/, dependencies);
        console.log('Fixing build.gradle dependencies...');
        fs.writeFileSync(projectGradlePath, projectGradleContent);
      }

      const apply = `\napply from: 'nativescript.buildscript.gradle'`;
      if (projectGradleContent.indexOf(apply) === -1) {
        console.log('Fixing build.gradle...');
        projectGradleContent = projectGradleContent.replace(/(dependencies(\s{)?({)?)/, 'dependencies {' + apply);
        fs.writeFileSync(projectGradlePath, projectGradleContent);
      }
    }

    // const mainAndroidManifestPath = path.join(rootPath, 'android/app/src/main/AndroidManifest.xml');
    // const mainAndroidManifest = fs.readFileSync(mainAndroidManifestPath);
    // if (mainAndroidManifest) {
    //   const mainAndroidManifestDocument = parser.parseFromString(mainAndroidManifest.toString());
    //   const packageName = mainAndroidManifestDocument.documentElement.getAttribute('package');
    //   const applicationEl = mainAndroidManifestDocument.documentElement.getElementsByTagName('application')?.[0];

    //   let applicationName;

    //   if (packageName && applicationEl) {
    //     if (typeof packageName === 'string' && packageName !== '') {
    //       const name = applicationEl.getAttribute('android:name');
    //       if (typeof name === 'string' && name.startsWith('.')) {
    //         applicationName = packageName + name;
    //       } else if (typeof name === 'string') {
    //         applicationName = name;
    //       }
    //     }
    //   } else if (applicationEl) {
    //     const name = applicationEl.getAttribute('android:name');
    //     if (typeof name === 'string' && !name.startsWith('.')) {
    //       applicationName = name;
    //     }
    //   }

    //   if (!applicationName) {
    //     applicationEl.setAttribute('android:name', defaultApplicationName);
    //     console.log('Name not found')
    //     fs.writeFileSync(mainAndroidManifestPath, serializer.serializeToString(mainAndroidManifestDocument));
    //   } else {
    //     if (applicationName !== defaultApplicationName) {
    //       const applicationFile = path.join(
    //         rootPath,
    //         `android/app/src/main/java/${applicationName.replace(/\./g, '/')}`
    //       );
    //       const application = fs.readFileSync(applicationFile);
    //       const appContent = application.toString();
    //       let has = 0;
    //       if (appContent.indexOf('RuntimeHelper.initRuntime(this)') > -1) {
    //         has++;
    //       }

    //       if (appContent.indexOf('.runScript(') > -1) {
    //         has++;
    //       }

    //       if (appContent.indexOf('Application getInstance()') > -1) {
    //         has++;
    //       }

    //       if (has !== 3) {
    //         throw new Error(
    //           'Application Class is not configured to start the NativeScript Runtime \n Please use the following as a guide to configure your custom Application class \n ' +
    //             exampleApplicationContent
    //         );
    //       }
    //     }
    //   }
    // }
    console.log('\n✅   Android Ready');
    resolve();
  });
}

function uninstallAndroid() {
  return new Promise((resolve) => {
    const removalExampleApplicationContent = `
    package my.capacitor.app;

    import android.app.Application;
    import com.tns.Runtime; // remove this line
    import com.tns.RuntimeHelper; // remove this line
    import java.io.File; // remove this line if it's no longer used

    public class MyCapacitorApplication extends Application {
        Runtime rt; // remove this line
        private static MyCapacitorApplication thiz; // remove this line if it's no longer used

        public MyCapacitorApplication() {
            thiz = this;  // remove this line if it's no longer used
        }

        public void onCreate() {
            super.onCreate();
            rt = RuntimeHelper.initRuntime(this); // remove this line
            if(rt != null){ // remove this line
              File file = new File(getFilesDir(), "public/nativescript.js"); // remove this line
              rt.runScript(file); // remove this line
            }
        }

      // remove this line if it's no longer used
        public static Application getInstance() {
            return thiz;
        }
    }`;

    console.log('Cleaning up NativeScript Dependencies ...');
    fse.removeSync(path.join(rootPath, 'android/app/gradle-helpers'));
    fse.removeSync(path.join(rootPath, 'android/build-tools'));
    fse.removeSync(path.join(rootPath, 'android/app/src/main/java/com/tns'));
    fse.removeSync(path.join(rootPath, 'android/app/src/debug/java/com/tns'));
    fse.removeSync(path.join(rootPath, 'android/app/src/debug/res/layout/error_activity.xml'));
    fse.removeSync(path.join(rootPath, 'android/app/src/debug/res/layout/exception_tab.xml'));
    fse.removeSync(path.join(rootPath, 'android/app/src/debug/res/layout/logcat_tab.xml'));
    fse.removeSync(path.join(rootPath, 'android/gradle-helpers'));
    fse.removeSync(path.join(rootPath, 'android/app/src/main/assets/public/internal'));
    fse.removeSync(path.join(rootPath, 'android/app/src/main/assets/public/metadata'));
    fse.removeSync(path.join(rootPath, 'android/app/libs/runtime-libs/nativescript-optimized.aar'));
    fse.removeSync(path.join(rootPath, 'android/app/libs/runtime-libs/nativescript-optimized-with-inspector.aar'));
    fse.removeSync(path.join(rootPath, 'android/app/libs/runtime-libs/nativescript-regular.aar'));
    fse.removeSync(path.join(rootPath, 'android/app/libs/runtime-libs/core.aar'));
    fse.removeSync(path.join(rootPath, 'android/app/libs/runtime-libs/widgets-release.aar'));
    fse.removeSync(path.join(rootPath, 'android/app/core/runtime-libs/core.aar'));
    fse.removeSync(path.join(rootPath, 'android/app/core/runtime-libs/widgets-release.aar'));
    fse.removeSync(path.join(rootPath, 'android/dependencies.json'));
    fse.removeSync(path.join(rootPath, 'android/additional_gradle.properties'));


    const appGradlePath = path.join(rootPath, 'android/app/build.gradle');
    const appGradle = fs.readFileSync(appGradlePath);
    if (appGradle) {
      let appGradleContent = appGradle.toString();
      const apply = `\napply from: '../nativescript.build.gradle'`;
      if (appGradleContent.indexOf(apply) > -1) {
        console.log('Fixing app.gradle')
        appGradleContent = appGradleContent.replace(apply, '');
        fs.writeFileSync(appGradlePath, appGradleContent);
      }
    }

    const projectGradlePath = path.join(rootPath, 'android/build.gradle');
    const projectGradle = fs.readFileSync(projectGradlePath);
    if (projectGradle) {
      let projectGradleContent = projectGradle.toString();
      const apply = `\napply from: 'nativescript.buildscript.gradle'`;
      if (projectGradleContent.indexOf(apply) > -1) {
        projectGradleContent = projectGradleContent.replace(apply, '');
        fs.writeFileSync(projectGradlePath, projectGradleContent);
      }
    }

    fse.removeSync(path.join(rootPath, 'android/nativescript.build.gradle'));

    fse.removeSync(path.join(rootPath, 'android/nativescript.buildscript.gradle'));

    const mainAndroidManifestPath = path.join(rootPath, 'android/app/src/main/AndroidManifest.xml');
    const mainAndroidManifest = fs.readFileSync(mainAndroidManifestPath);
    if (mainAndroidManifest) {
      const mainAndroidManifestDocument = parser.parseFromString(mainAndroidManifest.toString());
      const packageName = mainAndroidManifestDocument.documentElement.getAttribute('package');
      const applicationEl = mainAndroidManifestDocument.documentElement.getElementsByTagName('application')?.[0];

      let applicationName;

      if (packageName && applicationEl) {
        if (typeof packageName === 'string' && packageName !== '') {
          const name = applicationEl.getAttribute('android:name');
          if (typeof name === 'string' && name.startsWith('.')) {
            applicationName = packageName + name;
          } else if (typeof name === 'string') {
            applicationName = name;
          }
        }
      } else if (applicationEl) {
        const name = applicationEl.getAttribute('android:name');
        if (typeof name === 'string' && !name.startsWith('.')) {
          applicationName = name;
        }
      }

      // if (applicationName === defaultApplicationName) {
      //   applicationEl.removeAttribute('android:name');
      //   fs.writeFileSync(mainAndroidManifestPath, serializer.serializeToString(mainAndroidManifestDocument));
      // } else {
      //   try {
      //     const applicationFile = path.join(
      //       rootPath,
      //       `android/app/src/main/java/${applicationName.replace(/\./g, '/')}`
      //     );
      //     const application = fs.readFileSync(applicationFile);
      //     const appContent = application.toString();
      //     let has = 0;
      //     if (appContent.indexOf('RuntimeHelper.initRuntime(this)') > -1) {
      //       has++;
      //     }

      //     if (appContent.indexOf('.runScript(') > -1) {
      //       has++;
      //     }

      //     if (appContent.indexOf('Application getInstance()') > -1) {
      //       has++;
      //     }

      //     if (has === 3) {
      //       console.log(
      //         'To finish uninstalling \n Please use remove the following as a guide to clean up your custom Application Class\n' +
      //           removalExampleApplicationContent
      //       );
      //     }
      //   } catch (err) {
      //     console.log('NativeScript Android uninstall error:', err);
      //   }
      // }
    }
    resolve();
  });
}

(async () => {
  if (argv.action === 'install') {
    await installAndroid()
  } else {
    await uninstallAndroid()
  }
})()