/**
 * @format
 */

import { AppRegistry, TextInput, Text } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

if (Text.defaultProps == null) Text.defaultProps = {};
if (TextInput.defaultProps == null) TextInput.defaultProps = {};

Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => App);
