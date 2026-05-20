import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class TTextTheme {
  static TextTheme lightTextTheme = TextTheme(
      displayMedium: GoogleFonts.exo(
          color: Colors.black87, fontSize: 24, fontWeight: FontWeight.bold),
      displaySmall: GoogleFonts.exo(
          color: Colors.black45, fontSize: 18, fontWeight: FontWeight.normal),
      headlineMedium: GoogleFonts.exo(
          color: Colors.black87, fontSize: 24, fontWeight: FontWeight.bold),
      headlineSmall: GoogleFonts.exo(
          color: Colors.black87, fontSize: 18, fontWeight: FontWeight.normal),
      titleLarge: GoogleFonts.exo(
          color: Colors.black87, fontSize: 16, fontWeight: FontWeight.bold),
      displayLarge: GoogleFonts.exo(
          color: Colors.black87, fontSize: 14, fontWeight: FontWeight.normal));

  //>>>>>>>>>>>>Dark<<<<<<<<<<<<//
  static TextTheme darkTextTheme = TextTheme(
    displayMedium: GoogleFonts.exo(
        color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
    displaySmall: GoogleFonts.exo(
        color: Colors.white, fontSize: 18, fontWeight: FontWeight.normal),
    headlineMedium: GoogleFonts.exo(
        color: Colors.black87, fontSize: 24, fontWeight: FontWeight.bold),
    headlineSmall: GoogleFonts.exo(
        color: Colors.black87, fontSize: 18, fontWeight: FontWeight.normal),
    titleLarge: GoogleFonts.exo(
        color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
    displayLarge: GoogleFonts.exo(
        color: Colors.white, fontSize: 14, fontWeight: FontWeight.normal),
  );
}
