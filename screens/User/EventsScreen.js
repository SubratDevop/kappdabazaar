import { Feather } from '@expo/vector-icons';
import EventCard from '../../components/EventCard';
import { useAuthStore } from '../../store/useAuthStore';
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    ActivityIndicator,
    Button,
    Card,
    Chip,
    Divider,
    FAB,
    Modal,
    Portal,
    Searchbar,
    TextInput,
} from "react-native-paper";
import EmptyState from "../../components/EmptyState";
import { API_BASE } from "../../constants/exports";

const dummyEvents = [
    {
        id: 1,
        name: "Textile Expo 2024",
        date: "March 15-17, 2024",
        location: "Bombay Exhibition Centre, Mumbai",
        status: "Upcoming",
        images: [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
        ],
        description: "Join us for the biggest textile exhibition of the year. Meet industry leaders, discover new trends, and network with professionals from around the world.",
        organizer: "Textile Association of India",
        attendees: "500+",
        category: "Exhibition"
    },
    {
        id: 2,
        name: "Fashion Week 2024",
        date: "April 5-10, 2024",
        location: "Jio World Convention Centre, Mumbai",
        status: "Upcoming",
        images: [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
        ],
        description: "Experience the future of fashion with exclusive runway shows, designer collections, and industry networking opportunities.",
        organizer: "Fashion Design Council of India",
        attendees: "1000+",
        category: "Fashion Show"
    }
];

