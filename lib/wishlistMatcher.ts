import { UserWishlistItem } from '@/types/user';
import { analyzeWishlistMatch } from './claude';

interface MatchResult {
  isMatch: boolean;
  confidence: 'high' | 'medium' | 'verified';
  reason: string;
}

/**
 * Hybrid matching algorithm:
 * 1. Keyword matching (fast, cheap)
 * 2. Category matching
 * 3. AI semantic matching (for uncertain cases)
 */
export async function matchWishlistAgainstSale(
  wishlistItem: UserWishlistItem,
  garageSale: any
): Promise<MatchResult> {
  const saleText = `${garageSale.title} ${garageSale.description}`.toLowerCase();
  const wishlistText = `${wishlistItem.item_name} ${wishlistItem.description || ''}`.toLowerCase();

  // Extract keywords from wishlist item (split by space, filter common words)
  const keywords = extractKeywords(wishlistText);

  // Phase 1: Direct keyword matching
  const exactMatches = keywords.filter(keyword =>
    saleText.includes(keyword) && keyword.length > 2
  );

  if (exactMatches.length >= 2 || exactMatches.some(k => k.length > 6)) {
    return {
      isMatch: true,
      confidence: 'high',
      reason: `Keyword match: ${exactMatches.join(', ')}`,
    };
  }

  // Phase 2: Category matching
  if (wishlistItem.category && garageSale.categories?.includes(wishlistItem.category)) {
    // Partial keyword match + category match = medium confidence
    if (exactMatches.length >= 1) {
      // Use AI to verify semantic similarity
      try {
        const aiMatch = await analyzeWishlistMatch(wishlistItem, garageSale);
        if (aiMatch.isMatch) {
          return {
            isMatch: true,
            confidence: 'verified',
            reason: `AI verified: ${aiMatch.reason}`,
          };
        }
      } catch (error) {
        console.error('AI matching error:', error);
        // Fall back to category match
        return {
          isMatch: true,
          confidence: 'medium',
          reason: `Category match: ${wishlistItem.category}${exactMatches.length > 0 ? `, partial keyword: ${exactMatches[0]}` : ''}`,
        };
      }
    }
  }

  // Phase 3: Single keyword match - verify with AI
  if (exactMatches.length === 1) {
    try {
      const aiMatch = await analyzeWishlistMatch(wishlistItem, garageSale);
      if (aiMatch.isMatch) {
        return {
          isMatch: true,
          confidence: 'verified',
          reason: `AI verified: ${aiMatch.reason}`,
        };
      }
    } catch (error) {
      console.error('AI matching error:', error);
    }
  }

  return {
    isMatch: false,
    confidence: 'medium',
    reason: 'No match',
  };
}

function extractKeywords(text: string): string[] {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'set', 'item', 'items', 'sale', 'garage', 'various', 'misc', 'etc',
  ]);

  return text
    .split(/\s+/)
    .map(word => word.replace(/[^a-z0-9]/g, ''))
    .filter(word => word.length > 2 && !commonWords.has(word));
}
