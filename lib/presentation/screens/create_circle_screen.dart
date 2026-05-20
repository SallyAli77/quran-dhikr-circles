import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/presentation/screens/published_circle_screen.dart';
import 'dart:math';

enum CircleType { quran, tasbeeh, adhkar }

class CreateCircleScreen extends StatefulWidget {
  final CircleType type;

  const CreateCircleScreen({super.key, required this.type});

  @override
  State<CreateCircleScreen> createState() => _CreateCircleScreenState();
}

class _CreateCircleScreenState extends State<CreateCircleScreen> {
  late final String code;
  String name = '';
  int members = 5;
  int from = 1;
  int to = 7;
  String tasbeeh = "أستغفر الله العظيم";
  String tasbeehCustom = "";
  String adhkarKind = "أذكار الصباح";
  String sura = "الفاتحة";

  final List<String> tasbeehOptions = [
    "أستغفر الله العظيم",
    "سبحان الله وبحمده",
    "لا إله إلا الله",
    "الحمد لله",
    "الله أكبر",
  ];

  final List<String> adhkarOptions = [
    "أذكار الصباح",
    "أذكار المساء",
    "أذكار النوم",
    "أذكار بعد الصلاة"
  ];

  final List<String> suraOptions = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام"
  ];

  @override
  void initState() {
    super.initState();
    code = _generateCode();
  }

  String _generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    final rnd = Random();
    return String.fromCharCodes(Iterable.generate(5, (_) => chars.codeUnitAt(rnd.nextInt(chars.length))));
  }

  String get _title {
    switch (widget.type) {
      case CircleType.quran: return "Memorize Quran";
      case CircleType.tasbeeh: return "Tasbeeh";
      case CircleType.adhkar: return "Adhkar";
    }
  }

  void _submit() {
    Navigator.of(context).push(MaterialPageRoute(
      builder: (_) => PublishedCircleScreen(
        code: code,
        name: name.isEmpty ? _title : name,
      ),
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircleAvatar(
              radius: 14,
              backgroundColor: AppTheme.card,
              child: Icon(LucideIcons.user, size: 16, color: AppTheme.textMuted),
            ),
            SizedBox(width: 8),
            Text("Mohamed Ahmed", style: TextStyle(fontSize: 14)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.bell, color: AppTheme.textMuted),
            onPressed: () {},
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.card,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppTheme.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("Create a Circle", style: TextStyle(fontSize: 14, color: AppTheme.textMuted)),
              Text(_title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primary)),
              const SizedBox(height: 24),

              if (widget.type == CircleType.quran) ...[
                _buildField("Sura", DropdownButtonFormField<String>(
                  initialValue: sura,
                  decoration: const InputDecoration(border: InputBorder.none, isDense: true),
                  items: suraOptions.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (v) => setState(() => sura = v!),
                )),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text("From", style: TextStyle(color: AppTheme.textMuted)),
                    Row(
                      children: [
                        _buildNumberInput(from, (v) => setState(() => from = v)),
                        const SizedBox(width: 12),
                        const Text("To", style: TextStyle(color: AppTheme.textMuted)),
                        const SizedBox(width: 12),
                        _buildNumberInput(to, (v) => setState(() => to = v)),
                      ],
                    ),
                  ],
                ),
              ],

              if (widget.type == CircleType.tasbeeh) ...[
                _buildField("Tasbeeh", DropdownButtonFormField<String>(
                  initialValue: tasbeeh,
                  decoration: const InputDecoration(border: InputBorder.none, isDense: true),
                  items: tasbeehOptions.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (v) => setState(() => tasbeeh = v!),
                )),
                const SizedBox(height: 16),
                _buildField("Add Yours", TextField(
                  decoration: const InputDecoration(border: InputBorder.none, isDense: true),
                  onChanged: (v) => setState(() => tasbeehCustom = v),
                )),
              ],

              if (widget.type == CircleType.adhkar) ...[
                _buildField("Adhkar", DropdownButtonFormField<String>(
                  initialValue: adhkarKind,
                  decoration: const InputDecoration(border: InputBorder.none, isDense: true),
                  items: adhkarOptions.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (v) => setState(() => adhkarKind = v!),
                )),
              ],

              const SizedBox(height: 16),
              _buildField("Circle Name", TextField(
                decoration: const InputDecoration(
                  hintText: "Circle name",
                  border: InputBorder.none,
                  isDense: true,
                ),
                onChanged: (v) => setState(() => name = v),
              )),

              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Number of Members"),
                  DropdownButton<int>(
                    value: members,
                    underline: const SizedBox(),
                    items: [2,3,4,5,6,7,8,9,10].map((n) => DropdownMenuItem(value: n, child: Text(n.toString(), style: const TextStyle(color: AppTheme.primary)))).toList(),
                    onChanged: (v) => setState(() => members = v!),
                  ),
                ],
              ),

              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Circle Code"),
                  Text(code, style: const TextStyle(fontFamily: 'monospace', fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.primary)),
                ],
              ),

              const SizedBox(height: 32),
              Center(
                child: ElevatedButton(
                  onPressed: _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                  ),
                  child: const Text("Create", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildField(String label, Widget child) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        border: Border.all(color: AppTheme.border),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
          child,
        ],
      ),
    );
  }

  Widget _buildNumberInput(int value, Function(int) onChanged) {
    return Container(
      width: 48,
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppTheme.border)),
      ),
      child: TextFormField(
        initialValue: value.toString(),
        keyboardType: TextInputType.number,
        textAlign: TextAlign.center,
        style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold),
        decoration: const InputDecoration(border: InputBorder.none, isDense: true),
        onChanged: (v) {
          final parsed = int.tryParse(v);
          if (parsed != null) onChanged(parsed);
        },
      ),
    );
  }
}
