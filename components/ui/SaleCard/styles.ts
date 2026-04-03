import { StyleSheet } from "react-native";

export default StyleSheet.create({
	card: {
		borderWidth: 1,
		borderRadius: 18,
		overflow: "hidden",
		marginBottom: 16,
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 18,
		shadowOffset: { width: 0, height: 8 },
		elevation: 3,
	},
	mediaWrap: { height: 230, width: "100%" },
	media: { width: "100%", height: "100%" },
	mediaPlaceholder: {
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},

	distancePill: {
		position: "absolute",
		top: 14,
		right: 14,
		borderWidth: 1,
		borderRadius: 999,
		paddingVertical: 8,
		paddingHorizontal: 12,
		flexDirection: "row",
		gap: 8,
		alignItems: "center",
	},
	distanceText: { fontSize: 15, fontWeight: "800" },

	dateBadge: {
		position: "absolute",
		left: 14,
		bottom: 14,
		borderRadius: 999,
		paddingVertical: 10,
		paddingHorizontal: 14,
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
	},
	dateText: { color: "#fff", fontSize: 16, fontWeight: "800" },

	body: { padding: 16 },
	title: {
		fontSize: 22,
		fontWeight: "900",
		letterSpacing: -0.3,
		marginBottom: 10,
	},

	timeRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginBottom: 10,
	},
	timeText: { fontSize: 16, fontWeight: "700" },

	divider: { height: 1, width: "100%", marginVertical: 12 },

	itemsRow: { flexDirection: "row", alignItems: "center", gap: 12 },
	avatarStack: { flexDirection: "row", alignItems: "center" },
	avatar: {
		width: 26,
		height: 26,
		borderRadius: 999,
		borderWidth: 2,
		borderColor: "#fff",
	},
	itemsText: { fontSize: 16, fontWeight: "700" },
});

