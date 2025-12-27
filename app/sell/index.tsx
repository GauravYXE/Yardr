// app/sell/index.tsx
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { saveSellDraft } from "@/lib/draftSale";

function StepHeader() {
	return (
		<View style={styles.stepWrap}>
			<Text style={styles.title}>Add Sale</Text>

			<View style={styles.stepsRow}>
				<View style={styles.stepItem}>
					<View style={[styles.stepCircle, styles.stepActive]}>
						<IconSymbol name="video.fill" size={22} color="#fff" />
					</View>
					<Text style={[styles.stepLabel, styles.stepLabelActive]}>
						Record Video
					</Text>
				</View>

				<View style={styles.stepLine} />

				<View style={styles.stepItem}>
					<View style={styles.stepCircle}>
						<IconSymbol name="eye.fill" size={22} color="#B8B1A9" />
					</View>
					<Text style={styles.stepLabel}>Review</Text>
				</View>

				<View style={styles.stepLine} />

				<View style={styles.stepItem}>
					<View style={styles.stepCircle}>
						<IconSymbol
							name="checkmark.circle.fill"
							size={22}
							color="#B8B1A9"
						/>
					</View>
					<Text style={styles.stepLabel}>Publish</Text>
				</View>
			</View>
		</View>
	);
}

export default function RecordVideoScreen() {
	const cameraRef = useRef<CameraView>(null);
	const [permission, requestPermission] = useCameraPermissions();
	const [isRecording, setIsRecording] = useState(false);
	const [cameraReady, setCameraReady] = useState(false);

	useEffect(() => {
		if (permission && !permission.granted) {
			requestPermission();
		}
	}, [permission]);

	const toggleRecording = async () => {
		if (!cameraRef.current || !cameraReady) return;

		if (isRecording) {
			cameraRef.current.stopRecording();
			setIsRecording(false);
		} else {
			setIsRecording(true);

			try {
				const video = await cameraRef.current.recordAsync({
					maxDuration: 5, // seconds
				});

				if (!video?.uri) {
					Alert.alert("Recording Failed", "No video was recorded.");
					return;
				}

				await saveSellDraft({ videoUri: video.uri });

				router.replace({
					pathname: "/sell/video",
					params: { videoUri: video.uri },
				});
			} catch (error) {
				console.error("Recording error:", error);
				Alert.alert("Recording Error", "Failed to record video.");
			} finally {
				setIsRecording(false);
			}
		}
	};

	if (!permission?.granted) {
		return (
			<View style={styles.container}>
				<Text style={{ textAlign: "center", marginBottom: 20 }}>
					Camera permission is required to record a video.
				</Text>
				<TouchableOpacity onPress={requestPermission}>
					<Text style={{ color: "#E9833A", fontWeight: "bold" }}>
						Grant Permission
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<StepHeader />

			<View style={styles.infoBox}>
				<Text style={styles.infoText}>
					Record a video walkthrough of your sale items (minimum 5 seconds). Our
					AI will analyze it and generate tags automatically.
				</Text>
			</View>

			<View style={styles.cameraBox}>
				<CameraView
					ref={cameraRef}
					style={StyleSheet.absoluteFill}
					facing="back"
					mode="video" // ← THIS IS THE CRITICAL FIX FOR SDK 51+
					onCameraReady={() => setCameraReady(true)}
				/>

				<TouchableOpacity
					style={[
						styles.recordButton,
						!cameraReady && styles.recordButtonDisabled,
					]}
					onPress={toggleRecording}
					disabled={!cameraReady}
					activeOpacity={0.9}
				>
					<IconSymbol
						name={isRecording ? "stop.fill" : "video.fill"}
						size={26}
						color="#fff"
					/>
				</TouchableOpacity>

				<Text style={styles.recordHint}>
					{!cameraReady
						? "Camera loading..."
						: isRecording
						? "Recording… tap to stop"
						: "Tap to start recording (5 seconds)"}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAF7F2",
		paddingHorizontal: 18,
	},

	title: {
		textAlign: "center",
		fontSize: 22,
		fontWeight: "800",
		marginTop: 16,
	},

	stepWrap: { marginBottom: 18 },

	stepsRow: {
		marginTop: 14,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},

	stepItem: { alignItems: "center", width: 110 },

	stepCircle: {
		width: 52,
		height: 52,
		borderRadius: 26,
		backgroundColor: "#EEE7DD",
		alignItems: "center",
		justifyContent: "center",
	},

	stepActive: {
		backgroundColor: "#E9833A",
	},

	stepLabel: {
		marginTop: 8,
		fontSize: 13,
		color: "#9A9289",
		fontWeight: "700",
	},

	stepLabelActive: {
		color: "#E9833A",
	},

	stepLine: {
		width: 42,
		height: 4,
		borderRadius: 2,
		backgroundColor: "#E6E1DA",
	},

	infoBox: {
		backgroundColor: "#FFF5E8",
		borderRadius: 18,
		padding: 16,
		marginBottom: 18,
	},

	infoText: {
		fontSize: 15,
		lineHeight: 22,
		color: "#6B625A",
		textAlign: "center",
		fontWeight: "600",
	},

	cameraBox: {
		height: 280,
		borderRadius: 24,
		backgroundColor: "#000",
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center",
	},

	recordButton: {
		width: 86,
		height: 86,
		borderRadius: 43,
		backgroundColor: "#D9413A",
		alignItems: "center",
		justifyContent: "center",
	},

	recordButtonDisabled: {
		backgroundColor: "#A09A94",
	},

	recordHint: {
		position: "absolute",
		bottom: 18,
		color: "#fff",
		fontWeight: "700",
	},
});
