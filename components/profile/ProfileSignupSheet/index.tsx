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

export default function ProfileSignupSheet({
	visible,
	onClose,
	onSwitchToLogin,
}: {
	visible: boolean;
	onClose: () => void;
	onSwitchToLogin: () => void;
}) {
	const { signUp } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSignup = async () => {
		if (!email || !password || !displayName) return;

		try {
			setLoading(true);
			const { session } = await signUp(email, password, displayName);
			if (session) {
				onClose();
				return;
			}

			alert(
				"We sent you a confirmation email. Please confirm your email, then sign in to continue.",
			);
			onSwitchToLogin();
		} catch (e: any) {
			alert(e.message || "Signup failed");
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
						<TouchableOpacity style={styles.closeBtn} onPress={onClose}>
							<Text style={styles.closeText}>✕</Text>
						</TouchableOpacity>

						<View style={styles.logoWrap}>
							<View style={styles.logoIcon} />
							<Text style={styles.logoText}>Yardr</Text>
						</View>

						<Text style={styles.subtitle}>Create your account</Text>

						<View style={styles.form}>
							<Text style={styles.label}>Display name</Text>
							<View style={styles.inputWrap}>
								<TextInput
									placeholder="John Doe"
									placeholderTextColor="#9B948C"
									value={displayName}
									onChangeText={setDisplayName}
									style={styles.input}
								/>
							</View>

							<Text style={[styles.label, { marginTop: 14 }]}>Email</Text>
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

							<Text style={[styles.label, { marginTop: 14 }]}>Password</Text>
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

						<TouchableOpacity
							style={[
								styles.signUpBtn,
								(!email || !password || !displayName || loading) && {
									opacity: 0.6,
								},
							]}
							disabled={!email || !password || !displayName || loading}
							onPress={handleSignup}
						>
							<Text style={styles.signUpText}>
								{loading ? "Creating account…" : "Sign Up"}
							</Text>
						</TouchableOpacity>

						<View style={styles.footer}>
							<Text style={styles.footerText}>Already have an account?</Text>
							<TouchableOpacity onPress={onSwitchToLogin}>
								<Text style={styles.footerLink}>Sign in</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	);
}

