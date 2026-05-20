import 'package:circles_online_muslim_community/src/constants/sizes.dart';
import 'package:circles_online_muslim_community/src/constants/text_strings.dart';
import 'package:circles_online_muslim_community/src/features/authentication/screens/forget_password/forget-password_options/forget_password_btn_widget.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../forget_password_mail/forget_password_mail.dart';

class ForgetPasswordScreen {
  static Future<dynamic> buildShowModalBottomSheet(context) {
    return showModalBottomSheet(
      context: context,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
      builder: (context) => Container(
        padding: const EdgeInsets.all(tDefaultSize),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(
            tForgetPasswordTitle,
            style: Theme.of(context).textTheme.displayMedium,
          ),
          Text(
            tForgetPasswordSubTitle,
            style: Theme.of(context).textTheme.displaySmall,
          ),
          const SizedBox(
            height: 30.0,
          ),
          ForgetPasswordBtnWidget(
            btnIcon: Icons.mail_outline_rounded,
            title: tEmail,
            subTitle: tResetViaEmail,
            onTap: () {
              Get.back();
              Get.to(() => const ForgetPasswordMailScreen());
            },
          ),
          const SizedBox(
            height: 20.0,
          ),
          ForgetPasswordBtnWidget(
            btnIcon: Icons.mobile_friendly_rounded,
            title: tPhoneNo,
            subTitle: tResetViaPhone,
            onTap: () {},
          ),
        ]),
      ),
    );
  }
}

