import { StyleSheet } from "react-native";

export default StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	sheet: {
		backgroundColor: "#FAF7F2",
		padding: 20,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	},
	item: { paddingVertical: 16 },
	text: { fontSize: 16, fontWeight: "600" },
});

