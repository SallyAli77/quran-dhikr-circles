import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../../constants/image_strings.dart';
import '../../../../constants/sizes.dart';
import '../../../../constants/text_strings.dart';
import '../login/login_screen.dart';

class signup_footer_widget extends StatelessWidget {
  const signup_footer_widget({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const Text("OR"),
        const SizedBox(
          height: tFormHeight - 20,
        ),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            icon: const Image(
              image: AssetImage(tgoogle),
              width: 20.0,
            ),
            onPressed: () {},
            label: Text(tSignInWithGoogle.toUpperCase()),
          ),
        ),
        const SizedBox(
          height: tFormHeight - 20,
        ),
        TextButton(
            onPressed: () => Get.to(() => const LoginScreen()),
            child: Text.rich(
              TextSpan(
                  text: tAlreadyHaveAnAccount,
                  style: Theme.of(context).textTheme.displaySmall,
                  children: const [
                    TextSpan(text: tLogin, style: TextStyle(color: Colors.blue))
                  ]),
            ))
      ],
    );
  }
}
