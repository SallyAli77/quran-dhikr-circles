import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/src/repository/authentication_repository/authentication_repository.dart';
import 'package:get/get.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text("Settings"),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          _buildSectionHeader("Appearance"),
          _buildSettingTile(
            icon: LucideIcons.moon,
            title: "Dark Mode",
            trailing: Switch(value: false, onChanged: (v) {}),
          ),
          _buildSettingTile(
            icon: LucideIcons.languages,
            title: "App Language",
            trailing: const Text("English", style: TextStyle(color: AppTheme.primary)),
          ),
          const SizedBox(height: 32),
          _buildSectionHeader("Account"),
          _buildSettingTile(
            icon: LucideIcons.user,
            title: "Edit Profile",
            onTap: () {},
          ),
          _buildSettingTile(
            icon: LucideIcons.shieldCheck,
            title: "Privacy & Security",
            onTap: () {},
          ),
          const SizedBox(height: 32),
          _buildSectionHeader("Support"),
          _buildSettingTile(
            icon: LucideIcons.helpCircle,
            title: "Help Center",
            onTap: () {},
          ),
          _buildSettingTile(
            icon: LucideIcons.info,
            title: "About Muslim Circles",
            onTap: () {},
          ),
          const SizedBox(height: 48),
          SizedBox(
            width: double.infinity,
            height: 56,
            child: OutlinedButton.icon(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                    title: const Row(
                      children: [
                        Icon(LucideIcons.logOut, color: Colors.red),
                        SizedBox(width: 8),
                        Text("Sign Out"),
                      ],
                    ),
                    content: const Text("Are you sure you want to sign out of your account?"),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text("Cancel"),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context);
                          AuthenticationRepository.instance.logout();
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text("Sign Out"),
                      ),
                    ],
                  ),
                );
              },
              icon: const Icon(LucideIcons.logOut, color: Colors.red),
              label: const Text("Logout", style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Colors.red),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
            ),
          ),
          const SizedBox(height: 20),
          const Center(
            child: Text(
              "Version 1.0.0 (Beta)",
              style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Text(
        title,
        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textMuted),
      ),
    );
  }

  Widget _buildSettingTile({required IconData icon, required String title, Widget? trailing, VoidCallback? onTap}) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppTheme.card,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: AppTheme.text, size: 20),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      trailing: trailing ?? const Icon(LucideIcons.chevronRight, size: 20, color: AppTheme.textMuted),
      onTap: onTap,
    );
  }
}
