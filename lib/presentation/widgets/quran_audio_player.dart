import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';

class QuranAudioPlayer extends StatefulWidget {
  final String audioUrl;
  final VoidCallback onNext;
  final VoidCallback onPrevious;
  final bool isPlaying;
  final Function(bool) onTogglePlay;

  const QuranAudioPlayer({
    super.key,
    required this.audioUrl,
    required this.onNext,
    required this.onPrevious,
    required this.isPlaying,
    required this.onTogglePlay,
  });

  @override
  State<QuranAudioPlayer> createState() => _QuranAudioPlayerState();
}

class _QuranAudioPlayerState extends State<QuranAudioPlayer> {
  late AudioPlayer _player;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _player = AudioPlayer();
    _initAudio();
  }

  Future<void> _initAudio() async {
    try {
      setState(() => _isLoading = true);
      await _player.setUrl(widget.audioUrl);
      setState(() => _isLoading = false);
      if (widget.isPlaying) {
        _player.play();
      }
    } catch (e) {
      print("Error loading audio: $e");
    }
  }

  @override
  void didUpdateWidget(QuranAudioPlayer oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.audioUrl != widget.audioUrl) {
      _initAudio();
    }
    if (oldWidget.isPlaying != widget.isPlaying) {
      if (widget.isPlaying) {
        _player.play();
      } else {
        _player.pause();
      }
    }
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: BoxDecoration(
        color: AppTheme.card,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          StreamBuilder<Duration>(
            stream: _player.positionStream,
            builder: (context, snapshot) {
              final position = snapshot.data ?? Duration.zero;
              final duration = _player.duration ?? Duration.zero;
              return SliderTheme(
                data: SliderTheme.of(context).copyWith(
                  trackHeight: 4,
                  thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                  overlayShape: const RoundSliderOverlayShape(overlayRadius: 12),
                  activeTrackColor: AppTheme.quranText,
                  inactiveTrackColor: AppTheme.quranTone,
                  thumbColor: AppTheme.quranText,
                ),
                child: Slider(
                  value: position.inMilliseconds.toDouble(),
                  max: duration.inMilliseconds.toDouble() > 0 
                      ? duration.inMilliseconds.toDouble() 
                      : 1.0,
                  onChanged: (value) {
                    _player.seek(Duration(milliseconds: value.toInt()));
                  },
                ),
              );
            },
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              IconButton(
                icon: const Icon(LucideIcons.skipBack, color: AppTheme.text),
                onPressed: widget.onPrevious,
              ),
              GestureDetector(
                onTap: () => widget.onTogglePlay(!widget.isPlaying),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: const BoxDecoration(
                    color: AppTheme.quranText,
                    shape: BoxShape.circle,
                  ),
                  child: _isLoading 
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      )
                    : Icon(
                        widget.isPlaying ? LucideIcons.pause : LucideIcons.play,
                        color: Colors.white,
                      ),
                ),
              ),
              IconButton(
                icon: const Icon(LucideIcons.skipForward, color: AppTheme.text),
                onPressed: widget.onNext,
              ),
            ],
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}
