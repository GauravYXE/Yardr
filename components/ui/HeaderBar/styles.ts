import { StyleSheet } from "react-native";

export default StyleSheet.create({
	wrap: {
		paddingHorizontal: 18,
		paddingTop: 10,
		paddingBottom: 6,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	left: { flexDirection: "row", alignItems: "center", gap: 10 },
	logoBox: {
		width: 40,
		height: 40,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	logoDot: {
		width: 10,
		height: 10,
		borderRadius: 999,
		backgroundColor: "rgba(255,255,255,0.9)",
	},
	brand: { fontSize: 26, fontWeight: "800", letterSpacing: -0.2 },

	right: { flexDirection: "row", alignItems: "center", gap: 10 },
	iconBtn: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	badge: {
		position: "absolute",
		top: 9,
		right: 10,
		width: 9,
		height: 9,
		borderRadius: 999,
		borderWidth: 2,
		borderColor: "#FAF7F2",
	},
});

