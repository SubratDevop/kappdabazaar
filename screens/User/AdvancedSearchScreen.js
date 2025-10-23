import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import {
  Button,
  Chip,
  ActivityIndicator,
  Searchbar,
  RadioButton,
  Slider,
  Divider,
} from 'react-native-paper';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import FabricCard from '../../components/FabricCard';
import EmptyState from '../../components/EmptyState';

const AdvancedSearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    categories: [],
    materials: [],
    colors: [],
    patterns: [],
    brands: [],
    ratings: 0,
    availability: 'all', // all, in_stock, out_of_stock
    sortBy: 'relevance', // relevance, price_low, price_high, rating, newest
    location: '',
    minOrderQuantity: '',
    maxOrderQuantity: '',
    gstIncluded: false,
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  const filterOptions = {
    categories: [
      'Cotton Fabrics',
      'Silk Fabrics',
      'Polyester Fabrics',
      'Linen Fabrics',
      'Wool Fabrics',
      'Denim',
      'Chiffon',
      'Georgette',
      'Crepe',
      'Satin',
    ],
    materials: [
      'Pure Cotton',
      'Cotton Blend',
      'Pure Silk',
      'Silk Blend',
      '100% Polyester',
      'Poly Cotton',
      'Linen Cotton',
      'Wool Blend',
      'Viscose',
      'Rayon',
    ],
    colors: [
      'Red',
      'Blue',
      'Green',
      'Yellow',
      'Black',
      'White',
      'Pink',
      'Purple',
      'Orange',
      'Brown',
      'Grey',
      'Multicolor',
    ],
    patterns: [
      'Solid',
      'Printed',
      'Striped',
      'Checked',
      'Floral',
      'Geometric',
      'Abstract',
      'Embroidered',
      'Woven',
      'Digital Print',
    ],
    brands: [
      'Reliance Textiles',
      'Arvind Mills',
      'Welspun',
      'Vardhman',
      'Bombay Dyeing',
      'Raymond',
      'Grasim',
      'Donear',
      'Siyaram',
      'OCM',
    ],
    sortOptions: [
      { value: 'relevance', label: 'Relevance' },
      { value: 'price_low', label: 'Price: Low to High' },
      { value: 'price_high', label: 'Price: High to Low' },
      { value: 'rating', label: 'Customer Rating' },
      { value: 'newest', label: 'Newest First' },
      { value: 'popularity', label: 'Most Popular' },
    ],
  };

  useEffect(() => {
    if (searchQuery.length > 2 || Object.keys(appliedFilters).length > 0) {
      searchProducts(true);
    }
  }, [searchQuery, appliedFilters]);

  const searchProducts = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      
      const searchParams = {
        query: searchQuery,
        page: currentPage,
        limit: 20,
        ...appliedFilters,
      };

      // Simulate API call - replace with actual API
      const response = await fetch('/api/products/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      });
      
      const data = await response.json();
      
      if (reset) {
        setProducts(data.products);
        setPage(2);
      } else {
        setProducts(prev => [...prev, ...data.products]);
        setPage(prev => prev + 1);
      }
      
      setTotalResults(data.total);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
    setShowFilters(false);
  };

  const clearFilters = () => {
    const defaultFilters = {
      priceRange: [0, 10000],
      categories: [],
      materials: [],
      colors: [],
      patterns: [],
      brands: [],
      ratings: 0,
      availability: 'all',
      sortBy: 'relevance',
      location: '',
      minOrderQuantity: '',
      maxOrderQuantity: '',
      gstIncluded: false,
    };
    setFilters(defaultFilters);
    setAppliedFilters({});
  };

  const toggleArrayFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (appliedFilters.categories?.length) count++;
    if (appliedFilters.materials?.length) count++;
    if (appliedFilters.colors?.length) count++;
    if (appliedFilters.patterns?.length) count++;
    if (appliedFilters.brands?.length) count++;
    if (appliedFilters.ratings > 0) count++;
    if (appliedFilters.availability !== 'all') count++;
    if (appliedFilters.priceRange?.[0] > 0 || appliedFilters.priceRange?.[1] < 10000) count++;
    return count;
  };

  const renderFilterSection = (title, filterType, options) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.filterOptions}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterChip,
              filters[filterType].includes(option) && styles.activeFilterChip,
            ]}
            onPress={() => toggleArrayFilter(filterType, option)}
          >
            <Text
              style={[
                styles.filterChipText,
                filters[filterType].includes(option) && styles.activeFilterChipText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPriceFilter = () => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>Price Range</Text>
      <View style={styles.priceRange}>
        <Text style={styles.priceLabel}>₹{filters.priceRange[0]}</Text>
        <Text style={styles.priceLabel}>₹{filters.priceRange[1]}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10000}
        value={filters.priceRange[1]}
        onValueChange={(value) =>
          setFilters(prev => ({
            ...prev,
            priceRange: [prev.priceRange[0], Math.round(value)],
          }))
        }
        minimumTrackTintColor="#132f56"
        maximumTrackTintColor="#E5E7EB"
        thumbStyle={{ backgroundColor: '#132f56' }}
      />
    </View>
  );

  const renderRatingFilter = () => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>Minimum Rating</Text>
      <View style={styles.ratingOptions}>
        {[1, 2, 3, 4, 5].map(rating => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.ratingOption,
              filters.ratings === rating && styles.activeRatingOption,
            ]}
            onPress={() => setFilters(prev => ({ ...prev, ratings: rating }))}
          >
            <Text style={styles.ratingText}>{rating}⭐ & above</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSortOptions = () => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>Sort By</Text>
      <RadioButton.Group
        onValueChange={value => setFilters(prev => ({ ...prev, sortBy: value }))}
        value={filters.sortBy}
      >
        {filterOptions.sortOptions.map(option => (
          <View key={option.value} style={styles.radioOption}>
            <RadioButton value={option.value} />
            <Text style={styles.radioLabel}>{option.label}</Text>
          </View>
        ))}
      </RadioButton.Group>
    </View>
  );

  const renderFiltersModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Ionicons name="close" size={24} color="#132f56" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filters</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {renderPriceFilter()}
          <Divider style={styles.divider} />
          {renderFilterSection('Categories', 'categories', filterOptions.categories)}
          <Divider style={styles.divider} />
          {renderFilterSection('Materials', 'materials', filterOptions.materials)}
          <Divider style={styles.divider} />
          {renderFilterSection('Colors', 'colors', filterOptions.colors)}
          <Divider style={styles.divider} />
          {renderFilterSection('Patterns', 'patterns', filterOptions.patterns)}
          <Divider style={styles.divider} />
          {renderFilterSection('Brands', 'brands', filterOptions.brands)}
          <Divider style={styles.divider} />
          {renderRatingFilter()}
          <Divider style={styles.divider} />
          {renderSortOptions()}
        </ScrollView>

        <View style={styles.modalFooter}>
          <Button
            mode="outlined"
            onPress={() => setShowFilters(false)}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={applyFilters}
            style={styles.applyButton}
          >
            Apply Filters
          </Button>
        </View>
      </View>
    </Modal>
  );

  const renderActiveFilters = () => {
    const activeFilters = [];
    
    if (appliedFilters.categories?.length) {
      activeFilters.push(...appliedFilters.categories.map(cat => ({ type: 'category', value: cat })));
    }
    if (appliedFilters.materials?.length) {
      activeFilters.push(...appliedFilters.materials.map(mat => ({ type: 'material', value: mat })));
    }
    if (appliedFilters.colors?.length) {
      activeFilters.push(...appliedFilters.colors.map(color => ({ type: 'color', value: color })));
    }
    if (appliedFilters.ratings > 0) {
      activeFilters.push({ type: 'rating', value: `${appliedFilters.ratings}⭐ & above` });
    }

    if (activeFilters.length === 0) return null;

    return (
      <View style={styles.activeFiltersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {activeFilters.map((filter, index) => (
            <Chip
              key={index}
              mode="outlined"
              onClose={() => {
                // Remove specific filter
                if (filter.type === 'category') {
                  setAppliedFilters(prev => ({
                    ...prev,
                    categories: prev.categories?.filter(cat => cat !== filter.value) || [],
                  }));
                }
                // Add similar logic for other filter types
              }}
              style={styles.activeFilterChip}
            >
              {filter.value}
            </Chip>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderProduct = ({ item }) => (
    <FabricCard
      product={item}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      style={styles.productCard}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#132f56" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Products</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search fabrics, materials, brands..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#132f56"
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <MaterialIcons name="tune" size={24} color="#132f56" />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {renderActiveFilters()}

      {totalResults > 0 && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {totalResults} results found
          </Text>
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            style={styles.sortButton}
          >
            <MaterialIcons name="sort" size={20} color="#132f56" />
            <Text style={styles.sortText}>Sort</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#132f56" />
          <Text style={styles.loadingText}>Searching products...</Text>
        </View>
      ) : products.length === 0 ? (
        <EmptyState
          type="search"
          title="No products found"
          subtitle="Try adjusting your search or filters"
          actionText="Clear Filters"
          onActionPress={clearFilters}
        />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          contentContainerStyle={styles.productsList}
          onEndReached={() => {
            if (hasMore && !loading) {
              searchProducts(false);
            }
          }}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            loading && products.length > 0 ? (
              <ActivityIndicator size="small" color="#132f56" style={styles.loadMore} />
            ) : null
          }
        />
      )}

      {renderFiltersModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#132f56',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    elevation: 0,
    backgroundColor: '#F8FAFC',
  },
  searchInput: {
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFiltersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  activeFilterChip: {
    marginRight: 8,
    backgroundColor: '#F0F9FF',
    borderColor: '#132f56',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    color: '#132f56',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  productsList: {
    padding: 16,
  },
  productCard: {
    flex: 1,
    margin: 4,
  },
  loadMore: {
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#132f56',
  },
  clearText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#132f56',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterChip: {
    backgroundColor: '#132f56',
    borderColor: '#132f56',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#132f56',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  ratingOptions: {
    gap: 8,
  },
  ratingOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeRatingOption: {
    backgroundColor: '#132f56',
    borderColor: '#132f56',
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioLabel: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  divider: {
    marginVertical: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#132f56',
  },
});

export default AdvancedSearchScreen; 