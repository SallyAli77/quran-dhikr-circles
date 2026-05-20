import 'package:circles_online_muslim_community/src/features/authentication/controllers/signup_controller.dart';
import 'package:circles_online_muslim_community/src/features/authentication/models/user_model.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../../constants/sizes.dart';
import '../../../../constants/text_strings.dart';
import 'dart:math';

class signUpFormWidget extends StatelessWidget {
  const signUpFormWidget({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(SignUpController());
    final formKey = GlobalKey<FormState>();

    return Container(
        padding: const EdgeInsets.symmetric(vertical: tFormHeight - 10),
        child: Form(
          key: formKey,
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            TextFormField(
              controller: controller.fullname,
              decoration: const InputDecoration(
                prefixIcon: Icon(Icons.person_outline_outlined),
                labelText: tFullname,
              ),
            ),
            const SizedBox(
              height: tFormHeight - 20,
            ),
            TextFormField(
              controller: controller.email,
              decoration: const InputDecoration(
                prefixIcon: Icon(Icons.email_outlined),
                labelText: tEmail,
              ),
            ),
            const SizedBox(
              height: tFormHeight - 20,
            ),
            TextFormField(
              controller: controller.phoneNo,
              decoration: const InputDecoration(
                prefixIcon: Icon(Icons.phone_android),
                labelText: tPhoneNo,
              ),
            ),
            const SizedBox(
              height: tFormHeight - 20,
            ),
            TextFormField(
              controller: controller.password,
              decoration: const InputDecoration(
                prefixIcon: Icon(Icons.fingerprint),
                labelText: tPassword,
              ),
            ),
            const SizedBox(
              height: tFormHeight - 10,
            ),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                  onPressed: () {
                    if (formKey.currentState!.validate()) {
                      final user = UserModel(
                        email: controller.email.text.trim(),
                        fullname: controller.fullname.text.trim(),
                        phoneNo: controller.phoneNo.text.trim(),
                        password: controller.password.text.trim(),
                        uniqueId: "user_${Random().nextInt(999999)}",
                      );
                      SignUpController.instance.createUser(user);
                    }
                  },
                  child: Text(tSignUp.toUpperCase())),
            )
          ]),
        ));
  }
}
