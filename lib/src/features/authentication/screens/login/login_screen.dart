import 'package:circles_online_muslim_community/src/constants/sizes.dart';
import 'package:flutter/material.dart';
import 'login_footer_widget.dart';
import 'login_form_widget.dart';
import 'login_header_widget.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: SingleChildScrollView(
          child: Container(
            padding: const EdgeInsets.all(tDefaultSize),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start,
                //....Section....1 //
                children: [
                  const loginHeaderWidget(),

                  //....Section....2 //
                  loginForm(),

                  //....Section....3//
                  const login_footer_widget(),
                ]),
          ),
        ),
      ),
    );
  }
}
