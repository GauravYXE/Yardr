import { ThemedText } from "@/components/themed-text";
import { garageSaleService } from "@/services/garageSaleService";
import { GarageSale } from "@/types/garageSale";
import { MaterialIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
	Alert,
	Image,
	ScrollView,
	Share,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";

export default function ViewSaleScreen() {
	const { id } = useLocalSearchParams();
	const [loading, setLoading] = useState(true);
	const [sale, setSale] = useState<GarageSale | null>(null);

	useEffect(() => {
		loadSale();
	}, [id]);

	const loadSale = async () => {
		try {
			const saleData = await garageSaleService.getGarageSaleById(id as string);
			if (!saleData) {
				Alert.alert("Error", "Garage sale not found");
				router.back();
				return;
			}
			setSale(saleData);
		} catch {
			Alert.alert("Error", "Failed to load garage sale");
			router.back();
		} finally {
			setLoading(false);
		}
	};

	const handleShare = async () => {
		if (!sale) return;
		await Share.share({
			title: sale.title,
			message: `${sale.title}\n${sale.location.address}`,
		});
	};

	const handleGetDirections = () => {
		if (!sale) return;
		const url = `https://maps.google.com/?q=${sale.location.latitude},${sale.location.longitude}`;
		Linking.openURL(url);
	};

	const handleCall = () => {
		if (!sale?.contactPhone) return;
		Linking.openURL(`tel:${sale.contactPhone}`);
	};

	const handleMessage = () => {
		if (!sale?.contactPhone) return;
		Linking.openURL(`sms:${sale.contactPhone}`);
	};

	const formatFullDate = (dateStr: string) =>
		new Date(dateStr).toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		});

	if (loading || !sale) {
		return (
			<View style={styles.center}>
				<ThemedText>Loading...</ThemedText>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* HERO */}
				<View style={styles.hero}>
					<Image source={{ uri: sale.videoUrl }} style={styles.heroImage} />

					<TouchableOpacity
						style={styles.heroBtn}
						onPress={() => router.back()}
					>
						<MaterialIcons name="arrow-back" size={20} color="#333" />
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.heroBtn, styles.heroBtnRight]}
						onPress={handleShare}
					>
						<MaterialIcons name="share" size={20} color="#333" />
					</TouchableOpacity>
				</View>

				{/* CONTENT */}
				<View style={styles.content}>
					<View style={styles.card}>
						<ThemedText style={styles.title}>{sale.title}</ThemedText>

						{/* Categories */}
						<View style={styles.chips}>
							{sale.categories?.map((c, i) => (
								<View key={i} style={styles.chip}>
									<ThemedText style={styles.chipText}>{c}</ThemedText>
								</View>
							))}
						</View>

						{/* DETAILS */}
						<View style={styles.details}>
							<View style={styles.row}>
								<MaterialIcons
									name="calendar-today"
									size={18}
									color="#FF9500"
								/>
								<View style={styles.textWrap}>
									<ThemedText style={styles.label}>When</ThemedText>
									<ThemedText style={styles.value}>
										{formatFullDate(sale.date)}
									</ThemedText>
									<ThemedText style={styles.sub}>
										{sale.startTime} – {sale.endTime}
									</ThemedText>
								</View>
							</View>

							<View style={styles.divider} />

							<View style={styles.row}>
								<MaterialIcons name="location-on" size={18} color="#FF9500" />
								<View style={styles.textWrap}>
									<ThemedText style={styles.label}>Location</ThemedText>
									<ThemedText style={styles.value}>
										{sale.location.address}
									</ThemedText>
									<ThemedText style={styles.sub}>0 ft away</ThemedText>
								</View>
							</View>

							<View style={styles.divider} />

							<ThemedText style={styles.description}>
								{sale.description}
							</ThemedText>
						</View>

						{/* HOST */}
						<View style={styles.host}>
							<View style={styles.hostLeft}>
								<View style={styles.avatar}>
									<MaterialIcons name="person" size={22} color="#777" />
								</View>
								<View>
									<ThemedText style={styles.hostName}>
										{sale.contactName}
									</ThemedText>
									<ThemedText style={styles.hostRole}>Host</ThemedText>
								</View>
							</View>

							<View style={styles.hostActions}>
								<TouchableOpacity onPress={handleCall} style={styles.iconBtn}>
									<MaterialIcons name="phone" size={18} color="#FF9500" />
								</TouchableOpacity>
								<TouchableOpacity
									onPress={handleMessage}
									style={styles.iconBtn}
								>
									<MaterialIcons
										name="chat-bubble-outline"
										size={18}
										color="#FF9500"
									/>
								</TouchableOpacity>
							</View>
						</View>

						{/* FEATURED ITEMS */}
						<ThemedText style={styles.sectionTitle}>Featured Items</ThemedText>

						<View style={styles.grid}>
							{[1, 2, 3, 4].map((i) => (
								<View key={i} style={styles.item}>
									<View style={styles.itemImg} />
									<ThemedText style={styles.itemName}>Item {i}</ThemedText>
									<ThemedText style={styles.price}>$25</ThemedText>
								</View>
							))}
						</View>
					</View>

					<View style={{ height: 120 }} />
				</View>
			</ScrollView>

			{/* CTA */}
			<View style={styles.ctaBar}>
				<TouchableOpacity style={styles.cta} onPress={handleGetDirections}>
					<MaterialIcons name="near-me" size={20} color="#fff" />
					<ThemedText style={styles.ctaText}>Get Directions</ThemedText>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#FCF8F2" },
	center: { flex: 1, justifyContent: "center", alignItems: "center" },

	hero: { height: 320 },
	heroImage: { width: "100%", height: "100%" },
	heroBtn: {
		position: "absolute",
		top: 16,
		left: 16,
		backgroundColor: "#fff",
		borderRadius: 24,
		padding: 12,
	},
	heroBtnRight: { left: undefined, right: 16 },

	content: { marginTop: -32 },
	card: {
		backgroundColor: "#FCF8F2",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 16,
	},

	title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
	chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
	chip: {
		backgroundColor: "#FFE8D1",
		borderRadius: 16,
		paddingHorizontal: 12,
		paddingVertical: 6,
		marginRight: 8,
		marginBottom: 8,
	},
	chipText: { color: "#FF9500", fontWeight: "600", fontSize: 13 },

	details: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 16,
		marginBottom: 20,
	},
	row: { flexDirection: "row" },
	textWrap: { marginLeft: 12, flex: 1 },
	label: { fontSize: 12, color: "#999", fontWeight: "600" },
	value: { fontSize: 16, fontWeight: "600", marginTop: 4 },
	sub: { fontSize: 13, color: "#666" },
	divider: { height: 1, backgroundColor: "#eee", marginVertical: 16 },
	description: { fontSize: 14, lineHeight: 22, color: "#333" },

	host: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 24,
	},
	hostLeft: { flexDirection: "row", alignItems: "center" },
	avatar: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: "#eee",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	hostName: { fontWeight: "600" },
	hostRole: { fontSize: 12, color: "#999" },
	hostActions: { flexDirection: "row" },
	iconBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#eee",
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 8,
	},

	sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	item: {
		width: "48%",
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 12,
		marginBottom: 16,
	},
	itemImg: {
		height: 120,
		backgroundColor: "#eee",
		borderRadius: 12,
		marginBottom: 12,
	},
	itemName: { fontWeight: "600" },
	price: { color: "#FF9500", fontWeight: "700" },

	ctaBar: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		padding: 16,
		backgroundColor: "#fff",
		borderTopWidth: 1,
		borderTopColor: "#eee",
	},
	cta: {
		backgroundColor: "#FF9500",
		paddingVertical: 16,
		borderRadius: 14,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	ctaText: { color: "#fff", fontSize: 16, fontWeight: "700", marginLeft: 8 },
});
