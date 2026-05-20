import 'package:circles_online_muslim_community/presentation/screens/auth_screens.dart' as premium_auth;
import 'package:circles_online_muslim_community/presentation/screens/main_navigation_screen.dart';
import 'package:circles_online_muslim_community/src/repository/authentication_repository/exception/signup_email_passwprd_failure.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:get/get.dart';


class AuthenticationRepository extends GetxController {
  static AuthenticationRepository get instance => Get.find();

  //variables
  final _auth = FirebaseAuth.instance;
  late final Rx<User?> firebaseUser;
  var verificationId = "".obs;

  //will be load when app launches this func will be called and set the firebaseUser state
  @override
  void onReady() {
    firebaseUser = Rx<User?>(_auth.currentUser);
    firebaseUser.bindStream(_auth.userChanges());
    ever(firebaseUser, _setInitialScreen);
  }

//setting initial screen onLoad
  _setInitialScreen(User? callback) {
    callback == null
        ? Get.offAll(() => const premium_auth.LoginScreen())
        : Get.offAll(() => const MainNavigationScreen());
  }

//func
  Future<void> phoneAuthentication(String phoneNo) async {
    await _auth.verifyPhoneNumber(
        phoneNumber: phoneNo,
        verificationCompleted: ((credential) async {
          await _auth.signInWithCredential(credential);
        }),
        verificationFailed: (e) {
          if (e.code == "invalid.phone.number") {
            Get.snackbar("Error", "The provided phone number is not valid.");
          } else {
            Get.snackbar("Error", "Something went wrong. Try again.");
          }
        },
        codeSent: ((verificationId, forceResendingToken) {
          this.verificationId.value = verificationId;
        }),
        codeAutoRetrievalTimeout: ((verificationId) {
          this.verificationId.value = verificationId;
        }));
  }

  Future<bool> verifyOTP(String otp) async {
    var credentials = await _auth.signInWithCredential(
        PhoneAuthProvider.credential(
            verificationId: verificationId.value, smsCode: otp));
    return credentials.user != null ? true : false;
  }

  Future<void> createUserWithEmailAndPassword(
      String email, String password) async {
    try {
      await _auth.createUserWithEmailAndPassword(
          email: email, password: password);
      firebaseUser.value != null
          ? Get.offAll(() => const MainNavigationScreen())
          : Get.to(() => const premium_auth.LoginScreen());
    } on FirebaseAuthException catch (e) {
      final ex = SignUpWithEmailAndPasswordFailure.code(e.code);
      print("FIREBASE AUTH EXCEPTION - ${ex.message}");
      throw ex;
    } catch (_) {
      const ex = SignUpWithEmailAndPasswordFailure();
      print("EXCEPTION - ${ex.message}");
      throw ex;
    }
  }

  Future<void> loginWithEmailAndPassword(String email, String password) async {
    try {
      await _auth.signInWithEmailAndPassword(email: email, password: password);
    } on FirebaseAuthException {
      // Handle error
    } catch (_) {}
  }

  Future<void> logout() async => await _auth.signOut();
}
