import 'package:circles_online_muslim_community/src/constants/colors.dart';
import 'package:circles_online_muslim_community/src/constants/image_strings.dart';
import 'package:circles_online_muslim_community/src/constants/sizes.dart';
import 'package:circles_online_muslim_community/src/constants/text_strings.dart';
import 'package:circles_online_muslim_community/src/features/authentication/screens/login/login_screen.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../../common_widgets/fade_in_animation/animation_design.dart';
import '../../../../common_widgets/fade_in_animation/fade_in_animation_model.dart';
import '../../controllers/fade_in_animation_controller.dart';
import '../sign_up/signup_screen.dart';

class welcomeScreen extends StatelessWidget {
  const welcomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(FadeInAnimationController());
    controller.startAnimation();

    var height = MediaQuery.of(context).size.height;
    return Scaffold(
      body: Stack(
        children: [
          TFadeInAnimation(
            durationInMs: 1200,
            animate: TanimatePosition(
              bottomAfter: 0,
              bottomBefore: -100,
              leftBefore: 0,
              leftAfter: 0,
              topBefore: 0,
              topAfter: 0,
              rightBefore: 0,
              rightAfter: 0,
            ),
            child: Container(
              padding: const EdgeInsets.all(tDefaultSize),
              color: Colors.white,
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Image(image: const AssetImage(twelcome), height: height * 0.6),
                    Column(
                      children: [
                        Text(tWelcomeTitle,
                            style: Theme.of(context).textTheme.headlineMedium,
                            textAlign: TextAlign.center),
                        Text(tWelcomeSubTitle,
                            style: Theme.of(context).textTheme.headlineSmall,
                            textAlign: TextAlign.center),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(
                            child: OutlinedButton(
                                onPressed: () =>
                                    Get.to(() => const LoginScreen()),
                                style: OutlinedButton.styleFrom(
                                  shape: const RoundedRectangleBorder(),
                                  foregroundColor: tSecondaryColor,
                                  side: const BorderSide(color: tSecondaryColor),
                                  padding: const EdgeInsets.symmetric(
                                      vertical: tButtonHeight),
                                ),
                                child: Text(tLogin.toUpperCase()))),
                        const SizedBox(
                          width: 10.0,
                        ),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () => Get.to(() => const SignUpScreen()),
                            style: ElevatedButton.styleFrom(
                              elevation: 0,
                              shape: const RoundedRectangleBorder(),
                              foregroundColor: tWhiteColor,
                              backgroundColor: tSecondaryColor,
                              side: const BorderSide(color: tSecondaryColor),
                              padding:
                                  const EdgeInsets.symmetric(vertical: tButtonHeight),
                            ),
                            child: Text(tSignUp.toUpperCase()),
                          ),
                        ),
                      ],
                    )
                  ]),
            ),
          ),
        ],
      ),
    );
  }
}
