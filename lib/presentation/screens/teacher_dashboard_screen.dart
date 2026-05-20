import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/src/features/social/models/recitation_post_model.dart';
import 'package:circles_online_muslim_community/src/repository/recitation_repository/recitation_repository.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:circles_online_muslim_community/presentation/screens/evaluation_screen.dart';

class TeacherDashboardScreen extends StatefulWidget {
  const TeacherDashboardScreen({super.key});

  @override
  State<TeacherDashboardScreen> createState() => _TeacherDashboardScreenState();
}

class _TeacherDashboardScreenState extends State<TeacherDashboardScreen> {
  late Future<List<RecitationPostModel>> _recitationsFuture;

  @override
  void initState() {
    super.initState();
    _refresh();
  }

  void _refresh() {
    final user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      setState(() {
        _recitationsFuture = RecitationRepository.instance.getRecitationsForTeacher(user.uid);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text("Teacher Dashboard"),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.refreshCcw, color: AppTheme.text),
            onPressed: _refresh,
          ),
        ],
      ),
      body: FutureBuilder<List<RecitationPostModel>>(
        future: _recitationsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }
          final recitations = snapshot.data ?? [];
          if (recitations.isEmpty) {
            return const Center(child: Text("No recitations found for you."));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: recitations.length,
            separatorBuilder: (context, index) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final post = recitations[index];
              final hasFeedback = post.feedback != null;

              return Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.card,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: hasFeedback ? Colors.green.withOpacity(0.1) : AppTheme.quranTone,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        hasFeedback ? LucideIcons.checkCircle : LucideIcons.clock,
                        color: hasFeedback ? Colors.green : AppTheme.quranText,
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            post.userName,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          Text(
                            "${post.surahName} - Ayah ${post.ayahIndex + 1}",
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () async {
                        await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => EvaluationScreen(post: post),
                          ),
                        );
                        _refresh();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: hasFeedback ? AppTheme.textMuted : AppTheme.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        elevation: 0,
                      ),
                      child: Text(hasFeedback ? "View" : "Evaluate"),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
