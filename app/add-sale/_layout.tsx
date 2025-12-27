// app/add-sale/_layout.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function AddSaleLayout() {
	const { user, loading } = useAuth();

	// Show loading spinner while checking auth
	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#0A0A0A",
				}}
			>
				<ActivityIndicator size="large" color="#FFFFFF" />
				<Text style={{ color: "#FFFFFF", marginTop: 16, fontSize: 16 }}>
					Loading...
				</Text>
			</View>
		);
	}

	// Not logged in → send to Profile tab
	if (!user) {
		return <Redirect href="/(tabs)/profile" />;
	}

	// Logged in → let Expo Router auto-load app/add-sale/add-sale.tsx
	return <Stack screenOptions={{ headerShown: false }} />;
	// ← Empty Stack is perfect here — no manual screens needed!
}
