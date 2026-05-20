import 'package:circles_online_muslim_community/src/constants/colors.dart';
import 'package:circles_online_muslim_community/src/constants/image_strings.dart';
import 'package:circles_online_muslim_community/src/constants/sizes.dart';
import 'package:circles_online_muslim_community/src/constants/text_strings.dart';
import 'package:circles_online_muslim_community/src/features/core/screens/profile/update_profile_screen.dart';
import 'package:circles_online_muslim_community/src/features/core/screens/profile/widgets/profile_menu.dart';
import 'package:flutter/material.dart';
import 'package:circles_online_muslim_community/src/repository/authentication_repository/authentication_repository.dart';
import 'package:get/get.dart';
import 'package:line_awesome_flutter/line_awesome_flutter.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    var isDark = MediaQuery.of(context).platformBrightness == Brightness.dark;
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
            onPressed: () {}, icon: Icon(Icons.chevron_left)),
        title: Text(tProfile, style: Theme.of(context).textTheme.displayLarge),
        actions: [
          IconButton(
              onPressed: () {
                isDark ? Brightness.dark : Brightness.light;
              },
              icon: Icon(isDark ? Icons.wb_sunny_outlined : Icons.nightlight_round_outlined))
        ],
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(tDefaultSize),
          child: Column(
            children: [
              Stack(
                children: [
                  SizedBox(
                    width: 120,
                    height: 120,
                    child: ClipRRect(
                        borderRadius: BorderRadius.circular(100),
                        child: const Image(image: AssetImage(tProfileImage))),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                        width: 35,
                        height: 35,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(100),
                          color: tPrimaryColor,
                        ),
                        child: Icon(Icons.edit,
                            color: Colors.black, size: 20)),
                  )
                ],
              ),
              const SizedBox(height: 10),
              Text(tProfileHeading,
                  style: Theme.of(context).textTheme.bodyLarge),
              Text(tProfileSubHeading,
                  style: Theme.of(context).textTheme.bodyMedium),
              const SizedBox(height: 20),
              SizedBox(
                width: 200,
                child: ElevatedButton(
                    onPressed: () => Get.to(() => const UpdateProfileScreen()),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: tPrimaryColor,
                        side: BorderSide.none,
                        shape: const StadiumBorder()),
                    child: const Text(
                      tEditProfile,
                      style: TextStyle(color: tDarkColor),
                    )),
              ),
              const SizedBox(height: 30),
              const Divider(),
              const SizedBox(height: 10),

              //Menu
              ProfileMenuWidget(
                  title: "Settings",
                  icon: Icons.settings,
                  onPress: () {}),
              ProfileMenuWidget(
                  title: "Billing Details",
                  icon: Icons.wallet,
                  onPress: () {}),
              ProfileMenuWidget(
                  title: "User Management",
                  icon: Icons.person_add_alt_1,
                  onPress: () {}),
              const Divider(color: Colors.grey),
              const SizedBox(height: 10),
              ProfileMenuWidget(
                  title: "Information",
                  icon: Icons.info_outline,
                  onPress: () {}),
              ProfileMenuWidget(
                  title: "Logout",
                  icon: Icons.logout,
                  textColor: Colors.red,
                  endIcon: false,
                  onPress: () {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                        title: const Row(
                          children: [
                            Icon(Icons.logout, color: Colors.red),
                            SizedBox(width: 8),
                            Text("Sign Out"),
                          ],
                        ),
                        content: const Text("Are you sure you want to sign out of your account?"),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text("Cancel"),
                          ),
                          ElevatedButton(
                            onPressed: () {
                              Navigator.pop(context);
                              AuthenticationRepository.instance.logout();
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            child: const Text("Sign Out"),
                          ),
                        ],
                      ),
                    );
                  }),
            ],
          ),
        ),
      ),
    );
  }
}
