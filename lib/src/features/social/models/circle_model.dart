import 'package:cloud_firestore/cloud_firestore.dart';

class CircleModel {
  final String id;
  final String hostId;
  final String title;
  final String type; // 'quran', 'tasbeeh', 'adhkar'
  final List<String> memberIds;
  final String? currentTurnUserId;
  final bool isActive;
  final DateTime createdAt;
  final Map<String, dynamic> metadata; // e.g., {"surah": 1, "startAyah": 1}

  CircleModel({
    required this.id,
    required this.hostId,
    required this.title,
    required this.type,
    required this.memberIds,
    this.currentTurnUserId,
    this.isActive = true,
    required this.createdAt,
    this.metadata = const {},
  });

  Map<String, dynamic> toJson() {
    return {
      "hostId": hostId,
      "title": title,
      "type": type,
      "memberIds": memberIds,
      "currentTurnUserId": currentTurnUserId,
      "isActive": isActive,
      "createdAt": createdAt.toIso8601String(),
      "metadata": metadata,
    };
  }

  factory CircleModel.fromSnapshot(DocumentSnapshot<Map<String, dynamic>> document) {
    final data = document.data()!;
    return CircleModel(
      id: document.id,
      hostId: data["hostId"],
      title: data["title"],
      type: data["type"],
      memberIds: List<String>.from(data["memberIds"] ?? []),
      currentTurnUserId: data["currentTurnUserId"],
      isActive: data["isActive"] ?? true,
      createdAt: DateTime.parse(data["createdAt"]),
      metadata: data["metadata"] ?? {},
    );
  }
}
