import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SellVideoScreen() {
	const cameraRef = useRef<CameraView>(null);

	const [permission, requestPermission] = useCameraPermissions();
	const [cameraReady, setCameraReady] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [showModal, setShowModal] = useState(true);
	const [recordingTime, setRecordingTime] = useState(0);
	const timerRef = useRef<number | null>(null);

	useEffect(() => {
		(async () => {
			if (!permission) return;
			if (!permission.granted) {
				const res = await requestPermission();
				if (!res.granted) {
					Alert.alert(
						"Camera Permission",
						"Please allow camera access to record a video."
					);
				}
			}
		})();
	}, [permission, requestPermission]);

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	const safeBack = () => {
		if (router.canGoBack()) router.back();
		else router.replace("/(tabs)");
	};

	const onStartRecording = async () => {
		if (!cameraReady) {
			Alert.alert(
				"Hold on",
				"Camera is still starting up. Try again in a second."
			);
			return;
		}
		if (isRecording) return;

		try {
			// Hide the modal and reset timer
			setShowModal(false);
			setIsRecording(true);
			setRecordingTime(0);

			// Start timer countdown
			timerRef.current = setInterval(() => {
				setRecordingTime((prev) => prev + 1);
			}, 1000);

			// Start recording
			const video = await cameraRef.current?.recordAsync({
				maxDuration: 5,
			});

			// Stop timer
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}

			setIsRecording(false);

			if (!video?.uri) {
				Alert.alert("Recording failed", "No video was captured.");
				setShowModal(true);
				return;
			}

			// Pass the video uri to publish/review screen
			router.push({
				pathname: "/sell/publish",
				params: { videoUri: video.uri },
			});
		} catch (e: any) {
			// Stop timer
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}

			setIsRecording(false);
			setShowModal(true);
			Alert.alert("Recording error", e?.message ?? "Failed to record video.");
			console.error(e);
		}
	};

	const onStopRecording = async () => {
		try {
			await cameraRef.current?.stopRecording();
		} catch (e) {
			// ignore
		}
	};

	const onSkip = () => {
		router.push("/sell/publish");
	};

	if (!permission?.granted) {
		return (
			<View style={styles.center}>
				<Text style={styles.text}>Requesting camera permission…</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<CameraView
				ref={cameraRef}
				style={StyleSheet.absoluteFill}
				facing="back"
				mode="video"
				onCameraReady={() => setCameraReady(true)}
			/>

			{/* Top right close button */}
			<TouchableOpacity onPress={safeBack} style={styles.closeBtn}>
				<Text style={styles.closeText}>✕</Text>
			</TouchableOpacity>

			{/* Recording timer when recording */}
			{isRecording && (
				<View style={styles.recordingIndicator}>
					<View style={styles.recordingDot} />
					<Text style={styles.recordingText}>{recordingTime}s / 5s</Text>
				</View>
			)}

			{/* Center modal UI - shows only when not recording */}
			{showModal && !isRecording && (
				<View style={styles.modalCard}>
					<View style={styles.iconCircle}>
						<Text style={styles.icon}>📹</Text>
					</View>

					<Text style={styles.title}>Record a 5-second video</Text>
					<Text style={styles.subtitle}>
						Show your items in a quick video. Our AI will automatically detect
						and tag items for your listing.
					</Text>

					<TouchableOpacity
						onPress={onStartRecording}
						disabled={!cameraReady}
						style={[styles.primaryBtn, !cameraReady && { opacity: 0.6 }]}
					>
						<Text style={styles.primaryBtnText}>
							{cameraReady ? "Start Recording" : "Camera Loading..."}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
						<Text style={styles.skipText}>Skip Video (Fill Manually)</Text>
					</TouchableOpacity>
				</View>
			)}

			{/* Record button at bottom - only show when not recording and modal is hidden */}
			{!showModal && !isRecording && (
				<View style={styles.recordWrap}>
					<TouchableOpacity
						onPress={onStartRecording}
						disabled={!cameraReady}
						style={[styles.recordOuter, !cameraReady && { opacity: 0.6 }]}
					>
						<View style={styles.recordInner} />
					</TouchableOpacity>
				</View>
			)}

			{/* Stop button when recording */}
			{isRecording && (
				<View style={styles.recordWrap}>
					<TouchableOpacity
						onPress={onStopRecording}
						style={styles.recordOuter}
					>
						<View style={styles.stopInner} />
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#000" },
	center: { flex: 1, alignItems: "center", justifyContent: "center" },
	text: { color: "#111", fontSize: 16 },

	closeBtn: {
		position: "absolute",
		top: 60,
		right: 18,
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.35)",
		zIndex: 5,
	},
	closeText: { color: "#fff", fontSize: 18, fontWeight: "700" },

	recordingIndicator: {
		position: "absolute",
		top: 60,
		left: 18,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 59, 48, 0.9)",
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 20,
		zIndex: 5,
	},
	recordingDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#fff",
		marginRight: 8,
	},
	recordingText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "700",
	},

	modalCard: {
		position: "absolute",
		left: 18,
		right: 18,
		top: 120,
		borderRadius: 28,
		paddingVertical: 22,
		paddingHorizontal: 20,
		backgroundColor: "#fff",
		alignItems: "center",
		zIndex: 4,
	},
	iconCircle: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: "#F6EEE6",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 10,
	},
	icon: { fontSize: 24 },
	title: { fontSize: 26, fontWeight: "800", color: "#222", marginTop: 6 },
	subtitle: {
		marginTop: 10,
		fontSize: 15,
		lineHeight: 20,
		color: "#6B625A",
		textAlign: "center",
	},

	primaryBtn: {
		marginTop: 18,
		height: 56,
		borderRadius: 28,
		alignSelf: "stretch",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#D88445",
	},
	primaryBtnText: { color: "#fff", fontSize: 18, fontWeight: "800" },

	skipBtn: { marginTop: 14, paddingVertical: 10 },
	skipText: { color: "#8A8077", fontSize: 16, fontWeight: "700" },

	recordWrap: {
		position: "absolute",
		bottom: 70,
		left: 0,
		right: 0,
		alignItems: "center",
		zIndex: 3,
	},
	recordOuter: {
		width: 84,
		height: 84,
		borderRadius: 42,
		borderWidth: 4,
		borderColor: "rgba(255,255,255,0.5)",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.15)",
	},
	recordInner: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: "#E24B43",
	},
	stopInner: {
		width: 40,
		height: 40,
		borderRadius: 6,
		backgroundColor: "#E24B43",
	},
});
