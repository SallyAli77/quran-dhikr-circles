/*
**************************
ToDO: Step 2 [ User Repository to perform Database Operation]
**************************
*/

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../features/authentication/models/user_model.dart';
import '../../features/authentication/models/teacher_application_model.dart';

class UserRepository extends GetxController {
  static UserRepository get instance => Get.find();

  final _db = FirebaseFirestore.instance;

  // Store user in Firebase

  Future<void> createUser(UserModel user) async {
    try {
      await _db.collection("Users").add(user.toJson());
      Get.snackbar("Success", "Your Account has been created.",
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green.withOpacity(0.1),
          colorText: Colors.green);
    } catch (error) {
      Get.snackbar("Error", "Something went wrong. Try again",
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.redAccent.withOpacity(0.1),
          colorText: Colors.red);
      print("ERROR - $error");
    }
  }

  // 2- Fetch All Users Or User details
  Future<UserModel?> getUserDetails(String email) async {
    try {
      final snapshot =
          await _db.collection("Users").where("Email", isEqualTo: email).get();
      if (snapshot.docs.isEmpty) return null;
      return UserModel.fromSnapshot(snapshot.docs.first);
    } catch (e) {
      print("Error fetching user details: $e");
      return null;
    }
  }

  // New: Search User by Unique ID
  Future<UserModel?> searchUserByUniqueId(String uniqueId) async {
    try {
      final snapshot = await _db
          .collection("Users")
          .where("UniqueId", isEqualTo: uniqueId)
          .get();
      if (snapshot.docs.isEmpty) return null;
      return UserModel.fromSnapshot(snapshot.docs.first);
    } catch (e) {
      print("Error searching user: $e");
      return null;
    }
  }

  // New: Send Friend Request
  Future<void> sendFriendRequest(String targetUserId, String currentUserId) async {
    try {
      await _db.collection("Users").doc(targetUserId).update({
        "FriendRequests": FieldValue.arrayUnion([currentUserId])
      });
    } catch (e) {
      print("Error sending friend request: $e");
    }
  }

  // New: Accept Friend Request
  Future<void> acceptFriendRequest(String currentUserId, String targetUserId) async {
    try {
      // Add to friends for both
      await _db.collection("Users").doc(currentUserId).update({
        "Friends": FieldValue.arrayUnion([targetUserId]),
        "FriendRequests": FieldValue.arrayRemove([targetUserId])
      });
      await _db.collection("Users").doc(targetUserId).update({
        "Friends": FieldValue.arrayUnion([currentUserId])
      });
    } catch (e) {
      print("Error accepting friend request: $e");
    }
  }

  Future<List<UserModel>> allUser() async {
    try {
      final snapshot = await _db.collection("Users").get();
      return snapshot.docs.map((e) => UserModel.fromSnapshot(e)).toList();
    } catch (e) {
      print("Error fetching all users: $e");
      return [];
    }
  }

  Future<void> updateUserDetails(UserModel user) async {
    try {
      await _db.collection("Users").doc(user.id).update(user.toJson());
    } catch (e) {
      print("Error updating user details: $e");
    }
  }

  Future<void> submitTeacherApplication(TeacherApplicationModel application) async {
    try {
      await _db.collection("TeacherApplications").add(application.toJson());
    } catch (e) {
      throw "Error submitting application: $e";
    }
  }

  Future<TeacherApplicationModel?> getApplicationStatus(String userId) async {
    try {
      final snapshot = await _db
          .collection("TeacherApplications")
          .where("userId", isEqualTo: userId)
          .orderBy("timestamp", descending: true)
          .limit(1)
          .get();
      if (snapshot.docs.isEmpty) return null;
      return TeacherApplicationModel.fromSnapshot(snapshot.docs.first);
    } catch (e) {
      print("Error fetching application status: $e");
      return null;
    }
  }
}
