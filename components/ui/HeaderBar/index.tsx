import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import styles from "./styles";

export default function HeaderBar() {
	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? "light"];

	return (
		<View style={[styles.wrap, { backgroundColor: theme.background }]}>
			<View style={styles.left}>
				<View style={[styles.logoBox, { backgroundColor: theme.tint }]}>
					<View style={styles.logoDot} />
				</View>
				<Text style={[styles.brand, { color: theme.tint }]}>Yardr</Text>
			</View>

			<View style={styles.right}>
				<TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
					<IconSymbol
						size={22}
						name="magnifyingglass"
						color={theme.secondaryText}
					/>
				</TouchableOpacity>

				<TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
					<IconSymbol size={22} name="bell" color={theme.secondaryText} />
					<View style={[styles.badge, { backgroundColor: theme.tint }]} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

