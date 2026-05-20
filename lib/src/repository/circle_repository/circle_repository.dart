import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:get/get.dart';
import '../../features/social/models/circle_model.dart';

class CircleRepository extends GetxController {
  static CircleRepository get instance => Get.find();

  final _db = FirebaseFirestore.instance;

  Future<String> createCircle(CircleModel circle) async {
    try {
      final doc = await _db.collection("Circles").add(circle.toJson());
      return doc.id;
    } catch (e) {
      throw "Error creating circle: $e";
    }
  }

  Stream<List<CircleModel>> getActiveCircles() {
    return _db
        .collection("Circles")
        .where("isActive", isEqualTo: true)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((doc) => CircleModel.fromSnapshot(doc)).toList());
  }

  Stream<CircleModel> getCircleStream(String circleId) {
    return _db
        .collection("Circles")
        .doc(circleId)
        .snapshots()
        .map((doc) => CircleModel.fromSnapshot(doc as DocumentSnapshot<Map<String, dynamic>>));
  }

  Future<void> joinCircle(String circleId, String userId) async {
    try {
      await _db.collection("Circles").doc(circleId).update({
        "memberIds": FieldValue.arrayUnion([userId])
      });
    } catch (e) {
      throw "Error joining circle: $e";
    }
  }

  Future<void> leaveCircle(String circleId, String userId) async {
    try {
      await _db.collection("Circles").doc(circleId).update({
        "memberIds": FieldValue.arrayRemove([userId])
      });
    } catch (e) {
      throw "Error leaving circle: $e";
    }
  }

  Future<void> updateTurn(String circleId, String nextUserId) async {
    try {
      await _db.collection("Circles").doc(circleId).update({
        "currentTurnUserId": nextUserId
      });
    } catch (e) {
      throw "Error updating turn: $e";
    }
  }
}
