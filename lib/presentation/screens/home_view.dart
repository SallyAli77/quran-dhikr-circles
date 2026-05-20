import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/presentation/widgets/home_components.dart';
import 'package:circles_online_muslim_community/presentation/screens/create_circle_screen.dart';
import 'package:circles_online_muslim_community/presentation/screens/quran_circles_list_screen.dart';
import 'package:circles_online_muslim_community/presentation/screens/teacher_screen.dart';
import 'package:circles_online_muslim_community/src/repository/user_repository/user_repository.dart';
import 'package:firebase_auth/firebase_auth.dart';

class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.only(bottom: 100), // Space for bottom nav
      children: [
        const CategoryStrip(),

        const SectionDivider(label: "Create a Circle"),

        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: CreateCard(
                  title: "Memorize Quran",
                  description: "Take a quick quiz before creating the circle.",
                  icon: LucideIcons.bookOpen,
                  tone: AppTheme.quranTone,
                  textColor: AppTheme.quranText,
                  onTap: () async {
                    showDialog(
                      context: context,
                      barrierDismissible: false,
                      builder: (context) => const Center(child: CircularProgressIndicator()),
                    );

                    final email = FirebaseAuth.instance.currentUser?.email;
                    if (email != null) {
                      final user = await UserRepository.instance.getUserDetails(email);
                      if (context.mounted) {
                        Navigator.pop(context); // Dismiss progress indicator
                      }

                      if (user?.role == "teacher") {
                        if (context.mounted) {
                          Navigator.of(context).push(MaterialPageRoute(
                            builder: (_) => const CreateCircleScreen(type: CircleType.quran),
                          ));
                        }
                      } else {
                        if (context.mounted) {
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                              title: const Row(
                                children: [
                                  Icon(LucideIcons.lock, color: Colors.orange),
                                  SizedBox(width: 8),
                                  Text("Certified Feature"),
                                ],
                              ),
                              content: const Text(
                                "Only certified Quran teachers can open a Circle of Quran Memorization (تحفيظ قرآن).\n\nApply as a teacher and pass the qualification exam to unlock this advantage!",
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: const Text("Close"),
                                ),
                                ElevatedButton(
                                  onPressed: () {
                                    Navigator.pop(context);
                                    Navigator.of(context).push(MaterialPageRoute(
                                      builder: (_) => const TeacherApplicationScreen(),
                                    ));
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppTheme.tasbeehText,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
                                  child: const Text("Apply Now"),
                                ),
                              ],
                            ),
                          );
                        }
                      }
                    } else {
                      if (context.mounted) {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text("Please login to create a circle")),
                        );
                      }
                    }
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: CreateCard(
                  title: "Tasbeeh",
                  description: "Encourage others to make Tasbeeh together.",
                  icon: LucideIcons.hand,
                  tone: AppTheme.tasbeehTone,
                  textColor: AppTheme.tasbeehText,
                  onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const CreateCircleScreen(type: CircleType.tasbeeh))),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 12),

        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: CreateCard(
                  title: "Adhkar",
                  description: "Daily morning and evening Adhkar circle.",
                  icon: LucideIcons.sparkles,
                  tone: AppTheme.adhkarTone,
                  textColor: AppTheme.adhkarText,
                  onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const CreateCircleScreen(type: CircleType.adhkar))),
                ),
              ),
              const SizedBox(width: 12),
              const Expanded(child: TeacherCard()),
            ],
          ),
        ),

        const SectionDivider(label: "or Join one"),

        const CircleRow(
          title: "New Tasbeeh Circles",
          icon: LucideIcons.hand,
          tone: AppTheme.tasbeehTone,
          textColor: AppTheme.tasbeehText,
        ),

        CircleRow(
          title: "New Memorize Quran Circles",
          icon: LucideIcons.bookOpen,
          tone: AppTheme.quranTone,
          textColor: AppTheme.quranText,
          onSeeAll: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => QuranCirclesListScreen())),
        ),

        const CircleRow(
          title: "New Adhkar Circles",
          icon: LucideIcons.sparkles,
          tone: AppTheme.adhkarTone,
          textColor: AppTheme.adhkarText,
        ),
      ],
    );
  }
}
