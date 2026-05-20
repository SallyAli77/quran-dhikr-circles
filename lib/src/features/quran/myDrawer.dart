import 'package:circles_online_muslim_community/src/constants/text_strings.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:circles_online_muslim_community/src/features/quran/constants.dart';
import 'package:circles_online_muslim_community/src/features/quran/settings.dart';

class MyDrawer extends StatelessWidget {
  const MyDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
              decoration: const BoxDecoration(
                color: Colors.transparent,
              ),
              child: Column(
                children: [
                  Image.asset(
                    "assets/logo.png",
                    height: 80,
                  ),
                  const Text(
                    tAppName,
                    style: TextStyle(fontSize: 20),
                  )
                ],
              )),
          ListTile(
            leading: const Icon(
              Icons.settings,
            ),
            title: const Text("Settings"),
            onTap: () {
              Get.back();
              Get.to(() => const settings());
            },
          ),
          ListTile(
            leading: const Icon(
              Icons.share,
            ),
            title: const Text("Share"),
            onTap: () {
              Share.share(
                  "'*Muslim Circles \n Share our Application through www.google.com'");
              Get.back();
            },
          ),
          ListTile(
            leading: const Icon(
              Icons.rate_review,
            ),
            title: const Text("Rate us"),
            onTap: () async {
              if (!await launchUrl(quranAppUrl,
                  mode: LaunchMode.externalApplication)) {
                throw "Sorry, Could not launch $quranAppUrl";
              }
            },
          ),
        ],
      ),
    );
  }
}

