import { Stack } from "expo-router";
import React from "react";

export default function SellLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" /> {/* Step 1 */}
			<Stack.Screen name="video" /> {/* Step 2 */}
			<Stack.Screen name="publish" /> {/* Step 3 */}
			<Stack.Screen name="success" />
		</Stack>
	);
}
