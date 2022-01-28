/**
 * @format
 */

 import {AppRegistry} from 'react-native';
 import App from './App';
 import {name as appName} from './app.json';
 import React from 'react';
 import { Text}  from'react-native';
 import { buildFor, buildForFoleja,buildForBebbo } from "@assets/translations/appOfflineData/apiConstants";
 // import 'intl';
 // import 'intl/locale-data/jsonp/en';
 import 'intl';
//  import 'intl/locale-data/jsonp/sq-AL';
//  import 'intl/locale-data/jsonp/be-BY';
//  import 'intl/locale-data/jsonp/ru-BY';
//  import 'intl/locale-data/jsonp/el-GR';
//  import 'intl/locale-data/jsonp/sq-XK';
//  import 'intl/locale-data/jsonp/sr-Latn-XK';
//  import 'intl/locale-data/jsonp/ky-KG';
//  import 'intl/locale-data/jsonp/ru-KG';
//  import 'intl/locale-data/jsonp/mk-MK';
//  import 'intl/locale-data/jsonp/sq-MK';
//  import 'intl/locale-data/jsonp/ar';
//  import 'intl/locale-data/jsonp/fa-AF';
//  import 'intl/locale-data/jsonp/sr-Latn-RS';
//  import 'intl/locale-data/jsonp/uz-Latn-UZ';
//  import 'intl/locale-data/jsonp/ru-RU';
//  import 'intl/locale-data/jsonp/en-US';
//  import '@assets/customLocale/bg-BG';
//  import '@assets/customLocale/tg-TJ';
//  import '@assets/customLocale/me-cnr';
 // import 'intl/locale-data/jsonp/be';
 // import 'intl/locale-data/jsonp/be';
 //sq,ru

 console.log("in indexjs --",buildFor);
 if(buildFor == buildForFoleja) {
    require('intl/locale-data/jsonp/sq-XK')
    require('intl/locale-data/jsonp/sr-Latn-XK')
 }else {
    require('intl/locale-data/jsonp/sq-AL')
    require('intl/locale-data/jsonp/be-BY')
    require('intl/locale-data/jsonp/ru-BY')
    require('intl/locale-data/jsonp/el-GR')
    require('intl/locale-data/jsonp/ky-KG')
    require('intl/locale-data/jsonp/ru-KG')
    require('intl/locale-data/jsonp/mk-MK')
    require('intl/locale-data/jsonp/sq-MK')
    require('intl/locale-data/jsonp/ar')
    require('intl/locale-data/jsonp/fa-AF')
    require('intl/locale-data/jsonp/sr-Latn-RS')
    require('intl/locale-data/jsonp/uz-Latn-UZ')
    require('intl/locale-data/jsonp/ru-RU')
    require('intl/locale-data/jsonp/en-US')
    require('@assets/customLocale/bg-BG')
    require('@assets/customLocale/tg-TJ')
    require('@assets/customLocale/me-cnr')
 }
 AppRegistry.registerComponent(appName, () => () => <App />);
 if (Text.defaultProps == null) {
     Text.defaultProps = {};
     Text.defaultProps.allowFontScaling = false;
 }
 