const EventsScreen = ({ navigation }) => {
    const { userRole } = useAuthStore();

    const [selectedTab, setSelectedTab] = useState("Events");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [createEventModal, setCreateEventModal] = useState(false);



    // Data states
    const [events, setEvents] = useState([]);

    // Create event form
    const [newEvent, setNewEvent] = useState({
        event_name: "",
        description: "",
        category: "textile_expo",
        start_date: "",
        end_date: "",
        location_city: "",
        location_address: "",
        created_by: 1
    });

    const { authInfo } = useAuthStore();
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);


    const tabs = ["Events"];
    const statusFilters = [
        "all",
        "upcoming",
        "ongoing",
        "completed",
        "cancelled",
    ];
    const categoryFilters = [
        "all",
        "textile_expo",
        "fashion_show",
        "trade_fair",
        "workshop",
        "webinar",
        "conference",
    ];

    useEffect(() => {
        fetchEventData();
    }, [selectedTab]);

  const renderCreateEventModal = () => (
    <Portal>
      <Modal
        visible={createEventModal}
        onDismiss={() => setCreateEventModal(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <ScrollView>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Event</Text>
            <TouchableOpacity onPress={() => setCreateEventModal(false)}>
              <MaterialIcons name="close" size={24} color="#132f56" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              label="Event Title"
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({ ...newEvent, event_name: text })}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Description"
              value={newEvent.description}
              onChangeText={(text) =>
                setNewEvent({ ...newEvent, description: text })
              }
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
            />

            {/* Start Date */}
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={styles.input}
            >
              <TextInput
                label="Start Date"
                value={newEvent.start_date ? new Date(newEvent.start_date).toLocaleString() : ""}
                editable={false}
                mode="outlined"
              />
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={showStartPicker}
              mode="datetime"
              onConfirm={(date) => {
                setShowStartPicker(false);
                setNewEvent({ ...newEvent, start_date: date.toISOString() });
              }}
              onCancel={() => setShowStartPicker(false)}
            />


            {/* End Date */}
            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              style={styles.input}
            >
              <TextInput
                label="End Date"
                value={newEvent.end_date ? new Date(newEvent.end_date).toLocaleString() : ""}
                editable={false}
                mode="outlined"
              />
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={showEndPicker}
              mode="datetime"
              onConfirm={(date) => {
                setShowEndPicker(false);
                setNewEvent({ ...newEvent, end_date: date.toISOString() });
              }}
              onCancel={() => setShowEndPicker(false)}
            />


            <TextInput
              label="Location City"
              value={newEvent.location_city}
              onChangeText={(text) =>
                setNewEvent({ ...newEvent, location_city: text })
              }
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Location Address"
              value={newEvent.location_address}
              onChangeText={(text) =>
                setNewEvent({ ...newEvent, location_address: text })
              }
              style={styles.input}
              mode="outlined"
            />
            {/* 
            <TextInput
              label="Registration Fee (₹)"
              value={newEvent.registrationFee}
              onChangeText={(text) =>
                setNewEvent({ ...newEvent, registrationFee: text })
              }
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
            /> */}

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setCreateEventModal(false)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleCreateEvent}
                style={styles.createButton}
                buttonColor="#132f56"
              >
                Create Event
              </Button>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
    // get all events
    const fetchEventData = async () => {
        try {
            setLoading(true);
            const token = authInfo?.token;
            const headers = { Authorization: `Bearer ${token}` };
            if (selectedTab === "Events") {
                try {
                    const eventsResponse = await axios.get(`${API_BASE}/superadmin/events`, {
                        headers,
                    });
                    setEvents(eventsResponse.data.data.events || []);
                } catch (error) {
                    // Fallback events data
                    setEvents([
                        {
                            id: 1,
                            title: "India International Textile Expo 2024",
                            description:
                                "Largest textile exhibition showcasing latest fabrics and trends",
                            category: "textile_expo",
                            status: "upcoming",
                            startDate: "2024-06-15T09:00:00Z",
                            endDate: "2024-06-17T18:00:00Z",
                            location: "Mumbai Exhibition Centre",
                            maxParticipants: 500,
                            registeredParticipants: 287,
                            registrationFee: 2500,
                            createdAt: new Date().toISOString(),
                            organizer: "SuperAdmin",
                        },
                        {
                            id: 2,
                            title: "Sustainable Fashion Workshop",
                            description:
                                "Learn about eco-friendly fabric production and sustainable practices",
                            category: "workshop",
                            status: "ongoing",
                            startDate: "2024-05-20T10:00:00Z",
                            endDate: "2024-05-20T16:00:00Z",
                            location: "Virtual Event",
                            maxParticipants: 100,
                            registeredParticipants: 85,
                            registrationFee: 999,
                            createdAt: new Date().toISOString(),
                            organizer: "SuperAdmin",
                        },
                        {
                            id: 3,
                            title: "Cotton Fabric Trade Fair",
                            description:
                                "Connect with cotton fabric manufacturers and suppliers",
                            category: "trade_fair",
                            status: "completed",
                            startDate: "2024-04-10T09:00:00Z",
                            endDate: "2024-04-12T17:00:00Z",
                            location: "Delhi Trade Centre",
                            maxParticipants: 300,
                            registeredParticipants: 268,
                            registrationFee: 1500,
                            createdAt: new Date().toISOString(),
                            organizer: "SuperAdmin",
                        },
                    ]);
                }
            }
        } catch (error) {
            console.error("Error fetching event data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchEventData();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "upcoming":
                return "#2196F3";
            case "ongoing":
                return "#4CAF50";
            case "completed":
                return "#9C27B0";
            case "cancelled":
                return "#FF0000";
            default:
                return "#666";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "upcoming":
                return "schedule";
            case "ongoing":
                return "play-circle-filled";
            case "completed":
                return "check-circle";
            case "cancelled":
                return "cancel";
            default:
                return "info";
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "textile_expo":
                return "store";
            case "fashion_show":
                return "style";
            case "trade_fair":
                return "business";
            case "workshop":
                return "school";
            case "webinar":
                return "video-call";
            case "conference":
                return "groups";
            default:
                return "event";
        }
    };

    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            selectedStatus === "all" || event.status === selectedStatus;
        const matchesCategory =
            selectedCategory === "all" || event.category === selectedCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });


    // create event
    const handleCreateEvent = async () => {

        try {
            const token = authInfo?.token;
            const headers = { Authorization: `Bearer ${token}` };

            console.log("EVENT TOKEN", token);

            const eventData = {
                ...newEvent
            };

            console.log("EVENT DATA", eventData);


            await axios.post(`${API_BASE}/superadmin/events`, eventData, { headers });

            setCreateEventModal(false);
            setNewEvent({
                event_name: "",
                description: "",
                category: "textile_expo",
                start_date: "",
                end_date: "",
                location_city: "",
                location_address: "",
                created_by: 1
            });

            Alert.alert("Success", "Event created successfully!");
            fetchEventData();
        } catch (error) {
            console.error("Error creating event:", error);
            Alert.alert("Error", "Failed to create event. Please try again.");
        }
    };


    // const renderHeader = () => (
    //     <View style={styles.header}>
    //         <Text style={styles.title}>Upcoming Events</Text>
    //         {userRole === "superadmin" && (
    //             <TouchableOpacity
    //                 style={styles.addButton}
    //                 onPress={() => navigation.navigate('AddEvent')}
    //             >
    //                 <Feather name="plus" size={20} color="#fff" />
    //                 <Text style={styles.addButtonText}>Add Event</Text>
    //             </TouchableOpacity>
    //         )}
    //     </View>
    // );


    const renderEventsTab = () => {
        if (loading) {
            return (
                <ActivityIndicator
                    animating={true}
                    size="large"
                    style={styles.loader}
                />
            );
        }

        return (
            <ScrollView
                style={styles.tabContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Search and Filters */}
                <View style={styles.searchSection}>
                    <Searchbar
                        placeholder="Search events..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                    />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.filterContainer}
                    >
                        <Text style={styles.filterLabel}>Status:</Text>
                        {statusFilters.map((status) => (
                            <Chip
                                key={status}
                                selected={selectedStatus === status}
                                onPress={() => setSelectedStatus(status)}
                                style={styles.filterChip}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Chip>
                        ))}
                    </ScrollView>
                </View>

                {/* Events List */}
                {filteredEvents.length === 0 ? (
                    <EmptyState
                        type="events"
                        title="No Events Found"
                        subtitle="No events match your current filters or create your first event"
                        actionText="Create Event"
                        onActionPress={() => setCreateEventModal(true)}
                    />
                ) : (
                    filteredEvents.map((event) => (
                        <Card key={event.id} style={styles.eventCard}>
                            <Card.Content>
                                <View style={styles.eventHeader}>
                                    <View style={styles.eventTitleSection}>
                                        <MaterialIcons
                                            name={getCategoryIcon(event.category)}
                                            size={20}
                                            color="#132f56"
                                            style={styles.categoryIcon}
                                        />
                                        <View style={styles.eventTitleText}>
                                            <Text style={styles.eventTitle}>{event.event_name}</Text>
                                            <Text style={styles.eventCategory}>
                                                {event.category}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(event.status) },
                    ]}
                  >
                    <MaterialIcons
                      name={getStatusIcon(event.status)}
                      size={14}
                      color="#fff"
                    />
                    <Text style={styles.statusText}>
                      {event.status}
                    </Text>
                  </View> */}
                                </View>

                                <Text style={styles.eventDescription} numberOfLines={2}>
                                    {event.description}
                                </Text>

                                <Divider style={styles.divider} />

                                <View style={styles.eventDetails}>
                                    <View style={styles.detailRow}>
                                        <MaterialIcons
                                            name="location-on"
                                            size={16}
                                            color="#6B7280"
                                        />
                                        <Text style={styles.detailText}>{event.location_city}</Text>
                                        <Text style={styles.detailText}>{event.location_address}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <MaterialIcons name="event" size={16} color="#6B7280" />
                                        <Text style={styles.detailText}>
                                            {new Date(event.start_date).toLocaleDateString()} -{" "}
                                            {new Date(event.end_date).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    {/* <View style={styles.detailRow}>
                    <MaterialIcons
                      name="currency-rupee"
                      size={16}
                      color="#6B7280"
                    />
                    <Text style={styles.detailText}>
                      ₹{event.registrationFee}
                    </Text>
                  </View> */}
                                </View>

                                {/* {authInfo.userRole === "superadmin" && (
                  <View style={styles.eventActions}>
                    <TouchableOpacity style={styles.actionButtonSmall}>
                      <MaterialIcons
                        name="visibility"
                        size={16}
                        color="#132f56"
                      />
                      <Text style={styles.actionTextSmall}>View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButtonSmall}>
                      <MaterialIcons name="edit" size={16} color="#132f56" />
                      <Text style={styles.actionTextSmall}>Edit</Text>
                    </TouchableOpacity>
                    {event.status === "upcoming" && (
                      <TouchableOpacity
                        style={[
                          styles.actionButtonSmall,
                          { backgroundColor: "#FF0000" },
                        ]}
                      >
                        <MaterialIcons name="cancel" size={16} color="#fff" />
                        <Text style={[styles.actionTextSmall, { color: "#fff" }]}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}


 */}

                            </Card.Content>
                        </Card>
                    ))
                )}
            </ScrollView>
        );
    };



    return (
        <View style={styles.container}>
            {/* <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View> */}

            {renderEventsTab()}
            {authInfo.userRole === "superadmin" && (
                <FAB
                    style={styles.fab}
                    icon="plus"
                    color="#fff"
                    labelStyle={{ color: "#fff" }}
                    label="Create Event"
                    onPress={() => setCreateEventModal(true)}
                />
            )}

            {renderCreateEventModal()}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingTop: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#132f56",
        flex: 1,
        textAlign: "center",
        marginHorizontal: 16,
    },
    tabContainer: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginHorizontal: 4,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: "#132f56",
    },
    tabText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },
    activeTabText: {
        color: "#132f56",
        fontWeight: "600",
    },
    tabContent: {
        flex: 1,
        padding: 16,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    searchSection: {
        marginBottom: 16,
    },
    searchBar: {
        marginBottom: 12,
    },
    filterContainer: {
        flexDirection: "row",
        marginBottom: 8,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#374151",
        alignSelf: "center",
        marginRight: 8,
    },
    filterChip: {
        marginRight: 8,
    },
    eventCard: {
        marginBottom: 16,
        elevation: 2,
    },
    eventHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    eventTitleSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    categoryIcon: {
        marginRight: 12,
    },
    eventTitleText: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
    },
    eventCategory: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "600",
    },
    eventDescription: {
        fontSize: 14,
        color: "#6B7280",
        lineHeight: 20,
        marginBottom: 12,
    },
    divider: {
        marginVertical: 12,
    },
    eventDetails: {
        gap: 8,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    detailText: {
        fontSize: 14,
        color: "#374151",
        marginLeft: 8,
    },
    eventActions: {
        flexDirection: "row",
        gap: 8,
        flexWrap: "wrap",
    },
    actionButtonSmall: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderRadius: 6,
        backgroundColor: "#F3F4F6",
        gap: 4,
    },
    actionTextSmall: {
        fontSize: 12,
        color: "#132f56",
        fontWeight: "500",
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    statsCard: {
        width: "48%",
        marginBottom: 12,
        elevation: 2,
    },
    statsCardContent: {
        paddingVertical: 16,
    },
    statsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    growthText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#4CAF50",
    },
    statsValue: {
        fontSize: 20,
        fontWeight: "700",
        color: "#132f56",
        marginBottom: 4,
    },
    statsLabel: {
        fontSize: 12,
        color: "#6B7280",
    },
    chartCard: {
        marginBottom: 16,
        elevation: 2,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 16,
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#132f56",
    },
    modalContainer: {
        backgroundColor: "#fff",
        margin: 20,
        borderRadius: 12,
        maxHeight: "80%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#132f56",
    },
    modalContent: {
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    cancelButton: {
        flex: 0.45,
    },
    createButton: {
        flex: 0.45,
    },
});

export default EventsScreen;