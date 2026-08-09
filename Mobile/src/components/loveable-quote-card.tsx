import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { QuoteCard } from '@/components/quote-card';
import { type Quote } from '@/config/api';
import { useLoves } from '@/context/loves';

/**
 * A QuoteCard wired to the loves context: it knows whether the quote is saved,
 * and its heart actually saves/removes. Used on Today and in the feed.
 *
 * It's a component (not a hook) on purpose — a FlatList renders many cards, and
 * hooks can't run inside a render loop, but each component instance can hold its
 * own hook state (here, the per-card `pending` flag).
 */
export function LoveableQuoteCard({
  quote,
  fill,
  large,
}: {
  quote: Quote;
  fill?: string;
  large?: boolean;
}) {
  const { isLoved, toggleLove } = useLoves();
  const [pending, setPending] = useState(false);

  async function onToggle() {
    if (pending) return;
    setPending(true);
    try {
      const result = await toggleLove(quote);
      if (result === 'auth') {
        // Guest tapped the heart — send them to sign in, then they can save.
        router.push('/sign-in');
      } else if (result === 'cap') {
        Alert.alert('Your collection is full', 'Remove a quote to make room for a new one.');
      } else if (result === 'error') {
        Alert.alert('Something went wrong', 'We could not save that quote. Please try again.');
      }
      // 'saved' / 'removed' need no message — the heart fills or empties.
    } finally {
      setPending(false);
    }
  }

  return (
    <QuoteCard
      text={quote.text}
      author={quote.author}
      category={quote.category}
      fill={fill}
      loved={isLoved(quote.id)}
      pending={pending}
      onToggleLove={onToggle}
      large={large}
    />
  );
}
