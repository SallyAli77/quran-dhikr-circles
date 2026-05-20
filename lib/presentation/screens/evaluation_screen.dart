import 'dart:io';
import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/src/features/social/models/recitation_post_model.dart';
import 'package:circles_online_muslim_community/src/repository/recitation_repository/recitation_repository.dart';
import 'package:firebase_auth/firebase_auth.dart';

class EvaluationScreen extends StatefulWidget {
  final RecitationPostModel post;

  const EvaluationScreen({super.key, required this.post});

  @override
  State<EvaluationScreen> createState() => _EvaluationScreenState();
}

class _EvaluationScreenState extends State<EvaluationScreen> {
  late AudioPlayer _studentPlayer;
  late AudioPlayer _feedbackPlayer;
  late AudioRecorder _recorder;

  bool _isStudentPlaying = false;
  bool _isFeedbackPlaying = false;
  bool _isRecording = false;

  String? _recordedPath;
  final TextEditingController _feedbackController = TextEditingController();
  int _score = 5; // Default out of 5 stars
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _studentPlayer = AudioPlayer();
    _feedbackPlayer = AudioPlayer();
    _recorder = AudioRecorder();

    _studentPlayer.setUrl(widget.post.audioUrl);
    if (widget.post.feedback != null) {
      _feedbackController.text = widget.post.feedback!;
      _score = widget.post.score ?? 5;
    }
  }

  @override
  void dispose() {
    _studentPlayer.dispose();
    _feedbackPlayer.dispose();
    _recorder.dispose();
    _feedbackController.dispose();
    super.dispose();
  }

  Future<void> _toggleStudentPlay() async {
    if (_isStudentPlaying) {
      await _studentPlayer.pause();
      setState(() => _isStudentPlaying = false);
    } else {
      setState(() => _isStudentPlaying = true);
      await _studentPlayer.play();
      _studentPlayer.playerStateStream.listen((state) {
        if (state.processingState == ProcessingState.completed) {
          if (mounted) setState(() => _isStudentPlaying = false);
        }
      });
    }
  }

  Future<void> _toggleFeedbackPlay() async {
    if (_recordedPath == null) return;

    if (_isFeedbackPlaying) {
      await _feedbackPlayer.pause();
      setState(() => _isFeedbackPlaying = false);
    } else {
      await _feedbackPlayer.setFilePath(_recordedPath!);
      setState(() => _isFeedbackPlaying = true);
      _feedbackPlayer.play();
      _feedbackPlayer.playerStateStream.listen((state) {
        if (state.processingState == ProcessingState.completed) {
          if (mounted) setState(() => _isFeedbackPlaying = false);
        }
      });
    }
  }

  Future<void> _startRecording() async {
    try {
      if (await _recorder.hasPermission()) {
        final dir = await getApplicationDocumentsDirectory();
        final path = p.join(dir.path, 'feedback_${DateTime.now().millisecondsSinceEpoch}.m4a');

        await _recorder.start(const RecordConfig(), path: path);
        setState(() {
          _isRecording = true;
          _recordedPath = path;
        });
      }
    } catch (e) {
      print("Error starting feedback recording: $e");
    }
  }

  Future<void> _stopRecording() async {
    try {
      final path = await _recorder.stop();
      setState(() {
        _isRecording = false;
        _recordedPath = path;
      });
    } catch (e) {
      print("Error stopping feedback recording: $e");
    }
  }

  Future<void> _submit() async {
    if (_feedbackController.text.isEmpty && _recordedPath == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please write a comment or record a voice correction")),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      String? uploadUrl;
      if (_recordedPath != null) {
        final user = FirebaseAuth.instance.currentUser;
        if (user != null) {
          final file = File(_recordedPath!);
          uploadUrl = await RecitationRepository.instance.uploadAudio(file, user.uid);
        }
      }

      await RecitationRepository.instance.submitFeedback(
        widget.post.id!,
        _feedbackController.text,
        _score,
        voiceFeedbackUrl: uploadUrl,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Evaluation submitted successfully!")),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Error submitting evaluation: $e")));
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text("Evaluate Recitation"),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Student's recitation card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppTheme.card,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppTheme.border),
              ),
              child: Column(
                children: [
                  Text(
                    "${widget.post.userName}'s Recitation",
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "${widget.post.surahName} - Ayah ${widget.post.ayahIndex + 1}",
                    style: const TextStyle(color: AppTheme.textMuted),
                  ),
                  const SizedBox(height: 20),
                  const Divider(),
                  const SizedBox(height: 12),
                  GestureDetector(
                    onTap: _toggleStudentPlay,
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: const BoxDecoration(
                        color: AppTheme.quranTone,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        _isStudentPlaying ? LucideIcons.pause : LucideIcons.play,
                        color: AppTheme.quranText,
                        size: 32,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _isStudentPlaying ? "Playing Recitation..." : "Listen to Student's Recitation",
                    style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Interactive Star Rating System
            const Text("Select Rating Score", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: List.generate(5, (index) {
                final starScore = index + 1;
                return IconButton(
                  icon: Icon(
                    starScore <= _score ? Icons.star : Icons.star_border,
                    color: Colors.amber,
                    size: 40,
                  ),
                  onPressed: () {
                    setState(() {
                      _score = starScore;
                    });
                  },
                );
              }),
            ),
            const SizedBox(height: 32),

            // Written Corrections Comment
            const Text("Written Corrections & Comments", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            TextField(
              controller: _feedbackController,
              maxLines: 4,
              decoration: InputDecoration(
                hintText: "Explain errors in Tajweed, pronunciation, or Hifz here...",
                filled: true,
                fillColor: AppTheme.card,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: AppTheme.border),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: AppTheme.border),
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Teacher Voice Replies / Corrections Recorder
            const Text("Voice Corrections (تسميع)", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppTheme.card,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.border),
              ),
              child: Column(
                children: [
                  if (_recordedPath != null && !_isRecording) ...[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        IconButton(
                          icon: Icon(_isFeedbackPlaying ? LucideIcons.pause : LucideIcons.play),
                          color: AppTheme.tasbeehText,
                          onPressed: _toggleFeedbackPlay,
                        ),
                        const SizedBox(width: 8),
                        const Text("Preview your voice reply", style: TextStyle(fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 16),
                  ],
                  GestureDetector(
                    onTap: _isRecording ? _stopRecording : _startRecording,
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: _isRecording ? Colors.red : AppTheme.tasbeehText,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: (_isRecording ? Colors.red : AppTheme.tasbeehText).withOpacity(0.3),
                            blurRadius: 10,
                            spreadRadius: 2,
                          )
                        ],
                      ),
                      child: Icon(
                        _isRecording ? LucideIcons.square : LucideIcons.mic,
                        color: Colors.white,
                        size: 32,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    _isRecording ? "Recording Corrections..." : "Tap to record voice feedback",
                    style: TextStyle(
                      color: _isRecording ? Colors.red : AppTheme.textMuted,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 48),

            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: _isSubmitting
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text("Submit Evaluation", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
