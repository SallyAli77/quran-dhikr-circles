import 'package:circles_online_muslim_community/src/repository/authentication_repository/authentication_repository.dart';
import 'package:get/get.dart';

import '../../../../pages/bottom_bar.dart';

class OTPController extends GetxController {
  static OTPController get instance => Get.find();

  void verifyOTP(String otp) async {
    var isVerified = await AuthenticationRepository.instance.verifyOTP(otp);
    isVerified ? Get.offAll(const HomePage()) : Get.back();
  }
}
