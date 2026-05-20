import 'dart:io';
import 'package:flutter/material.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'package:just_audio/just_audio.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:circles_online_muslim_community/src/features/social/models/recitation_post_model.dart';
import 'package:circles_online_muslim_community/src/repository/recitation_repository/recitation_repository.dart';
import 'package:get/get.dart';

class RecitationRecordScreen extends StatefulWidget {
  final int surahIndex;
  final int ayahIndex;
  final String surahName;
  final String ayahText;

  const RecitationRecordScreen({
    super.key,
    required this.surahIndex,
    required this.ayahIndex,
    required this.surahName,
    required this.ayahText,
  });

  @override
  State<RecitationRecordScreen> createState() => _RecitationRecordScreenState();
}

class _RecitationRecordScreenState extends State<RecitationRecordScreen> {
  late AudioRecorder _recorder;
  late AudioPlayer _player;
  String? _path;
  bool _isRecording = false;
  bool _isPlaying = false;
  bool _isUploading = false;
  Duration _duration = Duration.zero;

  @override
  void initState() {
    super.initState();
    _recorder = AudioRecorder();
    _player = AudioPlayer();
  }

  @override
  void dispose() {
    _recorder.dispose();
    _player.dispose();
    super.dispose();
  }

  Future<void> _startRecording() async {
    try {
      if (await _recorder.hasPermission()) {
        final dir = await getApplicationDocumentsDirectory();
        final path = p.join(dir.path, 'recitation_${DateTime.now().millisecondsSinceEpoch}.m4a');
        
        await _recorder.start(const RecordConfig(), path: path);
        setState(() {
          _isRecording = true;
          _path = path;
        });
      }
    } catch (e) {
      print("Error starting recording: $e");
    }
  }

  Future<void> _stopRecording() async {
    try {
      final path = await _recorder.stop();
      setState(() {
        _isRecording = false;
        _path = path;
      });
    } catch (e) {
      print("Error stopping recording: $e");
    }
  }

  Future<void> _playRecording() async {
    if (_path != null) {
      await _player.setFilePath(_path!);
      setState(() => _isPlaying = true);
      _player.play();
      _player.playerStateStream.listen((state) {
        if (state.processingState == ProcessingState.completed) {
          setState(() => _isPlaying = false);
        }
      });
    }
  }

  Future<void> _publishRecitation() async {
    if (_path == null) return;

    setState(() => _isUploading = true);

    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) throw "User not logged in";

      final file = File(_path!);
      final repo = RecitationRepository.instance;
      
      final downloadUrl = await repo.uploadAudio(file, user.uid);

      final post = RecitationPostModel(
        userId: user.uid,
        userName: user.displayName ?? "Anonymous",
        audioUrl: downloadUrl,
        surahIndex: widget.surahIndex,
        ayahIndex: widget.ayahIndex,
        surahName: widget.surahName,
        timestamp: DateTime.now(),
      );

      await repo.saveRecitationPost(post);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Recitation published successfully!")),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      print("Error publishing: $e");
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: $e")),
        );
      }
    } finally {
      if (mounted) setState(() => _isUploading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text("Record Recitation"),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
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
                    "${widget.surahName} - Ayah ${widget.ayahIndex + 1}",
                    style: const TextStyle(
                      color: AppTheme.quranText,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    widget.ayahText,
                    textDirection: TextDirection.rtl,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 24,
                      fontFamily: "quran",
                      height: 1.8,
                    ),
                  ),
                ],
              ),
            ),
            const Spacer(),
            if (_path != null && !_isRecording) ...[
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    icon: Icon(_isPlaying ? LucideIcons.pause : LucideIcons.play),
                    onPressed: _playRecording,
                  ),
                  const Text("Preview Recording"),
                ],
              ),
              const SizedBox(height: 20),
            ],
            GestureDetector(
              onTap: _isRecording ? _stopRecording : _startRecording,
              child: Container(
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: _isRecording ? Colors.red : AppTheme.quranText,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: (_isRecording ? Colors.red : AppTheme.quranText).withOpacity(0.3),
                      blurRadius: 20,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: Icon(
                  _isRecording ? LucideIcons.square : LucideIcons.mic,
                  color: Colors.white,
                  size: 48,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              _isRecording ? "Recording..." : "Tap to record",
              style: TextStyle(
                color: _isRecording ? Colors.red : AppTheme.textMuted,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Spacer(),
            if (_path != null && !_isRecording)
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: _isUploading ? null : _publishRecitation,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: _isUploading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text("Publish Recitation"),
                ),
              ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
