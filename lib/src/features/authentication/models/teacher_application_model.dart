import 'package:cloud_firestore/cloud_firestore.dart';

class TeacherApplicationModel {
  final String? id;
  final String userId;
  final String userName;
  final String subject;
  final String bio;
  final String? qualificationsUrl;
  final String status; // "pending", "exam_in_progress", "approved", "rejected"
  final DateTime timestamp;

  TeacherApplicationModel({
    this.id,
    required this.userId,
    required this.userName,
    required this.subject,
    required this.bio,
    this.qualificationsUrl,
    this.status = "pending",
    required this.timestamp,
  });

  Map<String, dynamic> toJson() {
    return {
      "userId": userId,
      "userName": userName,
      "subject": subject,
      "bio": bio,
      "qualificationsUrl": qualificationsUrl,
      "status": status,
      "timestamp": timestamp.toIso8601String(),
    };
  }

  factory TeacherApplicationModel.fromSnapshot(DocumentSnapshot<Map<String, dynamic>> document) {
    final data = document.data()!;
    return TeacherApplicationModel(
      id: document.id,
      userId: data["userId"],
      userName: data["userName"],
      subject: data["subject"],
      bio: data["bio"],
      qualificationsUrl: data["qualificationsUrl"],
      status: data["status"] ?? "pending",
      timestamp: DateTime.parse(data["timestamp"]),
    );
  }
}
