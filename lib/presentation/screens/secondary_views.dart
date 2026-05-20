import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/presentation/widgets/home_components.dart';
import 'package:circles_online_muslim_community/presentation/screens/create_circle_screen.dart';

class BrowseView extends StatelessWidget {
  const BrowseView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.only(bottom: 100, top: 16),
      children: const [
        CircleRow(
          title: "New Tasbeeh Circles",
          icon: LucideIcons.hand,
          tone: AppTheme.tasbeehTone,
          textColor: AppTheme.tasbeehText,
          showSeeAll: false,
        ),
        CircleRow(
          title: "New Memorize Quran Circles",
          icon: LucideIcons.bookOpen,
          tone: AppTheme.quranTone,
          textColor: AppTheme.quranText,
          showSeeAll: false,
        ),
        CircleRow(
          title: "New Adhkar Circles",
          icon: LucideIcons.sparkles,
          tone: AppTheme.adhkarTone,
          textColor: AppTheme.adhkarText,
          showSeeAll: false,
        ),
      ],
    );
  }
}

class CreateView extends StatelessWidget {
  const CreateView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.only(bottom: 100),
      children: [
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
                  onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const CreateCircleScreen(type: CircleType.quran))),
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
      ],
    );
  }
}
