import 'package:circles_online_muslim_community/src/features/authentication/screens/forget_password/forget-password_options/build_show_modal_bottom_sheet.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../../../pages/bottom_bar.dart';
import '../../../../constants/sizes.dart';
import '../../../../constants/text_strings.dart';

Form loginForm() {
  return Form(
      child: Container(
    padding: const EdgeInsets.symmetric(vertical: tFormHeight - 10),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextFormField(
          decoration: const InputDecoration(
              prefixIcon: Icon(Icons.person_outline_outlined),
              labelText: tEmail,
              hintText: tEmail,
              border: OutlineInputBorder()),
        ),
        const SizedBox(
          height: tFormHeight - 20,
        ),
        TextFormField(
          decoration: const InputDecoration(
              prefixIcon: Icon(Icons.fingerprint),
              labelText: tPassword,
              hintText: tPassword,
              border: OutlineInputBorder(),
              suffixIcon: IconButton(
                  onPressed: null, icon: Icon(Icons.remove_red_eye_sharp))),
        ),
        const SizedBox(
          height: tFormHeight - 20,
        ),
        Align(
            alignment: Alignment.centerRight,
            child: TextButton(
                onPressed: () {
                  ForgetPasswordScreen.buildShowModalBottomSheet(Get.context);
                },
                child: const Text(tForgetPassword))),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () => Get.to(() => const HomePage()),
            child: Text(tLogin.toUpperCase()),
          ),
        ),
      ],
    ),
  ));
}
