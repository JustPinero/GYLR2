import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../types';
import { categoryKeywords } from '../constants/keywords';

// Storage key for category mappings
const MAPPINGS_STORAGE_KEY = '@gylr/category_mappings';

// Common words to filter out when extracting patterns
const COMMON_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
  'used', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
  'us', 'them', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why',
  'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
  'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  're', 'meeting', 'call', 'session', 'event', 'appointment',
]);

export interface CategoryMapping {
  pattern: string;
  category: Category;
  createdAt: string;
}

export interface CategorizationResult {
  category: Category;
  source: 'user_mapping' | 'keyword' | 'default';
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Load category mappings from AsyncStorage
 */
export async function loadCategoryMappings(): Promise<CategoryMapping[]> {
  try {
    const stored = await AsyncStorage.getItem(MAPPINGS_STORAGE_KEY);
    if (!stored) return [];

    const data = JSON.parse(stored) as { mappings: CategoryMapping[] };
    return data.mappings ?? [];
  } catch (error) {
    console.error('Failed to load category mappings:', error);
    return [];
  }
}

/**
 * Save a new category mapping to AsyncStorage
 */
export async function saveCategoryMapping(
  pattern: string,
  category: Category
): Promise<CategoryMapping> {
  const mappings = await loadCategoryMappings();

  // Remove existing mapping for this pattern if it exists
  const filteredMappings = mappings.filter(
    (m) => m.pattern.toLowerCase() !== pattern.toLowerCase()
  );

  const newMapping: CategoryMapping = {
    pattern: pattern.toLowerCase(),
    category,
    createdAt: new Date().toISOString(),
  };

  filteredMappings.push(newMapping);

  await AsyncStorage.setItem(
    MAPPINGS_STORAGE_KEY,
    JSON.stringify({ mappings: filteredMappings })
  );

  return newMapping;
}

/**
 * Remove a category mapping from AsyncStorage
 */
export async function removeCategoryMapping(pattern: string): Promise<void> {
  const mappings = await loadCategoryMappings();
  const filteredMappings = mappings.filter(
    (m) => m.pattern.toLowerCase() !== pattern.toLowerCase()
  );

  await AsyncStorage.setItem(
    MAPPINGS_STORAGE_KEY,
    JSON.stringify({ mappings: filteredMappings })
  );
}

/**
 * Clear all category mappings
 */
export async function clearAllMappings(): Promise<void> {
  await AsyncStorage.removeItem(MAPPINGS_STORAGE_KEY);
}

/**
 * Extract a meaningful pattern from an event title
 * Removes common words and returns significant terms
 */
export function extractPattern(title: string): string {
  const words = title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter((word) => word.length > 2 && !COMMON_WORDS.has(word));

  // Return up to 3 significant words joined
  return words.slice(0, 3).join(' ');
}

/**
 * Check if a title matches a pattern
 */
export function titleMatchesPattern(title: string, pattern: string): boolean {
  const lowerTitle = title.toLowerCase();
  const lowerPattern = pattern.toLowerCase();

  // Check if all words in pattern exist in title
  const patternWords = lowerPattern.split(/\s+/);
  return patternWords.every((word) => lowerTitle.includes(word));
}

/**
 * Suggest a category for an event based on user mappings and keywords
 */
export function suggestCategory(
  eventTitle: string,
  userMappings: CategoryMapping[]
): CategorizationResult {
  const lowerTitle = eventTitle.toLowerCase();

  // 1. Check user mappings first (highest priority)
  for (const mapping of userMappings) {
    if (titleMatchesPattern(lowerTitle, mapping.pattern)) {
      return {
        category: mapping.category,
        source: 'user_mapping',
        confidence: 'high',
      };
    }
  }

  // 2. Check default keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        return {
          category: category as Category,
          source: 'keyword',
          confidence: 'medium',
        };
      }
    }
  }

  // 3. No match found
  return {
    category: Category.UNCATEGORIZED,
    source: 'default',
    confidence: 'low',
  };
}

/**
 * Get category display info (icon, label, color)
 */
export function getCategoryInfo(category: Category): {
  icon: string;
  label: string;
  color: string;
} {
  const info: Record<Category, { icon: string; label: string; color: string }> = {
    [Category.WORK]: { icon: '💼', label: 'Work', color: '#E85D75' },
    [Category.PLAY]: { icon: '🎮', label: 'Play', color: '#50C878' },
    [Category.HEALTH]: { icon: '💪', label: 'Health', color: '#4ECDC4' },
    [Category.ROMANCE]: { icon: '💕', label: 'Romance', color: '#FF6B9D' },
    [Category.STUDY]: { icon: '📚', label: 'Study', color: '#9B59B6' },
    [Category.UNCATEGORIZED]: { icon: '❓', label: 'Uncategorized', color: '#6B6B6B' },
  };

  return info[category];
}

/**
 * Get all categories (excluding uncategorized) for picker
 */
export function getSelectableCategories(): Category[] {
  return [
    Category.WORK,
    Category.PLAY,
    Category.HEALTH,
    Category.ROMANCE,
    Category.STUDY,
  ];
}
