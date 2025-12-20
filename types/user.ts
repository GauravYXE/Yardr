// User-related type definitions

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  garage_sale_id: string;
  created_at: string;
}

export interface UserReminder {
  id: string;
  user_id: string;
  garage_sale_id: string;
  reminder_time: string;
  notification_sent: boolean;
  expo_push_token: string | null;
  created_at: string;
}

export interface UserSaleView {
  id: string;
  user_id: string;
  garage_sale_id: string;
  viewed_at: string;
}

export interface UserWishlistItem {
  id: string;
  user_id: string;
  item_name: string;
  description: string | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WishlistMatch {
  id: string;
  user_id: string;
  wishlist_item_id: string;
  garage_sale_id: string;
  matched_at: string;
  notification_sent: boolean;
  notification_sent_at: string | null;
  match_confidence: 'high' | 'medium' | 'verified';
  match_reason: string | null;
}

export interface WishlistMatchWithDetails extends WishlistMatch {
  garage_sale: any; // Will be properly typed with GarageSale
  wishlist_item: UserWishlistItem;
}
