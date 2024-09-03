
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"done.invoke.auth.authorized:invocation[0]": { type: "done.invoke.auth.authorized:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.auth.clearKeyChain:invocation[0]": { type: "done.invoke.auth.clearKeyChain:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.auth.introSlider:invocation[0]": { type: "done.invoke.auth.introSlider:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "clearKeys": "done.invoke.auth.clearKeyChain:invocation[0]";
"downloadFaceSdkModel": "done.invoke.auth.authorized:invocation[0]";
"generatePasscodeSalt": "done.invoke.auth.introSlider:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "requestStoredContext": "xstate.init";
"setBiometrics": "SETUP_BIOMETRICS";
"setContext": "STORE_RESPONSE";
"setInitialDownloadDone": "INITIAL_DOWNLOAD_DONE";
"setIsToggleFromSettings": "CHANGE_METHOD";
"setLanguage": "SETUP_BIOMETRICS" | "SETUP_PASSCODE";
"setOnboardingDone": "ONBOARDING_DONE";
"setPasscode": "SETUP_PASSCODE";
"setPasscodeSalt": "done.invoke.auth.introSlider:invocation[0]";
"setTourGuide": "SET_TOUR_GUIDE";
"storeContext": "INITIAL_DOWNLOAD_DONE" | "ONBOARDING_DONE" | "SETUP_BIOMETRICS" | "SETUP_PASSCODE" | "done.invoke.auth.authorized:invocation[0]" | "done.invoke.auth.clearKeyChain:invocation[0]" | "done.invoke.auth.introSlider:invocation[0]";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "hasBiometricSet": "";
"hasData": "STORE_RESPONSE";
"hasLanguageset": "";
"hasPasscodeSet": "";
        };
        eventsCausingServices: {
          "clearKeys": "STORE_RESPONSE";
"downloadFaceSdkModel": "LOGIN" | "SETUP_BIOMETRICS" | "SETUP_PASSCODE";
"generatePasscodeSalt": "SELECT";
        };
        matchesStates: "authorized" | "checkingAuth" | "clearKeyChain" | "init" | "introSlider" | "languagesetup" | "savingDefaults" | "settingUp" | "unauthorized";
        tags: never;
      }
  