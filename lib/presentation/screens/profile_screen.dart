import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/src/features/social/models/recitation_post_model.dart';
import 'package:circles_online_muslim_community/src/repository/recitation_repository/recitation_repository.dart';
import 'package:circles_online_muslim_community/src/repository/user_repository/user_repository.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:circles_online_muslim_community/presentation/screens/settings_screen.dart';
import 'package:just_audio/just_audio.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return const Center(child: Text("Not logged in"));

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
            floating: false,
            pinned: true,
            backgroundColor: AppTheme.primary,
            actions: [
              IconButton(
                icon: const Icon(LucideIcons.settings, color: Colors.white),
                onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SettingsScreen())),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [AppTheme.primary, AppTheme.primary.withOpacity(0.8)],
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 40),
                    const CircleAvatar(
                      radius: 40,
                      backgroundColor: Colors.white,
                      child: Icon(LucideIcons.user, size: 40, color: AppTheme.primary),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      user.displayName ?? user.email?.split('@')[0] ?? "User",
                      style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      user.email ?? "",
                      style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 14),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionHeader("Overview"),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      _buildStatCard("Circles", "0", LucideIcons.users),
                      const SizedBox(width: 16),
                      _buildStatCard("Recitations", "...", LucideIcons.mic),
                    ],
                  ),
                  const SizedBox(height: 32),
                  _buildSectionHeader("My Recitations"),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
          _buildRecitationsList(user.uid),
          const SliverToBoxAdapter(child: SizedBox(height: 80)),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.text),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.card,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppTheme.border),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppTheme.primary, size: 24),
            const SizedBox(height: 8),
            Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
          ],
        ),
      ),
    );
  }

  Widget _buildRecitationsList(String userId) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance
          .collection('Recitations')
          .where('userId', isEqualTo: userId)
          .snapshots(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const SliverToBoxAdapter(child: Center(child: CircularProgressIndicator()));
        }
        final docs = snapshot.data?.docs ?? [];
        if (docs.isEmpty) {
          return const SliverToBoxAdapter(child: Center(child: Text("No recitations yet.")));
        }

        return SliverList(
          delegate: SliverChildBuilderDelegate(
            (context, index) {
              final post = RecitationPostModel.fromSnapshot(docs[index] as DocumentSnapshot<Map<String, dynamic>>);
              return RecitationItemWidget(post: post);
            },
            childCount: docs.length,
          ),
        );
      },
    );
  }
}

class RecitationItemWidget extends StatefulWidget {
  final RecitationPostModel post;
  const RecitationItemWidget({super.key, required this.post});

  @override
  State<RecitationItemWidget> createState() => _RecitationItemWidgetState();
}

class _RecitationItemWidgetState extends State<RecitationItemWidget> {
  AudioPlayer? _player;
  bool _isPlaying = false;
  bool _isExpanded = false;

  @override
  void dispose() {
    _player?.dispose();
    super.dispose();
  }

  Future<void> _togglePlay() async {
    if (widget.post.voiceFeedbackUrl == null) return;
    
    try {
      if (_player == null) {
        _player = AudioPlayer();
        await _player!.setUrl(widget.post.voiceFeedbackUrl!);
      }

      if (_isPlaying) {
        await _player!.pause();
        setState(() => _isPlaying = false);
      } else {
        setState(() => _isPlaying = true);
        await _player!.play();
        _player!.playerStateStream.listen((state) {
          if (state.processingState == ProcessingState.completed) {
            if (mounted) setState(() => _isPlaying = false);
          }
        });
      }
    } catch (e) {
      print("Error playing feedback audio: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    final hasFeedback = widget.post.feedback != null || widget.post.voiceFeedbackUrl != null;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.card,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.border),
        ),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: hasFeedback ? Colors.green.withOpacity(0.1) : AppTheme.quranTone,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    hasFeedback ? LucideIcons.award : LucideIcons.clock,
                    color: hasFeedback ? Colors.green : AppTheme.quranText,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "${widget.post.surahName} - Ayah ${widget.post.ayahIndex + 1}",
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      if (hasFeedback)
                        Row(
                          children: List.generate(5, (starIdx) {
                            return Icon(
                              starIdx < (widget.post.score ?? 5) ? Icons.star : Icons.star_border,
                              color: Colors.amber,
                              size: 16,
                            );
                          }),
                        )
                      else
                        const Text("Pending Feedback", style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                    ],
                  ),
                ),
                if (hasFeedback)
                  IconButton(
                    icon: Icon(_isExpanded ? LucideIcons.chevronUp : LucideIcons.chevronDown),
                    onPressed: () {
                      setState(() {
                        _isExpanded = !_isExpanded;
                      });
                    },
                  )
              ],
            ),
            if (_isExpanded && hasFeedback) ...[
              const SizedBox(height: 16),
              const Divider(),
              const SizedBox(height: 8),
              if (widget.post.feedback != null && widget.post.feedback!.isNotEmpty) ...[
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(LucideIcons.messageSquare, color: AppTheme.textMuted, size: 16),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        widget.post.feedback!,
                        style: const TextStyle(fontSize: 14, height: 1.4),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
              ],
              if (widget.post.voiceFeedbackUrl != null) ...[
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppTheme.tasbeehTone,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      GestureDetector(
                        onTap: _togglePlay,
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: AppTheme.tasbeehText,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            _isPlaying ? LucideIcons.pause : LucideIcons.play,
                            color: Colors.white,
                            size: 16,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _isPlaying ? "Playing voice reply..." : "Listen to Teacher's Voice Correction",
                          style: const TextStyle(
                            color: AppTheme.tasbeehText,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ],
        ),
      ),
    );
  }
}
