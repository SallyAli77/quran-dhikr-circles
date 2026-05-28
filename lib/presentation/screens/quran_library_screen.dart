import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/src/features/quran/constants.dart';
import 'package:circles_online_muslim_community/src/features/quran/sura_builder.dart';
import 'package:circles_online_muslim_community/src/features/quran/arabic_sura_number.dart';

enum QuranMode { none, recitation, listening }

class QuranLibraryScreen extends StatefulWidget {
  const QuranLibraryScreen({super.key});

  @override
  State<QuranLibraryScreen> createState() => _QuranLibraryScreenState();
}

class _QuranLibraryScreenState extends State<QuranLibraryScreen> {
  QuranMode activeMode = QuranMode.none;
  dynamic quranData;
  bool isLoading = true;

  // Juz' to 1-indexed Surah numbers mapping
  final Map<int, List<int>> juzSurahs = {
    1: [1, 2],
    2: [2],
    3: [2, 3],
    4: [3, 4],
    5: [4],
    6: [4, 5],
    7: [5, 6],
    8: [6, 7],
    9: [7, 8],
    10: [8, 9],
    11: [9, 10, 11],
    12: [11, 12],
    13: [12, 13, 14],
    14: [15, 16],
    15: [17, 18],
    16: [18, 19, 20],
    17: [21, 22],
    18: [23, 24, 25],
    19: [25, 26, 27],
    20: [27, 28, 29],
    21: [29, 30, 31, 32, 33],
    22: [33, 34, 35, 36],
    23: [36, 37, 38, 39],
    24: [39, 40, 41],
    25: [41, 42, 43, 44, 45],
    26: [46, 47, 48, 49, 50, 51],
    27: [51, 52, 53, 54, 55, 56, 57],
    28: [58, 59, 60, 61, 62, 63, 64, 65, 66],
    29: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77],
    30: List.generate(37, (i) => 78 + i) // 78 to 114
  };

  @override
  void initState() {
    super.initState();
    loadQuranData();
  }

  Future<void> loadQuranData() async {
    final data = await readJson();
    if (mounted) {
      setState(() {
        quranData = data;
        isLoading = false;
      });
    }
  }

  // Opens the gorgeous Tasmee' setup dialog popup
  void _showTasmeeSetupDialog() {
    int? selectedJuz;
    int? selectedSurahIndex;
    int? ayahFrom;
    int? ayahTo;

    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            final filteredSurahNumbers = selectedJuz != null ? juzSurahs[selectedJuz] : null;

            return Dialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              backgroundColor: AppTheme.card,
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Header
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppTheme.quranTone,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(LucideIcons.mic, color: AppTheme.quranText),
                          ),
                          const SizedBox(width: 16),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "إعداد جلسة التسميع",
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    fontFamily: "quran",
                                  ),
                                ),
                                Text(
                                  "اختر الجزء والسورة ونطاق الآيات",
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: AppTheme.textMuted,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Step 1: Select Juz'
                      const Text(
                        "1. اختر الجزء الشريف",
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.text),
                        textDirection: TextDirection.rtl,
                      ),
                      const SizedBox(height: 8),
                      DropdownButtonFormField<int>(
                        value: selectedJuz,
                        decoration: _inputDecoration("اختر الجزء"),
                        alignment: Alignment.centerRight,
                        items: List.generate(30, (i) => i + 1).map((juzNum) {
                          return DropdownMenuItem<int>(
                            value: juzNum,
                            alignment: Alignment.centerRight,
                            child: Text(
                              "الجزء $juzNum",
                              textDirection: TextDirection.rtl,
                              style: const TextStyle(fontSize: 14),
                            ),
                          );
                        }).toList(),
                        onChanged: (val) {
                          setDialogState(() {
                            selectedJuz = val;
                            selectedSurahIndex = null;
                            ayahFrom = null;
                            ayahTo = null;
                          });
                        },
                      ),
                      const SizedBox(height: 18),

                      // Step 2: Select Surah
                      if (selectedJuz != null) ...[
                        const Text(
                          "2. اختر السورة الكريمة",
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.text),
                          textDirection: TextDirection.rtl,
                        ),
                        const SizedBox(height: 8),
                        DropdownButtonFormField<int>(
                          value: selectedSurahIndex,
                          decoration: _inputDecoration("اختر السورة"),
                          alignment: Alignment.centerRight,
                          items: filteredSurahNumbers!.map((suraNum) {
                            final idx = suraNum - 1;
                            final name = arabicName[idx]["name"];
                            return DropdownMenuItem<int>(
                              value: idx,
                              alignment: Alignment.centerRight,
                              child: Text(
                                "$suraNum. سورة $name",
                                textDirection: TextDirection.rtl,
                                style: const TextStyle(fontSize: 14),
                              ),
                            );
                          }).toList(),
                          onChanged: (val) {
                            setDialogState(() {
                              selectedSurahIndex = val;
                              ayahFrom = null;
                              ayahTo = null;
                            });
                          },
                        ),
                        const SizedBox(height: 18),
                      ],

                      // Step 3: Ayah Ranges
                      if (selectedSurahIndex != null) ...[
                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text("إلى الآية", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                                  const SizedBox(height: 6),
                                  DropdownButtonFormField<int>(
                                    value: ayahTo,
                                    decoration: _inputDecoration("الكل"),
                                    items: List.generate(
                                      noOfVerses[selectedSurahIndex!],
                                      (i) => i + 1,
                                    ).where((a) => ayahFrom == null || a >= ayahFrom!).map((a) {
                                      return DropdownMenuItem<int>(
                                        value: a,
                                        child: Text("$a"),
                                      );
                                    }).toList(),
                                    onChanged: (val) {
                                      setDialogState(() {
                                        ayahTo = val;
                                      });
                                    },
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text("من الآية", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                                  const SizedBox(height: 6),
                                  DropdownButtonFormField<int>(
                                    value: ayahFrom,
                                    decoration: _inputDecoration("1"),
                                    items: List.generate(
                                      noOfVerses[selectedSurahIndex!],
                                      (i) => i + 1,
                                    ).map((a) {
                                      return DropdownMenuItem<int>(
                                        value: a,
                                        child: Text("$a"),
                                      );
                                    }).toList(),
                                    onChanged: (val) {
                                      setDialogState(() {
                                        ayahFrom = val;
                                        if (ayahTo != null && val != null && ayahTo! < val) {
                                          ayahTo = null;
                                        }
                                      });
                                    },
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                      ],

                      // Actions
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              style: OutlinedButton.styleFrom(
                                side: const BorderSide(color: AppTheme.border),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                padding: const EdgeInsets.symmetric(vertical: 14),
                              ),
                              onPressed: () => Navigator.pop(context),
                              child: const Text("إلغاء", style: TextStyle(color: AppTheme.textMuted)),
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
                              onPressed: selectedSurahIndex == null
                                  ? null
                                  : () {
                                      Navigator.pop(context); // Close dialog
                                      // Navigate to SuraBuilder with recitation parameters!
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => SuraBuilder(
                                            arabic: quranData[0],
                                            sura: selectedSurahIndex!,
                                            suraName: arabicName[selectedSurahIndex!]["name"],
                                            ayah: 0,
                                            isRecitationMode: true,
                                            ayahFrom: ayahFrom ?? 1,
                                            ayahTo: ayahTo ?? noOfVerses[selectedSurahIndex!],
                                          ),
                                        ),
                                      );
                                    },
                              child: const Text("ابدأ التسميع والـتسجيل"),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppTheme.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppTheme.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppTheme.primary, width: 1.5),
      ),
      filled: true,
      fillColor: Colors.grey[50],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          "القرآن الكريم",
          style: TextStyle(
            color: AppTheme.text,
            fontWeight: FontWeight.bold,
            fontFamily: "quran",
            fontSize: 28,
          ),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(LucideIcons.chevronLeft, color: AppTheme.text),
          onPressed: () {
            if (activeMode != QuranMode.none) {
              setState(() {
                activeMode = QuranMode.none;
              });
            } else {
              Navigator.pop(context);
            }
          },
        ),
        actions: [
          if (activeMode == QuranMode.listening)
            IconButton(
              icon: const Icon(LucideIcons.bookmark, color: AppTheme.quranText),
              onPressed: () async {
                fabIsClicked = true;
                if (await readBookmark() == true) {
                  if (!mounted) return;
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => SuraBuilder(
                        arabic: quranData[0],
                        sura: bookmarkedSura - 1,
                        suraName: arabicName[bookmarkedSura - 1]["name"],
                        ayah: bookmarkedAyah,
                      ),
                    ),
                  );
                }
              },
            ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.quranText))
          : activeMode == QuranMode.none
              ? _buildChoiceScreen()
              : _buildSurahList(),
    );
  }

  // 1. Landing Choice Screen (Tilaawah vs Tasmee')
  Widget _buildChoiceScreen() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Center(
            child: Icon(
              LucideIcons.bookOpen,
              color: AppTheme.quranText,
              size: 52,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            "خدمات القرآن الكريم الفاخرة",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              fontFamily: "quran",
              color: AppTheme.text,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            "اختر طريقتك للتفاعل مع كتاب الله عز وجل اليوم",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.textMuted,
            ),
          ),
          const SizedBox(height: 40),

          // 1. Recitation Card (تسميع)
          GestureDetector(
            onTap: _showTasmeeSetupDialog,
            child: _buildCategoryCard(
              title: "تسميع القرآن الكريم",
              badge: "تسميع وتصحيح ✧",
              description:
                  "سجل تلاوتك العذبة من الجزء والسور المختارة، وأرسلها للمعلمين والقرّاء المعتمدين لتصحيح تلاوتك والحصول على تقييم وتوجيه دقيق.",
              icon: LucideIcons.mic,
              iconColor: const Color(0xFFEF4444), // red-500
              iconBgColor: const Color(0xFFFEE2E2), // red-100
            ),
          ),
          const SizedBox(height: 20),

          // 2. Listening Card (تلاوة)
          GestureDetector(
            onTap: () {
              setState(() {
                activeMode = QuranMode.listening;
              });
            },
            child: _buildCategoryCard(
              title: "تلاوة القرآن الكريم",
              badge: "تلاوة وقراءة ✧",
              description:
                  "تصفح كافة السور الـ 114 بالرسم العثماني الفاخر مع تراجم شريفة متعددة، واستمع لتلاوة عطرة بأصوات مشاهير القرّاء بجودة عالية.",
              icon: LucideIcons.volume2,
              iconColor: AppTheme.quranText,
              iconBgColor: AppTheme.quranTone,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryCard({
    required String title,
    required String badge,
    required String description,
    required IconData icon,
    required Color iconColor,
    required Color iconBgColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.card,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 15,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: iconBgColor,
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: iconColor, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        fontFamily: "quran",
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      badge,
                      style: TextStyle(
                        fontSize: 12,
                        color: iconColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            description,
            textDirection: TextDirection.rtl,
            style: const TextStyle(
              fontSize: 13,
              color: AppTheme.textMuted,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  // 2. Surah Directory List View
  Widget _buildSurahList() {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: 114,
      separatorBuilder: (context, index) => const SizedBox(height: 12),
      itemBuilder: (context, i) {
        return GestureDetector(
          onTap: () {
            fabIsClicked = false;
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => SuraBuilder(
                  arabic: quranData[0],
                  sura: i,
                  suraName: arabicName[i]["name"],
                  ayah: 0,
                ),
              ),
            );
          },
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.card,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.border),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.quranTone.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  alignment: Alignment.center,
                  decoration: const BoxDecoration(
                    color: AppTheme.quranTone,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    "${i + 1}",
                    style: const TextStyle(
                      color: AppTheme.quranText,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Surah ${arabicName[i]["name"]}",
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        "${noOfVerses[i]} Verses",
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppTheme.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  arabicName[i]["name"],
                  style: const TextStyle(
                    fontSize: 24,
                    fontFamily: "quran",
                    color: AppTheme.quranText,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
