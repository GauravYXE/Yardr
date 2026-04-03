import { StyleSheet } from "react-native";

export default StyleSheet.create({
	outer: {
		borderWidth: 1,
		borderRadius: 18,
		padding: 6,
		flexDirection: "row",
		gap: 8,
	},
	pill: {
		flex: 1,
		borderRadius: 14,
		paddingVertical: 10,
		paddingHorizontal: 12,
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "transparent",
	},
	label: { fontSize: 15, fontWeight: "700" },
});

