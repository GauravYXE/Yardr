import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { wishlistService } from '@/services/wishlistService';
import { UserWishlistItem } from '@/types/user';

export default function WishlistsScreen() {
  const { user, isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<UserWishlistItem[]>([]);
  const [matchCounts, setMatchCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlistItems();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadWishlistItems = async () => {
    if (!user) return;

    try {
      const items = await wishlistService.getUserWishlistItems(user.id);
      setWishlistItems(items);

      // Load match counts for each item
      const counts: Record<string, number> = {};
      await Promise.all(
        items.map(async (item) => {
          const count = await wishlistService.getMatchCountForWishlistItem(item.id);
          counts[item.id] = count;
        })
      );
      setMatchCounts(counts);
    } catch (error) {
      console.error('Error loading wishlist items:', error);
      Alert.alert('Error', 'Failed to load wishlist items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadWishlistItems();
  };

  const handleDeleteItem = (item: UserWishlistItem) => {
    Alert.alert(
      'Delete Wishlist Item',
      `Remove "${item.item_name}" from your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await wishlistService.deleteWishlistItem(item.id);
              loadWishlistItems();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete wishlist item');
            }
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.authPrompt}>
          <ThemedText type="subtitle" style={styles.authTitle}>
            Sign In Required
          </ThemedText>
          <ThemedText style={styles.authText}>
            Sign in to create a wishlist and get notified when items you're looking for appear at garage sales!
          </ThemedText>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push('/auth/sign-in')}
          >
            <ThemedText style={styles.signInButtonText}>Sign In</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.headerText}>
            My Wishlist
          </ThemedText>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-wishlist-item')}
          >
            <ThemedText style={styles.addButtonText}>+ Add Item</ThemedText>
          </TouchableOpacity>
        </View>

        {wishlistItems.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyIcon}>🔍</ThemedText>
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              No wishlist items yet
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              Add items you're looking for and we'll notify you when they appear at garage sales!
            </ThemedText>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/add-wishlist-item')}
            >
              <ThemedText style={styles.emptyButtonText}>Add Your First Item</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {wishlistItems.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTitleRow}>
                    <ThemedText type="defaultSemiBold" style={styles.itemName}>
                      {item.item_name}
                    </ThemedText>
                    {matchCounts[item.id] > 0 && (
                      <View style={styles.matchBadge}>
                        <ThemedText style={styles.matchBadgeText}>
                          {matchCounts[item.id]}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  {item.category && (
                    <View style={styles.categoryTag}>
                      <ThemedText style={styles.categoryText}>
                        {item.category}
                      </ThemedText>
                    </View>
                  )}
                </View>

                {item.description && (
                  <ThemedText style={styles.itemDescription}>
                    {item.description}
                  </ThemedText>
                )}

                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.viewMatchesButton}
                    onPress={() => router.push(`/wishlist-matches/${item.id}`)}
                  >
                    <ThemedText style={styles.viewMatchesText}>
                      View Matches {matchCounts[item.id] > 0 ? `(${matchCounts[item.id]})` : ''}
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteItem(item)}
                  >
                    <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  authTitle: {
    marginBottom: 12,
  },
  authText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
    color: '#000',
  },
  signInButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
  },
  addButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
    paddingHorizontal: 32,
    color: '#000',
  },
  emptyButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    marginBottom: 8,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    flex: 1,
    color: '#000',
  },
  matchBadge: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  matchBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryText: {
    fontSize: 12,
    opacity: 0.8,
    color: '#000',
  },
  itemDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
    color: '#000',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewMatchesButton: {
    flex: 1,
    backgroundColor: '#0066FF',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewMatchesText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
