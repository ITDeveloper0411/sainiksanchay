import { StyleSheet, Text } from 'react-native';

import LottieView from 'lottie-react-native';
import { Colors } from '../config/Colors';
import { GlobalFonts } from '../config/GlobalFonts';
import { SafeAreaView } from 'react-native-safe-area-context';

const Loader = () => {
  return (
    <SafeAreaView style={styles.loaderContainer}>
      <LottieView
        source={require('../../assets/loader/loading.json')} // Add your animation file
        autoPlay
        loop
        style={styles.loaderAnimation}
      />
      <Text style={[styles.loaderText, GlobalFonts.textRegular]}>
        Loading...
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  loaderAnimation: {
    width: 200,
    height: 100,
  },
  loaderText: {
    fontSize: 16,
    color: Colors.primaryColor,
    fontFamily: GlobalFonts.textBold.fontFamily,
  },
});

export default Loader;
