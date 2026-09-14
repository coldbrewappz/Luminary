import { Image, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

const LOGO = require('../../assets/images/icon.png');

/**
 * The image that gets shared — NOT shown in the app. The share flow renders this
 * off-screen, snapshots it to a PNG (react-native-view-shot), and hands the file
 * to the native share sheet. See context/share.tsx.
 *
 * Design 2 (approved): logo on top, generous space, then the quote and author,
 * centered on the app's linen ground. Fixed square so every share looks the same;
 * long quotes shrink to fit rather than overflowing.
 */
export function ShareCard({ text, author }: { text: string; author: string }) {
  return (
    <View style={styles.card}>
      <Image source={LOGO} style={styles.logo} />
      <Text
        style={styles.quote}
        adjustsFontSizeToFit
        numberOfLines={8}
        minimumFontScale={0.65}>
        {text}
      </Text>
      <Text style={styles.author}>— {author}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 360,
    height: 360,
    backgroundColor: Colors.linen,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 38,
  },
  logo: { width: 62, height: 62, borderRadius: 13 },
  quote: {
    fontFamily: Fonts.serif,
    fontStyle: 'italic',
    fontSize: 23,
    lineHeight: 32,
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: 26,
  },
  author: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: Colors.textMid,
    textAlign: 'center',
    marginTop: 16,
  },
});
