import { router } from "expo-router";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import styles from "./styles";

export default function ProfileMenuSheet({ visible, onClose }: any) {
	return (
		<Modal visible={visible} animationType="slide" transparent>
			<View style={styles.overlay}>
				<View style={styles.sheet}>
					<Menu label="My Sales" onPress={() => router.push("/my-sales")} />
					<Menu label="Saved Sales" />
					<Menu label="Notifications" />
					<Menu label="Settings" />
					<Menu label="Help & Support" />
					<Menu label="Close" onPress={onClose} />
				</View>
			</View>
		</Modal>
	);
}

function Menu({ label, onPress }: any) {
	return (
		<TouchableOpacity style={styles.item} onPress={onPress}>
			<Text style={styles.text}>{label}</Text>
		</TouchableOpacity>
	);
}

