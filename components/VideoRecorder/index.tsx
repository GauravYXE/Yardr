import { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Video, ResizeMode } from 'expo-av';
import { ThemedText } from '@/components/themed-text';

import styles from './styles';

interface VideoRecorderProps {
  onVideoRecorded: (videoUri: string, frames: string[]) => void;
  onCancel: () => void;
}

export default function VideoRecorder({ onVideoRecorded, onCancel }: VideoRecorderProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  if (!permission) {
    return <View style={styles.container}><ThemedText>Loading...</ThemedText></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.message}>We need camera permission</ThemedText>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const startRecording = async () => {
    if (!cameraRef.current) return;

    try {
      // 3-second countdown
      for (let i = 3; i > 0; i--) {
        setCountdown(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setCountdown(null);

      setIsRecording(true);

      const video = await cameraRef.current.recordAsync({
        maxDuration: 5,
      });

      setIsRecording(false);
      setRecordedVideo(video.uri);
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  const extractFrames = async (videoUri: string): Promise<string[]> => {
    // Placeholder: in production we would extract frames at intervals
    console.log('Video recorded at:', videoUri);
    return [];
  };

  const handleUseVideo = async () => {
    if (!recordedVideo) return;

    setProcessing(true);
    try {
      const frames = await extractFrames(recordedVideo);
      onVideoRecorded(recordedVideo, frames);
    } catch (error) {
      console.error('Error processing video:', error);
      Alert.alert('Error', 'Failed to process video');
    } finally {
      setProcessing(false);
    }
  };

  const handleRetake = () => {
    setRecordedVideo(null);
    setCountdown(null);
  };

  if (recordedVideo) {
    return (
      <View style={styles.container}>
        <Video
          source={{ uri: recordedVideo }}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          shouldPlay
        />

        {processing ? (
          <View style={styles.processingContainer}>
            <ThemedText style={styles.processingText}>
              Analyzing video with AI...
            </ThemedText>
          </View>
        ) : (
          <View style={styles.controls}>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleRetake}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleUseVideo}>
              <Text style={styles.buttonText}>Use Video</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing="back"
        mode="video"
      >
        {countdown !== null && (
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        )}

        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <ThemedText style={styles.recordingText}>Recording...</ThemedText>
          </View>
        )}

        <View style={styles.controls}>
          {!isRecording && !countdown && (
            <>
              <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onCancel}>
                <Text style={styles.buttonText}>Skip Video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
                <View style={styles.recordButtonInner} />
              </TouchableOpacity>
            </>
          )}

          {isRecording && (
            <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
              <View style={styles.stopButtonInner} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.instructionsContainer}>
          <ThemedText style={styles.instructionsText}>
            📹 Record a 5-second video (Optional)
          </ThemedText>
          <ThemedText style={styles.instructionsSubtext}>
            AI will auto-fill your listing, or tap the Skip Video button to fill manually
          </ThemedText>
        </View>
      </CameraView>
    </View>
  );
}

