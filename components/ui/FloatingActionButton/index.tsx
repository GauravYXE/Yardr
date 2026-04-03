import React from "react";
import { TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import styles from "./styles";

export default function FloatingActionButton({
	onPress,
}: {
	onPress: () => void;
}) {
	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? "light"];

	return (
		<View style={styles.wrap} pointerEvents="box-none">
			<TouchableOpacity
				style={[styles.btn, { backgroundColor: theme.tint }]}
				activeOpacity={0.9}
				onPress={onPress}
			>
				<IconSymbol size={26} name="plus" color="#FFFFFF" />
			</TouchableOpacity>
		</View>
	);
}

