import 'package:circles_online_muslim_community/pages/Tasbeeh.dart';
import 'package:circles_online_muslim_community/pages/read.dart';
import 'package:circles_online_muslim_community/pages/screens/create_memo_quran_screen.dart';
import 'package:circles_online_muslim_community/pages/screens/create_tasbeeh_screen.dart';
import 'package:circles_online_muslim_community/src/constants/colors.dart';
import 'package:circles_online_muslim_community/src/constants/text_strings.dart';
import 'package:circles_online_muslim_community/src/features/core/screens/profile/profile_screen.dart';
import 'package:circles_online_muslim_community/src/features/quran/index.dart';
import 'package:circles_online_muslim_community/src/repository/authentication_repository/authentication_repository.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../src/constants/image_strings.dart';

class UserHomePage extends StatefulWidget {
  const UserHomePage({super.key});

  @override
  State<UserHomePage> createState() => _UserHomePageState();
}

class _UserHomePageState extends State<UserHomePage> {
  int _selectedIndex = 0;

  void _navigateBottomBar(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          leading: IconButton(
            onPressed: () => Get.to(const ProfileScreen()),
            icon: const Icon(Icons.menu),
            color: tPrimaryColor,
          ),
          title: Text(tAppName,
              style: Theme.of(context).textTheme.displaySmall,
              textAlign: TextAlign.start),
          elevation: 0,
          backgroundColor: tSecondaryColor,
          actions: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: const CircleAvatar(
                child: ClipOval(
                  child: Image(
                    image: AssetImage(tman33),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),
            IconButton(
                icon: const Icon(Icons.exit_to_app),
                onPressed: () {
                  AuthenticationRepository.instance.logout();
                }),
          ]),
      body: DecoratedBox(
        decoration: const BoxDecoration(color: tSecondaryColor),
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 5.0),
          children: [
            /*
            //appBar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  const CircleAvatar(
                    child: ClipOval(
                      child: Image(
                        height: 60.0,
                        width: 60.0,
                        image: AssetImage(tman),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Salam!",
                        style: TextStyle(
                          fontFamily: "Billabong",
                          fontSize: 20.0,
                        ),
                      ),
                      const Text(
                        "Person Name",
                        style: TextStyle(
                            fontFamily: "Billabong",
                            fontSize: 16.0,
                            color: Colors.blue),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.settings),
                        iconSize: 30.0,
                        onPressed: () => print("settings"),
                      ),
                      const SizedBox(
                        width: 16.0,
                      ),
                      Container(
                        width: 35.0,
                        child: IconButton(
                          icon: const Icon(Icons.notification_add_rounded),
                          iconSize: 30.0,
                          onPressed: () => print("notification"),
                        ),
                      )
                    ],
                  )
                ],
              ),
            ), */
            //Banner
            GestureDetector(
              onTap: () => Get.to(() => const IndexPage()),
              child: SizedBox(
                height: 45,
                child: ListView(
                  shrinkWrap: true,
                  scrollDirection: Axis.horizontal,
                  children: [
                    SizedBox(
                      width: 170,
                      height: 50,
                      child: Row(
                        children: [
                          Container(
                            width: 45,
                            height: 45,
                            decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(50),
                                color: Colors.green),
                            child: const Center(
                              child: CircleAvatar(
                                child: ClipOval(
                                  child: Image(
                                    height: 40.0,
                                    width: 40.0,
                                    image: AssetImage(tquran2),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(
                            width: 5,
                          ),
                          Flexible(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  "Quran Kareem",
                                  style:
                                      Theme.of(context).textTheme.displayLarge,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                Text(
                                  "Read werd",
                                  style:
                                      Theme.of(context).textTheme.displayLarge,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: () => Get.to(() => const tasbeehPage()),
                      child: SizedBox(
                        width: 170,
                        height: 50,
                        child: Row(
                          children: [
                            Container(
                              width: 45,
                              height: 45,
                              decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(50),
                                  color: Colors.orange),
                              child: const Center(
                                child: CircleAvatar(
                                  child: ClipOval(
                                    child: Image(
                                      height: 40.0,
                                      width: 40.0,
                                      image: AssetImage(ttasbeeh),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(
                              width: 5,
                            ),
                            Flexible(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    "Tasbeeh",
                                    style: Theme.of(context)
                                        .textTheme
                                        .displayLarge,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  Text(
                                    "Begin Tasbeeh",
                                    style: Theme.of(context)
                                        .textTheme
                                        .displayLarge,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () => Get.to(() => const read()),
                      child: SizedBox(
                        width: 170,
                        height: 50,
                        child: Row(
                          children: [
                            Container(
                              width: 45,
                              height: 45,
                              decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(50),
                                  color: Colors.red),
                              child: const Center(
                                child: CircleAvatar(
                                  child: ClipOval(
                                    child: Image(
                                      height: 40.0,
                                      width: 40.0,
                                      image: AssetImage(tpray),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(
                              width: 5,
                            ),
                            Flexible(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    "Read",
                                    style: Theme.of(context)
                                        .textTheme
                                        .displayLarge,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  Text(
                                    "Azkar & Ruqya",
                                    style: Theme.of(context)
                                        .textTheme
                                        .displayLarge,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            /*Container(
              width: double.infinity,
              height: 50.0,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: 10,
                itemBuilder: (BuildContext context, int index) {
                  if (index == 0) {
                    return const SizedBox(width: 10.0);
                  }
                  return Container(
                    margin: const EdgeInsets.all(10.0),
                    width: 30.0,
                    height: 30.0,
                    decoration: const BoxDecoration(
                      shape: BoxShape.rectangle,
                      boxShadow: [
                        BoxShadow(
                            color: Colors.black45,
                            offset: Offset(0, 2),
                            blurRadius: 6.0),
                      ],
                    ),
                    child: const CircleAvatar(
                      child: ClipOval(
                        child: Image(
                          height: 60.0,
                          width: 60.0,
                          image: AssetImage(twoman),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),*/

            //Horizontal break text 1
            const SizedBox(height: 10.0),
            Row(
              children: [
                Expanded(
                  flex: 1,
                  child: Container(
                      height: 40,
                      decoration: BoxDecoration(
                          color: tPrimaryColor,
                          borderRadius: BorderRadius.circular(36)),
                      alignment: Alignment.center,
                      child: const Text("----- Create a Circle ----")),
                ),
              ],
            ),
            const SizedBox(height: 10.0),

            //Create Circles
            Row(
              children: [
                Expanded(
                    child: Stack(children: [
                  // first white circle
                  Positioned(
                    child: Padding(
                      padding: const EdgeInsets.only(left: 10),
                      child: SizedBox(
                        height: 200,
                        child: Container(
                          width: 160,
                          height: 160,
                          decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white,
                              boxShadow: [
                                BoxShadow(
                                    color: Colors.black45,
                                    offset: Offset(0, 2),
                                    blurRadius: 6.0)
                              ]),
                        ),
                      ),
                    ),
                  ),
                  //first text
                  const Positioned(
                      top: 65,
                      left: 35,
                      child: Column(
                        children: [
                          Text("Create a circle",
                              style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold)),
                          Text("Memorize Quran",
                              style: TextStyle(
                                  color: tPrimaryColor,
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold)),
                          Text("\n Take a quiz before\n creating the circle",
                              style:
                                  TextStyle(color: Colors.black, fontSize: 12)),
                        ],
                      )),

                  // first blue circle
                  Positioned(
                    top: 0,
                    left: 60,
                    child: Container(
                      width: 60,
                      height: 60,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: tPrimaryColor,
                      ),
                      //imageInsideBlueCircle
                      child: const CircleAvatar(
                        child: ClipOval(
                          child: Image(
                            height: 60.0,
                            width: 60.0,
                            image: AssetImage(tread),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ),
                  ),
                  //second white circle
                  Positioned(
                    top: 0,
                    left: 190,
                    child: SizedBox(
                      height: 200,
                      child: Container(
                        width: 160,
                        height: 160,
                        decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white,
                            boxShadow: [
                              BoxShadow(
                                  color: Colors.black45,
                                  offset: Offset(0, 2),
                                  blurRadius: 6.0)
                            ]),
                      ),
                    ),
                  ),
                  //second text
                  const Positioned(
                      top: 65,
                      left: 210,
                      child: Column(
                        children: [
                          Text("Create a circle",
                              style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold)),
                          Text("Tasbeeh",
                              style: TextStyle(
                                  color: tPrimaryColor,
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold)),
                          Text("\n Encourage others to\n Tasbeeh ",
                              style:
                                  TextStyle(color: Colors.black, fontSize: 12)),
                        ],
                      )),

                  //second quran Button
                  Positioned(
                      top: 145,
                      left: 57,
                      child: GestureDetector(
                        onTap: () => Get.to(() => const CMemoQuran()),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                              padding: const EdgeInsets.fromLTRB(20, 8, 20, 8),
                              color: tPrimaryColor,
                              child: const Text(
                                "Start",
                                style: TextStyle(fontSize: 12),
                              )),
                        ),
                      )),
                  //first Button
                  Positioned(
                      top: 145,
                      left: 237,
                      child: GestureDetector(
                        onTap: () => Get.to(() => const CTasbeehScreen()),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                              padding: const EdgeInsets.fromLTRB(20, 8, 20, 8),
                              color: tPrimaryColor,
                              child: const Text(
                                "Start",
                                style: TextStyle(fontSize: 12),
                              )),
                        ),
                      )),
                  //second blue circle
                  Positioned(
                    top: 0,
                    left: 240,
                    child: Container(
                      width: 60,
                      height: 60,
                      decoration: const BoxDecoration(
                          shape: BoxShape.circle, color: tPrimaryColor),
                      child: const CircleAvatar(
                        child: ClipOval(
                          child: Image(
                            height: 60.0,
                            width: 60.0,
                            image: AssetImage(ttasbeeh),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ),
                  )
                ])),
              ],
            ),

            //Horizontal break text 2
            const SizedBox(height: 10.0),
            Row(
              children: [
                Expanded(
                  flex: 1,
                  child: Container(
                      height: 40,
                      decoration: BoxDecoration(
                          color: tPrimaryColor,
                          borderRadius: BorderRadius.circular(36)),
                      alignment: Alignment.center,
                      child: const Text("----- or Join  one ----")),
                ),
              ],
            ),

            //scroll horizontal
            const SizedBox(
              height: 10.0,
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("New Tasbeeh Circles"),
                  SizedBox(
                    width: 30.0,
                  ),
                  Text(
                    "see all",
                    style: TextStyle(color: tPrimaryColor, fontSize: 18),
                  )
                ],
              ),
            ),
            SizedBox(
              width: double.infinity,
              height: 100.0,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: 6,
                itemBuilder: (BuildContext context, int index) {
                  if (index == 0) {
                    return const SizedBox(width: 10.0);
                  }
                  return Container(
                    margin: const EdgeInsets.all(10.0),
                    width: 60.0,
                    height: 60.0,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                            color: Colors.black45,
                            offset: Offset(0, 2),
                            blurRadius: 6.0),
                      ],
                    ),
                    child: const CircleAvatar(
                      child: ClipOval(
                        child: Image(
                          height: 60.0,
                          width: 60.0,
                          image: AssetImage(ttasbeeh),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(
              height: 10.0,
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("New Memorize Quran Circles"),
                  SizedBox(
                    width: 30.0,
                  ),
                  Text(
                    "see all",
                    style: TextStyle(color: tPrimaryColor, fontSize: 18),
                  )
                ],
              ),
            ),
            SizedBox(
              width: double.infinity,
              height: 100.0,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: 6,
                itemBuilder: (BuildContext context, int index) {
                  if (index == 0) {
                    return const SizedBox(width: 10.0);
                  }
                  return Container(
                    margin: const EdgeInsets.all(10.0),
                    width: 60.0,
                    height: 60.0,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                            color: Colors.black45,
                            offset: Offset(0, 2),
                            blurRadius: 6.0),
                      ],
                    ),
                    child: const CircleAvatar(
                      child: ClipOval(
                        child: Image(
                          height: 60.0,
                          width: 60.0,
                          image: AssetImage(tread),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  );
                },
              ),
            )
          ],
        ),
      ),
    );
  }
}
