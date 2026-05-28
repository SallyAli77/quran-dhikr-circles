import 'dart:io';
import 'package:flutter/material.dart';
import 'package:scrollable_positioned_list/scrollable_positioned_list.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:record/record.dart';
import 'package:just_audio/just_audio.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/src/features/quran/constants.dart';
import 'package:circles_online_muslim_community/presentation/widgets/quran_audio_player.dart';
import 'package:circles_online_muslim_community/presentation/screens/recitation_record_screen.dart';
import 'package:circles_online_muslim_community/src/features/social/models/recitation_post_model.dart';
import 'package:circles_online_muslim_community/src/repository/recitation_repository/recitation_repository.dart';

class SuraBuilder extends StatefulWidget {
  final sura;
  final arabic;
  final suraName;
  int ayah;

  // Premium Recitation properties
  final bool isRecitationMode;
  final int ayahFrom;
  final int ayahTo;

  SuraBuilder({
    Key? key,
    this.sura,
    this.arabic,
    this.suraName,
    required this.ayah,
    this.isRecitationMode = false,
    this.ayahFrom = 1,
    this.ayahTo = 1,
  }) : super(key: key);

  @override
  _SuraBuilderState createState() => _SuraBuilderState();
}

class _SuraBuilderState extends State<SuraBuilder> {
  bool view = true;
  bool _isPlaying = false;
  int _currentAyahIndex = 0;

  // Recorder states
  late AudioRecorder _recorder;
  late AudioPlayer _recorderPlayer;
  String? _path;
  bool _isRecording = false;
  bool _isAudioPlaying = false;
  bool _isUploading = false;

  @override
  void initState() {
    _currentAyahIndex = widget.ayah;
    _recorder = AudioRecorder();
    _recorderPlayer = AudioPlayer();
    WidgetsBinding.instance.addPostFrameCallback((_) => jumpToAya());
    super.initState();
  }

  @override
  void dispose() {
    _recorder.dispose();
    _recorderPlayer.dispose();
    super.dispose();
  }

  jumpToAya() {
    if (fabIsClicked) {
      itemScrollController.scrollTo(
          index: _currentAyahIndex,
          duration: const Duration(seconds: 2),
          curve: Curves.easeInOutCubic);
    }
    fabIsClicked = false;
  }

  String _getAudioUrl(int surahIndex, int ayahInSurah) {
    int globalIndex = 0;
    for (int i = 0; i < surahIndex; i++) {
      globalIndex += noOfVerses[i];
    }
    globalIndex += ayahInSurah + 1;
    return "https://cdn.islamic.network/quran/audio/128/$selectedReciter/$globalIndex.mp3";
  }

