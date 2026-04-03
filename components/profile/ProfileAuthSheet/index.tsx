import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import styles from "./styles";

type Props = {
	visible: boolean;
	onClose: () => void;
	onSwitchToSignup: () => void;
};

export default function ProfileAuthSheet({
	visible,
	onClose,
	onSwitchToSignup,
}: Props) {
	const { signIn } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		if (!email || !password) return;

		try {
			setLoading(true);
			await signIn(email, password);
			onClose();
		} catch (e: any) {
			alert(e.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal visible={visible} animationType="slide" transparent>
			<View style={styles.overlay}>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : undefined}
					style={styles.wrapper}
				>
					<View style={styles.sheet}>
						{/* Close */}
						<TouchableOpacity style={styles.closeBtn} onPress={onClose}>
							<Text style={styles.closeText}>✕</Text>
						</TouchableOpacity>

						{/* Logo */}
						<View style={styles.logoWrap}>
							<View style={styles.logoIcon} />
							<Text style={styles.logoText}>Yardr</Text>
						</View>

						<Text style={styles.subtitle}>
							Welcome back! Sign in to continue.
						</Text>

						{/* Form */}
						<View style={styles.form}>
							<Text style={styles.label}>Email</Text>
							<View style={styles.inputWrap}>
								<TextInput
									placeholder="you@example.com"
									placeholderTextColor="#9B948C"
									value={email}
									onChangeText={setEmail}
									autoCapitalize="none"
									keyboardType="email-address"
									style={styles.input}
								/>
							</View>

							<Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
							<View style={styles.inputWrap}>
								<TextInput
									placeholder="••••••••"
									placeholderTextColor="#9B948C"
									value={password}
									onChangeText={setPassword}
									secureTextEntry
									style={styles.input}
								/>
							</View>
						</View>

						{/* Sign In Button */}
						<TouchableOpacity
							style={[
								styles.signInBtn,
								(!email || !password || loading) && { opacity: 0.6 },
							]}
							disabled={!email || !password || loading}
							onPress={handleLogin}
						>
							<Text style={styles.signInText}>
								{loading ? "Signing in…" : "Sign In"}
							</Text>
						</TouchableOpacity>

						{/* Footer */}
						<View style={styles.footer}>
							<Text style={styles.footerText}>Don’t have an account?</Text>
							<TouchableOpacity onPress={onSwitchToSignup}>
								<Text style={styles.footerLink}>Sign up for free</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	);
}

