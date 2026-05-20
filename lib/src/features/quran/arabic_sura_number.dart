import 'package:flutter/material.dart';
import 'package:circles_online_muslim_community/src/features/quran/to_arabic_no_converter.dart';

class ArabicSuraNumber extends StatelessWidget {
  const ArabicSuraNumber({Key? key, required this.i}) : super(key: key);
  final int i;

  @override
  Widget build(BuildContext context) {
    return Text(
      "\uFD3E${(i + 1).toString().toArabicNumbers}\uFD3F",
      style: const TextStyle(
          color: Color.fromARGB(255, 0, 0, 0),
          fontFamily: "me_quran",
          fontSize: 20,
          shadows: [
            Shadow(
              offset: Offset(0.5, 0.5),
              blurRadius: 1.0,
              color: Color.fromARGB(255, 64, 163, 255),
            ),
          ]),
    );
  }
}
