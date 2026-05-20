import 'package:get/get.dart';
import "package:circles_online_muslim_community/src/constants/colors.dart";
import "package:firebase_auth/firebase_auth.dart";
import "package:flutter/material.dart";
import "../components/button.dart";
import "../components/text_field.dart";

class LoginPage extends StatefulWidget {
  final Function()? onTap;
  const LoginPage({super.key, this.onTap});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  // text editing controllers
  final emailTextController = TextEditingController();
  final passwordTextController = TextEditingController();

  //Sign user In
  void signIn() async {
    // show loading circle
    showDialog(
      context: context,
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );

    //try sign in
    try {
      await FirebaseAuth.instance.signInWithEmailAndPassword(
          email: emailTextController.text,
          password: passwordTextController.text);

      // pop loading circle
      if (context.mounted) Get.back();
    } on FirebaseAuthException catch (e) {
      // pop loading circle
      Get.back();
      // display error message
      displayMessage(e.code);
    }
  }

  // display a dialog message
  void displayMessage(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(message),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: tSecondaryColor,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 25.0),
            child:
                Column(mainAxisAlignment: MainAxisAlignment.center, children: [
              //....Section....1 *********************//

              //logo
              /*const loginHeaderWidget(),*/

              //....Section....2 ********************//

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

              // sign in button
              MyButton(
                text: "Sign In",
                onTap: signIn,
              ),
              const SizedBox(height: 10),
              //go to register page
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    "Not a member?",
                    style: TextStyle(
                        fontWeight: FontWeight.bold, color: tWhiteColor),
                  ),
                  const SizedBox(width: 4),
                  GestureDetector(
                    onTap: widget.onTap,
                    child: const Text(
                      "Register now",
                      style: TextStyle(
                          fontWeight: FontWeight.bold, color: tPrimaryColor),
                    ),
                  ),

                  //....Section....3*******************//

                  /*const login_footer_widget(),*/
                ],
              )
            ]),
          ),
        ),
      ),
    );
  }
}


