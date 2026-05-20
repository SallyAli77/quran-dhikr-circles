import 'package:cloud_firestore/cloud_firestore.dart';

class RecitationPostModel {
  final String? id;
  final String userId;
  final String userName;
  final String audioUrl;
  final int surahIndex;
  final int ayahIndex;
  final String surahName;
  final DateTime timestamp;
  final String? teacherId; // If targeted at a specific teacher
  final String? feedback; // Teacher feedback
  final int? score; // Teacher score
  final String? voiceFeedbackUrl; // Teacher voice reply URL
  final bool isPublic;

  RecitationPostModel({
    this.id,
    required this.userId,
    required this.userName,
    required this.audioUrl,
    required this.surahIndex,
    required this.ayahIndex,
    required this.surahName,
    required this.timestamp,
    this.teacherId,
    this.feedback,
    this.score,
    this.voiceFeedbackUrl,
    this.isPublic = true,
  });

  Map<String, dynamic> toJson() {
    return {
      "userId": userId,
      "userName": userName,
      "audioUrl": audioUrl,
      "surahIndex": surahIndex,
      "ayahIndex": ayahIndex,
      "surahName": surahName,
      "timestamp": timestamp.toIso8601String(),
      "teacherId": teacherId,
      "feedback": feedback,
      "score": score,
      "voiceFeedbackUrl": voiceFeedbackUrl,
      "isPublic": isPublic,
    };
  }

  factory RecitationPostModel.fromSnapshot(DocumentSnapshot<Map<String, dynamic>> document) {
    final data = document.data()!;
    return RecitationPostModel(
      id: document.id,
      userId: data["userId"],
      userName: data["userName"],
      audioUrl: data["audioUrl"],
      surahIndex: data["surahIndex"],
      ayahIndex: data["ayahIndex"],
      surahName: data["surahName"],
      timestamp: DateTime.parse(data["timestamp"]),
      teacherId: data["teacherId"],
      feedback: data["feedback"],
      score: data["score"],
      voiceFeedbackUrl: data["voiceFeedbackUrl"],
      isPublic: data["isPublic"] ?? true,
    );
  }
}
