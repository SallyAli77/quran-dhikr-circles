import 'package:circles_online_muslim_community/pages/bottom_bar.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import 'login_or_register.dart';

class AuthPage extends StatelessWidget {
  const AuthPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder(
          stream: FirebaseAuth.instance
              .authStateChanges(), // tell us if logged or not
          builder: (context, snapshot) {
            // user is logger in
            if (snapshot.hasData) {
              return const HomePage();
            }
            // user is NOT logged in
            else {
              return const LoginOrRegister();
            }
          }),
    );
  }
}
