// app/auth/sign-in.tsx
import { useAuth } from "@/contexts/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
	Alert,
	Animated,
	Dimensions,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function SignInScreen() {
	const { signIn } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const params = useLocalSearchParams<{ redirectTo?: string }>();
	const redirectTo =
		typeof params.redirectTo === "string" ? params.redirectTo : undefined;

	// Slide-up animation matching Modal animationType="slide"
	const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
	const fadeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.spring(slideAnim, {
				toValue: 0,
				damping: 30,
				useNativeDriver: true,
			}),
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 250,
				useNativeDriver: true,
			}),
		]).start();
	}, []);

	const handleClose = () => {
		Animated.parallel([
			Animated.timing(slideAnim, {
				toValue: SCREEN_HEIGHT,
				duration: 250,
				useNativeDriver: true,
			}),
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}),
		]).start(() => {
			if (router.canGoBack()) router.back();
			else router.replace("/(tabs)");
		});
	};

	const handleSignIn = async () => {
		if (!email || !password) {
			Alert.alert("Error", "Please enter both email and password");
			return;
		}

		try {
			setLoading(true);
			await signIn(email.trim(), password);
			// Navigate without animation since we're replacing
			if (redirectTo) {
				router.replace(redirectTo as any);
			} else if (router.canGoBack()) {
				router.back();
			} else {
				router.replace("/(tabs)");
			}
		} catch (e: any) {
			Alert.alert("Sign In Failed", e.message || "Invalid email or password");
		} finally {
			setLoading(false);
		}
	};

	const handleSwitchToSignup = () => {
		Animated.parallel([
			Animated.timing(slideAnim, {
				toValue: SCREEN_HEIGHT,
				duration: 250,
				useNativeDriver: true,
			}),
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}),
		]).start(() => {
			router.replace({
				pathname: "/auth/sign-up",
				params: redirectTo ? { redirectTo } : undefined,
			});
		});
	};

	return (
		<View style={styles.root}>
			{/* Overlay - tap to dismiss */}
			<TouchableWithoutFeedback onPress={handleClose}>
				<Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
			</TouchableWithoutFeedback>

			{/* Sheet wrapper - slides up from bottom */}
			<Animated.View
				style={[styles.wrapper, { transform: [{ translateY: slideAnim }] }]}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : undefined}
					style={styles.kav}
				>
					<View style={styles.sheet}>
						<TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
							<Text style={styles.closeText}>✕</Text>
						</TouchableOpacity>

						<View style={styles.logoWrap}>
							<View style={styles.logoIcon} />
							<Text style={styles.logoText}>Yardr</Text>
						</View>

						<Text style={styles.subtitle}>
							Welcome back! Sign in to continue.
						</Text>

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
									editable={!loading}
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
									editable={!loading}
								/>
							</View>
						</View>

						<TouchableOpacity
							style={[
								styles.signInBtn,
								(!email || !password || loading) && { opacity: 0.6 },
							]}
							disabled={!email || !password || loading}
							onPress={handleSignIn}
						>
							<Text style={styles.signInText}>
								{loading ? "Signing in…" : "Sign In"}
							</Text>
						</TouchableOpacity>

						<View style={styles.footer}>
							<Text style={styles.footerText}>Don't have an account?</Text>
							<TouchableOpacity
								onPress={handleSwitchToSignup}
								disabled={loading}
							>
								<Text style={styles.footerLink}>Sign up for free</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		justifyContent: "flex-end",
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.45)",
	},
	wrapper: { height: "92%" },
	kav: { flex: 1 },
	sheet: {
		flex: 1,
		backgroundColor: "#FAF7F2",
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		paddingHorizontal: 24,
		paddingTop: 24,
	},
	closeBtn: { position: "absolute", top: 16, right: 20 },
	closeText: { fontSize: 22, color: "#7B746E" },

	logoWrap: { alignItems: "center", marginTop: 24 },
	logoIcon: {
		width: 52,
		height: 52,
		borderRadius: 12,
		backgroundColor: "#E28A4B",
		marginBottom: 12,
	},
	logoText: { fontSize: 30, fontWeight: "800", color: "#E28A4B" },

	subtitle: {
		textAlign: "center",
		fontSize: 16,
		color: "#7B746E",
		marginVertical: 24,
	},

	form: { marginTop: 8 },
	label: { fontSize: 14, fontWeight: "600", color: "#3A3633" },
	inputWrap: {
		backgroundColor: "#F1EDE6",
		borderRadius: 14,
		paddingHorizontal: 14,
		height: 52,
		justifyContent: "center",
		marginTop: 6,
	},
	input: { fontSize: 16 },

	signInBtn: {
		marginTop: 32,
		backgroundColor: "#E28A4B",
		borderRadius: 28,
		height: 56,
		alignItems: "center",
		justifyContent: "center",
	},
	signInText: { color: "#FFF", fontSize: 18, fontWeight: "700" },

	footer: { marginTop: 28, alignItems: "center" },
	footerText: { color: "#7B746E", fontSize: 14 },
	footerLink: {
		color: "#E28A4B",
		fontSize: 15,
		fontWeight: "700",
		marginTop: 4,
	},
});
