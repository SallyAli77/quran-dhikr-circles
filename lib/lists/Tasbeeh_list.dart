import 'package:flutter/material.dart';

List<DropdownMenuItem<String>> TasbeehItems =
    List<DropdownMenuItem<String>>.generate(
  TasbeehList.length,
  (int index) {
    String Tasbeeh = TasbeehList[index];
    return DropdownMenuItem(
      value: Tasbeeh,
      child: Text(Tasbeeh),
    );
  },
);

const TasbeehList = [
  'الحمد لله',
  'أستغفر الله العظيم',
  'سبحان الله',
  'لا إله إلا الله',
  "الله أكبر",
  'الصلاة على النبي',
  'حسبي الله ونعم الوكيل ',
  'متنوع',
  "أخرى",
];
