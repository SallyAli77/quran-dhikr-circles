import 'package:flutter/material.dart';
import 'package:scrollable_positioned_list/scrollable_positioned_list.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/src/features/quran/constants.dart';
import 'package:circles_online_muslim_community/presentation/widgets/quran_audio_player.dart';
import 'package:circles_online_muslim_community/presentation/screens/recitation_record_screen.dart';

class SuraBuilder extends StatefulWidget {
  final sura;
  final arabic;
  final suraName;
  int ayah;

  SuraBuilder({
    Key? key,
    this.sura,
    this.arabic,
    this.suraName,
    required this.ayah,
  }) : super(key: key);

  @override
  _SuraBuilderState createState() => _SuraBuilderState();
}

class _SuraBuilderState extends State<SuraBuilder> {
  bool view = true;
  bool _isPlaying = false;
  int _currentAyahIndex = 0;

  @override
  void initState() {
    _currentAyahIndex = widget.ayah;
    WidgetsBinding.instance.addPostFrameCallback((_) => jumpToAya());
    super.initState();
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
    // Calculate global ayah index (approximate if not exact)
    int globalIndex = 0;
    for (int i = 0; i < surahIndex; i++) {
      globalIndex += noOfVerses[i];
    }
    globalIndex += ayahInSurah + 1;
    return "https://cdn.islamic.network/quran/audio/128/$selectedReciter/$globalIndex.mp3";
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
                decoration: BoxDecoration(
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

    return Stack(
      children: [
        ScrollablePositionedList.builder(
          padding: const EdgeInsets.only(bottom: 150),
          itemBuilder: (context, index) {
            return Column(
              children: [
                if (index == 0 && widget.sura != 0 && widget.sura != 8)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 20),
                    child: ReturnBasmala(),
                  ),
                verseBuilder(index, previousVerses),
                const Divider(height: 1, color: AppTheme.border),
              ],
            );
          },
          itemScrollController: itemScrollController,
          itemPositionsListener: itemPositionsListener,
          itemCount: lengthOfSura,
        ),
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: QuranAudioPlayer(
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
