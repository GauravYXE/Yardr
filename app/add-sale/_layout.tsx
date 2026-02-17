// app/add-sale/_layout.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function AddSaleLayout() {
	const { user, loading } = useAuth();
	const router = useRouter();

	// Auth guard for the whole /add-sale group.
	// Use an effect for navigation to avoid redirecting during render.
	useEffect(() => {
		if (!loading && !user) {
			router.replace({
				pathname: "/auth/sign-in",
				params: { redirectTo: "/add-sale" },
			});
		}
	}, [loading, user, router]);

	// While we're checking auth or redirecting, show a simple loading state.
	if (loading || !user) {
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

	// Logged in → let Expo Router auto-load app/add-sale/index.tsx
	return <Stack screenOptions={{ headerShown: false }} />;
}
