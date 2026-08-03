import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';

import { CARD_FILLS, QuoteCard } from '@/components/quote-card';
import { Label, Screen } from '@/components/screen';
import { ScrollTopButton } from '@/components/scroll-top-button';
import { API_BASE_URL, CATEGORIES, type Quote } from '@/config/api';
import { Colors, Spacing, Type } from '@/constants/theme';

/**
 * The quote feed. Ports QuoteFeed.jsx + QuoteCard.jsx. Reached by drilling into
 * a category tile, or via "wander through every quote" (no category param).
 *
 * Uses FlatList — React Native's built-in virtualized list, which only renders
 * the rows on screen. Matters here because the monthly agent keeps this list
 * growing. The Love button is a no-op until Phase 15 ports LovesContext.
 */
export default function FeedScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const listRef = useRef<FlatList<Quote>>(null);

  const categoryData = CATEGORIES.find((c) => c.id === category);
  const heading = categoryData ? `${categoryData.emoji} ${categoryData.name}` : 'All quotes';

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const url = category
          ? `${API_BASE_URL}/api/quotes/category/${category}`
          : `${API_BASE_URL}/api/quotes`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        setQuotes((await res.json()) as Quote[]);
      } catch (err) {
        console.warn('Could not load feed:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [category]);

  // Show the back-to-top button once the mom has scrolled a screen or so down.
  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setShowTop(e.nativeEvent.contentOffset.y > 400);
  }, []);

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  return (
    <Screen
      scroll={false}
      onBack={() => router.back()}
      backLabel="Quotes"
      action={<Label>{heading}</Label>}
      contentStyle={styles.noPad}>
      {loading ? (
        <View style={styles.state}>
          <Text style={[Type.quoteSmall, styles.stateText]}>Gathering your light…</Text>
        </View>
      ) : error ? (
        <View style={styles.state}>
          <Text style={[Type.quoteSmall, styles.stateText]}>Something went wrong.</Text>
        </View>
      ) : quotes.length === 0 ? (
        <View style={styles.state}>
          <Text style={[Type.quoteSmall, styles.stateText]}>No quotes here yet.</Text>
        </View>
      ) : (
        <>
          <FlatList
            ref={listRef}
            data={quotes}
            keyExtractor={(item) => String(item.id)}
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            renderItem={({ item, index }) => (
              <QuoteCard
                text={item.text}
                author={item.author}
                category={item.category}
                fill={CARD_FILLS[index % CARD_FILLS.length]}
                onToggleLove={() => {}}
              />
            )}
          />
          <ScrollTopButton visible={showTop} onPress={scrollToTop} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  noPad: { paddingBottom: 0 },
  listContent: { paddingHorizontal: Spacing.gutter, paddingTop: Spacing.lg, paddingBottom: Spacing.xxl },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.linenDark, marginVertical: 26 },
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  stateText: { color: Colors.textLight, textAlign: 'center' },
});
