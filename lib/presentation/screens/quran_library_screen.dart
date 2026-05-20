import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/src/features/quran/constants.dart';
import 'package:circles_online_muslim_community/src/features/quran/sura_builder.dart';
import 'package:circles_online_muslim_community/src/features/quran/arabic_sura_number.dart';

class QuranLibraryScreen extends StatefulWidget {
  const QuranLibraryScreen({super.key});

  @override
  State<QuranLibraryScreen> createState() => _QuranLibraryScreenState();
}

class _QuranLibraryScreenState extends State<QuranLibraryScreen> {
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
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
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
                      arabic: quran[0],
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
      body: FutureBuilder(
        future: readJson(),
        builder: (BuildContext context, AsyncSnapshot snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: AppTheme.quranText));
          } else if (snapshot.hasError) {
            return const Center(child: Text("Error loading Quran data"));
          } else if (snapshot.hasData) {
            return _buildSurahList(snapshot.data);
          } else {
            return const Center(child: Text("No data found"));
          }
        },
      ),
    );
  }

  Widget _buildSurahList(dynamic quranData) {
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
                  decoration: BoxDecoration(
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
                        "Surah ${arabicName[i]["name"]}", // Arabic name as subtitle
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
