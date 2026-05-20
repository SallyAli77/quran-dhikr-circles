import 'package:circles_online_muslim_community/src/constants/colors.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../components/button.dart';
import '../components/text_field.dart';

class RegisterPage extends StatefulWidget {
  final Function()? onTap;
  const RegisterPage({super.key, this.onTap});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  // text editing controllers
  final emailTextController = TextEditingController();
  final passwordTextController = TextEditingController();
  final confirmedPasswordTextController = TextEditingController();

  // sign user up
  void signUp() async {
    showDialog(
      context: context,
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );

    // display a dialog message
    void displayMessage(String message) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text(message),
        ),
      );
    }

    // make sure passwords match
    if (passwordTextController.text != confirmedPasswordTextController.text) {
      // pop loading circle
      Get.back();
      // display error message
      displayMessage("passwords don't match!");
      return;
    }

    // try creating the user
    try {
      // create the user
      UserCredential userCredential = await FirebaseAuth.instance
          .createUserWithEmailAndPassword(
              email: emailTextController.text,
              password: passwordTextController.text);
      // after creating the user, create a anew document in cloud firestore called Users
      FirebaseFirestore.instance
          .collection("Users")
          .doc(userCredential.user!.email)
          .set({
        "username": emailTextController.text.split("@")[0], // initial username
        "bio": "Empty bio.." //initial empty bio
        //add any additional fields as needed
      });

      //pop loading circle
      if (context.mounted) Get.back(); // for removing loa.cir.
    } on FirebaseAuthException catch (e) {
      // pop loading circle
      Get.back();
      // display error message
      displayMessage(e.code);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: tSecondaryColor,
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 25.0),
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    //logo
                    //....Section....1 //

                    /*const FormHeaderWidget(
              image: tlogo,
              title: tSignUpTitle,
              subtitle: tSignUpSubTitle,
            ),*/

                    //....Section....2 //

                    // email textfield
                    MyTextField(
                      controller: emailTextController,
                      hintText: "Email",
                      obscureText: false,
                    ),

                    const SizedBox(height: 10),

                    //password textfield
                    MyTextField(
                      controller: passwordTextController,
                      hintText: "Password",
                      obscureText: true,
                    ),

                    const SizedBox(height: 10),

                    //confirmed password textfield
                    MyTextField(
                      controller: confirmedPasswordTextController,
                      hintText: "Confirm Password",
                      obscureText: true,
                    ),

                    const SizedBox(height: 10),

                    // sign up button
                    MyButton(
                      text: "Sign Up",
                      onTap: signUp,
                    ),
                    const SizedBox(height: 10),

                    //go to register page
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Already Have an account?",
                          style: TextStyle(
                              fontWeight: FontWeight.bold, color: tWhiteColor),
                        ),
                        const SizedBox(width: 4),
                        GestureDetector(
                          onTap: widget.onTap,
                          child: const Text(
                            "Login now",
                            style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: tPrimaryColor),
                          ),
                        ),
                      ],
                    ),
                    //...section 3.....//
                    /* const signup_footer_widget(),*/
                  ]),
            ),
          ),
        ));
  }
}

