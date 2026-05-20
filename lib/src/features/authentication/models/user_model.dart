/*
    ***************************
    Todo: Step - 1 [Create Model]
    ***************************
*/

import 'package:cloud_firestore/cloud_firestore.dart';

class UserModel {
  final String? id;
  final String fullname;
  final String email;
  final String phoneNo;
  final String password;
  final String uniqueId; 
  final String role; // "student" or "teacher"
  final String? bio;
  final String? qualifications;
  final List<String> friends;
  final List<String> friendRequests;

  const UserModel({
    this.id,
    required this.email,
    required this.password,
    required this.fullname,
    required this.phoneNo,
    required this.uniqueId,
    this.role = "student",
    this.bio,
    this.qualifications,
    this.friends = const [],
    this.friendRequests = const [],
  });

  toJson() {
    return {
      "FullName": fullname,
      "Email": email,
      "Phone": phoneNo,
      "Password": password,
      "UniqueId": uniqueId,
      "Role": role,
      "Bio": bio,
      "Qualifications": qualifications,
      "Friends": friends,
      "FriendRequests": friendRequests,
    };
  }

  /// 1- MAP USER FETCHED FROM FIREBASE TO USERMODEL
  factory UserModel.fromSnapshot(
      DocumentSnapshot<Map<String, dynamic>> document) {
    final data = document.data() ?? {};
    return UserModel(
      id: document.id,
      email: data["Email"] ?? '',
      password: data["Password"] ?? '',
      fullname: data["FullName"] ?? '',
      phoneNo: data["Phone"] ?? '',
      uniqueId: data["UniqueId"] ?? '',
      role: data["Role"] ?? 'student',
      bio: data["Bio"],
      qualifications: data["Qualifications"],
      friends: List<String>.from(data["Friends"] ?? []),
      friendRequests: List<String>.from(data["FriendRequests"] ?? []),
    );
  }
}
