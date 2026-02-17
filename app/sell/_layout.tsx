// app/sell/_layout.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function SellLayout() {
	const { user, loading } = useAuth();
	const router = useRouter();

	// Auth guard — redirect to sign-in if not logged in.
	// Pass redirectTo so sign-in/sign-up bounce back here after success.
	useEffect(() => {
		if (!loading && !user) {
			router.replace({
				pathname: "/auth/sign-in",
				params: { redirectTo: "/sell" },
			});
		}
	}, [loading, user, router]);

	// Show a loader while auth state is being determined or while
	// the redirect is in-flight.
	if (loading || !user) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#FAF7F2",
				}}
			>
				<ActivityIndicator size="large" color="#D97B3F" />
				<Text
					style={{
						color: "#6F6A64",
						marginTop: 16,
						fontSize: 16,
						fontWeight: "600",
					}}
				>
					Loading…
				</Text>
			</View>
		);
	}

	// Authenticated — render the sell flow screens
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" /> {/* Step 1 – Record Video  */}
			<Stack.Screen name="video" /> {/* Step 2 – Review        */}
			<Stack.Screen name="publish" /> {/* Step 3 – Publish       */}
			<Stack.Screen name="success" /> {/* Success                */}
		</Stack>
	);
}
