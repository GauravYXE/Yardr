import { ThemedText } from "@/components/themed-text";
import { garageSaleService } from "@/services/garageSaleService";
import { GarageSale } from "@/types/garageSale";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	Platform,
	ScrollView,
	Share,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

function haversineKm(
	a: { latitude: number; longitude: number },
	b: { latitude: number; longitude: number }
) {
	const R = 6371;
	const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
	const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
	const lat1 = (a.latitude * Math.PI) / 180;
	const lat2 = (b.latitude * Math.PI) / 180;

	const x =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

	return R * (2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
}

export default function ViewSaleScreen() {
	const { id } = useLocalSearchParams();
	const [loading, setLoading] = useState(true);
	const [sale, setSale] = useState<GarageSale | null>(null);
	const [userLoc, setUserLoc] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);

	useEffect(() => {
		loadSale();
		loadUserLocation();
	}, [id]);

	const loadUserLocation = useCallback(async () => {
		try {
			const perm = await Location.requestForegroundPermissionsAsync();
			if (perm.status === "granted") {
				const pos = await Location.getCurrentPositionAsync({});
				setUserLoc({
					latitude: pos.coords.latitude,
					longitude: pos.coords.longitude,
				});
			}
		} catch (error) {
			console.error("Error getting user location:", error);
		}
	}, []);

	const loadSale = async () => {
		try {
			const saleData = await garageSaleService.getGarageSaleById(id as string);
			if (!saleData) {
				Alert.alert("Error", "Garage sale not found");
				router.back();
				return;
			}
			setSale(saleData);
		} catch (error) {
			console.error("Error loading sale:", error);
			Alert.alert("Error", "Failed to load garage sale");
			router.back();
		} finally {
			setLoading(false);
		}
	};

	const distanceText = useMemo(() => {
		if (!sale || !userLoc) return null;
		const km = haversineKm(userLoc, sale.location);
		const feet = km * 3280.84;
		return feet >= 5280
			? `${Math.round(feet / 5280)} miles away`
			: `${Math.round(feet)} feet away`;
	}, [sale, userLoc]);

	const formatFullDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatTimeRange = (startTime?: string, endTime?: string) => {
		if (!startTime || !endTime) return "";
		const to12 = (t: string) => {
			const [hh, mm] = t.split(":").map(Number);
			const ampm = hh >= 12 ? "PM" : "AM";
			const h = ((hh + 11) % 12) + 1;
			return `${h}${mm ? `:${String(mm).padStart(2, "0")}` : ""} ${ampm}`;
		};
		return `${to12(startTime)} - ${to12(endTime)}`;
	};

	const handleShare = async () => {
		if (!sale) return;

		const dateStr = formatFullDate(sale.startDate || sale.date);
		const timeStr = formatTimeRange(sale.startTime, sale.endTime);
		const deepLink = `yardr://sale-detail/${sale.id}`;
		const shareText = `${sale.title}\n\n${dateStr}\n${timeStr}\n\n${sale.location.address}\n\n${deepLink}`;

		try {
			const shareOptions: { title?: string; message?: string; url?: string } = {
				title: sale.title,
				message: shareText,
			};
			
			// Add URL for iOS (optional, iOS will handle it)
			if (Platform.OS === "ios") {
				shareOptions.url = deepLink;
			}
			
			await Share.share(shareOptions);
		} catch (error) {
			console.error("Error sharing:", error);
		}
	};

	const handleGetDirections = async () => {
		if (!sale) return;

		const { latitude, longitude, address } = sale.location;

		if (latitude && longitude) {
			if (Platform.OS === "ios") {
				const url = `http://maps.apple.com/?daddr=${latitude},${longitude}`;
				Linking.openURL(url);
			} else {
				// Try Google Navigation first, fallback to web URL
				const navUrl = `google.navigation:q=${latitude},${longitude}`;
				const webUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
				
				const canOpen = await Linking.canOpenURL(navUrl);
				Linking.openURL(canOpen ? navUrl : webUrl);
			}
		} else if (address) {
			// Fallback to address-based search if lat/long missing
			const encodedAddress = encodeURIComponent(address);
			const url =
				Platform.OS === "ios"
					? `http://maps.apple.com/?q=${encodedAddress}`
					: `https://maps.google.com/?q=${encodedAddress}`;
			Linking.openURL(url);
		}
	};

	const handleCall = () => {
		if (!sale?.contactPhone) return;
		Linking.openURL(`tel:${sale.contactPhone}`);
	};

	const handleMessage = () => {
		if (!sale?.contactPhone) return;
		Linking.openURL(`sms:${sale.contactPhone}`);
	};

	if (loading || !sale) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#D97B3F" />
			</View>
		);
	}

	const heroImage = sale.images?.[0] || sale.videoUrl;

	return (
		<View style={styles.container}>
			{/* Hero Image */}
			<View style={styles.heroContainer}>
				{heroImage ? (
					<Image source={{ uri: heroImage }} style={styles.heroImage} />
				) : (
					<View style={styles.heroPlaceholder}>
						<MaterialIcons name="photo" size={48} color="#999" />
					</View>
				)}

				{/* Back Button */}
				<TouchableOpacity
					style={styles.floatingButton}
					onPress={() => router.back()}
					activeOpacity={0.8}
				>
					<MaterialIcons name="arrow-back" size={22} color="#4A3A2A" />
				</TouchableOpacity>

				{/* Share Button */}
				<TouchableOpacity
					style={[styles.floatingButton, styles.floatingButtonRight]}
					onPress={handleShare}
					activeOpacity={0.8}
				>
					<MaterialIcons name="share" size={22} color="#4A3A2A" />
				</TouchableOpacity>
			</View>

			{/* Scrollable Content */}
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.contentCard}>
					{/* Title */}
					<Text style={styles.title}>{sale.title}</Text>

					{/* Tags/Categories */}
					{sale.categories && sale.categories.length > 0 && (
						<View style={styles.tagsContainer}>
							<MaterialIcons
								name="local-offer"
								size={18}
								color="#FF9500"
								style={styles.tagIcon}
							/>
							<View style={styles.tagsRow}>
								{sale.categories.map((category, index) => (
									<View key={index} style={styles.tag}>
										<Text style={styles.tagText}>{category}</Text>
									</View>
								))}
							</View>
						</View>
					)}

					{/* Date and Time */}
					<View style={styles.detailRow}>
						<MaterialIcons
							name="event"
							size={20}
							color="#FF9500"
							style={styles.detailIcon}
						/>
						<View style={styles.detailContent}>
							<Text style={styles.detailValue}>
								{formatFullDate(sale.startDate || sale.date)}
							</Text>
							<Text style={styles.detailSubtext}>
								{formatTimeRange(sale.startTime, sale.endTime)}
							</Text>
						</View>
					</View>

					{/* Address and Distance */}
					<View style={styles.detailRow}>
						<MaterialIcons
							name="location-on"
							size={20}
							color="#FF9500"
							style={styles.detailIcon}
						/>
						<View style={styles.detailContent}>
							<Text style={styles.detailValue}>{sale.location.address}</Text>
							{distanceText && (
								<Text style={styles.detailSubtext}>{distanceText}</Text>
							)}
						</View>
					</View>

					{/* Description */}
					{sale.description && (
						<Text style={styles.description}>{sale.description}</Text>
					)}

					{/* Host Section */}
					{sale.contactName && (
						<View style={styles.hostSection}>
							<View style={styles.hostAvatar}>
								<MaterialIcons name="person" size={24} color="#4A90E2" />
							</View>
							<View style={styles.hostInfo}>
								<Text style={styles.hostName}>{sale.contactName}</Text>
								<Text style={styles.hostRole}>Host</Text>
							</View>
							{(sale.contactPhone || sale.contactEmail) && (
								<View style={styles.hostActions}>
									{sale.contactPhone && (
										<>
											<TouchableOpacity
												style={styles.hostActionButton}
												onPress={handleCall}
												activeOpacity={0.7}
											>
												<MaterialIcons name="phone" size={18} color="#FF9500" />
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.hostActionButton}
												onPress={handleMessage}
												activeOpacity={0.7}
											>
												<MaterialIcons
													name="sms"
													size={18}
													color="#FF9500"
												/>
											</TouchableOpacity>
										</>
									)}
								</View>
							)}
						</View>
					)}
				</View>
			</ScrollView>

			{/* Fixed Get Directions Button */}
			<View style={styles.ctaContainer}>
				<TouchableOpacity
					style={styles.ctaButton}
					onPress={handleGetDirections}
					activeOpacity={0.9}
				>
					<MaterialIcons name="near-me" size={20} color="#FFFFFF" />
					<Text style={styles.ctaText}>Get Directions</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAF7F2",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#FAF7F2",
	},

	// Hero Section
	heroContainer: {
		height: 320,
		width: "100%",
		position: "relative",
	},
	heroImage: {
		width: "100%",
		height: "100%",
	},
	heroPlaceholder: {
		width: "100%",
		height: "100%",
		backgroundColor: "#E6E1DA",
		justifyContent: "center",
		alignItems: "center",
	},
	floatingButton: {
		position: "absolute",
		top: 50,
		left: 16,
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: "#FAF7F2",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	floatingButtonRight: {
		left: undefined,
		right: 16,
	},

	// Scrollable Content
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 100,
	},
	contentCard: {
		backgroundColor: "#FFFFFF",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 20,
		marginTop: -24,
		minHeight: 500,
	},

	// Title
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: "#1F1F1F",
		marginBottom: 16,
		letterSpacing: -0.3,
	},

	// Tags
	tagsContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 20,
	},
	tagIcon: {
		marginRight: 8,
		marginTop: 2,
	},
	tagsRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		flex: 1,
	},
	tag: {
		backgroundColor: "#FFE8D1",
		borderRadius: 16,
		paddingHorizontal: 14,
		paddingVertical: 6,
		marginRight: 8,
		marginBottom: 8,
	},
	tagText: {
		color: "#FF9500",
		fontSize: 14,
		fontWeight: "600",
	},

	// Detail Rows
	detailRow: {
		flexDirection: "row",
		marginBottom: 20,
	},
	detailIcon: {
		marginRight: 12,
		marginTop: 2,
	},
	detailContent: {
		flex: 1,
	},
	detailValue: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1F1F1F",
		marginBottom: 4,
	},
	detailSubtext: {
		fontSize: 14,
		color: "#6F6A64",
		fontWeight: "500",
	},

	// Description
	description: {
		fontSize: 15,
		lineHeight: 22,
		color: "#1F1F1F",
		marginBottom: 24,
	},

	// Host Section
	hostSection: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#FAF7F2",
		borderRadius: 16,
	},
	hostAvatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#F1EDE6",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	hostInfo: {
		flex: 1,
	},
	hostName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1F1F1F",
		marginBottom: 2,
	},
	hostRole: {
		fontSize: 13,
		color: "#6F6A64",
		fontWeight: "500",
	},
	hostActions: {
		flexDirection: "row",
		gap: 8,
	},
	hostActionButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#E6E1DA",
	},

	// CTA Button
	ctaContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		padding: 16,
		backgroundColor: "#FFFFFF",
		borderTopWidth: 1,
		borderTopColor: "#E6E1DA",
		paddingBottom: 20,
	},
	ctaButton: {
		backgroundColor: "#FF9500",
		borderRadius: 14,
		paddingVertical: 16,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	ctaText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "700",
		marginLeft: 8,
	},
});
