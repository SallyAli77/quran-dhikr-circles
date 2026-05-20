import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/src/repository/user_repository/user_repository.dart';
import 'package:circles_online_muslim_community/src/features/authentication/models/user_model.dart';
import 'package:get/get.dart';

class SocialSearchScreen extends StatefulWidget {
  const SocialSearchScreen({super.key});

  @override
  State<SocialSearchScreen> createState() => _SocialSearchScreenState();
}

class _SocialSearchScreenState extends State<SocialSearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  final UserRepository _userRepo = Get.put(UserRepository());
  UserModel? _foundUser;
  bool _isSearching = false;

  void _searchUser() async {
    if (_searchController.text.isEmpty) return;
    setState(() => _isSearching = true);
    final user = await _userRepo.searchUserByUniqueId(_searchController.text.trim());
    setState(() {
      _foundUser = user;
      _isSearching = false;
    });
    if (user == null) {
      Get.snackbar("Not Found", "No user found with this ID",
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.redAccent.withOpacity(0.1));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Social & Search", style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Search Bar
            Container(
              decoration: BoxDecoration(
                color: AppTheme.card,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.border),
              ),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: "Enter Unique ID (e.g. user_123)",
                  prefixIcon: const Icon(LucideIcons.search, size: 20),
                  suffixIcon: IconButton(
                    icon: const Icon(LucideIcons.arrowRight, color: AppTheme.primary),
                    onPressed: _searchUser,
                  ),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
                onSubmitted: (_) => _searchUser(),
              ),
            ),
            const SizedBox(height: 24),

            if (_isSearching)
              const Center(child: CircularProgressIndicator())
            else if (_foundUser != null)
              _buildUserResultCard(_foundUser!)
            else ...[
              const SectionHeader(title: "My Friends"),
              const SizedBox(height: 12),
              Expanded(
                child: ListView.builder(
                  itemCount: 0, // Placeholder for actual friends list
                  itemBuilder: (context, index) => const ListTile(title: Text("No friends yet")),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildUserResultCard(UserModel user) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.primary.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 24,
            backgroundColor: AppTheme.primary,
            child: Icon(LucideIcons.user, color: Colors.white),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(user.fullname, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                Text("@${user.uniqueId}", style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () {
              // TODO: Implement send friend request logic
              Get.snackbar("Request Sent", "Friend request sent to ${user.fullname}",
                  snackPosition: SnackPosition.BOTTOM,
                  backgroundColor: Colors.green.withOpacity(0.1));
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              padding: const EdgeInsets.symmetric(horizontal: 12),
            ),
            child: const Text("Add", style: TextStyle(fontSize: 12)),
          ),
        ],
      ),
    );
  }
}

class SectionHeader extends StatelessWidget {
  final String title;
  const SectionHeader({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        const Spacer(),
        const Icon(LucideIcons.users, size: 20, color: AppTheme.textMuted),
      ],
    );
  }
}
