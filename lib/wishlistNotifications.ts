import * as Notifications from 'expo-notifications';
import { supabase } from '@/lib/supabase';
import { remindersService } from '@/services/remindersService';

export async function sendWishlistMatchNotification(
  userId: string,
  matchId: string
): Promise<void> {
  try {
    // Get match details
    const { data: match, error } = await supabase
      .from('wishlist_matches')
      .select(`
        *,
        garage_sales (*),
        user_wishlists (*)
      `)
      .eq('id', matchId)
      .single();

    if (error || !match || match.notification_sent) return;

    // Get user's push token
    const pushToken = await remindersService.getPushToken();
    if (!pushToken) {
      console.warn('No push token available for wishlist notification');
      return;
    }

    // Send notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Found: ${match.user_wishlists.item_name}! 🎉`,
        body: `"${match.garage_sales.title}" may have what you're looking for!`,
        data: {
          type: 'wishlist_match',
          matchId: match.id,
          garageSaleId: match.garage_sale_id,
          wishlistItemId: match.wishlist_item_id,
        },
      },
      trigger: null, // Send immediately
    });

    // Mark as sent
    await supabase
      .from('wishlist_matches')
      .update({
        notification_sent: true,
        notification_sent_at: new Date().toISOString(),
      })
      .eq('id', matchId);
  } catch (error) {
    console.error('Error sending wishlist match notification:', error);
    throw error;
  }
}
