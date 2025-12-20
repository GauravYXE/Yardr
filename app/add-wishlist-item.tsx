import { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { wishlistService } from '@/services/wishlistService';
import { GarageSaleCategory } from '@/types/garageSale';

const CATEGORIES: GarageSaleCategory[] = [
  'furniture',
  'clothing',
  'electronics',
  'toys',
  'books',
  'tools',
  'kitchen',
  'sports',
  'other',
];

export default function AddWishlistItemScreen() {
  const { user } = useAuth();
  const [itemDescription, setItemDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be signed in to add wishlist items');
      return;
    }

    if (!itemDescription.trim()) {
      Alert.alert('Error', 'Please describe what you\'re looking for');
      return;
    }

    setLoading(true);
    try {
      // Use the first line or first 50 chars as the item name
      const lines = itemDescription.trim().split('\n');
      const itemName = lines[0].substring(0, 50);
      const fullDescription = itemDescription.trim();

      await wishlistService.addWishlistItem(
        user.id,
        itemName,
        fullDescription,
        undefined // No category selection
      );

      Alert.alert(
        'Success',
        "Wishlist item added! We'll notify you when we find matches.",
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error('Error adding wishlist item:', error);
      Alert.alert('Error', error.message || 'Failed to add wishlist item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="subtitle" style={styles.title}>
          What are you looking for?
        </ThemedText>

        <ThemedText style={styles.helperText}>
          Describe the item you want to find at garage sales. Be as specific as you'd like!
        </ThemedText>

        <View style={styles.formGroup}>
          <TextInput
            style={styles.textArea}
            placeholder="e.g., Wine glass set, preferably crystal or lead-free glass, set of 4 or more"
            value={itemDescription}
            onChangeText={setItemDescription}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            placeholderTextColor="#999"
            autoFocus
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <ThemedText style={styles.submitButtonText}>
            {loading ? 'Adding...' : 'Add to Wishlist'}
          </ThemedText>
        </TouchableOpacity>
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
  title: {
    marginBottom: 12,
  },
  helperText: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 24,
    color: '#666',
  },
  formGroup: {
    marginBottom: 24,
  },
  textArea: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 200,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#0066FF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
