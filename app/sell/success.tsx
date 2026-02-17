// app/sell/success.tsx
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SellSuccess() {
	const handleViewMySales = () => {
		// Navigate to the Profile tab first, then push My Sales on top.
		// Using replace so the success screen isn't in the back-stack.
		router.replace("/(tabs)/profile");
		// Small timeout lets the tab navigation settle before pushing
		setTimeout(() => {
			router.push("/my-sales");
		}, 100);
	};

	const handleGoHome = () => {
		// Navigate to the Discover (home) tab
		router.replace("/(tabs)");
	};

	return (
		<View style={styles.safe}>
			<View style={styles.card}>
				{/* Success icon */}
				<View style={styles.iconWrap}>
					<IconSymbol size={28} name="checkmark.circle.fill" color="#2E7D32" />
				</View>

				<Text style={styles.title}>Your sale is live! 🎉</Text>
				<Text style={styles.subtitle}>
					It&apos;s been published successfully and buyers nearby can now find
					it. What would you like to do next?
				</Text>

				{/* View My Sales — goes to profile tab → my-sales */}
				<TouchableOpacity
					style={styles.primaryBtn}
					onPress={handleViewMySales}
					activeOpacity={0.92}
				>
					<IconSymbol size={20} name="list.bullet" color="#FFF" />
					<Text style={styles.primaryText}>View My Sales</Text>
				</TouchableOpacity>

				{/* Go Home — goes to Discover tab */}
				<TouchableOpacity
					style={styles.secondaryBtn}
					onPress={handleGoHome}
					activeOpacity={0.92}
				>
					<IconSymbol size={20} name="house.fill" color="#1F1F1F" />
					<Text style={styles.secondaryText}>Go Home</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: "#FAF7F2",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 18,
	},
	card: {
		width: "100%",
		backgroundColor: "#FFF",
		borderRadius: 22,
		borderWidth: 1,
		borderColor: "#E6E1DA",
		padding: 24,
		alignItems: "center",
	},
	iconWrap: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: "#EAF6EC",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 18,
	},
	title: {
		fontSize: 24,
		fontWeight: "800",
		color: "#1F1F1F",
		textAlign: "center",
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 15,
		lineHeight: 22,
		color: "#6B625A",
		textAlign: "center",
		marginBottom: 28,
	},

	primaryBtn: {
		width: "100%",
		height: 56,
		borderRadius: 28,
		backgroundColor: "#D97B3F",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		marginBottom: 12,
	},
	primaryText: { color: "#FFF", fontSize: 17, fontWeight: "800" },

	secondaryBtn: {
		width: "100%",
		height: 56,
		borderRadius: 28,
		backgroundColor: "#F1EDE6",
		borderWidth: 1,
		borderColor: "#E6E1DA",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
	},
	secondaryText: { color: "#1F1F1F", fontSize: 16, fontWeight: "800" },
});
