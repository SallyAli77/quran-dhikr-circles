import 'package:circles_online_muslim_community/src/constants/colors.dart';
import 'package:circles_online_muslim_community/src/utils/theme/elevated_button_theme.dart';
import 'package:circles_online_muslim_community/src/utils/theme/outlined_button_theme.dart';
import 'package:circles_online_muslim_community/src/utils/theme/text_field_theme.dart';
import 'package:circles_online_muslim_community/src/utils/theme/text_theme.dart';
import 'package:flutter/material.dart';

class TAppTheme {
  static ThemeData lightTheme = ThemeData(
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: tPrimaryColor,
        secondary: tAccentColor,
        surface: tWhiteColor,
        onPrimary: tWhiteColor,
        onSurface: tDarkColor,
      ),
      scaffoldBackgroundColor: tWhiteColor,
      textTheme: TTextTheme.lightTextTheme,
      outlinedButtonTheme: TOutlinedButtonTheme.lightOutlinedButtonTheme,
      elevatedButtonTheme: TElevatedButtonTheme.lightElevatedButtonTheme,
      inputDecorationTheme: TTextFormFieldTheme.LightInputDecorationTheme);

  static ThemeData darkTheme = ThemeData(
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: tPrimaryColor,
        secondary: tAccentColor,
        surface: tSecondaryColor,
        onPrimary: tWhiteColor,
        onSurface: tWhiteColor,
      ),
      scaffoldBackgroundColor: tDarkColor,
      textTheme: TTextTheme.darkTextTheme,
      outlinedButtonTheme: TOutlinedButtonTheme.darkOutlinedButtonTheme,
      elevatedButtonTheme: TElevatedButtonTheme.darkElevatedButtonTheme,
      inputDecorationTheme: TTextFormFieldTheme.DarkInputDecorationTheme);
}
