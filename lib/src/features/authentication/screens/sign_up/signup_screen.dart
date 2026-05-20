import 'package:circles_online_muslim_community/src/constants/image_strings.dart';
import 'package:circles_online_muslim_community/src/constants/sizes.dart';
import 'package:circles_online_muslim_community/src/constants/text_strings.dart';
import 'package:circles_online_muslim_community/src/features/authentication/screens/sign_up/signup_footer_widget.dart';
import 'package:circles_online_muslim_community/src/features/authentication/screens/sign_up/signup_form_widget.dart';
import 'package:flutter/material.dart';
import '../../../../common_widgets/fade_in_animation/form/form_header_widget.dart';

class SignUpScreen extends StatelessWidget {
  const SignUpScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: SingleChildScrollView(
          child: Container(
            padding: const EdgeInsets.all(tDefaultSize),
            child: const Column(crossAxisAlignment: CrossAxisAlignment.start,
                //....Section....1 //
                children: [
                  FormHeaderWidget(
                    image: tlogo,
                    title: tSignUpTitle,
                    subtitle: tSignUpSubTitle,
                  ),

                  //....Section....2 //
                  signUpFormWidget(),

                  //...section 3.....//
                  signup_footer_widget(),
                ]),
          ),
        ),
      ),
    );
  }
}
