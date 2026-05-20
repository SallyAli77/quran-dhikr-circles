import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/presentation/screens/teacher_screen.dart';
import 'package:circles_online_muslim_community/presentation/screens/join_circle_screen.dart';
import 'package:circles_online_muslim_community/presentation/screens/quran_library_screen.dart';
import 'package:circles_online_muslim_community/presentation/screens/teacher_dashboard_screen.dart';
import 'package:circles_online_muslim_community/src/repository/user_repository/user_repository.dart';
import 'package:circles_online_muslim_community/src/repository/circle_repository/circle_repository.dart';
import 'package:circles_online_muslim_community/src/features/social/models/circle_model.dart';
import 'package:circles_online_muslim_community/presentation/screens/tasbeeh_screen.dart';
import 'package:circles_online_muslim_community/presentation/screens/adhkar_screen.dart';
import 'package:firebase_auth/firebase_auth.dart';

class CategoryStrip extends StatelessWidget {
  const CategoryStrip({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Row(
        children: [
          _buildCategoryItem(
            context,
            LucideIcons.bookOpen,
            "تسميع قرآن",
            "Quran Kareem",
            AppTheme.quranTone,
            AppTheme.quranText,
            onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const QuranLibraryScreen())),
          ),
          const SizedBox(width: 12),
          _buildCategoryItem(
            context,
            LucideIcons.hand,
            "تسبيح",
            "Begin Tasbeeh",
            AppTheme.tasbeehTone,
            AppTheme.tasbeehText,
            onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const TasbeehScreen())),
          ),
          const SizedBox(width: 12),
          _buildCategoryItem(
            context,
            LucideIcons.sparkles,
            "أذكار",
            "Daily Adhkar",
            AppTheme.adhkarTone,
            AppTheme.adhkarText,
            onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AdhkarScreen())),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryItem(
    BuildContext context,
    IconData icon,
    String arabic,
    String title,
    Color tone,
    Color textColor, {
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
      width: 150,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.border),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: tone, shape: BoxShape.circle),
            child: Icon(icon, color: textColor, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  arabic,
                  style: const TextStyle(
                    fontSize: 10,
                    color: AppTheme.textMuted,
                  ),
                ),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    height: 1.1,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ),
    );
  }
}

class SectionDivider extends StatelessWidget {
  final String label;
  const SectionDivider({super.key, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 16),
      alignment: Alignment.center,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: AppTheme.primary,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          "──── $label ────",
          style: const TextStyle(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}

class CreateCard extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final Color tone;
  final Color textColor;
  final VoidCallback? onTap;

  const CreateCard({
    super.key,
    required this.title,
    required this.description,
    required this.icon,
    required this.tone,
    required this.textColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      alignment: Alignment.topCenter,
      children: [
        Container(
          margin: const EdgeInsets.only(top: 24),
          padding: const EdgeInsets.fromLTRB(12, 32, 12, 16),
          decoration: BoxDecoration(
            color: AppTheme.card,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppTheme.border),
          ),
          child: Column(
            children: [
              const Text(
                "Create a circle",
                style: TextStyle(fontSize: 10, color: AppTheme.textMuted),
              ),
              Text(
                title,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                description,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 10, color: AppTheme.textMuted),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 32,
                child: ElevatedButton(
                  onPressed: onTap ?? () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 0,
                  ),
                  child: const Text("Start", style: TextStyle(fontSize: 12)),
                ),
              ),
            ],
          ),
        ),
        Positioned(
          top: 0,
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: tone,
              shape: BoxShape.circle,
              border: Border.all(color: AppTheme.background, width: 4),
            ),
            child: Icon(icon, color: textColor, size: 24),
          ),
        ),
      ],
    );
  }
}

class TeacherCard extends StatelessWidget {
  const TeacherCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      alignment: Alignment.topCenter,
      children: [
        Container(
          margin: const EdgeInsets.only(top: 24),
          padding: const EdgeInsets.fromLTRB(12, 32, 12, 16),
          decoration: BoxDecoration(
            color: AppTheme.card,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppTheme.border),
          ),
          child: Column(
            children: [
              const Text(
                "Join as a",
                style: TextStyle(fontSize: 10, color: AppTheme.textMuted),
              ),
              const Text(
                "Teacher",
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.tasbeehText,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                "Guide students through Quran, Adhkar or Tasbeeh.",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 10, color: AppTheme.textMuted),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 32,
                child: FutureBuilder(
                  future: UserRepository.instance.getUserDetails(FirebaseAuth.instance.currentUser?.email ?? ""),
                  builder: (context, snapshot) {
                    final user = snapshot.data;
                    final isTeacher = user?.role == "teacher";
                    
                    return ElevatedButton(
                      onPressed: () {
                        if (isTeacher) {
                          Navigator.of(context).push(MaterialPageRoute(builder: (_) => const TeacherDashboardScreen()));
                        } else {
                          Navigator.of(context).push(MaterialPageRoute(builder: (_) => const TeacherApplicationScreen()));
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.tasbeehText,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 0,
                      ),
                      child: Text(isTeacher ? "Dashboard" : "Apply", style: const TextStyle(fontSize: 12)),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
        Positioned(
          top: 0,
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.tasbeehTone,
              shape: BoxShape.circle,
              border: Border.all(color: AppTheme.background, width: 4),
            ),
            child: const Icon(
              LucideIcons.graduationCap,
              color: AppTheme.tasbeehText,
              size: 24,
            ),
          ),
        ),
      ],
    );
  }
}

class CircleRow extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color tone;
  final Color textColor;
  final bool showSeeAll;
  final VoidCallback? onSeeAll;

  const CircleRow({
    super.key,
    required this.title,
    required this.icon,
    required this.tone,
    required this.textColor,
    this.showSeeAll = true,
    this.onSeeAll,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
              if (showSeeAll)
                InkWell(
                  onTap: onSeeAll,
                  child: const Row(
                    children: [
                      Text(
                        "see all",
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.primary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Icon(
                        LucideIcons.chevronRight,
                        size: 14,
                        color: AppTheme.primary,
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 80,
          child: StreamBuilder<List<CircleModel>>(
            stream: CircleRepository.instance.getActiveCircles(),
            builder: (context, snapshot) {
              final allCircles = snapshot.data ?? [];
              final circles = allCircles.where((c) => title.toLowerCase().contains(c.type)).toList();
              
              if (circles.isEmpty) {
                return const Center(child: Text("No active circles", style: TextStyle(color: AppTheme.textMuted, fontSize: 12)));
              }

              return ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: circles.length,
                itemBuilder: (context, index) {
                  final circle = circles[index];
                  return GestureDetector(
                    onTap: () {
                      Navigator.of(context).push(MaterialPageRoute(
                        builder: (_) => JoinCircleScreen(id: circle.id, type: circle.type),
                      ));
                    },
                    child: Container(
                      margin: const EdgeInsets.only(right: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: tone, shape: BoxShape.circle),
                      child: Icon(icon, color: textColor, size: 28),
                    ),
                  );
                },
              );
            },
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }
}
