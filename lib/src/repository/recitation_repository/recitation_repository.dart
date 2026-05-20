import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:get/get.dart';
import '../../features/social/models/recitation_post_model.dart';

class RecitationRepository extends GetxController {
  static RecitationRepository get instance => Get.find();

  final _db = FirebaseFirestore.instance;
  final _storage = FirebaseStorage.instance;

  Future<String> uploadAudio(File file, String userId) async {
    try {
      final fileName = "recitation_${DateTime.now().millisecondsSinceEpoch}.m4a";
      final ref = _storage.ref().child('recitations').child(userId).child(fileName);
      await ref.putFile(file);
      return await ref.getDownloadURL();
    } catch (e) {
      throw "Error uploading audio: $e";
    }
  }

  Future<void> saveRecitationPost(RecitationPostModel post) async {
    try {
      await _db.collection("Recitations").add(post.toJson());
    } catch (e) {
      throw "Error saving post: $e";
    }
  }

  Future<List<RecitationPostModel>> getPublicRecitations() async {
    try {
      final snapshot = await _db
          .collection("Recitations")
          .where("isPublic", isEqualTo: true)
          .orderBy("timestamp", descending: true)
          .get();
      return snapshot.docs.map((e) => RecitationPostModel.fromSnapshot(e)).toList();
    } catch (e) {
      print("Error fetching recitations: $e");
      return [];
    }
  }

  Future<List<RecitationPostModel>> getRecitationsForTeacher(String teacherId) async {
    try {
      final snapshot = await _db
          .collection("Recitations")
          .where("teacherId", isEqualTo: teacherId)
          .orderBy("timestamp", descending: true)
          .get();
      return snapshot.docs.map((e) => RecitationPostModel.fromSnapshot(e)).toList();
    } catch (e) {
      print("Error fetching recitations for teacher: $e");
      return [];
    }
  }

  Future<void> submitFeedback(String postId, String feedback, int score, {String? voiceFeedbackUrl}) async {
    try {
      await _db.collection("Recitations").doc(postId).update({
        "feedback": feedback,
        "score": score,
        "voiceFeedbackUrl": voiceFeedbackUrl,
      });
    } catch (e) {
      throw "Error submitting feedback: $e";
    }
  }
}