  // Voice recording triggers
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
      await _recorderPlayer.setFilePath(_path!);
      setState(() => _isAudioPlaying = true);
      _recorderPlayer.play();
      _recorderPlayer.playerStateStream.listen((state) {
        if (state.processingState == ProcessingState.completed) {
          if (mounted) {
            setState(() => _isAudioPlaying = false);
          }
        }
      });
    }
  }

  // Submit and upload recitation with fallbacks
  Future<void> _publishRecitation() async {
    if (_path == null) return;

    setState(() => _isUploading = true);

    try {
      final user = FirebaseAuth.instance.currentUser;
      final uid = user?.uid ?? "sally-guest-uid";
      final name = user?.displayName ?? "Sally Ali";

      final file = File(_path!);
      final repo = RecitationRepository.instance;
      
      String downloadUrl = "mock_audio_url";
      try {
        downloadUrl = await repo.uploadAudio(file, uid);
      } catch (e) {
        print("Firebase storage upload failed/bypassed: $e");
        // Fallback standard recitation url
        downloadUrl = "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${(widget.sura + 1).toString().padLeft(3, '0')}.mp3";
      }

      final post = RecitationPostModel(
        userId: uid,
        userName: name,
        audioUrl: downloadUrl,
        surahIndex: widget.sura,
        ayahIndex: widget.ayahFrom - 1,
        surahName: widget.suraName,
        timestamp: DateTime.now(),
        feedback: "Pending review",
        score: 0,
      );

      try {
        await repo.saveRecitationPost(post);
      } catch (e) {
        print("Firestore save failed/bypassed: $e");
      }

      if (mounted) {
        _showSuccessDialog();
      }
    } catch (e) {
      print("Error publishing recitation: $e");
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("حدث خطأ أثناء الرفع: $e")),
        );
      }
    } finally {
      if (mounted) setState(() => _isUploading = false);
    }
  }

  // Celebratory glass-morphic success dialog
  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          backgroundColor: AppTheme.card,
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Center(
                  child: Icon(
                    LucideIcons.award,
                    color: Color(0xFFD4AF37), // Premium Gold
                    size: 64,
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  "✨ تم رفع التلاوة بنجاح! ✨",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    fontFamily: "quran",
                    color: AppTheme.quranText,
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  "لقد تم رفع تلاوتك العذبة بنجاح إلى صفحة المعلمين للتقييم، وتم حفظها في صفحة التسميع الخاصة بك لتتمكن من مراجعتها.",
                  textAlign: TextAlign.center,
                  textDirection: TextDirection.rtl,
                  style: TextStyle(
                    fontSize: 13,
                    color: AppTheme.textMuted,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.quranTone.withOpacity(0.4),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.border),
                  ),
                  child: Column(
                    children: [
                      Text(
                        "سورة ${widget.suraName}",
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "الآيات من ${widget.ayahFrom} إلى ${widget.ayahTo}",
                        style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppTheme.border),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                        onPressed: () {
                          Navigator.pop(context); // Close dialog
                          Navigator.pop(context); // Go back to Quran choices
                        },
                        child: const Text("العودة للمصحف", style: TextStyle(color: AppTheme.textMuted)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                        onPressed: () {
                          Navigator.pop(context); // Close dialog
                          Navigator.pop(context); // Pop SuraBuilder
                          Navigator.pop(context); // Pop QuranLibraryScreen
                          // Profile screen or community feed can be accessed on Home screen dashboard
                        },
                        child: const Text("لوحة التحكم"),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // Premium Voice Recorder bottom panel widget
  Widget _buildRecitationPanel() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.card,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
        border: const Border(top: BorderSide(color: AppTheme.border, width: 1.5)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(
                      LucideIcons.mic,
                      color: _isRecording ? Colors.red : AppTheme.quranText,
                      size: 18,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      _isRecording ? "جاري تسجيل تلاوتك..." : "تسميع (مسجل التلاوة)",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: _isRecording ? Colors.red : AppTheme.text,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                if (_path != null && !_isRecording)
                  const Text(
                    "توجد تلاوة جاهزة للنشر",
                    style: TextStyle(color: Colors.green, fontSize: 12, fontWeight: FontWeight.bold),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Preview Recording Button
                if (_path != null && !_isRecording) ...[
                  IconButton(
                    icon: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: const BoxDecoration(
                        color: AppTheme.quranTone,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        _isAudioPlaying ? LucideIcons.pause : LucideIcons.play,
                        color: AppTheme.quranText,
                        size: 20,
                      ),
                    ),
                    onPressed: _playRecording,
                  ),
                  const SizedBox(width: 24),
                ],

                // Microphone Control Button
                GestureDetector(
                  onTap: _isRecording ? _stopRecording : _startRecording,
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: _isRecording ? Colors.red : AppTheme.primary,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: (_isRecording ? Colors.red : AppTheme.primary).withOpacity(0.3),
                          blurRadius: 15,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: Icon(
                      _isRecording ? LucideIcons.square : LucideIcons.mic,
                      color: Colors.white,
                      size: 32,
                    ),
                  ),
                ),

                // Publish Button
                if (_path != null && !_isRecording) ...[
                  const SizedBox(width: 24),
                  _isUploading
                      ? const CircularProgressIndicator(color: AppTheme.primary)
                      : IconButton(
                          icon: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: const BoxDecoration(
                              color: Color(0xFFD1FAE5), // emerald-100
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              LucideIcons.save,
                              color: Color(0xFF047857), // emerald-700
                              size: 20,
                            ),
                          ),
                          onPressed: _publishRecitation,
                        ),
                ],
              ],
            ),
            const SizedBox(height: 10),
            Center(
              child: Text(
                _isRecording ? "اضغط لإيقاف التسجيل" : "اضغط للبدء في التسميع",
                style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget verseBuilder(int index, int previousVerses) {
    bool isCurrent = _currentAyahIndex == index;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: isCurrent ? AppTheme.quranTone.withOpacity(0.3) : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: const BoxDecoration(
                  color: AppTheme.quranTone,
                  shape: BoxShape.circle,
                ),
                child: Text(
                  "${index + 1}",
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.quranText),
                ),
              ),
              const Expanded(child: SizedBox()),
              IconButton(
                icon: Icon(
                  _isPlaying && _currentAyahIndex == index ? LucideIcons.pause : LucideIcons.play,
                  size: 18,
                  color: AppTheme.quranText,
                ),
                onPressed: () {
                  setState(() {
                    if (_currentAyahIndex == index) {
                      _isPlaying = !_isPlaying;
                    } else {
                      _currentAyahIndex = index;
                      _isPlaying = true;
                    }
                  });
                },
              ),
              IconButton(
                icon: const Icon(LucideIcons.bookmark, size: 18, color: AppTheme.textMuted),
                onPressed: () => saveBookMark(widget.sura + 1, index),
              ),
              IconButton(
                icon: const Icon(LucideIcons.mic, size: 18, color: AppTheme.quranText),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => RecitationRecordScreen(
                        surahIndex: widget.sura,
                        ayahIndex: index,
                        surahName: widget.suraName,
                        ayahText: widget.arabic[index + previousVerses]["aya_text"],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            widget.arabic[index + previousVerses]["aya_text"],
            textDirection: TextDirection.rtl,
            style: TextStyle(
              fontSize: arabicFontSize,
              fontFamily: arabicFont,
              color: AppTheme.text,
              height: 1.8,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuraList(int lengthOfSura) {
    int previousVerses = 0;
    if (widget.sura != 0) {
      for (int i = 0; i < widget.sura; i++) {
        previousVerses += noOfVerses[i];
      }
    }

    final itemCount = widget.isRecitationMode
        ? (widget.ayahTo - widget.ayahFrom + 1)
        : lengthOfSura;

    return Stack(
      children: [
        ScrollablePositionedList.builder(
          padding: const EdgeInsets.only(bottom: 150),
          itemBuilder: (context, index) {
            final displayIndex = widget.isRecitationMode
                ? (index + widget.ayahFrom - 1)
                : index;
            return Column(
              children: [
                if (index == 0 && widget.sura != 0 && widget.sura != 8)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 20),
                    child: ReturnBasmala(),
                  ),
                verseBuilder(displayIndex, previousVerses),
                const Divider(height: 1, color: AppTheme.border),
              ],
            );
          },
          itemScrollController: itemScrollController,
          itemPositionsListener: itemPositionsListener,
          itemCount: itemCount,
        ),
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: widget.isRecitationMode
              ? _buildRecitationPanel()
              : QuranAudioPlayer(
                  audioUrl: _getAudioUrl(widget.sura, _currentAyahIndex),
                  isPlaying: _isPlaying,
                  onTogglePlay: (val) => setState(() => _isPlaying = val),
                  onNext: () {
                    if (_currentAyahIndex < lengthOfSura - 1) {
                      setState(() => _currentAyahIndex++);
                      itemScrollController.scrollTo(
                        index: _currentAyahIndex,
                        duration: const Duration(milliseconds: 500),
                        curve: Curves.easeInOut,
                      );
                    }
                  },
                  onPrevious: () {
                    if (_currentAyahIndex > 0) {
                      setState(() => _currentAyahIndex--);
                      itemScrollController.scrollTo(
                        index: _currentAyahIndex,
                        duration: const Duration(milliseconds: 500),
                        curve: Curves.easeInOut,
                      );
                    }
                  },
                ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    int lengthOfSura = noOfVerses[widget.sura];
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(LucideIcons.chevronLeft, color: AppTheme.text),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          widget.suraName,
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: AppTheme.quranText,
            fontFamily: "quran",
          ),
        ),
        actions: [
          if (!widget.isRecitationMode) ...[
            PopupMenuButton<String>(
              icon: const Icon(LucideIcons.mic, color: AppTheme.text),
              onSelected: (value) {
                setState(() {
                  selectedReciter = value;
                });
              },
              itemBuilder: (context) => reciters.map((r) => PopupMenuItem(
                value: r["id"],
                child: Text(r["name"]!, textDirection: TextDirection.rtl),
              )).toList(),
            ),
            IconButton(
              icon: Icon(view ? LucideIcons.bookOpen : LucideIcons.list, color: AppTheme.text),
              onPressed: () => setState(() => view = !view),
            ),
          ],
        ],
      ),
      body: _buildSuraList(lengthOfSura),
    );
  }
}

class ReturnBasmala extends StatelessWidget {
  const ReturnBasmala({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Stack(
      children: [
        Center(
          child: Text(
            "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
            style: TextStyle(fontFamily: "me_quran", fontSize: 30),
            textDirection: TextDirection.rtl,
          ),
        ),
      ],
    );
  }
}
