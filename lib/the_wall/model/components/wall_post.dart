import 'package:circles_online_muslim_community/src/constants/colors.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../helper/helper_methods.dart';
import 'comment.dart';
import 'comment_button.dart';
import 'delete_button.dart';
import 'like_button.dart';

class WallPost extends StatefulWidget {
  final String message;
  final String user;
  final String time;
  final String postId;
  final List<String> likes;

  const WallPost({
    super.key,
    required this.message,
    required this.user,
    required this.postId,
    required this.likes,
    required this.time,
  });

  @override
  State<WallPost> createState() => _WallPostState();
}

class _WallPostState extends State<WallPost> {
  // user
  final currentUser = FirebaseAuth.instance.currentUser!;
  bool isLiked = false;

  // comment text controller
  final _commentTextController = TextEditingController();
  @override
  void initState() {
    super.initState();
    isLiked = widget.likes.contains(currentUser.email);
  }

  // toggle like
  void toggleLike() {
    setState(() {
      isLiked = !isLiked;
    });

    // Access the document is Firebase
    DocumentReference postRef =
        FirebaseFirestore.instance.collection("User Posts").doc(widget.postId);
    if (isLiked) {
      // if the post is now liked, add the user's email to the "likes" field
      postRef.update({
        "Likes": FieldValue.arrayUnion([currentUser.email])
      });
    } else {
      // if the post is now unliked, remove the user's email to the "likes" field
      postRef.update({
        "Likes": FieldValue.arrayRemove([currentUser.email])
      });
    }
  }

  // adding comment
  void addComment(String commentText) {
    // write the comment to firestore under the comments collection for  this post
    FirebaseFirestore.instance
        .collection("User Posts")
        .doc(widget.postId)
        .collection("Comments")
        .add(
      {
        "CommentText": commentText,
        "CommentedBy": currentUser.email,
        "CommentTime":
            Timestamp.now() // REMEMBER to format this when displaying
      },
    );
  }

  // show a dialog box for adding comment
  void showCommentDialog() {
    showDialog(
        context: context,
        builder: (context) => AlertDialog(
              title: const Text("Add Comment"),
              content: TextField(
                controller: _commentTextController,
                decoration: const InputDecoration(hintText: "Write a comment.."),
              ),
              actions: [
                // Cancel button
                TextButton(
                  onPressed: () {
                    // pop box
                    Get.back();
                    //clear controller
                    _commentTextController.clear();
                  },
                  child: const Text("Cancel"),
                ),
                // post button
                TextButton(
                  onPressed: () {
                    // add comment
                    addComment(_commentTextController.text);
                    // pop box
                    Get.back();
                    //clear controller
                    _commentTextController.clear();
                  },
                  child: const Text("Post"),
                ),
              ],
            ));
  }

  // delete a post
  void deletePost() {
    // show a dialog box asking for confirmation before deleting the post
    showDialog(
        context: context,
        builder: (context) => AlertDialog(
              title: const Text("Delete Post"),
              content: const Text("Are you sure you want to delete this post?"),
              actions: [
                // Cancel Button
                TextButton(
                  onPressed: () => Get.back(),
                  child: const Text("Cancel"),
                ),

                // Delete Button
                TextButton(
                  onPressed: () async {
                    // delete the comments from firestore first
                    // (if you only delete the post, the comments will still be stored in firestore)
                    final commentDocs = await FirebaseFirestore.instance
                        .collection("User Posts")
                        .doc(widget.postId)
                        .collection("Comments")
                        .get();
                    for (var doc in commentDocs.docs) {
                      await FirebaseFirestore.instance
                          .collection("User Posts")
                          .doc(widget.postId)
                          .collection("Comments")
                          .doc(doc.id)
                          .delete();
                    }

                    // then delete the post
                    FirebaseFirestore.instance
                        .collection("User Posts")
                        .doc(widget.postId)
                        .delete()
                        .then((value) => print("post deleted"))
                        .catchError(
                            (error) => print("failed to delete post: $error"));

                    // dismiss the dialog
                    Get.back();
                  },
                  child: const Text("Delete"),
                ),
              ],
            ));
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[850],
        borderRadius: BorderRadius.circular(8),
      ),
      margin: const EdgeInsets.only(top: 25, left: 15, right: 15),
      padding: const EdgeInsets.all(15),
      child: Column(
        children: [
          // user
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // group of text (user + email)
              Row(children: [
                Text(
                  widget.user,
                  style: const TextStyle(color: tWhiteColor),
                ),
                Text(
                  " . ",
                  style: TextStyle(color: Colors.grey[400]),
                ),
                Text(
                  widget.time,
                  style: const TextStyle(color: Colors.yellow),
                ),
              ]),
              // delete button
              if (widget.user == currentUser.email)
                DeleteButton(
                  onTap: deletePost,
                ),
            ],
          ),

          const SizedBox(height: 10),

          // message
          Row(
            children: [
              Text(widget.message),
            ],
          ),
          const SizedBox(height: 5),

          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              //like button
              LikeButton(
                isLiked: isLiked,
                onTap: toggleLike,
              ),

              const SizedBox(width: 5),
              // like count

              Text(
                widget.likes.length.toString(),
                style: const TextStyle(color: Colors.grey),
              ),
              const SizedBox(width: 25),

              //comment button
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  CommentButton(onTap: showCommentDialog),
                  const SizedBox(width: 5),
                  //comment count
                  const Text(
                    "0",
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 10),
          //comments under the post
          StreamBuilder<QuerySnapshot>(
            stream: FirebaseFirestore.instance
                .collection("User Posts")
                .doc(widget.postId)
                .collection("Comments")
                .orderBy("CommentTime", descending: true)
                .snapshots(),
            builder: (context, snapshot) {
              if (!snapshot.hasData) {
                return const Center(
                  child: CircularProgressIndicator(),
                );
              }
              return ListView(
                shrinkWrap: true, // for nested lists
                physics: const NeverScrollableScrollPhysics(),
                children: snapshot.data!.docs.map((doc) {
                  // get the comment
                  final commentData = doc.data() as Map<String, dynamic>;

                  // return the comment
                  return Comment(
                      text: commentData["CommentText"],
                      user: commentData["CommentedBy"],
                      time: formatDate(commentData["CommentTime"]));
                }).toList(),
              );
            },
          ),
        ],
      ),
    );
  }
}

