export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const categories = [
  { id: 'motherhood',  name: 'Motherhood',       emoji: '🌸', theme: 'lavender' },
  { id: 'healing',     name: 'Healing',           emoji: '🌿', theme: 'blush'    },
  { id: 'hope',        name: 'Hope',              emoji: '☀️', theme: 'lavender' },
  { id: 'strength',    name: 'Strength',          emoji: '💪', theme: 'blush'    },
  { id: 'not-alone',   name: 'You Are Not Alone', emoji: '🤍', theme: 'lavender' },
  { id: 'humor',       name: 'A Little Humor',    emoji: '😄', theme: 'blush'    },
]

export const quotes = [
  { id: 1,  text: "You are doing better than you think you are.",                                                                                    author: "Unknown",          category: "strength"   },
  { id: 2,  text: "Almost everything will work again if you unplug it for a few minutes — including you.",                                           author: "Anne Lamott",      category: "healing"    },
  { id: 3,  text: "Healing is not linear. Be gentle with yourself.",                                                                                 author: "Unknown",          category: "healing"    },
  { id: 4,  text: "You cannot pour from an empty cup. Take care of yourself first.",                                                                 author: "Unknown",          category: "healing"    },
  { id: 5,  text: "The wound is the place where the light enters you.",                                                                              author: "Rumi",             category: "healing"    },
  { id: 6,  text: "Breathe. You are exactly where you need to be.",                                                                                  author: "Unknown",          category: "not-alone"  },
  { id: 7,  text: "One day at a time. One hour at a time. One moment at a time.",                                                                    author: "Unknown",          category: "hope"       },
  { id: 8,  text: "You were given this life because you are strong enough to live it.",                                                              author: "Unknown",          category: "strength"   },
  { id: 9,  text: "Making the decision to have a child is to decide forever to have your heart go walking around outside your body.",                author: "Elizabeth Stone",  category: "motherhood" },
  { id: 10, text: "In giving birth to our babies, we may find that we give birth to new possibilities within ourselves.",                            author: "Myla Kabat-Zinn",  category: "motherhood" },
  { id: 11, text: "There is hope, even when your brain tells you there isn't.",                                                                      author: "John Green",       category: "hope"       },
  { id: 12, text: "Rest is not idleness. It is the key to a full life.",                                                                             author: "Unknown",          category: "healing"    },
  { id: 13, text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, or overwhelmed.",                             author: "Lori Deschene",    category: "not-alone"  },
  { id: 14, text: "A mother's love is patient and forever.",                                                                                         author: "Unknown",          category: "motherhood" },
  { id: 15, text: "Before I had kids I went to sleep whenever I wanted. Now I only do it when my toddler lets me.",                                  author: "Unknown",          category: "humor"      },
  { id: 16, text: "Motherhood: the days are long but the years are short.",                                                                          author: "Unknown",          category: "motherhood" },
  { id: 17, text: "You are everything they need.",                                                                                                   author: "Unknown",          category: "not-alone"  },
  { id: 18, text: "My alone time is sometimes a trip to the grocery store. That counts, right?",                                                     author: "Unknown",          category: "humor"      },
  { id: 19, text: "Even the darkest night will end and the sun will rise.",                                                                          author: "Victor Hugo",      category: "hope"       },
  { id: 20, text: "She believed she could, so she did.",                                                                                             author: "R.S. Grey",        category: "strength"   },
  { id: 21, text: "You are not alone in this. Not even close.",                                                                                      author: "Unknown",          category: "not-alone"  },
  { id: 22, text: "Motherhood is the greatest thing and the hardest thing.",                                                                         author: "Ricki Lake",       category: "motherhood" },
  { id: 23, text: "Surviving is enough. Thriving can wait.",                                                                                         author: "Unknown",          category: "healing"    },
  { id: 24, text: "I love my kids. I also love when they're asleep.",                                                                                author: "Unknown",          category: "humor"      },
]

export const QUOTE_CAP = 20

export function getDailyQuote() {
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)
  return quotes[dayOfYear % quotes.length]
}