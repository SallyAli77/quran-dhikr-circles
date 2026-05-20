import 'package:get/get.dart';
import "package:circles_online_muslim_community/src/constants/colors.dart";
import "package:circles_online_muslim_community/the_wall/model/pages/profile_page.dart";
import "package:cloud_firestore/cloud_firestore.dart";
import "package:firebase_auth/firebase_auth.dart";
import "package:flutter/material.dart";

import "../components/drawer.dart";
import "../components/text_field.dart";
import "../components/wall_post.dart";
import "../helper/helper_methods.dart";

class Sadka extends StatefulWidget {
  const Sadka({super.key});

  @override
  State<Sadka> createState() => _SadkaState();
}

class _SadkaState extends State<Sadka> {
  // user
  final currentUser = FirebaseAuth.instance.currentUser;

  // text controller
  final textController = TextEditingController();

  //sign user out
  void signout() {
    FirebaseAuth.instance.signOut();
  }

  // post message
  void postMessage() {
    // only post if there is something in the textfield
    if (textController.text.isNotEmpty) {
      // store in the firebase
      FirebaseFirestore.instance.collection("User Posts").add({
        "UserEmail": currentUser?.email ?? 'Unknown',
        "Message": textController.text,
        "TimeStamp": Timestamp.now(),
        "Likes": [],
      });
    }

    // clear the textfield
    setState(() {
      textController.clear();
    });
  }

  // Navigate to profile page
  void goToProfilePage() {
    // pop menu drawer
    Get.back();

    // go to profile page
    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const ProfilePage(),
        ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: tSecondaryColor,
      appBar: AppBar(
        backgroundColor: tSecondaryColor,
        title: const Text("Sadakat"),

        /*actions: [
          //Sign out button
          IconButton(onPressed: signout, icon: const Icon(Icons.logout)),
        ],*/
      ),
      drawer: MyDrawer(
        onProfileTap: goToProfilePage,
        onSignOut: signout,
      ),
      body: Center(
        child: Column(
          children: [
            // the wall
            //**extracting the data from the firebase */
            Expanded(
                child: StreamBuilder(
              stream: FirebaseFirestore.instance
                  .collection("User Posts")
                  .orderBy(
                    "TimeStamp",
                    descending: false,
                  )
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  return ListView.builder(
                    itemCount: snapshot.data!.docs
                        .length, //دي عشان الشاشة في النص يظهر فيها البوستات
                    itemBuilder: (context, index) {
                      // get the message
                      final post = snapshot.data!.docs[index];
                      return WallPost(
                        message: post["Message"],
                        user: post["UserEmail"],
                        postId: post.id,
                        likes: List<String>.from(post["Likes"] ?? []),
                        time: formatDate(post["TimeStamp"]),
                      );
                    },
                  );
                } else if (snapshot.hasError) {
                  return Center(
                    child: Text("Error: +${snapshot.error}"),
                  );
                }
                return const Center(
                  child: CircularProgressIndicator(),
                );
              },
            )),

            // post message
            Padding(
              padding: const EdgeInsets.all(5.0),
              child: Row(
                children: [
                  // textfield
                  Expanded(
                    child: MyTextField(
                      controller: textController,
                      hintText: "..أرجو الدعاء ل(اسم الشخص) بالرحمة والمغفرة",
                      obscureText: false,
                    ),
                  ),

                  //post button
                  IconButton(
                      onPressed: postMessage,
                      icon: const Icon(
                        Icons.send_sharp,
                        color: Colors.green,
                      ))
                ],
              ),
            ),

            // logged in as
            Text(
              "Logged in as: ${currentUser?.email ?? 'Unknown'}",
              style: const TextStyle(color: Colors.grey),
            ),

            const SizedBox(
              height: 25,
            )
          ],
        ),
      ),
    );
  }
}


