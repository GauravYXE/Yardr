import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { GarageSale } from "@/types/garageSale";

import styles from "./styles";

function formatDateBadge(iso: string) {
	const d = new Date(iso);
	const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
	const month = d.toLocaleDateString("en-US", { month: "short" });
	const day = d.getDate();
	return `${weekday}, ${month} ${day}`;
}

function formatTimeRange(startTime?: string, endTime?: string) {
	if (!startTime || !endTime) return "";
	const to12 = (t: string) => {
		const [hh, mm] = t.split(":").map(Number);
		const ampm = hh >= 12 ? "PM" : "AM";
		const h = ((hh + 11) % 12) + 1;
		return `${h}${mm ? `:${String(mm).padStart(2, "0")}` : ""}${ampm}`;
	};
	return `${to12(startTime)} - ${to12(endTime)}`;
}

export default function SaleCard({
	sale,
	distanceText,
	onPress,
}: {
	sale: GarageSale;
	distanceText?: string;
	onPress?: () => void;
}) {
	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? "light"];

	const img = sale.images?.[0];
	const dateIso = sale.startDate || sale.date;

	const badgeText = useMemo(() => formatDateBadge(dateIso), [dateIso]);
	const timeText = useMemo(
		() => formatTimeRange(sale.startTime, sale.endTime),
		[sale.startTime, sale.endTime]
	);

	const CardComponent = onPress ? TouchableOpacity : View;

	return (
		<CardComponent
			style={[
				styles.card,
				{ backgroundColor: theme.card, borderColor: theme.border },
			]}
			onPress={onPress}
			activeOpacity={onPress ? 0.95 : 1}
		>
			<View style={styles.mediaWrap}>
				{img ? (
					<Image
						source={{ uri: img }}
						style={styles.media}
						resizeMode="cover"
					/>
				) : (
					<View
						style={[styles.mediaPlaceholder, { backgroundColor: theme.muted }]}
					>
						<IconSymbol size={30} name="photo" color={theme.secondaryText} />
					</View>
				)}

				<View
					style={[
						styles.distancePill,
						{ backgroundColor: theme.card, borderColor: theme.border },
					]}
				>
					<IconSymbol
						size={16}
						name="location.fill"
						color={theme.secondaryText}
					/>
					<Text style={[styles.distanceText, { color: theme.text }]}>
						{distanceText || ""}
					</Text>
				</View>

				<View style={[styles.dateBadge, { backgroundColor: theme.tint }]}>
					<IconSymbol size={16} name="calendar" color="#FFFFFF" />
					<Text style={styles.dateText}>{badgeText}</Text>
				</View>
			</View>

			<View style={styles.body}>
				<Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
					{sale.title}
				</Text>

				<View style={styles.timeRow}>
					<IconSymbol size={16} name="clock" color={theme.secondaryText} />
					<Text style={[styles.timeText, { color: theme.secondaryText }]}>
						{timeText}
					</Text>
				</View>

				<View style={[styles.divider, { backgroundColor: theme.border }]} />

				<View style={styles.itemsRow}>
					<View style={styles.avatarStack}>
						<View style={[styles.avatar, { backgroundColor: theme.muted }]} />
						<View
							style={[
								styles.avatar,
								{ backgroundColor: theme.muted, marginLeft: -10 },
							]}
						/>
						<View
							style={[
								styles.avatar,
								{ backgroundColor: theme.muted, marginLeft: -10 },
							]}
						/>
					</View>
					<Text style={[styles.itemsText, { color: theme.secondaryText }]}>
						{(sale.categories?.length ?? 0) || 4} items
					</Text>
				</View>
			</View>
		</CardComponent>
	);
}

