import 'package:circles_online_muslim_community/src/features/authentication/models/user_model.dart';
import 'package:circles_online_muslim_community/src/features/authentication/screens/forget_password/forget-password_otp/otp_screen.dart';
import 'package:circles_online_muslim_community/src/repository/authentication_repository/authentication_repository.dart';
import 'package:circles_online_muslim_community/src/repository/user_repository/user_repository.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SignUpController extends GetxController {
  static SignUpController get instance => Get.find();

  //textfield controllers to get data from textfield
  final email = TextEditingController();
  final password = TextEditingController();
  final fullname = TextEditingController();
  final phoneNo = TextEditingController();

  final userRepo = Get.put(UserRepository());

  //call this function from design & it will do the rest
  void registerUser(String email, String password) {
    AuthenticationRepository.instance
        .createUserWithEmailAndPassword(email, password);
  }

//Get PhoneNo from User and pass  it to Auth Repository for firebase Authentication
  Future<void> createUser(UserModel user) async {
    await userRepo.createUser(user);
    phoneAuthentication(user.phoneNo);
    Get.to(() => const OTPScreen());
  }

  void phoneAuthentication(String phoneNo) {
    AuthenticationRepository.instance.phoneAuthentication(phoneNo);
  }
}
