import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:just_audio/just_audio.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';

class AdhkarScreen extends StatefulWidget {
  const AdhkarScreen({super.key});

  @override
  State<AdhkarScreen> createState() => _AdhkarScreenState();
}

class _AdhkarScreenState extends State<AdhkarScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Track counts locally per category item
  final Map<String, int> _adhkarCounts = {};
  
  // Audio playback
  AudioPlayer? _player;
  String? _currentlyPlayingId;
  bool _isPlaying = false;

  final List<Map<String, dynamic>> _morningAdhkar = [
    {
      "id": "m1",
      "text": "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ.",
      "benefit": "من قالها حين يصبح أجير من الجن حتى يمسي.",
      "target": 1,
      "audio": "https://download.quranicaudio.com/quran/muhammad_ayyoub/002.mp3" // Proxy/placeholder MP3
    },
    {
      "id": "m2",
      "text": "قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ.",
      "benefit": "تكفيه من كل شيء عند الصباح والمساء (تقرأ 3 مرات).",
      "target": 3,
      "audio": "https://download.quranicaudio.com/quran/muhammad_ayyoub/112.mp3"
    },
    {
      "id": "m3",
      "text": "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
      "benefit": "لم يضره شيء في ذلك اليوم أو تلك الليلة.",
      "target": 3,
      "audio": "https://download.quranicaudio.com/quran/muhammad_ayyoub/001.mp3"
    },
    {
      "id": "m4",
      "text": "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
      "benefit": "سؤال خير اليوم والاستعاذة من شره.",
      "target": 1,
      "audio": "https://download.quranicaudio.com/quran/muhammad_ayyoub/001.mp3"
    }
  ];

  final List<Map<String, dynamic>> _eveningAdhkar = [
    {
      "id": "e1",
      "text": "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ...",
      "benefit": "من قالها حين يمسي أجير من الجن حتى يصبح.",
      "target": 1,
      "audio": "https://download.quranicaudio.com/quran/muhammad_ayyoub/002.mp3"
    },
    {
      "id": "e2",
      "text": "قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ.",
      "benefit": "تكفيه من كل شيء (تقرأ 3 مرات).",
      "target": 3,
      "audio": "https://download.quranicaudio.com/quran/muhammad_ayyoub/112.mp3"
    },
    {
      "id": "e3",
      "text": "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
      "benefit": "سؤال خير الليلة والاستعاذة من شرها.",
      "target": 1,
      "audio": "https://download.quranicaudio.com/quran/muhammad_ayyoub/001.mp3"
    },
    {
      "id": "e4",
      "text": "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
      "benefit": "حفظ وحماية تامة حتى يصبح.",
      "target": 3,
      "audio": "https://download.quranicaudio.com/quran/muhammad_ayyoub/001.mp3"
    }
  ];

  final List<Map<String, dynamic>> _sleepAdhkar = [
    {
      "id": "s1",
      "text": "بِاسْمِكَ رَبِّ وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.",
      "benefit": "من قال ذلك إذا أوى إلى فراشه غفرت ذنوبه وحفظ.",
      "target": 1,
      "audio": "https://download.quranicaudio.com/quran/muhammad_ayyoub/001.mp3"
    },
    {
      "id": "s2",
      "text": "اللَّهُمَّ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا. اللَّهُمَّ إِنِّي أَسْأَلُكَ العَافِيَةَ.",
      "benefit": "التحصين والنوم على الفطرة السليمة.",
      "target": 1,
      "audio": "https://download.quranicaudio.com/quran/muhammad_ayyoub/001.mp3"
    }
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _player = AudioPlayer();

    // Initialize counts
    for (var item in _morningAdhkar) {
      _adhkarCounts[item["id"]] = item["target"];
    }
    for (var item in _eveningAdhkar) {
      _adhkarCounts[item["id"]] = item["target"];
    }
    for (var item in _sleepAdhkar) {
      _adhkarCounts[item["id"]] = item["target"];
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    _player?.dispose();
    super.dispose();
  }

  Future<void> _toggleAudio(String id, String url) async {
    try {
      if (_currentlyPlayingId == id && _isPlaying) {
        await _player?.pause();
        setState(() => _isPlaying = false);
      } else {
        setState(() {
          _currentlyPlayingId = id;
          _isPlaying = true;
        });
        await _player?.setUrl(url);
        _player?.play();
        _player?.playerStateStream.listen((state) {
          if (state.processingState == ProcessingState.completed) {
            if (mounted) {
              setState(() {
                _isPlaying = false;
                _currentlyPlayingId = null;
              });
            }
          }
        });
      }
    } catch (e) {
      print("Error playing adhkar audio: $e");
    }
  }

  void _decrementCount(String id) {
    int current = _adhkarCounts[id] ?? 0;
    if (current > 0) {
      HapticFeedback.lightImpact();
      setState(() {
        _adhkarCounts[id] = current - 1;
        if (current - 1 == 0) {
          HapticFeedback.mediumImpact();
        }
      });
    }
  }

  void _resetCounts(List<Map<String, dynamic>> items) {
    setState(() {
      for (var item in items) {
        _adhkarCounts[item["id"]] = item["target"];
      }
    });
    HapticFeedback.mediumImpact();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text("Daily Adhkar (أذكار)", style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppTheme.adhkarText,
          labelColor: AppTheme.adhkarText,
          unselectedLabelColor: AppTheme.textMuted,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
          tabs: const [
            Tab(text: "الصباح"),
            Tab(text: "المساء"),
            Tab(text: "النوم"),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildAdhkarList(_morningAdhkar),
          _buildAdhkarList(_eveningAdhkar),
          _buildAdhkarList(_sleepAdhkar),
        ],
      ),
    );
  }

  Widget _buildAdhkarList(List<Map<String, dynamic>> items) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton.icon(
                onPressed: () => _resetCounts(items),
                icon: const Icon(LucideIcons.refreshCw, size: 16, color: AppTheme.adhkarText),
                label: const Text("Reset All", style: TextStyle(color: AppTheme.adhkarText, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 80),
            itemCount: items.length,
            separatorBuilder: (context, index) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              final item = items[index];
              final id = item["id"];
              final count = _adhkarCounts[id] ?? 0;
              final target = item["target"];
              final isCompleted = count == 0;
              final isPlayingThis = _currentlyPlayingId == id && _isPlaying;

              return AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: isCompleted ? AppTheme.adhkarTone.withOpacity(0.4) : AppTheme.card,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: isCompleted ? AppTheme.adhkarText.withOpacity(0.3) : AppTheme.border,
                    width: isCompleted ? 2 : 1,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Arabic recitation text
                    Text(
                      item["text"],
                      textDirection: TextDirection.rtl,
                      style: TextStyle(
                        fontSize: 20,
                        height: 1.6,
                        fontFamily: "quran",
                        fontWeight: FontWeight.bold,
                        color: isCompleted ? AppTheme.primary.withOpacity(0.6) : AppTheme.primary,
                      ),
                    ),
                    const SizedBox(height: 12),
                    // Virtue description
                    Text(
                      item["benefit"],
                      textDirection: TextDirection.rtl,
                      style: TextStyle(
                        fontSize: 12,
                        color: isCompleted ? AppTheme.textMuted.withOpacity(0.6) : AppTheme.textMuted,
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Divider(),
                    const SizedBox(height: 8),
                    // Controls Row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Audio recitation play button
                        IconButton(
                          icon: Icon(isPlayingThis ? LucideIcons.pause : LucideIcons.volume2),
                          color: isCompleted ? AppTheme.adhkarText.withOpacity(0.5) : AppTheme.adhkarText,
                          onPressed: () => _toggleAudio(id, item["audio"]),
                        ),
                        // Circular Tap Counter Button
                        GestureDetector(
                          onTap: () => _decrementCount(id),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                            decoration: BoxDecoration(
                              color: isCompleted ? Colors.green : AppTheme.adhkarText,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              children: [
                                if (isCompleted) ...[
                                  const Icon(LucideIcons.check, color: Colors.white, size: 16),
                                  const SizedBox(width: 8),
                                  const Text("Completed", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                ] else ...[
                                  Text(
                                    "$count / $target",
                                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                                  ),
                                ]
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
