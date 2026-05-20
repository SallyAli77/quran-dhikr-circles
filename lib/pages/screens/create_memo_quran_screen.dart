import 'package:circles_online_muslim_community/src/constants/colors.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../lists/Quran_Sura.dart';
import '../bottom_bar.dart';
import 'Published_Circle.dart';

class CMemoQuran extends StatefulWidget {
  const CMemoQuran({Key? key}) : super(key: key);
  @override
  State<CMemoQuran> createState() => _CMemoQuranState();
}

class _CMemoQuranState extends State<CMemoQuran> {
  String? selectedSuraName;
  late TextEditingController _suraNameInputController;

  int _selectedIndex = 0;

  void _navigateBottomBar(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  void initState() {
    super.initState();
    _suraNameInputController = TextEditingController();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: tSecondaryColor,
      appBar: AppBar(
        backgroundColor: tSecondaryColor,
        title: const Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            CircleAvatar(
              backgroundImage: AssetImage('assets/images/man33.png'),
            ),
            SizedBox(width: 10),
            Text(
              'Mohamed Ahmed',
              style: TextStyle(color: Colors.white),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            color: tWhiteColor,
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(
              flex: 10,
              child: SingleChildScrollView(
                child: Stack(children: [
                  Container(
                    width: double.infinity,
                    margin: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 20),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.5),
                          spreadRadius: 3,
                          blurRadius: 7,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("Create a Circle",
                            style:
                                TextStyle(color: Colors.black, fontSize: 18)),
                        const SizedBox(height: 10),
                        const Text("Memorize Quran",
                            style: TextStyle(color: Colors.blue, fontSize: 24)),
                        const SizedBox(height: 20),
                        Row(
                          children: [
                            const Expanded(
                              child: Text("Sura",
                                  style: TextStyle(
                                      color: Colors.black, fontSize: 16)),
                            ),
                            DropdownButton<String>(
                              value: selectedSuraName,
                              items: QuranSuraNames.map((String suraName) {
                                return DropdownMenuItem<String>(
                                  value: suraName,
                                  child: Text(
                                    suraName,
                                  ),
                                );
                              }).toList(),
                              onChanged: (String? newValue) {
                                setState(() {
                                  selectedSuraName = newValue;
                                  if (newValue != null) {
                                    _suraNameInputController.text = newValue;
                                  }
                                });
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        const Row(
                          children: [
                            Expanded(
                              child: Text("From",
                                  style: TextStyle(
                                      color: Colors.black, fontSize: 16)),
                            ),
                            Text("1",
                                style: TextStyle(
                                    color: Colors.blue, fontSize: 16)),
                            SizedBox(width: 10),
                            Expanded(
                              child: Text("To",
                                  style: TextStyle(
                                      color: Colors.black, fontSize: 16)),
                            ),
                            Text("7",
                                style: TextStyle(
                                    color: Colors.blue, fontSize: 16)),
                          ],
                        ),
                        const SizedBox(height: 10),
                        TextField(
                          decoration: InputDecoration(
                            labelText: "Circle Name",
                            labelStyle: const TextStyle(color: Colors.black),
                            enabledBorder: OutlineInputBorder(
                              borderSide: const BorderSide(color: Colors.grey),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: const BorderSide(color: Colors.blue),
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            const Expanded(
                              child: Text("Number of Members",
                                  style: TextStyle(
                                      color: Colors.black, fontSize: 16)),
                            ),
                            DropdownButton<int>(
                              items: const [
                                DropdownMenuItem(
                                  value: 1,
                                  child: Text("1"),
                                ),
                                DropdownMenuItem(
                                  value: 2,
                                  child: Text("2"),
                                ),
                                DropdownMenuItem(
                                  value: 3,
                                  child: Text("3"),
                                ),
                                DropdownMenuItem(
                                  value: 4,
                                  child: Text("4"),
                                ),
                                DropdownMenuItem(
                                  value: 5,
                                  child: Text("5"),
                                ),
                                DropdownMenuItem(
                                  value: 6,
                                  child: Text("6"),
                                ),
                              ],
                              onChanged: (int? value) {},
                              underline: Container(),
                              iconEnabledColor: Colors.blue,
                              value: 1, // set initial value here
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        const Row(
                          children: [
                            Expanded(
                              child: Text("Circle Code",
                                  style: TextStyle(
                                      color: Colors.black, fontSize: 16)),
                            ),
                            Text(
                              "ABCDE",
                              style:
                                  TextStyle(color: Colors.blue, fontSize: 16),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        Center(
                          child: MaterialButton(
                            onPressed: () =>
                                Get.to(const PublishedCirclePage()),
                            color: Colors.blue,
                            textColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                            child: const Text("Create",
                                style: TextStyle(fontSize: 18)),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Positioned(
                    top: 10,
                    right: 10,
                    child: Container(
                      width: 75,
                      height: 75,
                      decoration: const BoxDecoration(
                        color: Colors.blue,
                        shape: BoxShape.circle,
                      ),
                      child: Image.asset("assets/images/read.png"),
                    ),
                  ),
                ]),
              )),
          Expanded(
            flex: 3,
            child: SingleChildScrollView(
              child: Container(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Join Memorize Quran Circle',
                          style: TextStyle(fontSize: 18),
                        ),
                        TextButton(
                          onPressed: () {},
                          child: const Text('See All'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 5),
                    const SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          CircleAvatar(
                            backgroundImage:
                                AssetImage('assets/images/logo.png'),
                            radius: 20,
                          ),
                          SizedBox(width: 20),
                          CircleAvatar(
                            backgroundImage:
                                AssetImage('assets/images/woman.png'),
                            radius: 20,
                          ),
                          SizedBox(width: 20),
                          CircleAvatar(
                            backgroundImage:
                                AssetImage('assets/images/boy.png'),
                            radius: 20,
                          ),
                          SizedBox(width: 20),
                          CircleAvatar(
                            backgroundImage:
                                AssetImage('assets/images/baby.png'),
                            radius: 20,
                          ),
                          SizedBox(width: 20),
                          CircleAvatar(
                            backgroundImage:
                                AssetImage('assets/images/logo.png'),
                            radius: 20,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBarWidget(
        selectedIndex: _selectedIndex,
        onTabTapped: _navigateBottomBar,
      ),
    );
  }
}
