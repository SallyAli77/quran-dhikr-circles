import 'package:get/get.dart';
import "package:flutter/material.dart";
import 'package:circles_online_muslim_community/src/features/quran/constants.dart';

class settings extends StatefulWidget {
  const settings({Key? key}) : super(key: key);

  @override
  State<settings> createState() => _settingsState();
}

class _settingsState extends State<settings> {
  @override
  Widget build(BuildContext context) {
    return Material(
      child: Scaffold(
        appBar: AppBar(
          title: const Text("settings"),
          backgroundColor: Colors.blue,
        ),
        body: SafeArea(
            child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: SingleChildScrollView(
            child: Column(
              children: [
                const Text(
                  "Arabic Font Size:",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
                Slider(
                    value: arabicFontSize,
                    min: 20,
                    max: 40,
                    onChanged: (value) {
                      setState(() {
                        arabicFontSize = value;
                      });
                    }),
                Text(
                  "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
                  style:
                      TextStyle(fontFamily: "quran", fontSize: arabicFontSize),
                  textDirection: TextDirection.rtl,
                ),
                const Padding(
                  padding: EdgeInsets.only(top: 10, bottom: 10),
                  child: Divider(),
                ),
                const Text(
                  "Mushaf Mode Font Size:",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
                Slider(
                    value: mushafFontSize,
                    min: 20,
                    max: 50,
                    onChanged: (value) {
                      setState(() {
                        mushafFontSize = value;
                      });
                    }),
                Text(
                  "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
                  style:
                      TextStyle(fontFamily: "quran", fontSize: arabicFontSize),
                  textDirection: TextDirection.rtl,
                ),

                //buttons
                const SizedBox(
                  height: 20,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    ElevatedButton(
                        onPressed: () {
                          setState(() {
                            arabicFontSize = 28;
                            mushafFontSize = 40;
                          });
                          saveSetting();
                        },
                        child: const Text("Reset")),
                    ElevatedButton(
                        onPressed: () {
                          saveSetting();
                          Get.back();
                        },
                        child: const Text("Save")),
                  ],
                ),
              ],
            ),
          ),
        )),
      ),
    );
  }
}


