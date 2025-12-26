import { useAuth } from "@/contexts/AuthContext";
import { deleteSale, getMySales } from "@/services/garageSaleService";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
	Alert,
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function MySalesScreen() {
	const { user } = useAuth();
	const [sales, setSales] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	// Redirect if not logged in
	if (!user) {
		router.replace("/profile");
		return null;
	}

	const load = async () => {
		setLoading(true);
		const data = await getMySales(user.id);
		setSales(data || []);
		setLoading(false);
	};

	// Reload when screen comes into focus
	useFocusEffect(
		useCallback(() => {
			load();
		}, [])
	);

	const confirmDelete = (id: string) => {
		Alert.alert("Delete Sale", "This action cannot be undone.", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					await deleteSale(id);
					setSales((prev) => prev.filter((s) => s.id !== id));
				},
			},
		]);
	};

	return (
		<SafeAreaView style={styles.safe}>
			{/* HEADER */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()}>
					<Text style={styles.back}>‹</Text>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>My Sales</Text>
				<View style={{ width: 24 }} />
			</View>

			<ScrollView style={styles.container}>
				{/* EMPTY STATE */}
				{!loading && sales.length === 0 && (
					<View style={styles.empty}>
						<Text style={styles.emptyTitle}>No sales yet</Text>
						<Text style={styles.emptySub}>
							Create a sale to start reaching buyers nearby.
						</Text>
					</View>
				)}

				{sales.map((sale) => (
					<View key={sale.id} style={styles.card}>
						<Image
							source={{
								uri:
									sale.cover_image ||
									"https://via.placeholder.com/600x400?text=Garage+Sale",
							}}
							style={styles.image}
						/>

						<View style={styles.info}>
							<Text style={styles.name}>{sale.title}</Text>
							<Text style={styles.meta}>
								{new Date(sale.start_date).toDateString()}
							</Text>
							<Text style={styles.meta}>{sale.items?.length || 0} items</Text>
						</View>

						<View style={styles.actions}>
							<ActionBtn
								label="View"
								onPress={() => router.push(`/sale-detail/${sale.id}`)}
							/>
							<ActionBtn
								label="Edit"
								onPress={() => router.push(`/edit-sale/${sale.id}`)}
							/>
							<ActionBtn
								label="Delete"
								danger
								onPress={() => confirmDelete(sale.id)}
							/>
						</View>
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	);
}

function ActionBtn({
	label,
	onPress,
	danger,
}: {
	label: string;
	onPress: () => void;
	danger?: boolean;
}) {
	return (
		<TouchableOpacity
			style={[styles.btn, danger && styles.btnDanger]}
			onPress={onPress}
		>
			<Text style={[styles.btnText, danger && styles.btnDangerText]}>
				{label}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: "#FAF7F2" },

	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingBottom: 10,
	},
	back: { fontSize: 28, fontWeight: "700" },
	headerTitle: {
		flex: 1,
		textAlign: "center",
		fontSize: 22,
		fontWeight: "800",
	},

	container: { padding: 20 },

	empty: {
		marginTop: 80,
		alignItems: "center",
	},
	emptyTitle: { fontSize: 20, fontWeight: "700" },
	emptySub: { color: "#777", marginTop: 6, textAlign: "center" },

	card: {
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 14,
		marginBottom: 16,
	},
	image: {
		width: "100%",
		height: 180,
		borderRadius: 14,
	},
	info: { marginTop: 10 },
	name: { fontSize: 18, fontWeight: "700" },
	meta: { color: "#777", marginTop: 2 },

	actions: {
		flexDirection: "row",
		marginTop: 14,
		justifyContent: "space-between",
	},
	btn: {
		flex: 1,
		marginHorizontal: 4,
		paddingVertical: 12,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "#DDD",
		alignItems: "center",
	},
	btnText: { fontWeight: "700" },
	btnDanger: { borderColor: "#E0523A" },
	btnDangerText: { color: "#E0523A" },
});
