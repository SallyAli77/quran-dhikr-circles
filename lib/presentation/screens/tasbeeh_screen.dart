import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';

class TasbeehScreen extends StatefulWidget {
  const TasbeehScreen({super.key});

  @override
  State<TasbeehScreen> createState() => _TasbeehScreenState();
}

class _TasbeehScreenState extends State<TasbeehScreen> with SingleTickerProviderStateMixin {
  int _counter = 0;
  int _target = 33; // 33, 99, 100, or 0 for unlimited
  String _selectedDhikr = "أستغفر الله العظيم";
  
  final List<String> _dhikrPresets = [
    "أستغفر الله العظيم",
    "سبحان الله وبحمده",
    "لا إله إلا الله",
    "الحمد لله",
    "الله أكبر",
    "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ"
  ];

  late AnimationController _animController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.92).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _increment() {
    HapticFeedback.lightImpact();
    _animController.forward().then((_) => _animController.reverse());

    setState(() {
      _counter++;
      if (_target > 0 && _counter >= _target) {
        // Complete target feedback
        HapticFeedback.vibrate();
        _showCompletionDialog();
        _counter = 0; // Reset or keep? Let's reset to allow next round
      }
    });
  }

  void _reset() {
    setState(() {
      _counter = 0;
    });
    HapticFeedback.mediumImpact();
  }

  void _showCompletionDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Row(
          children: [
            Icon(LucideIcons.sparkles, color: Colors.amber),
            SizedBox(width: 8),
            Text("Mashallah!"),
          ],
        ),
        content: Text("You have completed $_target counts of:\n\"$_selectedDhikr\""),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Accept & Continue", style: TextStyle(color: AppTheme.tasbeehText, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    double progress = _target > 0 ? (_counter / _target) : 0.0;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text("Digital Misbaha (مسبحة)", style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Dhikr Selector Card
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: AppTheme.card,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.border),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedDhikr,
                    isExpanded: true,
                    icon: const Icon(LucideIcons.chevronDown, color: AppTheme.tasbeehText),
                    items: _dhikrPresets.map((d) {
                      return DropdownMenuItem<String>(
                        value: d,
                        child: Text(
                          d,
                          textDirection: TextDirection.rtl,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.primary),
                        ),
                      );
                    }).toList(),
                    onChanged: (v) {
                      if (v != null) {
                        setState(() {
                          _selectedDhikr = v;
                          _counter = 0;
                        });
                      }
                    },
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Target Selector
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Select Target:", style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
                  Row(
                    children: [33, 99, 100, 0].map((t) {
                      final isSelected = _target == t;
                      final label = t == 0 ? "∞" : t.toString();
                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            _target = t;
                            _counter = 0;
                          });
                        },
                        child: Container(
                          margin: const EdgeInsets.only(left: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: isSelected ? AppTheme.tasbeehTone : AppTheme.card,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isSelected ? AppTheme.tasbeehText : AppTheme.border,
                            ),
                          ),
                          child: Text(
                            label,
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: isSelected ? AppTheme.tasbeehText : AppTheme.primary,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ),

              const Spacer(),

              // Circular Counter Tap Area
              Center(
                child: GestureDetector(
                  onTap: _increment,
                  child: ScaleTransition(
                    scale: _scaleAnimation,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // Counter Outer Glow / Ring
                        Container(
                          width: 260,
                          height: 260,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppTheme.card,
                            boxShadow: [
                              BoxShadow(
                                color: AppTheme.tasbeehText.withOpacity(0.12),
                                blurRadius: 40,
                                spreadRadius: 5,
                              )
                            ],
                            border: Border.all(color: AppTheme.border, width: 2),
                          ),
                        ),
                        // Progress Arc
                        if (_target > 0)
                          SizedBox(
                            width: 240,
                            height: 240,
                            child: CircularProgressIndicator(
                              value: progress,
                              strokeWidth: 8,
                              backgroundColor: Colors.transparent,
                              valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.tasbeehText),
                            ),
                          ),
                        // Inner Content
                        Container(
                          width: 220,
                          height: 220,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [AppTheme.card, AppTheme.tasbeehTone],
                            ),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                _counter.toString(),
                                style: const TextStyle(
                                  fontSize: 64,
                                  fontFamily: 'monospace',
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.tasbeehText,
                                ),
                              ),
                              if (_target > 0)
                                Text(
                                  "/ $_target",
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w500,
                                    color: AppTheme.textMuted,
                                  ),
                                )
                              else
                                const Icon(LucideIcons.infinity, color: AppTheme.textMuted, size: 20),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              const Spacer(),

              // Reset / Dhikr display
              Center(
                child: Text(
                  _selectedDhikr,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    fontFamily: "quran",
                    color: AppTheme.tasbeehText,
                  ),
                ),
              ),
              const SizedBox(height: 32),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton.icon(
                    onPressed: _reset,
                    icon: const Icon(LucideIcons.refreshCw, size: 16),
                    label: const Text("Reset Count"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red.withOpacity(0.1),
                      foregroundColor: Colors.red,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
