import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/presentation/screens/teacher_exam_screen.dart';
import 'package:circles_online_muslim_community/src/features/authentication/models/teacher_application_model.dart';
import 'package:circles_online_muslim_community/src/repository/user_repository/user_repository.dart';
import 'package:firebase_auth/firebase_auth.dart';

class TeacherApplicationScreen extends StatefulWidget {
  const TeacherApplicationScreen({super.key});

  @override
  State<TeacherApplicationScreen> createState() => _TeacherApplicationScreenState();
}

class _TeacherApplicationScreenState extends State<TeacherApplicationScreen> {
  String selectedSubject = "Quran";
  final TextEditingController _bioController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _bioController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text("Apply as Teacher", style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.tasbeehTone,
                  shape: BoxShape.circle,
                  border: Border.all(color: AppTheme.background, width: 4),
                ),
                child: const Icon(LucideIcons.graduationCap, color: AppTheme.tasbeehText, size: 48),
              ),
            ),
            const SizedBox(height: 24),
            const Text("Teacher Application", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.tasbeehText)),
            const Text("Guide students through Quran, Adhkar, or Tasbeeh.", style: TextStyle(color: AppTheme.textMuted)),
            const SizedBox(height: 32),

            _buildLabel("Select Subject"),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: AppTheme.card,
                border: Border.all(color: AppTheme.border),
                borderRadius: BorderRadius.circular(16),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: selectedSubject,
                  isExpanded: true,
                  items: ["Quran", "Adhkar", "Tasbeeh"].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
                  onChanged: (v) => setState(() => selectedSubject = v!),
                ),
              ),
            ),
            const SizedBox(height: 24),

            _buildLabel("Qualifications / Ijaza"),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: AppTheme.card,
                border: Border.all(color: AppTheme.border, style: BorderStyle.solid),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Column(
                children: [
                  Icon(LucideIcons.uploadCloud, color: AppTheme.primary, size: 32),
                  SizedBox(height: 8),
                  Text("Upload Document", style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary)),
                  Text("PDF, JPG, PNG", style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                ],
              ),
            ),
            const SizedBox(height: 24),

            _buildLabel("Brief Background"),
            const SizedBox(height: 8),
            TextField(
              controller: _bioController,
              maxLines: 4,
              decoration: InputDecoration(
                hintText: "Tell us about your teaching experience...",
                filled: true,
                fillColor: AppTheme.card,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppTheme.border)),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppTheme.border)),
              ),
            ),
            const SizedBox(height: 48),

            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : () async {
                  if (_bioController.text.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter your bio')));
                    return;
                  }

                  setState(() => _isSubmitting = true);
                  try {
                    final user = FirebaseAuth.instance.currentUser;
                    if (user == null) throw "User not found";

                    final app = TeacherApplicationModel(
                      userId: user.uid,
                      userName: user.displayName ?? "Anonymous",
                      subject: selectedSubject,
                      bio: _bioController.text,
                      timestamp: DateTime.now(),
                      status: "exam_in_progress",
                    );

                    await UserRepository.instance.submitTeacherApplication(app);
                    
                    if (mounted) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => TeacherExamScreen(applicationSubject: selectedSubject)),
                      );
                    }
                  } catch (e) {
                    if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
                  } finally {
                    if (mounted) setState(() => _isSubmitting = false);
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.tasbeehText,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                ),
                child: _isSubmitting 
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text("Next: Take Qualification Exam", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Text(text, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14));
  }
}
