import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/presentation/screens/circle_session_screen.dart';

class JoinCircleScreen extends StatelessWidget {
  final String id;
  final String type; // e.g., 'tasbeeh', 'quran', 'adhkar'

  const JoinCircleScreen({super.key, required this.id, required this.type});

  @override
  Widget build(BuildContext context) {
    String title = "سورة البقرة";
    if (type == 'tasbeeh') title = "تسبيح";
    if (type == 'adhkar') title = "أذكار";

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  InkWell(
                    onTap: () => Navigator.of(context).pop(),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.redAccent.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(LucideIcons.x,
                          color: Colors.redAccent, size: 20),
                    ),
                  ),
                  Row(
                    children: List.generate(
                      3,
                      (index) => Align(
                        widthFactor: 0.6,
                        child: CircleAvatar(
                          radius: 18,
                          backgroundColor: AppTheme.primary.withOpacity(0.2),
                          child: const CircleAvatar(
                            radius: 16,
                            backgroundColor: AppTheme.background,
                            child: Icon(Icons.person,
                                color: AppTheme.primary, size: 20),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // Central Graphic
              Center(
                child: SizedBox(
                  width: 128,
                  height: 128,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withOpacity(0.1),
                          shape: BoxShape.circle,
                          border: Border.all(
                              color: AppTheme.primary.withOpacity(0.3),
                              width: 4),
                        ),
                      ),
                      const Positioned(
                        top: 0,
                        left: 0,
                        child: CircleAvatar(
                          radius: 14,
                          backgroundColor: AppTheme.primary,
                          child: Text("3",
                              style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold)),
                        ),
                      ),
                      Positioned(
                        top: 16,
                        right: 8,
                        child: CircleAvatar(
                          radius: 16,
                          backgroundColor: Colors.greenAccent.shade400,
                          child: const CircleAvatar(
                              radius: 14, backgroundColor: AppTheme.background),
                        ),
                      ),
                      Positioned(
                        bottom: 16,
                        right: 0,
                        child: CircleAvatar(
                          radius: 14,
                          backgroundColor: Colors.pinkAccent.shade100,
                          child: const CircleAvatar(
                              radius: 12, backgroundColor: AppTheme.background),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Title and Subtitle
              Text(
                title,
                textAlign: TextAlign.center,
                style:
                    const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                textDirection: TextDirection.rtl,
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Joining",
                      style:
                          TextStyle(color: AppTheme.textMuted, fontSize: 14)),
                  const SizedBox(width: 8),
                  Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                          color: AppTheme.primary, shape: BoxShape.circle)),
                  const SizedBox(width: 4),
                  Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                          color: const Color(0xFF10B981),
                          shape: BoxShape.circle)),
                ],
              ),

              const SizedBox(height: 16),

              // Details Box
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.card,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Column(
                  children: [
                    _buildRow("Sura", type == 'quran' ? "البقرة" : "-"),
                    _buildRow("From", type == 'quran' ? "1" : "-"),
                    _buildRow("Number of Members", "9"),
                    _buildRow("Circle Code", id.toUpperCase(), isLast: true),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Members List
              Expanded(
                child: ListView.builder(
                  itemCount: 6,
                  itemBuilder: (context, index) {
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppTheme.card,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.border),
                      ),
                      child: Row(
                        children: [
                          CircleAvatar(
                              radius: 18,
                              backgroundColor: Colors.pinkAccent.shade100),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text("Name",
                                    style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold)),
                                Row(
                                  children: [
                                    Icon(Icons.star,
                                        color: Colors.yellow.shade700,
                                        size: 12),
                                    const SizedBox(width: 4),
                                    const Text("Score",
                                        style: TextStyle(
                                            fontSize: 12,
                                            color: AppTheme.textMuted)),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          const CircleAvatar(
                              radius: 16, backgroundColor: AppTheme.border),
                          const SizedBox(width: 8),
                          OutlinedButton(
                            onPressed: () {},
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: AppTheme.primary),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16)),
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 0),
                              minimumSize: const Size(0, 32),
                            ),
                            child: const Text("Follow",
                                style: TextStyle(
                                    color: AppTheme.primary,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500)),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),

              const SizedBox(height: 16),

              // Join Button
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(
                        builder: (_) => CircleSessionScreen(id: id)),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24)),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  elevation: 0,
                ),
                child: const Text("Join Circle",
                    style:
                        TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRow(String label, String value, {bool isLast = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 6),
      decoration: BoxDecoration(
        border: isLast ? null : const Border(bottom: BorderSide(color: AppTheme.border)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: const TextStyle(color: AppTheme.textMuted, fontSize: 14)),
          Text(value,
              style:
                  const TextStyle(fontWeight: FontWeight.w500, fontSize: 14)),
        ],
      ),
    );
  }
}
