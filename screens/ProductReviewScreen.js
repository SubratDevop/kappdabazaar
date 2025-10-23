import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Avatar,
  Card,
  Chip,
  FAB
} from 'react-native-paper';
import { API_BASE } from '../constants/exports';
import { useAuthStore } from '../store/useAuthStore';

const ProductReviewScreen = ({ navigation, route }) => {
  const { product } = route.params;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [filterBy, setFilterBy] = useState('all'); // all, 5, 4, 3, 2, 1, photos
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, helpful
  const [reviewStats, setReviewStats] = useState(null);
  const { authInfo, user } = useAuthStore();
  // Write review state
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    photos: [],
    pros: '',
    cons: '',
    wouldRecommend: null,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchReviewStats();
  }, [filterBy, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/product/${product.product_id}/reviews?filter=${filterBy}&sort=${sortBy}`,
        {
          headers: { Authorization: `Bearer ${authInfo?.token}` },
        }
      );
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/product/${product.product_id}/review-stats`,
        {
          headers: { Authorization: `Bearer ${authInfo?.token}` },
        }
      );
      setReviewStats(response.data);
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  const submitReview = async () => {
    if (newReview.rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    if (!newReview.comment.trim()) {
      Alert.alert('Error', 'Please write a review comment');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('productId', product.product_id);
      formData.append('rating', newReview.rating);
      formData.append('title', newReview.title);
      formData.append('comment', newReview.comment);
      formData.append('pros', newReview.pros);
      formData.append('cons', newReview.cons);
      formData.append('wouldRecommend', newReview.wouldRecommend);

      // Add photos
      newReview.photos.forEach((photo, index) => {
        formData.append('photos', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: `review_photo_${index}.jpg`,
        });
      });


      const response = await axios.post(`${API_BASE}/product/${product.product_id}/reviews`, formData, {
        headers: {
          Authorization: `Bearer ${authInfo?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Success', 'Review submitted successfully!');
      setShowWriteReview(false);
      setNewReview({
        rating: 0,
        title: '',
        comment: '',
        photos: [],
        pros: '',
        cons: '',
        wouldRecommend: null, qw

      });
      fetchReviews();
      fetchReviewStats();
    } catch (error) {

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with status ≠ 2xx
          console.error("Status:", error.response.status);
          console.error("Data:", error.response.data);

          Alert.alert('Error', error.response.data.error);

        } else if (error.request) {
          // Request sent, no response
          console.error("No response received:", error.request);
        } else {
          // Something else happened
          console.error("Axios error:", error.message);
        }
      } else {
        console.error('Error submitting review :', error);

        Alert.alert('Error', 'Failed to submit review. Please try again.');
      }




    } finally {
      setSubmitting(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.mediaTypes.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setNewReview(prev => ({
        ...prev,
        photos: [...prev.photos, ...result.assets.slice(0, 5 - prev.photos.length)],
      }));
    }
  };

  const removePhoto = (index) => {
    setNewReview(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const markHelpful = async (reviewId) => {
    try {
      await axios.post(
        `${API_BASE}/reviews/${reviewId}/helpful`,
        {},
        {
          headers: { Authorization: `Bearer ${authInfo?.token}` },
        }
      );
      fetchReviews();
    } catch (error) {
      console.error('Error marking review helpful:', error);
    }
  };

  const reportReview = async (reviewId) => {
    Alert.alert(
      'Report Review',
      'Why are you reporting this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Inappropriate Content', onPress: () => submitReport(reviewId, 'inappropriate') },
        { text: 'Spam', onPress: () => submitReport(reviewId, 'spam') },
        { text: 'Fake Review', onPress: () => submitReport(reviewId, 'fake') },
      ]
    );
  };

  const submitReport = async (reviewId, reason) => {
    try {
      await axios.post(
        `${API_BASE}/reviews/${reviewId}/report`,
        { reason },
        {
          headers: { Authorization: `Bearer ${authInfo?.token}` },
        }
      );
      Alert.alert('Success', 'Review reported successfully');
    } catch (error) {
      console.error('Error reporting review:', error);
    }
  };

  const renderStarRating = (rating, size = 16, interactive = false, onPress = null) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => interactive && onPress && onPress(star)}
            disabled={!interactive}
          >
            <AntDesign
              name={star <= rating ? 'star' : 'staro'}
              size={size}
              color={star <= rating ? '#FFD700' : '#E5E7EB'}
              style={{ marginRight: 2 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReviewStats = () => {
    if (!reviewStats) return null;

    return (
      <Card style={styles.statsCard}>
        <Card.Content>
          <View style={styles.statsHeader}>
            <View style={styles.overallRating}>
              <Text style={styles.ratingNumber}>{parseFloat(reviewStats.averageRating).toFixed(1)}</Text>
              {renderStarRating(Math.round(reviewStats.averageRating), 20)}
              <Text style={styles.totalReviews}>
                Based on {reviewStats.totalReviews} reviews
              </Text>
            </View>
          </View>

          {/* <View style={styles.ratingBreakdown}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviewStats.ratingBreakdown[rating] || 0;
              const percentage = reviewStats.totalReviews > 0 
                ? (count / reviewStats.totalReviews) * 100 
                : 0;
              
              return (
                <TouchableOpacity
                  key={rating}
                  style={styles.ratingRow}
                  onPress={() => setFilterBy(rating.toString())}
                >
                  <Text style={styles.ratingLabel}>{rating}⭐</Text>
                  <ProgressBar
                    progress={percentage / 100}
                    color="#FFD700"
                    style={styles.progressBar}
                  />
                  <Text style={styles.ratingCount}>{count}</Text>
                </TouchableOpacity>
              );
            })}
          </View> */}

          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{30}%</Text>
              <Text style={styles.statLabel}>Would Recommend</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{0}</Text>
              <Text style={styles.statLabel}>Photos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{reviewStats.verifiedPurchases}</Text>
              <Text style={styles.statLabel}>Verified Purchases</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderFilterChips = () => {
    const filters = [
      { key: 'all', label: 'All Reviews' },
      { key: '5', label: '5 Stars' },
      { key: '4', label: '4 Stars' },
      { key: '3', label: '3 Stars' },
      { key: '2', label: '2 Stars' },
      { key: '1', label: '1 Star' },
      { key: 'photos', label: 'With Photos' },
    ];

    return (
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <Chip
              key={filter.key}
              mode={filterBy === filter.key ? 'flat' : 'outlined'}
              selected={filterBy === filter.key}
              onPress={() => setFilterBy(filter.key)}
              style={[
                styles.filterChip,
                filterBy === filter.key && styles.activeFilterChip,
              ]}
              textStyle={[
                styles.filterChipText,
                filterBy === filter.key && styles.activeFilterChipText,
              ]}
            >
              {filter.label}
            </Chip>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderSortOptions = () => {
    const sortOptions = [
      { key: 'newest', label: 'Newest First' },
      { key: 'oldest', label: 'Oldest First' },
      { key: 'helpful', label: 'Most Helpful' },
      { key: 'rating_high', label: 'Highest Rating' },
      { key: 'rating_low', label: 'Lowest Rating' },
    ];

    return (
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortOption,
                sortBy === option.key && styles.activeSortOption,
              ]}
              onPress={() => setSortBy(option.key)}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === option.key && styles.activeSortOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderReview = ({ item: review }) => (
    <Card style={styles.reviewCard}>
      <Card.Content>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewerInfo}>
            <Avatar.Text
              size={40}
              label={review.user.name.charAt(0).toUpperCase()}
              style={styles.avatar}
            />
            <View style={styles.reviewerDetails}>
              <Text style={styles.reviewerName}>{review.user.name}</Text>
              <View style={styles.reviewMeta}>
                {renderStarRating(review.rating, 14)}
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
                {review.verifiedPurchase && (
                  <Chip mode="outlined" compact style={styles.verifiedChip}>
                    Verified Purchase
                  </Chip>
                )}
              </View>
            </View>
          </View>
          {/* <TouchableOpacity onPress={() => reportReview(review.id)}>
            <MaterialIcons name="more-vert" size={20} color="#6B7280" />
          </TouchableOpacity> */}
        </View>

        {review.title && (
          <Text style={styles.reviewTitle}>{review.title}</Text>
        )}

        <Text style={styles.reviewComment}>{review.comment}</Text>

        {review.pros && (
          <View style={styles.prosConsSection}>
            <Text style={styles.prosConsTitle}>👍 Pros:</Text>
            <Text style={styles.prosConsText}>{review.pros}</Text>
          </View>
        )}

        {review.cons && (
          <View style={styles.prosConsSection}>
            <Text style={styles.prosConsTitle}>👎 Cons:</Text>
            <Text style={styles.prosConsText}>{review.cons}</Text>
          </View>
        )}

        {review.wouldRecommend !== null && (
          <View style={styles.recommendSection}>
            <MaterialIcons
              name={review.wouldRecommend ? 'thumb-up' : 'thumb-down'}
              size={16}
              color={review.wouldRecommend ? '#10B981' : '#EF4444'}
            />
            <Text style={styles.recommendText}>
              {review.wouldRecommend ? 'Recommends this product' : 'Does not recommend this product'}
            </Text>
          </View>
        )}

        {review.photos && review.photos.length > 0 && (
          <View style={styles.reviewPhotos}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {review.photos.map((photo, index) => (
                <TouchableOpacity key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photo }} style={styles.reviewPhoto} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.reviewActions}>
          <TouchableOpacity
            style={styles.helpfulButton}
            onPress={() => markHelpful(review.id)}
          >
            <MaterialIcons name="thumb-up" size={16} color="#6B7280" />
            <Text style={styles.helpfulText}>
              Helpful ({review.helpfulCount || 0})
            </Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const renderWriteReviewModal = () => (
    <Modal
      visible={showWriteReview}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowWriteReview(false)}>
            <Ionicons name="close" size={24} color="#132f56" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Write a Review</Text>
          <TouchableOpacity
            onPress={submitReview}
            disabled={submitting || newReview.rating === 0}
          >
            <Text
              style={[
                styles.submitText,
                (submitting || newReview.rating === 0) && styles.submitTextDisabled,
              ]}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>Overall Rating *</Text>
            {renderStarRating(newReview.rating, 32, true, (rating) =>
              setNewReview(prev => ({ ...prev, rating }))
            )}
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Review Title</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Summarize your experience"
              value={newReview.title}
              onChangeText={(text) => setNewReview(prev => ({ ...prev, title: text }))}
              maxLength={100}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Your Review *</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Share your thoughts about this product..."
              value={newReview.comment}
              onChangeText={(text) => setNewReview(prev => ({ ...prev, comment: text }))}
              multiline
              numberOfLines={4}
              maxLength={1000}
            />
            <Text style={styles.characterCount}>
              {newReview.comment.length}/1000 characters
            </Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>What did you like?</Text>
            <TextInput
              style={styles.prosConsInput}
              placeholder="List the positive aspects..."
              value={newReview.pros}
              onChangeText={(text) => setNewReview(prev => ({ ...prev, pros: text }))}
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>What could be improved?</Text>
            <TextInput
              style={styles.prosConsInput}
              placeholder="List areas for improvement..."
              value={newReview.cons}
              onChangeText={(text) => setNewReview(prev => ({ ...prev, cons: text }))}
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Would you recommend this product?</Text>
            <View style={styles.recommendButtons}>
              <TouchableOpacity
                style={[
                  styles.recommendButton,
                  newReview.wouldRecommend === true && styles.recommendButtonActive,
                ]}
                onPress={() => setNewReview(prev => ({ ...prev, wouldRecommend: true }))}
              >
                <MaterialIcons name="thumb-up" size={20} color="#10B981" />
                <Text style={styles.recommendButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.recommendButton,
                  newReview.wouldRecommend === false && styles.recommendButtonActive,
                ]}
                onPress={() => setNewReview(prev => ({ ...prev, wouldRecommend: false }))}
              >
                <MaterialIcons name="thumb-down" size={20} color="#EF4444" />
                <Text style={styles.recommendButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Add Photos (Optional)</Text>
            <View style={styles.photoSection}>
              {newReview.photos.map((photo, index) => (
                <View key={index} style={styles.selectedPhoto}>
                  <Image source={{ uri: photo.uri }} style={styles.selectedPhotoImage} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <MaterialIcons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              {newReview.photos.length < 5 && (
                <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                  <MaterialIcons name="add-a-photo" size={32} color="#6B7280" />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.photoHint}>
              You can add up to 5 photos to help others
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#132f56" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View>
            {renderReviewStats()}
            {renderFilterChips()}
            {renderSortOptions()}
          </View>
        }
        contentContainerStyle={styles.reviewsList}
        refreshing={loading}
        onRefresh={fetchReviews}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <MaterialIcons name="rate-review" size={64} color="#E5E7EB" />
              <Text style={styles.emptyTitle}>No reviews yet</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to review this product
              </Text>
            </View>
          )
        }
      />
      {user.role == "user" && (
        <FAB
          style={styles.fab}
          icon="pencil"
          label="Write Review"
          onPress={() => setShowWriteReview(true)}
          labelStyle={{ color: "white" }}
          color="white"
        />
      )}


      {renderWriteReviewModal()}
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
  reviewsList: {
    padding: 16,
  },
  statsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  statsHeader: {
    marginBottom: 16,
  },
  overallRating: {
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#132f56',
    marginBottom: 8,
  },
  totalReviews: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  ratingBreakdown: {
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    width: 40,
    fontSize: 14,
    color: '#374151',
  },
  progressBar: {
    flex: 1,
    height: 8,
    marginHorizontal: 12,
    backgroundColor: '#F3F4F6',
  },
  ratingCount: {
    width: 30,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#132f56',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: '#fff',
  },
  activeFilterChip: {
    backgroundColor: '#132f56',
  },
  filterChipText: {
    color: '#6B7280',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 12,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  activeSortOption: {
    backgroundColor: '#132f56',
  },
  sortOptionText: {
    fontSize: 12,
    color: '#6B7280',
  },
  activeSortOptionText: {
    color: '#fff',
  },
  reviewCard: {
    marginBottom: 16,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    backgroundColor: '#132f56',
    marginRight: 12,
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  verifiedChip: {
    backgroundColor: '#F0F9FF',
    borderColor: '#10B981',
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  prosConsSection: {
    marginBottom: 8,
  },
  prosConsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  prosConsText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 16,
  },
  recommendSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  reviewPhotos: {
    marginBottom: 12,
  },
  photoContainer: {
    marginRight: 8,
  },
  reviewPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#132f56',
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
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#132f56',
  },
  submitTextDisabled: {
    color: '#9CA3AF',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  inputSection: {
    marginBottom: 24,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  prosConsInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
  },
  recommendButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  recommendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  recommendButtonActive: {
    backgroundColor: '#F0F9FF',
    borderColor: '#132f56',
  },
  recommendButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  photoSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  selectedPhoto: {
    position: 'relative',
  },
  selectedPhotoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  addPhotoText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  photoHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
});

export default ProductReviewScreen; 