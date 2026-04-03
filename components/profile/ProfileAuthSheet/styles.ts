import { StyleSheet } from "react-native";

export default StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.45)",
		justifyContent: "flex-end",
	},

	wrapper: {
		height: "92%",
	},

	sheet: {
		flex: 1,
		backgroundColor: "#FAF7F2",
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		paddingHorizontal: 24,
		paddingTop: 24,
	},

	closeBtn: {
		position: "absolute",
		top: 16,
		right: 20,
		zIndex: 10,
	},

	closeText: {
		fontSize: 22,
		color: "#7B746E",
	},

	logoWrap: {
		alignItems: "center",
		marginTop: 24,
	},

	logoIcon: {
		width: 52,
		height: 52,
		borderRadius: 12,
		backgroundColor: "#E28A4B",
		marginBottom: 12,
	},

	logoText: {
		fontSize: 30,
		fontWeight: "800",
		color: "#E28A4B",
	},

	subtitle: {
		textAlign: "center",
		fontSize: 16,
		color: "#7B746E",
		marginTop: 12,
		marginBottom: 36,
	},

	form: {
		marginTop: 12,
	},

	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#3A3633",
		marginBottom: 6,
	},

	inputWrap: {
		backgroundColor: "#F1EDE6",
		borderRadius: 14,
		paddingHorizontal: 14,
		height: 52,
		justifyContent: "center",
	},

	input: {
		fontSize: 16,
		color: "#1F1F1F",
	},

	signInBtn: {
		marginTop: 32,
		backgroundColor: "#E28A4B",
		borderRadius: 28,
		height: 56,
		alignItems: "center",
		justifyContent: "center",
	},

	signInText: {
		color: "#FFF",
		fontSize: 18,
		fontWeight: "700",
	},

	footer: {
		marginTop: 28,
		alignItems: "center",
	},

	footerText: {
		color: "#7B746E",
		fontSize: 14,
	},

	footerLink: {
		color: "#E28A4B",
		fontSize: 15,
		fontWeight: "700",
		marginTop: 4,
	},
});

