import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'dart:math';
import 'dart:async';

class CircleSessionScreen extends StatefulWidget {
  final String id;

  const CircleSessionScreen({super.key, required this.id});

  @override
  State<CircleSessionScreen> createState() => _CircleSessionScreenState();
}

class _CircleSessionScreenState extends State<CircleSessionScreen> {
  int _seconds = 300;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_seconds > 0) {
        setState(() => _seconds--);
      } else {
        _timer?.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final mm = (_seconds ~/ 60).toString().padLeft(2, '0');
    final ss = (_seconds % 60).toString().padLeft(2, '0');
    final pct = _seconds / 300;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: AppTheme.primary.withOpacity(0.2),
                shape: BoxShape.circle,
                border: Border.all(
                    color: AppTheme.primary.withOpacity(0.3), width: 2),
              ),
            ),
            const SizedBox(width: 8),
            const Text("Blue",
                style: TextStyle(
                    color: AppTheme.primary,
                    fontSize: 16,
                    fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.logOut, color: Colors.redAccent),
            onPressed: () {},
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Expanded(
                  child: Container(
                    height: 12,
                    decoration: BoxDecoration(
                      color: AppTheme.border,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    alignment: Alignment.centerLeft,
                    child: FractionallySizedBox(
                      widthFactor: pct,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                              colors: [Colors.greenAccent, Colors.green]),
                          borderRadius: BorderRadius.circular(6),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                const Icon(LucideIcons.hourglass,
                    color: Colors.amber, size: 20),
                const SizedBox(width: 4),
                Text("$mm:$ss",
                    style: const TextStyle(
                        fontFamily: 'monospace',
                        fontWeight: FontWeight.bold,
                        fontSize: 14)),
              ],
            ),
            const SizedBox(height: 16),
            const Text("Start circle",
                textAlign: TextAlign.center,
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                border: Border.all(
                    color: AppTheme.primary.withOpacity(0.4), width: 2),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  const Row(
                    children: [
                      CircleAvatar(
                          backgroundColor: AppTheme.border, radius: 18),
                      SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          children: [
                            Text("Ahmed Start with",
                                style: TextStyle(fontSize: 12)),
                            Text("الحمد لله",
                                style: TextStyle(
                                    color: AppTheme.primary,
                                    fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      CircleAvatar(
                          backgroundColor: Colors.green.shade200, radius: 18),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          children: [
                            Text("Ahmed started with",
                                style: TextStyle(
                                    color: Colors.green.shade700,
                                    fontSize: 12)),
                            const Text(
                                "الحمد لله حمداً كثيراً طيباً مباركاً فيه",
                                style: TextStyle(fontSize: 10)),
                          ],
                        ),
                      ),
                      const Icon(LucideIcons.settings,
                          color: AppTheme.primary, size: 20),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _buildDropdown("Speaker")),
                const SizedBox(width: 12),
                Expanded(child: _buildDropdown("Reciter")),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: AppTheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: RichText(
                text: const TextSpan(
                  style: TextStyle(fontSize: 12, color: AppTheme.text),
                  children: [
                    TextSpan(
                        text: "05:20 ",
                        style: TextStyle(
                            color: Colors.redAccent, fontFamily: 'monospace')),
                    TextSpan(
                        text: "Sara ",
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    TextSpan(text: "joined the circle "),
                    TextSpan(
                        text: "9/9",
                        style: TextStyle(
                            color: AppTheme.primary,
                            fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    children: [
                      _buildScoreRow("1st Maged", 200),
                      _buildScoreRow("2nd Ramy", 100),
                      _buildScoreRow("3rd Hesham", 50),
                      _buildScoreRow("4th Ramy", 49),
                      _buildScoreRow("5th Hesham", 44),
                      _buildScoreRow("6th Ramy", 37),
                      _buildScoreRow("7th Hesham", 35),
                      _buildScoreRow("8th Ramy", 33),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: AspectRatio(
                    aspectRatio: 1,
                    child: _buildSeatsCircle(),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.card,
                border: Border.all(color: AppTheme.border),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                      backgroundColor: Colors.amber.shade200, radius: 20),
                  const SizedBox(width: 12),
                  const Icon(Icons.star, color: Colors.amber),
                  const SizedBox(width: 8),
                  const Text("Score:"),
                  const Spacer(),
                  const Text("—",
                      style: TextStyle(fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(
                side: BorderSide(
                    color: AppTheme.primary.withOpacity(0.4), width: 2),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text("End Turn",
                  style: TextStyle(fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 16),
            Text("Circle #${widget.id}",
                textAlign: TextAlign.center,
                style:
                    const TextStyle(fontSize: 10, color: AppTheme.textMuted)),
          ],
        ),
      ),
    );
  }

  Widget _buildDropdown(String hint) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppTheme.card,
        border: Border.all(color: AppTheme.primary.withOpacity(0.4), width: 2),
        borderRadius: BorderRadius.circular(24),
      ),
      child: DropdownButton<String>(
        isExpanded: true,
        underline: const SizedBox(),
        hint: Text(hint, style: const TextStyle(fontSize: 12)),
        items: const [],
        onChanged: (v) {},
      ),
    );
  }

  Widget _buildScoreRow(String name, int score) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(name,
              style: const TextStyle(color: Colors.redAccent, fontSize: 12)),
          Text(score.toString(),
              style:
                  const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildSeatsCircle() {
    final seats = [
      {'n': 1, 'color': Colors.redAccent},
      {'n': 2, 'color': Colors.green},
      {'n': 3, 'color': Colors.lightBlue},
      {'n': 4, 'color': Colors.redAccent},
      {'n': 5, 'color': Colors.green},
      {'n': 6, 'color': Colors.lightBlue},
      {'n': 7, 'color': Colors.redAccent},
      {'n': 8, 'color': Colors.lightBlue},
      {'n': 9, 'color': Colors.lightBlue},
      {'n': 10, 'color': Colors.purpleAccent},
    ];

    return Stack(
      alignment: Alignment.center,
      children: [
        Container(
          margin: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.amber.shade200,
            shape: BoxShape.circle,
            boxShadow: const [
              BoxShadow(color: Colors.black12, blurRadius: 4)
            ],
          ),
        ),
        ...seats.asMap().entries.map((entry) {
          final i = entry.key;
          final s = entry.value;
          final angle = (i / seats.length) * 2 * pi - pi / 2;
          return Align(
            alignment: Alignment(cos(angle), sin(angle)),
            child: Container(
              width: 24,
              height: 24,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: s['color'] as Color,
                shape: BoxShape.circle,
                boxShadow: const [
                  BoxShadow(
                      color: Colors.black26,
                      blurRadius: 2,
                      offset: Offset(0, 1))
                ],
              ),
              child: Text(s['n'].toString(),
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold)),
            ),
          );
        }),
      ],
    );
  }
}
