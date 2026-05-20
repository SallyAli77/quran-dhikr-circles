import 'package:flutter/material.dart';

class AppTheme {
  // Colors based on the React prototype
  static const Color primary = Color(0xFF4F46E5); // Indigo
  static const Color background = Color(0xFFFAFAFA);
  static const Color card = Colors.white;
  static const Color text = Color(0xFF171717);
  static const Color textMuted = Color(0xFF737373);
  static const Color border = Color(0xFFE5E5E5);

  // Specific category colors
  static const Color tasbeehTone = Color(0xFFD1FAE5); // Emerald-100
  static const Color tasbeehText = Color(0xFF047857); // Emerald-700

  static const Color quranTone = Color(0xFFE0E7FF); // Primary/10
  static const Color quranText = primary;

  static const Color adhkarTone = Color(0xFFF3E8FF); // Purple/15
  static const Color adhkarText = Color(0xFF7E22CE); // Purple-700

  static ThemeData get lightTheme {
    return ThemeData(
      primaryColor: primary,
      scaffoldBackgroundColor: background,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primary,
        background: background,
        surface: card,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        iconTheme: IconThemeData(color: text),
        titleTextStyle: TextStyle(
          color: text,
          fontSize: 18,
          fontWeight: FontWeight.w600,
          letterSpacing: -0.5,
        ),
      ),
      textTheme: const TextTheme(
        bodyLarge: TextStyle(color: text),
        bodyMedium: TextStyle(color: textMuted),
      ),
      cardTheme: CardThemeData(
        color: card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: border, width: 1),
        ),
      ),
      useMaterial3: true,
    );
  }
}
