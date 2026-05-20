

import 'package:circles_online_muslim_community/src/common_widgets/fade_in_animation/form/form_header_widget.dart';
import 'package:circles_online_muslim_community/src/constants/image_strings.dart';
import 'package:circles_online_muslim_community/src/constants/sizes.dart';
import 'package:circles_online_muslim_community/src/constants/text_strings.dart';
import 'package:circles_online_muslim_community/src/features/authentication/screens/forget_password/forget-password_otp/otp_screen.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ForgetPasswordMailScreen extends StatelessWidget {
  const ForgetPasswordMailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
          body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(tDefaultSize),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(
                height: tDefaultSize * 4,
              ),
              const FormHeaderWidget(
                image: tlogo,
                title: tForgetPassword,
                subtitle: tforgetMailSubTitle,
                crossAxisAlignment: CrossAxisAlignment.center,
                heightBetween: 30.0,
                textAlign: TextAlign.center,
              ),
              const SizedBox(
                height: tFormHeight,
              ),
              Form(
                  child: Column(
                children: [
                  TextFormField(
                    decoration: const InputDecoration(
                        label: Text(tEmail),
                        hintText: tEmail,
                        prefixIcon: Icon(Icons.mail_outline_rounded)),
                  ),
                  const SizedBox(
                    height: tFormHeight,
                  ),
                  SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                          onPressed: () {
                            Get.to(() => const OTPScreen());
                          },
                          child: const Text(tNext))),
                ],
              ))
            ],
          ),
        ),
      )),
    );
  }
}
